/**
 * 구글 시트 → Supabase 실시간 동기화
 * 
 * 설치 방법:
 * 1. 구글 시트에서 확장 프로그램 → Apps Script
 * 2. 이 코드를 붙여넣기
 * 3. 환경 변수 설정 (CLOUD_SUPABASE_URL, CLOUD_SUPABASE_SERVICE_KEY)
 * 4. 트리거 설정: onEdit 함수에 대해 "편집 시" 트리거 추가
 */

// ========================================
// 📌 환경 변수 (여기에 직접 입력하거나 Script Properties 사용)
// ========================================

const CLOUD_SUPABASE_URL = "YOUR_CLOUD_SUPABASE_URL"; // 예: https://xxx.supabase.co
const CLOUD_SUPABASE_SERVICE_KEY = "YOUR_CLOUD_SUPABASE_SERVICE_KEY";

// ========================================
// 📌 onEdit 트리거 (시트 편집 시 자동 실행)
// ========================================

/**
 * 시트가 편집될 때 자동 실행
 */
function onEdit(e) {
  try {
    // 편집된 시트 이름 확인
    const sheetName = e.source.getActiveSheet().getName();
    
    // "2025상담" 시트만 처리
    if (sheetName !== "2025상담") {
      console.log(`⏭️ 스킵: ${sheetName} 시트는 동기화 대상이 아닙니다.`);
      return;
    }
    
    // 편집된 범위 확인
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    
    // 헤더 행(1행) 편집은 무시
    if (row === 1) {
      console.log("⏭️ 스킵: 헤더 행은 동기화하지 않습니다.");
      return;
    }
    
    // B~S열(2~19) 범위 확인
    if (col < 2 || col > 19) {
      console.log(`⏭️ 스킵: ${col}열은 동기화 대상이 아닙니다.`);
      return;
    }
    
    console.log(`✏️ 편집 감지: ${row}행, ${col}열`);
    
    // 해당 행의 전체 데이터 가져오기 (B~S열)
    const sheet = e.source.getActiveSheet();
    const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0]; // B~S열 (18개 컬럼)
    
    // 데이터 변환
    const inquiry = transformRowData(rowData, row);
    
    if (!inquiry) {
      console.log("⚠️ 유효하지 않은 데이터 (날짜 없음)");
      return;
    }
    
    // Supabase에 Upsert
    syncToSupabase(inquiry);
    
  } catch (error) {
    console.error("❌ onEdit 에러:", error);
  }
}

// ========================================
// 📌 데이터 변환 함수
// ========================================

/**
 * 구글 시트 행 데이터를 DB 형식으로 변환
 */
function transformRowData(row, rowNumber) {
  const date = row[0] ? formatDate(row[0]) : ""; // B열: 날짜
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
  const contractDate = row[16] ? formatDate(row[16]) : ""; // R열: 수임일
  const contractAmount = row[17] ? parseFloat(String(row[17]).replace(/[^0-9.-]/g, "")) : null; // S열: 수임금액

  // 날짜가 없으면 무효
  if (!date) return null;

  // 완전 제외 조건
  const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"];
  const isExcluded = receiptType === "문의건X" && excludeDetailSources.includes(detailSource);

  return {
    date,
    time,
    receipt_type: receiptType,
    detail_source: detailSource,
    field,
    customer_name: customerName,
    phone,
    email,
    receptionist,
    content,
    attached_file: attachedFile,
    is_reminder: isReminder,
    attorney,
    response_content: responseContent,
    is_visit: isVisit,
    is_contract: isContract,
    contract_date: contractDate,
    contract_amount: contractAmount,
    is_excluded: isExcluded,
    is_duplicate: false, // 중복 체크는 DB에서 처리
    original_row_number: rowNumber,
    synced_at: new Date().toISOString()
  };
}

/**
 * 날짜 형식 변환 (구글 시트 Date 객체 → YYYY-MM-DD)
 */
function formatDate(value) {
  if (!value) return "";
  
  // 이미 문자열인 경우
  if (typeof value === "string") {
    return value;
  }
  
  // Date 객체인 경우
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return String(value);
}

// ========================================
// 📌 Supabase 동기화 함수
// ========================================

/**
 * Supabase에 데이터 Upsert
 */
function syncToSupabase(inquiry) {
  try {
    console.log(`🔄 Supabase 동기화 시작: 행 ${inquiry.original_row_number}`);
    
    const url = `${CLOUD_SUPABASE_URL}/rest/v1/inquiries`;
    
    const payload = JSON.stringify(inquiry);
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLOUD_SUPABASE_SERVICE_KEY}`,
        "apikey": CLOUD_SUPABASE_SERVICE_KEY,
        "Prefer": "resolution=merge-duplicates" // Upsert 설정
      },
      payload: payload,
      muteHttpExceptions: true // 에러 응답도 받기
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (statusCode >= 200 && statusCode < 300) {
      console.log(`✅ 동기화 성공: 행 ${inquiry.original_row_number}`);
      
      // 수임 데이터도 동기화
      if (inquiry.is_contract && !inquiry.is_excluded) {
        syncContractToSupabase(inquiry);
      }
    } else {
      console.error(`❌ 동기화 실패 (${statusCode}): ${responseText}`);
    }
    
  } catch (error) {
    console.error("❌ syncToSupabase 에러:", error);
  }
}

/**
 * 수임 테이블에 동기화
 */
function syncContractToSupabase(inquiry) {
  try {
    const url = `${CLOUD_SUPABASE_URL}/rest/v1/contracts`;
    
    const contractData = {
      date: inquiry.date,
      time: inquiry.time,
      receipt_type: inquiry.receipt_type,
      detail_source: inquiry.detail_source,
      field: inquiry.field,
      customer_name: inquiry.customer_name,
      phone: inquiry.phone,
      email: inquiry.email,
      attorney: inquiry.attorney,
      contract_date: inquiry.contract_date,
      contract_amount: inquiry.contract_amount,
      content: inquiry.content,
      response_content: inquiry.response_content,
      original_row_number: inquiry.original_row_number,
      synced_at: new Date().toISOString()
    };
    
    const payload = JSON.stringify(contractData);
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLOUD_SUPABASE_SERVICE_KEY}`,
        "apikey": CLOUD_SUPABASE_SERVICE_KEY,
        "Prefer": "resolution=merge-duplicates"
      },
      payload: payload,
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    
    if (statusCode >= 200 && statusCode < 300) {
      console.log(`✅ 수임 데이터 동기화 성공: 행 ${inquiry.original_row_number}`);
    } else {
      console.error(`❌ 수임 데이터 동기화 실패 (${statusCode})`);
    }
    
  } catch (error) {
    console.error("❌ syncContractToSupabase 에러:", error);
  }
}

// ========================================
// 📌 수동 테스트 함수
// ========================================

/**
 * 특정 행을 수동으로 동기화 (테스트용)
 */
function testSyncRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2025상담");
  const testRow = 2; // 테스트할 행 번호
  
  const rowData = sheet.getRange(testRow, 2, 1, 18).getValues()[0];
  const inquiry = transformRowData(rowData, testRow);
  
  if (inquiry) {
    console.log("📊 변환된 데이터:", inquiry);
    syncToSupabase(inquiry);
  } else {
    console.log("❌ 유효하지 않은 데이터");
  }
}

/**
 * 전체 시트 동기화 (초기 동기화용 - 주의: 10,000건은 타임아웃 발생)
 * 사용하지 마세요! CSV + SQL 방법 사용 권장
 */
function syncAllRows() {
  console.log("⚠️ 전체 동기화는 권장하지 않습니다. CSV + SQL 방법을 사용하세요.");
  // 이 함수는 비활성화됩니다.
}
