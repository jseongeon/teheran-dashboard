/**
 * 구글 스프레드시트 실시간 동기화 스크립트
 * 
 * 설정 방법:
 * 1. 구글 스프레드시트에서 Extensions → Apps Script 열기
 * 2. 이 코드를 붙여넣기
 * 3. SUPABASE_URL과 SUPABASE_SERVICE_KEY를 입력
 * 4. 저장 후 onEdit 트리거 설정
 *    - 트리거: onEdit
 *    - 이벤트 소스: From spreadsheet
 *    - 이벤트 타입: On edit
 */

// ========================================
// 🔧 설정값 (여기만 수정하세요!)
// ========================================

const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE"; // 예: https://abc123.supabase.co/functions/v1/make-server-1da81fff
const SUPABASE_SERVICE_KEY = "YOUR_SERVICE_KEY_HERE";
const SHEET_NAME = "2025상담";
const START_ROW = 5; // 데이터 시작 행 (B5부터)

// ========================================
// 📌 자동 실행 함수 - D열 또는 E열이 변경될 때만 실행
// ========================================

function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    
    // 1. "2025상담" 시트인지 확인
    if (sheet.getName() !== SHEET_NAME) {
      Logger.log("❌ 다른 시트입니다. 동기화 스킵.");
      return;
    }
    
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    
    // 2. B5 이전 행이면 무시 (헤더)
    if (row < START_ROW) {
      Logger.log("❌ 헤더 행입니다. 동기화 스킵.");
      return;
    }
    
    // 3. D열(접수유형) 또는 E열(세부매체)이 변경되었는지 확인
    // B열=1, C열=2, D열=3, E열=4
    const isDColumn = col === 3; // D열 (접수유형)
    const isEColumn = col === 4; // E열 (세부매체)
    
    if (!isDColumn && !isEColumn) {
      Logger.log("❌ D열 또는 E열이 아닙니다. 동기화 스킵.");
      return;
    }
    
    // 4. 변경된 행의 전체 데이터 가져오기
    const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0]; // B~S열
    
    // 5. D열(접수유형)이 비어있으면 동기화 안 함
    const receiptType = rowData[1]; // D열 (index 1, 0부터 시작하므로)
    if (!receiptType) {
      Logger.log(`⚠️ 행 ${row}: D열(접수유형)이 비어있어 동기화하지 않습니다.`);
      return;
    }
    
    Logger.log(`✅ 행 ${row} 동기화 시작...`);
    Logger.log(`  - D열(접수유형): ${receiptType}`);
    Logger.log(`  - E열(세부매체): ${rowData[2] || "(비어있음)"}`);
    
    // 6. 서버에 데이터 전송
    syncRow(rowData, row);
    
  } catch (error) {
    Logger.log(`❌ onEdit 오류: ${error}`);
  }
}

// ========================================
// 📌 서버로 데이터 전송
// ========================================

function syncRow(rowData, rowNumber) {
  try {
    // 1. 데이터 파싱
    const inquiry = {
      date: formatDate(rowData[0]), // B열
      time: rowData[1] || "", // C열
      receiptType: rowData[2] || "", // D열
      detailSource: rowData[3] || "", // E열
      field: rowData[4] || "", // F열
      customerName: rowData[5] || "", // G열
      phone: rowData[6] || "", // H열
      email: rowData[7] || "", // I열
      receptionist: rowData[8] || "", // J열
      content: rowData[9] || "", // K열
      attachedFile: rowData[10] || "", // L열
      isReminder: rowData[11] === true || rowData[11] === "TRUE", // M열
      attorney: rowData[12] || "", // N열
      responseContent: rowData[13] || "", // O열
      isVisit: rowData[14] === true || rowData[14] === "TRUE", // P열
      isContract: rowData[15] === true || rowData[15] === "TRUE", // Q열
      contractDate: formatDate(rowData[16]), // R열
      contractAmount: parseAmount(rowData[17]) // S열
    };
    
    // 2. D열(접수유형)이 없으면 스킵
    if (!inquiry.receiptType) {
      Logger.log("⚠️ D열(접수유형)이 비어있어 동기화하지 않습니다.");
      return;
    }
    
    // 3. 날짜가 없으면 스킵
    if (!inquiry.date) {
      Logger.log("⚠️ 날짜가 비어있어 동기화하지 않습니다.");
      return;
    }
    
    // 4. API 요청 전송
    const url = `${SUPABASE_URL}/api/sync-single-row`;
    
    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      payload: JSON.stringify(inquiry),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      Logger.log(`✅ 행 ${rowNumber} 동기화 성공!`);
      Logger.log(`  응답: ${responseText}`);
    } else {
      Logger.log(`❌ 행 ${rowNumber} 동기화 실패! (${responseCode})`);
      Logger.log(`  응답: ${responseText}`);
    }
    
  } catch (error) {
    Logger.log(`❌ syncRow 오류: ${error}`);
  }
}

// ========================================
// 📌 헬퍼 함수
// ========================================

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
function formatDate(value) {
  if (!value) return "";
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    return "";
  }
}

/**
 * 금액 파싱
 */
function parseAmount(value) {
  if (!value) return null;
  
  try {
    const numStr = String(value).replace(/[^0-9.-]/g, '');
    const num = parseFloat(numStr);
    return isNaN(num) ? null : num;
  } catch (error) {
    return null;
  }
}

// ========================================
// 📌 테스트 함수 (수동 실행용)
// ========================================

function testSync() {
  Logger.log("🧪 테스트 시작...");
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const testRow = 5; // 5번 행 테스트
  const rowData = sheet.getRange(testRow, 2, 1, 18).getValues()[0];
  
  Logger.log("테스트 데이터:");
  Logger.log(rowData);
  
  syncRow(rowData, testRow);
}
