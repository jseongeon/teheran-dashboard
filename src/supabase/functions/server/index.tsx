/**
 * 통합 Edge Function - 모든 모듈을 하나의 파일로 통합
 * 구글 시트 데이터 로드 문제 해결 버전
 */

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// ========================================
// 📌 버전 정보
// ========================================
const SYNC_VERSION = "1.3.1";

// ========================================
// 📌 타입 정의
// ========================================

interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface InquiryRow {
  date: string;
  time: string;
  receiptType: string;
  detailSource: string;
  field: string;
  customerName: string;
  phone: string;
  email: string;
  receptionist: string;
  content: string;
  attachedFile: string;
  isReminder: boolean;
  attorney: string;
  responseContent: string;
  isVisit: boolean;
  isContract: boolean;
  contractDate: string;
  contractAmount: number | null;
  isExcluded: boolean;
  isDuplicate: boolean;
  originalRowNumber: number;
}

// ========================================
// 📌 Google Sheets 관련 함수들
// ========================================

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  console.log(`✅ 캐시 히트: ${key}`);
  return cached.data;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`💾 캐시 저장: ${key}`);
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : baseDelay * Math.pow(2, attempt);
        
        console.log(`⚠️ Rate limit (429), ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⚠️ 요청 실패, ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}

async function getAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  try {
    const header = {
      alg: "RS256",
      typ: "JWT"
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    }

    const base64url = (obj: any) => {
      const str = JSON.stringify(obj)
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }

    const headerEncoded = base64url(header)
    const payloadEncoded = base64url(payload)
    const signatureInput = `${headerEncoded}.${payloadEncoded}`
    
    let privateKey = serviceAccount.private_key
    
    if (privateKey.includes('\n') && !privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\n/g, '\\n')
    }
    
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    if (!privateKey || !privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error("Invalid private key format. 키가 '-----BEGIN PRIVATE KEY-----'로 시작하는지 확인하세요.")
    }
    
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    
    let pemContents: string
    try {
      const startIndex = privateKey.indexOf(pemHeader) + pemHeader.length
      const endIndex = privateKey.indexOf(pemFooter)
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("PEM 헤더나 푸터를 찾을 수 없습니다.")
      }
      
      pemContents = privateKey
        .substring(startIndex, endIndex)
        .replace(/\s/g, '')
        
      const base64Regex = /^[A-Za-z0-9+/=]+$/
      if (!base64Regex.test(pemContents)) {
        const invalidChars = pemContents.split('').filter(c => !base64Regex.test(c))
        throw new Error(`Base64가 아닌 문자가 포함됨: ${[...new Set(invalidChars)].join(', ')}`)
      }
    } catch (e) {
      throw new Error(`Private key 추출 실패: ${e}`)
    }
    
    let binaryDer: Uint8Array
    try {
      binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
    } catch (e) {
      throw new Error(`Failed to decode base64 private key: ${e}. PEM 내용 길이: ${pemContents.length}`)
    }
    
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    )
    
    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signatureInput)
    )

    const signatureArray = Array.from(new Uint8Array(signatureBuffer))
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const jwt = `${signatureInput}.${signatureBase64}`
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Access Token 획득 실패 (${tokenResponse.status}): ${error}`)
    }

    const tokenData = await tokenResponse.json()
    return tokenData.access_token
  } catch (error) {
    console.error("❌ getAccessToken 패:", error)
    throw error
  }
}

async function getSpreadsheetMetadata(spreadsheetId: string): Promise<any> {
  try {
    console.log("📋 스프레드시트 메타데이터 요청 중...")
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.")
    }

    const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountJson)
    const accessToken = await getAccessToken(serviceAccount)

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google Sheets API 오류 (${response.status}): ${error}`)
    }

    const data = await response.json()
    console.log("✅ 메타데이터 로드 성공!")
    
    return data
  } catch (error) {
    console.error("❌ 메타데이터 로드 실패:", error)
    throw error
  }
}

async function fetchMultipleRanges(
  spreadsheetId: string,
  ranges: string[]
): Promise<Record<string, any[][]>> {
  try {
    console.log("🔑 Service Account 키 파싱 시작...")
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.")
    }

    const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountJson)
    console.log("✅ Service Account 파싱 완료:", serviceAccount.client_email)
    
    console.log("🔐 Access Token 요청 중...")
    const accessToken = await getAccessToken(serviceAccount)
    console.log("✅ Access Token 획득 완료!")

    const rangeParams = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangeParams}`
    
    console.log("📡 Google Sheets API 호출 중...")
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 40000)
    
    try {
      const response = await fetchWithRetry(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log("📥 API 응답 상태:", response.status)

      if (!response.ok) {
        const error = await response.text()
        console.error("❌ API 오류 응답:", error)
        throw new Error(`Google Sheets API 오류 (${response.status}): ${error}`)
      }

      const data = await response.json()
      const result: Record<string, any[][]> = {}
      
      data.valueRanges.forEach((vr: any, index: number) => {
        result[ranges[index]] = vr.values || []
      })

      console.log("✅ 데이터 파싱 완료!")
      return result
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error("Google Sheets API 타임아웃 (40초 초과)")
      }
      throw fetchError
    }
  } catch (error) {
    console.error("❌ fetchMultipleRanges 오류 상세:")
    console.error("  - 에러:", error)
    throw error
  }
}

// ========================================
// 📌 DB 동기화 관련 함수들
// ========================================

function transformSheetRowToInquiry(row: any[], rowIndex: number): InquiryRow | null {
  const date = row[0] || ""; // B열: 날짜
  const time = row[1] || ""; // C열: 문의시간
  const receiptType = row[2] || ""; // D열: 접수유형
  const detailSource = row[3] || ""; // E열: 세부매체
  const field = row[4] || ""; // F열: 세부분야
  const customerName = row[5] || ""; // G열: 고객성함
  const phone = row[6] || ""; // H열: 고객연락처
  const email = row[7] || ""; // I열: 고객이메일
  const receptionist = row[8] || ""; // J열: 1차접수자
  const content = row[9] || ""; // K열: 접수내용
  const attachedFile = row[10] || ""; // L열: 첨부파일
  const isReminder = row[11] === true || row[11] === "TRUE"; // M열: 리마인드CRM
  const attorney = row[12] || ""; // N열: 변리사님
  const responseContent = row[13] || ""; // O열: 상담내용
  const isVisit = row[14] === true || row[14] === "TRUE"; // P열: 방문/출장
  const isContract = row[15] === true || row[15] === "TRUE"; // Q열: 수임여부
  const contractDate = row[16] || ""; // R열: 수임일
  const contractAmount = row[17] ? parseFloat(String(row[17]).replace(/[^0-9.-]/g, "")) : null; // S열: 수임금액

  // 날짜가 없으면 무효 데이터 (날짜는 필수)
  if (!date) return null;

  const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
  const isExcluded = receiptType === "문의건X" && excludeDetailSources.includes(detailSource);

  const isDuplicate = false;

  return {
    date,
    time,
    receiptType,
    detailSource,
    field,
    customerName,
    phone,
    email,
    receptionist,
    content,
    attachedFile,
    isReminder,
    attorney,
    responseContent,
    isVisit,
    isContract,
    contractDate,
    contractAmount,
    isExcluded,
    isDuplicate,
    originalRowNumber: rowIndex, // 호출 시 이미 정확한 행 번호 전달받음
  };
}

function markDuplicateInquiries(inquiries: InquiryRow[]): InquiryRow[] {
  const monthPhoneMap = new Map<string, InquiryRow[]>();

  inquiries.forEach((inquiry) => {
    const isDuplicateCheckTarget =
      inquiry.receiptType === "문의건X" &&
      (inquiry.detailSource === "연락처중복" || inquiry.detailSource === "리마인드CRM");

    if (!isDuplicateCheckTarget) return;
    if (!inquiry.phone) return;

    const month = inquiry.date.substring(0, 7);
    const key = `${month}-${inquiry.phone}`;

    if (!monthPhoneMap.has(key)) {
      monthPhoneMap.set(key, []);
    }
    monthPhoneMap.get(key)!.push(inquiry);
  });

  monthPhoneMap.forEach((group) => {
    if (group.length > 1) {
      for (let i = 1; i < group.length; i++) {
        group[i].isDuplicate = true;
      }
    }
  });

  return inquiries;
}

async function syncToDatabase(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  inquiries: InquiryRow[]
): Promise<{ success: boolean; message: string; stats: any }> {
  console.log(`🔍 syncToDatabase 호출됨:`);
  console.log(`  - URL: ${supabaseUrl || '(undefined)'}`);
  console.log(`  - Key 있음: ${!!supabaseServiceRoleKey}`);

  if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    throw new Error(`Invalid supabaseUrl: "${supabaseUrl}" (type: ${typeof supabaseUrl})`);
  }

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: "${supabaseUrl}"`);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  console.log(`📊 동기화 시작: ${inquiries.length}건`);

  // 🔥 날짜-시간 순으로 정렬
  console.log(`📅 날짜-시간 순으로 정렬 중...`);
  inquiries.sort((a, b) => {
    // 날짜 비교 (내림차순 - 최근 날짜가 위로)
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    
    // 날짜가 같으면 시간 비교 (내림차순 - 최근 시간이 위로)
    return b.time.localeCompare(a.time);
  });
  console.log(`✅ 정렬 완료 (최신순): ${inquiries[0]?.date} ${inquiries[0]?.time} ~ ${inquiries[inquiries.length-1]?.date} ${inquiries[inquiries.length-1]?.time}`);

  const stats = {
    total: inquiries.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < inquiries.length; i += BATCH_SIZE) {
      const batch = inquiries.slice(i, i + BATCH_SIZE);
      console.log(`🔄 배치 처리: ${i + 1}~${Math.min(i + BATCH_SIZE, inquiries.length)}/${inquiries.length}`);

      const dbRecords = batch.map((inquiry) => ({
        date: inquiry.date,
        time: inquiry.time,
        receipt_type: inquiry.receiptType,
        detail_source: inquiry.detailSource,
        field: inquiry.field,
        customer_name: inquiry.customerName,
        phone: inquiry.phone,
        email: inquiry.email,
        receptionist: inquiry.receptionist,
        content: inquiry.content,
        attached_file: inquiry.attachedFile,
        is_reminder: inquiry.isReminder,
        attorney: inquiry.attorney,
        response_content: inquiry.responseContent,
        is_visit: inquiry.isVisit,
        is_contract: inquiry.isContract,
        contract_date: inquiry.contractDate,
        contract_amount: inquiry.contractAmount,
        is_excluded: inquiry.isExcluded,
        is_duplicate: inquiry.isDuplicate,
        original_row_number: inquiry.originalRowNumber,
        synced_at: new Date().toISOString(),
      }));

      const { error: upsertError } = await supabase
        .from("inquiries")
        .upsert(dbRecords, {
          onConflict: "original_row_number",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error(`배치 ${i}~${i + BATCH_SIZE} 오류:`, upsertError);
        stats.errors += batch.length;
      } else {
        stats.inserted += batch.length;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const contracts = inquiries.filter(
      (inquiry) => inquiry.isContract && !inquiry.isExcluded
    );

    if (contracts.length > 0) {
      console.log(`📝 수임 데이터 동기화: ${contracts.length}건`);

      for (let i = 0; i < contracts.length; i += BATCH_SIZE) {
        const batch = contracts.slice(i, i + BATCH_SIZE);
        
        const contractRecords = batch.map((c) => ({
          date: c.date,
          time: c.time,
          receipt_type: c.receiptType,
          detail_source: c.detailSource,
          field: c.field,
          customer_name: c.customerName,
          phone: c.phone,
          email: c.email,
          attorney: c.attorney,
          contract_date: c.contractDate,
          contract_amount: c.contractAmount,
          content: c.content,
          response_content: c.responseContent,
          original_row_number: c.originalRowNumber,
          synced_at: new Date().toISOString(),
        }));

        const { error: contractUpsertError } = await supabase
          .from("contracts")
          .upsert(contractRecords, {
            onConflict: "original_row_number",
            ignoreDuplicates: false,
          });

        if (contractUpsertError) {
          console.error(`수임 배치 ${i}~${i + BATCH_SIZE} 오류:`, contractUpsertError);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    await supabase.from("sync_logs").insert({
      sync_type: "full",
      records_processed: stats.total,
      records_inserted: stats.inserted,
      records_updated: stats.updated,
      records_skipped: stats.skipped,
      status: stats.errors > 0 ? "partial" : "success",
      completed_at: new Date().toISOString(),
    });

    console.log("✅ 동기화 완료:", stats);

    return {
      success: true,
      message: "동기화 완료",
      stats,
    };
  } catch (error) {
    console.error("❌ 동기화 실패:", error);

    try {
      await supabase.from("sync_logs").insert({
        sync_type: "full",
        records_processed: stats.total,
        records_inserted: stats.inserted,
        records_updated: stats.updated,
        records_skipped: stats.skipped,
        error_message: error instanceof Error ? error.message : String(error),
        status: "failed",
        completed_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("로그 저장 실패:", logError);
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류",
      stats,
    };
  }
}

// ========================================
// 📌 Hono 앱 설정
// ========================================

const app = new Hono();

// 🔥 중요: CORS를 가장 먼저 설정!
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.use('*', logger(console.log));

app.options('*', (c) => {
  return c.text('', 204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  });
});

app.get("/make-server-1da81fff/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: SYNC_VERSION,
    serverUrl: Deno.env.get("SUPABASE_URL"),
    secrets: {
      hasSpreadsheetId: !!Deno.env.get("SPREADSHEET_ID"),
      hasServiceAccount: !!Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY"),
      hasCloudUrl: !!Deno.env.get("CLOUD_SUPABASE_URL"),
      hasCloudKey: !!Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY")
    }
  });
});

app.get("/make-server-1da81fff/sheets/metadata", async (c) => {
  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    
    if (!spreadsheetId) {
      return c.json({ error: "SPREADSHEET_ID가 설정되지 않았습니다." }, 400);
    }

    const metadata = await getSpreadsheetMetadata(spreadsheetId);
    
    return c.json({
      title: metadata.properties?.title,
      sheets: metadata.sheets?.map((sheet: any) => ({
        title: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
        index: sheet.properties.index
      }))
    });
  } catch (error) {
    console.error("❌ 메타데이터 로드 오류:", error);
    return c.json({ 
      error: "메타데이터를 가져오는 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

app.get('/make-server-1da81fff/sheets/data', async (c) => {
  console.log("📊 구글 시트 데이터 요청 시작");

  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    
    console.log(`🔍 환경 변수 상태:`);
    console.log(`  - SPREADSHEET_ID: ${spreadsheetId ? `✅ ${spreadsheetId.substring(0, 10)}...` : '❌ 없음'}`);
    console.log(`  - GOOGLE_SERVICE_ACCOUNT_KEY: ${serviceAccountKey ? '✅ 있음' : '❌ 없음'}`);
    
    if (!spreadsheetId || !serviceAccountKey) {
      console.log("⚠️ 환경 변수가 설정되지 않았습니다.");
      return c.json({ 
        error: "환경 변수 미설정",
        message: "SPREADSHEET_ID와 GOOGLE_SERVICE_ACCOUNT_KEY를 Supabase Dashboard에서 설정해주세요.",
        instructions: "Supabase Dashboard → Project Settings → Edge Functions → Add secret",
        needsSetup: true
      }, 200);
    }

    const cacheKey = `sheets-data-${spreadsheetId}`;
    
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log("✅ 캐시된 데이터 반환");
      return c.json({
        inquiries: cachedData.inquiries,
        cached: true
      });
    }

    console.log("📡 구글 시트에서 새 데이터 가져오는 중...");
    const ranges = ["'2025상담'!B5:S"]; // 5행부터 가져오기 (2행 → 5행)

    const data = await fetchMultipleRanges(spreadsheetId, ranges);

    console.log("✅ 데이터 로드 성공!");
    console.log("  - 상담 데이터:", data["'2025상담'!B5:S"]?.length || 0, "rows");

    const responseData = {
      inquiries: data["'2025상담'!B5:S"] || [],
    };
    
    setCachedData(cacheKey, responseData);

    return c.json(responseData);
  } catch (error) {
    console.error("❌ Google Sheets 데이터 로드 오류:");
    console.error("  - 에러 타입:", error?.constructor?.name);
    console.error("  - 에러 메시지:", error instanceof Error ? error.message : String(error));
    console.error("  - 스택:", error instanceof Error ? error.stack : '(없음)');
    
    return c.json({ 
      error: "데이터를 가져오는 중 오류가 발생했습니다.", 
      details: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name || 'Unknown',
      needsSetup: false
    }, 500);
  }
});

app.get('/make-server-1da81fff/api/debug/media-distribution', async (c) => {
  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    if (!spreadsheetId) {
      return c.json({ error: "SPREADSHEET_ID not configured" }, 500);
    }

    const ranges = ["'2025상담'!B2:S"];
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data["'2025상담'!B2:S"] || [];

    const mediaCount: Record<string, { count: number; examples: string[] }> = {};
    const detailSourceCount: Record<string, number> = {};

    rows.forEach((row) => {
      const receiptType = row[2] || "";
      const detailSource = row[3] || "";
      const isContract = row[15] === true || row[15] === "TRUE";

      if (!receiptType) return;
      if (receiptType === "문의건X") {
        const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
        if (excludeDetailSources.includes(detailSource)) return;
      }

      detailSourceCount[detailSource] = (detailSourceCount[detailSource] || 0) + 1;

      let category = "기타";
      
      const 홈페이지Sources = [
        "메인홈페이지_8230", "구홈페이지", "서울플레이스_5059", "부산플레이스_1970",
        "파워컨텐츠_2383", "유튜브_1737", "메인홈페이지", "세모특허원페이지",
        "서울플레이스", "부산플레이스", "튜브", "파워컨텐츠", "플레이스_예약"
      ];
      
      const 바이럴Sources = [
        "shp블로그_6571", "gem블로그_3678", "jnin블로그_1016", "woo블로그_2373",
        "koo블로그_5317", "tor블로그_4194", "khai블로그_2726", "lang블로그_4786",
        "자동화카페B_3816", "icarus블로그_3452", "자동화블로그(영)_1812", "자동화블로그(영2)_4194",
        "자동화블로그(승)_4283", "자동화블로그(언)_3193", "자동화테스트(백)_3734", "자동화카페A_4346",
        "자동화카페B_3987", "수원자동화블/카_5913", "백상희지식인_2152",
        "윤웅채지식인_4246", "김신연지식인_2526", "이상담지식인_3579",
        "new티스토리_3630", "고객인터뷰폼_3816", "소책자_3193", "자동화블로그A_4746"
      ];

      if (홈페이지Sources.includes(detailSource)) {
        category = "홈페이지";
      } else if (바이럴Sources.includes(detailSource)) {
        category = "바이럴";
      }

      if (!mediaCount[category]) {
        mediaCount[category] = { count: 0, examples: [] };
      }
      mediaCount[category].count++;
      if (mediaCount[category].examples.length < 5 && !mediaCount[category].examples.includes(detailSource)) {
        mediaCount[category].examples.push(detailSource);
      }
    });

    return c.json({
      totalRows: rows.length,
      mediaDistribution: mediaCount,
      topDetailSources: Object.entries(detailSourceCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([source, count]) => ({ source, count }))
    });
  } catch (error) {
    return c.json({ 
      error: error instanceof Error ? error.message : String(error) 
    }, 500);
  }
});

app.post('/make-server-1da81fff/api/sync-to-db', async (c) => {
  console.log("🔄 DB 동기화 요청 시작");

  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    
    if (!spreadsheetId || !serviceAccountKey) {
      return c.json({ 
        error: "환경 변수가 설정되지 않았습니다.",
        needsSetup: true
      }, 400);
    }

    console.log("📊 구글 시트 데이터 가져오기...");
    
    // 🔥 5행부터 가져오기
    const ranges = ["'2025상담'!B5:S"];
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data["'2025상담'!B5:S"] || [];

    console.log(`✅ ${rows.length}건의 데이터 로드 완료`);
    console.log(`📅 첫 번째 행 날짜: ${rows[0]?.[0]}`);
    console.log(`📅 마지막 행 날짜: ${rows[rows.length - 1]?.[0]}`);

    console.log("🔄 데이터 변환 중...");
    let inquiries = rows
      .map((row, index) => transformSheetRowToInquiry(row, index + 5)) // B5 = 시트 5행, index=0 → row_number=5
      .filter((inquiry): inquiry is NonNullable<typeof inquiry> => inquiry !== null);

    console.log("🔍 중복 체크 중...");
    inquiries = markDuplicateInquiries(inquiries);

    let localResult = null;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceRoleKey) {
      console.log("💾 로컬 DB 동기화 중...");
      try {
        localResult = await syncToDatabase(supabaseUrl, supabaseServiceRoleKey, inquiries);
        console.log("✅ 로컬 DB 동기화 완료:", localResult.stats);
      } catch (error) {
        console.error("⚠️ 로컬 DB 동기화 실패 (계속 진행):", error);
      }
    }

    let cloudResult = null;
    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    if (cloudSupabaseUrl && cloudSupabaseServiceKey) {
      console.log("☁️ 클라우드 DB 동기화 중...");
      try {
        cloudResult = await syncToDatabase(cloudSupabaseUrl, cloudSupabaseServiceKey, inquiries);
        console.log("✅ 클라우드 DB 동기화 완료:", cloudResult.stats);
      } catch (error) {
        console.error("⚠️ 클라우드 DB 동기화 실패:", error);
      }
    }

    return c.json({
      success: true,
      message: "동기화가 완료되었습니다.",
      local: localResult ? {
        success: localResult.success,
        stats: localResult.stats
      } : { skipped: true, reason: "로컬 Supabase 환경 변수 없음" },
      cloud: cloudResult ? {
        success: cloudResult.success,
        stats: cloudResult.stats
      } : { skipped: true, reason: "클라우드 Supabase 환경 변수 없음" },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ DB 동기화 오류:", error);
    return c.json({
      success: false,
      error: "DB 동기화 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

app.post('/make-server-1da81fff/api/sync-to-db-range', async (c) => {
  console.log("🔄 범위별 DB 동기화 요청");

  try {
    const body = await c.req.json();
    const { startRow, endRow } = body;

    if (!startRow || !endRow) {
      return c.json({ error: "startRow와 endRow가 필요합니다." }, 400);
    }

    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    
    if (!spreadsheetId || !serviceAccountKey) {
      return c.json({ error: "환경 변수 미설정" }, 400);
    }

    // 로컬 및 클라우드 DB 설정 모두 가져오기
    const localSupabaseUrl = Deno.env.get("SUPABASE_URL");
    const localSupabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    console.log(`🔍 환경 변수 확인:`);
    console.log(`  - SUPABASE_URL (로컬): ${localSupabaseUrl ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - SUPABASE_SERVICE_ROLE_KEY (로컬): ${localSupabaseServiceKey ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - CLOUD_SUPABASE_URL: ${cloudSupabaseUrl ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - CLOUD_SUPABASE_SERVICE_KEY: ${cloudSupabaseServiceKey ? '✅ 설정됨' : '❌ 없음'}`);

    // 최소 하나의 DB는 설정되어야 함
    if ((!localSupabaseUrl || !localSupabaseServiceKey) && (!cloudSupabaseUrl || !cloudSupabaseServiceKey)) {
      return c.json({ 
        error: "Supabase 환경 변수가 설정되지 않았습니다.",
        details: "로컬 또는 클라우드 Supabase 환경 변수 중 최소 하나는 설정되어야 합니다."
      }, 400);
    }

    const range = `'2025상담'!B${startRow}:S${endRow}`;
    console.log(`📊 범위: ${range}`);
    
    const ranges = [range];
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data[range] || [];

    console.log(`✅ ${rows.length}건 로드`);

    let inquiries = rows
      .map((row, index) => transformSheetRowToInquiry(row, startRow + index)) // B{startRow} = 시트 startRow행
      .filter((inquiry): inquiry is NonNullable<typeof inquiry> => inquiry !== null);

    console.log(`🔄 변환 완료: ${inquiries.length}건`);

    // 로컬 DB 동기화
    let localResult = null;
    if (localSupabaseUrl && localSupabaseServiceKey) {
      console.log(`💾 로컬 DB 동기화 중...`);
      try {
        localResult = await syncToDatabase(localSupabaseUrl, localSupabaseServiceKey, inquiries);
        console.log(`✅ 로컬 DB 동기화 완료:`, localResult.stats);
      } catch (error) {
        console.error(`⚠️ 로컬 DB 동기화 실패:`, error);
      }
    }

    // 클라우드 DB 동기화
    let cloudResult = null;
    if (cloudSupabaseUrl && cloudSupabaseServiceKey) {
      console.log(`☁️ 클라우드 DB 동기화 중...`);
      try {
        cloudResult = await syncToDatabase(cloudSupabaseUrl, cloudSupabaseServiceKey, inquiries);
        console.log(`✅ 클라우드 DB 동기화 완료:`, cloudResult.stats);
      } catch (error) {
        console.error(`⚠️ 클라우드 DB 동기화 실패:`, error);
      }
    }

    return c.json({
      success: true,
      range: { startRow, endRow },
      processed: inquiries.length,
      local: localResult ? {
        success: localResult.success,
        stats: localResult.stats
      } : { skipped: true, reason: "로컬 Supabase 환경 변수 없음" },
      cloud: cloudResult ? {
        success: cloudResult.success,
        stats: cloudResult.stats
      } : { skipped: true, reason: "클라우드 Supabase 환경 변수 없음" },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ 범위별 동기화 오류:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// 📦 단일 행 실시간 동기화 엔드포인트 (Google Apps Script용)
app.post('/make-server-1da81fff/api/sync-single-row', async (c) => {
  console.log("🔄 단일 행 실시간 동기화 요청");

  try {
    const inquiry = await c.req.json();
    
    // D열(접수유형) 필수 체크
    if (!inquiry.receiptType) {
      return c.json({ 
        success: false, 
        error: "접수유형(D열)이 필요합니다." 
      }, 400);
    }

    // 날짜 필수 체크
    if (!inquiry.date) {
      return c.json({ 
        success: false, 
        error: "날짜(B열)가 필요합니다." 
      }, 400);
    }

    console.log(`📝 데이터: ${inquiry.date} | ${inquiry.customerName} | ${inquiry.receiptType}`);

    const localSupabaseUrl = Deno.env.get("SUPABASE_URL");
    const localSupabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    if ((!localSupabaseUrl || !localSupabaseServiceKey) && (!cloudSupabaseUrl || !cloudSupabaseServiceKey)) {
      return c.json({ 
        success: false, 
        error: "Supabase 환경 변수가 설정되지 않았습니다." 
      }, 400);
    }

    const dbRecord = {
      date: inquiry.date,
      time: inquiry.time || "",
      receipt_type: inquiry.receiptType,
      detail_source: inquiry.detailSource || "",
      field: inquiry.field || "",
      customer_name: inquiry.customerName || "",
      phone: inquiry.phone || "",
      email: inquiry.email || "",
      receptionist: inquiry.receptionist || "",
      content: inquiry.content || "",
      attached_file: inquiry.attachedFile || "",
      is_reminder: inquiry.isReminder || false,
      attorney: inquiry.attorney || "",
      response_content: inquiry.responseContent || "",
      is_visit: inquiry.isVisit || false,
      is_contract: inquiry.isContract || false,
      contract_date: inquiry.contractDate || "",
      contract_amount: inquiry.contractAmount || null,
      is_excluded: inquiry.isExcluded || false,
      is_duplicate: inquiry.isDuplicate || false,
      original_row_number: inquiry.originalRowNumber,
      synced_at: new Date().toISOString(),
    };

    // 로컬 DB 동기화
    if (localSupabaseUrl && localSupabaseServiceKey) {
      const supabase = createClient(localSupabaseUrl, localSupabaseServiceKey);
      
      const { error: upsertError } = await supabase
        .from("inquiries")
        .upsert(dbRecord, {
          onConflict: "original_row_number",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error("로컬 DB upsert 오류:", upsertError);
      } else {
        console.log("✅ 로컬 DB 동기화 성공");
      }

      // 수임 데이터라면 contracts 테이블에도 추가
      if (inquiry.isContract) {
        const contractRecord = {
          date: inquiry.date,
          time: inquiry.time || "",
          receipt_type: inquiry.receiptType,
          detail_source: inquiry.detailSource || "",
          field: inquiry.field || "",
          customer_name: inquiry.customerName || "",
          phone: inquiry.phone || "",
          email: inquiry.email || "",
          attorney: inquiry.attorney || "",
          contract_date: inquiry.contractDate || "",
          contract_amount: inquiry.contractAmount || null,
          content: inquiry.content || "",
          response_content: inquiry.responseContent || "",
          original_row_number: inquiry.originalRowNumber,
          synced_at: new Date().toISOString(),
        };

        const { error: contractError } = await supabase
          .from("contracts")
          .upsert(contractRecord, {
            onConflict: "original_row_number",
            ignoreDuplicates: false,
          });

        if (contractError) {
          console.error("로컬 contracts 테이블 upsert 오류:", contractError);
        }
      }
    }

    // 클라우드 DB 동기화
    if (cloudSupabaseUrl && cloudSupabaseServiceKey) {
      const cloudSupabase = createClient(cloudSupabaseUrl, cloudSupabaseServiceKey);
      
      const { error: cloudUpsertError } = await cloudSupabase
        .from("inquiries")
        .upsert(dbRecord, {
          onConflict: "original_row_number",
          ignoreDuplicates: false,
        });

      if (cloudUpsertError) {
        console.error("클라우드 DB upsert 오류:", cloudUpsertError);
      } else {
        console.log("✅ 클라우드 DB 동기화 성공");
      }

      // 수임 데이터라면 contracts 테이블에도 추가
      if (inquiry.isContract) {
        const contractRecord = {
          date: inquiry.date,
          time: inquiry.time || "",
          receipt_type: inquiry.receiptType,
          detail_source: inquiry.detailSource || "",
          field: inquiry.field || "",
          customer_name: inquiry.customerName || "",
          phone: inquiry.phone || "",
          email: inquiry.email || "",
          attorney: inquiry.attorney || "",
          contract_date: inquiry.contractDate || "",
          contract_amount: inquiry.contractAmount || null,
          content: inquiry.content || "",
          response_content: inquiry.responseContent || "",
          original_row_number: inquiry.originalRowNumber,
          synced_at: new Date().toISOString(),
        };

        const { error: cloudContractError } = await cloudSupabase
          .from("contracts")
          .upsert(contractRecord, {
            onConflict: "original_row_number",
            ignoreDuplicates: false,
          });

        if (cloudContractError) {
          console.error("클라우드 contracts 테이블 upsert 오류:", cloudContractError);
        }
      }
    }

    console.log("✅ 실시간 동기화 성공!");

    return c.json({ 
      success: true, 
      message: "실시간 동기화 완료",
      data: dbRecord
    });

  } catch (error) {
    console.error("❌ 실시간 동기화 오류:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);