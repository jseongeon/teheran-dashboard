/**
 * 통합 Edge Function - 모든 모듈을 하나의 파일로 통합
 * Supabase Dashboard 수동 배포용
 */

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// ========================================
// 📌 버전 정보
// ========================================
const SYNC_VERSION = "1.3.0";
const LAST_UPDATE = "2025-12-23T12:00:00Z";

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
}

// ========================================
// 📌 Google Sheets 관련 함수들
// ========================================

// 캐시 저장소
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

/**
 * 캐시에서 데이터 가져오기
 */
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

/**
 * 캐시에 데이터 저장
 */
function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`💾 캐시 저장: ${key}`);
}

/**
 * 재시도 로직이 있는 fetch 함수
 */
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
      
      // 429 에러 (Rate Limit)인 경우 재시도
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : baseDelay * Math.pow(2, attempt); // Exponential backoff
        
        console.log(`⚠️ Rate limit (429), ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⚠️ 요청 실패, ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}

/**
 * JWT 생성 및 Access Token 획득
 */
async function getAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  try {
    // JWT Header
    const header = {
      alg: "RS256",
      typ: "JWT"
    }

    // JWT Payload
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    }

    // Base64url 인코딩
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
    
    // Private Key를 이용한 서명
    let privateKey = serviceAccount.private_key
    
    // private_key가 실제 줄바꿈 문자를 포함하고 있다면 \\n으로 변환
    if (privateKey.includes('\n') && !privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\n/g, '\\n')
    }
    
    // \\n을 실제 줄바꿈으로 변환
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    if (!privateKey || !privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error("Invalid private key format. 키가 '-----BEGIN PRIVATE KEY-----'로 시작하는지 확인하세요.")
    }
    
    // PKCS#8 형식의 키를 import
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    
    let pemContents: string
    try {
      // private key에서 헤더와 푸터 제거, 공백 제거
      const startIndex = privateKey.indexOf(pemHeader) + pemHeader.length
      const endIndex = privateKey.indexOf(pemFooter)
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("PEM 헤더나 푸터를 찾을 수 없습니다.")
      }
      
      pemContents = privateKey
        .substring(startIndex, endIndex)
        .replace(/\s/g, '') // 모든 공백, 탭, 줄바꿈 제거
        
      // Base64 문자만 포함되어 있는지 확인
      const base64Regex = /^[A-Za-z0-9+/=]+$/
      if (!base64Regex.test(pemContents)) {
        // 잘못된 문자 찾기
        const invalidChars = pemContents.split('').filter(c => !base64Regex.test(c))
        throw new Error(`Base64가 아닌 문자가 포함됨: ${[...new Set(invalidChars)].join(', ')}`)
      }
    } catch (e) {
      throw new Error(`Private key 추출 실패: ${e}`)
    }
    
    // Base64 디코딩
    let binaryDer: Uint8Array
    try {
      binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
    } catch (e) {
      throw new Error(`Failed to decode base64 private key: ${e}. PEM 내용 길이: ${pemContents.length}`)
    }
    
    // CryptoKey 생성
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
    
    // 서명 생성
    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signatureInput)
    )

    // Base64url 인코딩
    const signatureArray = Array.from(new Uint8Array(signatureBuffer))
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const jwt = `${signatureInput}.${signatureBase64}`
    
    // Access Token 요청
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
    console.error("❌ getAccessToken 실패:", error)
    throw error
  }
}

/**
 * 스프레드시트 메타데이터 가져오기 (시트 이름 확인용)
 */
async function getSpreadsheetMetadata(
  spreadsheetId: string
): Promise<any> {
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
    console.log("📊 사용 가능한 시트:")
    data.sheets?.forEach((sheet: any) => {
      console.log(`  - "${sheet.properties.title}" (ID: ${sheet.properties.sheetId})`)
    })
    
    return data
  } catch (error) {
    console.error("❌ 메타데이터 로드 실패:", error)
    throw error
  }
}

/**
 * 여러 범위의 데이터를 한 번에 가져오기
 */
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

    // Batch get values
    const rangeParams = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangeParams}`
    
    console.log("📡 Google Sheets API 호출 중...")
    
    // AbortController로 타임아웃 적용 (40초로 증가)
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

/**
 * 스프레드시트 원본 데이터를 DB 형식으로 변환
 */
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

  // ✅ D열(접수유형)이 없으면 무효 데이터
  if (!receiptType) return null;
  
  // 날짜가 없으면 무효 데이터 (날짜는 필수)
  if (!date) return null;

  const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
  const isExcluded = receiptType === "문의건X" && excludeDetailSources.includes(detailSource);

  // 중복 체크는 나중에 배치로 처리 (같은 달 내 핸드폰 중복)
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
  };
}

/**
 * 중복 문의 체크 (같은 달 내 핸드폰 번호 중복)
 */
function markDuplicateInquiries(inquiries: InquiryRow[]): InquiryRow[] {
  // 월별 + 핸드폰 번호로 그룹화
  const monthPhoneMap = new Map<string, InquiryRow[]>();

  inquiries.forEach((inquiry) => {
    // "연락처중복" 또는 "리마인드CRM" 세부출처만 체크
    const isDuplicateCheckTarget =
      inquiry.receiptType === "문의건X" &&
      (inquiry.detailSource === "연락처중복" || inquiry.detailSource === "리마인드CRM");

    if (!isDuplicateCheckTarget) return;
    if (!inquiry.phone) return;

    const month = inquiry.date.substring(0, 7); // YYYY-MM
    const key = `${month}-${inquiry.phone}`;

    if (!monthPhoneMap.has(key)) {
      monthPhoneMap.set(key, []);
    }
    monthPhoneMap.get(key)!.push(inquiry);
  });

  // 중복 마킹: 같은 월-핸드폰 그룹 내에서 첫 번째만 유효, 나머지는 중복
  monthPhoneMap.forEach((group) => {
    if (group.length > 1) {
      // 첫 번째는 유효, 나머지는 중복으로 마킹
      for (let i = 1; i < group.length; i++) {
        group[i].isDuplicate = true;
      }
    }
  });

  return inquiries;
}

/**
 * Supabase DB에 데이터 동기화 (배치 최적화)
 */
async function syncToDatabaseOptimized(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  inquiries: InquiryRow[]
): Promise<{ success: boolean; message: string; stats: any }> {
  // URL 유효성 검증 추가
  console.log(`🔍 syncToDatabaseOptimized 호출됨:`);
  console.log(`  - URL: ${supabaseUrl || '(undefined)'}`);
  console.log(`  - URL 타입: ${typeof supabaseUrl}`);
  console.log(`  - URL 길이: ${supabaseUrl?.length || 0}`);
  console.log(`  - Key 있음: ${!!supabaseServiceRoleKey}`);

  if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    throw new Error(`Invalid supabaseUrl: "${supabaseUrl}" (type: ${typeof supabaseUrl})`);
  }

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: "${supabaseUrl}"`);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  console.log(`📊 동기화 시작: ${inquiries.length}건`);

  const stats = {
    total: inquiries.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    // 1. 데이터 변환 (메모리 효율적으로)
    const BATCH_SIZE = 50; // 배치 크기를 50으로 줄임
    
    // 청크별로 처리하여 메모리 절약
    for (let i = 0; i < inquiries.length; i += BATCH_SIZE) {
      const batch = inquiries.slice(i, i + BATCH_SIZE);
      console.log(`🔄 배치 처리: ${i + 1}~${Math.min(i + BATCH_SIZE, inquiries.length)}/${inquiries.length}`);

      // 배치 데이터 변환 (✅ original_row_number 제거)
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
        synced_at: new Date().toISOString(),
      }));

      // ✅ Upsert 실행 (date + phone + time으로 중복 체크)
      // 주의: DB에 (date, phone, time) unique constraint가 설정되어 있어야 합니다!
      const { error: upsertError } = await supabase
        .from("inquiries")
        .upsert(dbRecords, {
          onConflict: "date,phone,time", // Primary Key 조합
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error(`배치 ${i}~${i + BATCH_SIZE} 오류:`, upsertError);
        stats.errors += batch.length;
      } else {
        stats.inserted += batch.length;
      }

      // 각 배치 사이에 짧은 지연 (리소스 회복)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 2. 수임 테이블 동기화 (is_contract가 true인 것만)
    const contracts = inquiries.filter(
      (inquiry) => inquiry.isContract && !inquiry.isExcluded
    );

    if (contracts.length > 0) {
      console.log(`📝 수임 데이터 동기화: ${contracts.length}건`);

      // 수임 데이터도 작은 배치로 처리
      for (let i = 0; i < contracts.length; i += BATCH_SIZE) {
        const batch = contracts.slice(i, i + BATCH_SIZE);
        
        // ✅ original_row_number 제거
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
          synced_at: new Date().toISOString(),
        }));

        // ✅ date + phone + time으로 중복 체크
        const { error: contractUpsertError } = await supabase
          .from("contracts")
          .upsert(contractRecords, {
            onConflict: "date,phone,time", // Primary Key 조합
            ignoreDuplicates: false,
          });

        if (contractUpsertError) {
          console.error(`수임 배치 ${i}~${i + BATCH_SIZE} 오류:`, contractUpsertError);
        }

        // 배치 사이 지연
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // 3. 동기화 로그 저장
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

    // 에러 로그 저장
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

// Enable logger
app.use('*', logger(console.log));

// 🔧 CORS Preflight 처리 (OPTIONS 요청은 JWT 검증 없이 통과)
app.options('*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
});

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

// Health check endpoint
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

// 스프레드시트 메타데이터 확인 엔드포인트 (시트 이름 확인용)
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

// Google Sheets 데이터 가져오기 엔드포인트
app.get('/make-server-1da81fff/sheets/data', async (c) => {
  console.log("📊 구글 시트 데이터 요청 시작");

  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    
    // 환경 변수가 설정되지 않은 경우 안내 메시지
    if (!spreadsheetId || !serviceAccountKey) {
      console.log("⚠️ 환경 변수가 설정되지 않았습니다.");
      return c.json({ 
        error: "환경 변수 미설정",
        message: "SPREADSHEET_ID와 GOOGLE_SERVICE_ACCOUNT_KEY를 Supabase Dashboard에서 설정해주세요.",
        instructions: "Supabase Dashboard → Project Settings → Edge Functions → Add secret",
        needsSetup: true
      }, 200);
    }

    // 캐시 키 생성
    const cacheKey = `sheets-data-${spreadsheetId}`;
    
    // 캐시 확인
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log("✅ 캐시된 데이터 반환");
      return c.json({
        inquiries: cachedData.inquiries,
        cached: true
      });
    }

    // 모든 시트 데이터를 한 번에 가져오기
    const ranges = ["'2025상담'!B5:S"]; // 5행부터 가져오기 (헤더 제외)

    // 45초 타임아웃 적용
    const dataPromise = fetchMultipleRanges(spreadsheetId, ranges);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Server timeout after 45 seconds")), 45000);
    });

    const data = await Promise.race([dataPromise, timeoutPromise]) as any;

    console.log("✅ 데이터 로드 성공!");
    console.log("  - 상담 데이터:", data["'2025상담'!B5:S"]?.length || 0, "rows");

    // 응답 데이터 준비
    const responseData = {
      inquiries: data["'2025상담'!B5:S"] || [],
    };
    
    // 캐시에 저장
    setCachedData(cacheKey, responseData);

    return c.json(responseData);
  } catch (error) {
    // 모든 에러를 여기서 처리
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error("❌ Google Sheets 데이터 로드 오류:");
    console.error("  - 에러 타입:", error?.constructor?.name);
    console.error("  - 에러 메시지:", errorMessage);
    
    if (errorMessage.includes("timeout") || errorMessage.includes("타임아웃")) {
      console.error("⏱️ Google Sheets API 타임아웃");
    }
    
    return c.json({ 
      error: "데이터를 가져오는 중 오류가 발생했습니다.", 
      details: errorMessage,
      needsSetup: true
    }, 200);
  }
});

// 🔍 디버깅: 매체별 데이터 분포 확인
app.get('/make-server-1da81fff/api/debug/media-distribution', async (c) => {
  try {
    const spreadsheetId = Deno.env.get("SPREADSHEET_ID");
    if (!spreadsheetId) {
      return c.json({ error: "SPREADSHEET_ID not configured" }, 500);
    }

    const ranges = ["'2025상담'!B5:S"]; // 5행부터 가져오기 (헤더 제외)
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data["'2025상담'!B5:S"] || [];

    // 매체별 카운트
    const mediaCount: Record<string, { count: number; examples: string[] }> = {};
    const detailSourceCount: Record<string, number> = {};

    rows.forEach((row) => {
      const receiptType = row[2] || ""; // D열
      const detailSource = row[3] || ""; // E열
      const isContract = row[15] === true || row[15] === "TRUE"; // Q열

      // D열이 비어있거나 문의건X 제외 조건이면 스킵
      if (!receiptType) return;
      if (receiptType === "문의건X") {
        const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
        if (excludeDetailSources.includes(detailSource)) return;
      }

      // 세부매체 카운트
      detailSourceCount[detailSource] = (detailSourceCount[detailSource] || 0) + 1;

      // 매체 카테고리 결정 (간단한 로직 재현)
      let category = "기타";
      
      const 홈페이지Sources = [
        "메인홈페이지_8230", "구홈페이지", "서울플레이스_5059", "부산플레이스_1970",
        "파워컨텐츠_2383", "유튜브_1737", "메인홈페이지", "세모특허원페이지",
        "서울플레이스", "부산플레이스", "유튜브", "파워컨텐츠", "플레이스_예약"
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

// 📦 DB 동기화 엔드포인트 (로컬 + 클라우드 Supabase 동시 동기화)
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

    // 1. 구글 시트 데이터 가져오기
    console.log("📊 구글 시트 데이터 가져오기...");
    const ranges = ["'2025상담'!B5:S"]; // 5행부터 가져오기 (헤더 제외)
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data["'2025상담'!B5:S"] || [];

    console.log(`✅ ${rows.length}건의 데이터 로드 완료`);

    // 2. 데이터 변환
    console.log("🔄 데이터 변환 중...");
    let inquiries = rows
      .map((row, index) => transformSheetRowToInquiry(row, index))
      .filter((inquiry): inquiry is NonNullable<typeof inquiry> => inquiry !== null);

    // 3. 중복 체크 (간소화 - 메모리 절약)
    console.log(`🔍 중복 체크 스킵 (성능 최적화) - ${inquiries.length}건 처리 예정`);
    // inquiries = markDuplicateInquiries(inquiries); // 성능 최적화를 위해 스킵

    // 4. 로컬 DB 동기화 (스킵 - 리소스 절약)
    let localResult = { skipped: true, reason: "리소스 절약을 위해 클라우드만 동기화" };

    // 5. 클라우드 DB 동기화 (배치 최적화)
    let cloudResult = null;
    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    if (cloudSupabaseUrl && cloudSupabaseServiceKey) {
      console.log("☁️ 클라우드 DB 동기화 중...");
      try {
        cloudResult = await syncToDatabaseOptimized(cloudSupabaseUrl, cloudSupabaseServiceKey, inquiries);
        console.log("✅ 클라우드 DB 동기화 완료:", cloudResult.stats);
      } catch (error) {
        console.error("⚠️ 클라우드 DB 동기화 실패:", error);
        return c.json({
          success: false,
          error: "클라우드 DB 동기화 실패",
          details: error instanceof Error ? error.message : String(error)
        }, 500);
      }
    } else {
      return c.json({
        success: false,
        error: "클라우드 Supabase 환경 변수가 설정되지 않았습니다.",
        needsSetup: true
      }, 400);
    }

    // 6. 결과 반환
    return c.json({
      success: true,
      message: "동기화가 완료되었습니다.",
      local: localResult,
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

// 📦 DB 동기화 (범위 지정) - 대량 데이터용
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

    // 범위 지정하여 데이터 가져오기
    const range = `'2025상담'!B${startRow}:S${endRow}`;
    console.log(`📊 범위: ${range}`);
    
    const ranges = [range];
    const data = await fetchMultipleRanges(spreadsheetId, ranges);
    const rows = data[range] || [];

    console.log(`✅ ${rows.length}건 로드`);

    // 데이터 변환 (행 번호 계산 주의)
    let inquiries = rows
      .map((row, index) => transformSheetRowToInquiry(row, startRow + index - 2))
      .filter((inquiry): inquiry is NonNullable<typeof inquiry> => inquiry !== null);

    console.log(`🔄 변환 완료: ${inquiries.length}건`);

    // 클라우드 DB 동기화
    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    if (!cloudSupabaseUrl || !cloudSupabaseServiceKey) {
      return c.json({ error: "클라우드 Supabase 환경 변수 미설정" }, 400);
    }

    const result = await syncToDatabaseOptimized(cloudSupabaseUrl, cloudSupabaseServiceKey, inquiries);

    return c.json({
      success: true,
      range: { startRow, endRow },
      processed: inquiries.length,
      stats: result.stats,
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
        error: "D열(접수유형)이 비어있어 동기화하지 않습니다." 
      }, 400);
    }
    
    // 날짜 필수 체크
    if (!inquiry.date) {
      return c.json({ 
        success: false, 
        error: "날짜가 비어있어 동기화하지 않습니다." 
      }, 400);
    }

    const cloudSupabaseUrl = Deno.env.get("CLOUD_SUPABASE_URL");
    const cloudSupabaseServiceKey = Deno.env.get("CLOUD_SUPABASE_SERVICE_KEY");

    if (!cloudSupabaseUrl || !cloudSupabaseServiceKey) {
      return c.json({ error: "클라우드 Supabase 환경 변수 미설정" }, 400);
    }

    const supabase = createClient(cloudSupabaseUrl, cloudSupabaseServiceKey);

    // DB 레코드 준비
    const dbRecord = {
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
      synced_at: new Date().toISOString(),
    };

    // Upsert (date + phone + time을 unique key로 사용)
    const { error: upsertError } = await supabase
      .from("inquiries")
      .upsert([dbRecord], {
        onConflict: "date,phone,time", // Primary Key 조합
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error("❌ Upsert 오류:", upsertError);
      return c.json({ 
        success: false, 
        error: upsertError.message 
      }, 500);
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
