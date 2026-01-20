// ========================================
// 🔧 설정값
// ========================================
const SUPABASE_URL = 'https://nhhuesrmapuweitfvoqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaHVlc3JtYXB1d2VpdGZ2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MTU3OTcsImV4cCI6MjA4MDM5MTc5N30.0QKXSQT0Ubz7capZ3GDwYG3siJuGTtcPLxuWz3B2tbA';
const SPREADSHEET_ID = '1gga84mxgkUI99PF-tFoeuWxFztMUxThgeHbSMphSF5M';

// 🔔 Slack Webhook URL (필수 설정!)
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

// ========================================
// 📝 onEditInstallable 핸들러
// ========================================
/** onEditInstallable 핸들러 - 설치 가능한 트리거 전용 */
function onEditInstallable(e) {
  // 매개변수 체크
  if (!e || !e.range) {
    console.log('onEditInstallable은 설치 가능한 트리거 함수입니다. 수동 실행하지 마세요.');
    return;
  }

  try {
    const sheet = e.range.getSheet();
    const row   = e.range.getRow();
    const col   = e.range.getColumn();

    if (sheet.getName() !== '2025상담' || row < 5) return;

    // 🆕 0) 필수 필드(B, C, H열) 삭제 시 Supabase 동기화 처리
    if (col === 2 || col === 3 || col === 8) { // B열(날짜), C열(시간), H열(전화번호)
      const newValue = e.range.getValue();
      
      // 값이 비워졌으면 삭제 동기화 실행
      if (!newValue || newValue === '') {
        console.log(`${row}행의 필수 필드(열 ${col}) 삭제 감지 - Supabase 동기화 실행`);
        syncDeletedRows();
        return;
      }
      
      // H열(전화번호)은 포맷팅 적용
      if (col === 8) {
        const cell = sheet.getRange(row, 8);
        const v = String(newValue).replace(/[^0-9]/g, '');
        if (/^\d+$/.test(v)) {
          const fmt = v
            .replace(/^(02)(\d{3,4})(\d{4})$/, '$1-$2-$3')
            .replace(/^(0\d{2})(\d{3,4})(\d{4})$/, '$1-$2-$3')
            .replace(/^(01\d)(\d{3,4})(\d{4})$/, '$1-$2-$3');
          cell.setValue(fmt);
        }
      }
      
      // 값이 있으면 일반 동기화
      const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
      syncToSupabase(rowData, row);
      return;
    }

    // 2) M열(13) 체크/해제 - Remind 시트 전용
    if (col === 13) {
      const isChecked = sheet.getRange(row, 13).getValue() === true;
      if (isChecked) {
        appendRemindRow(e);
      } else {
        removeRemindRow(e);
      }
      // Supabase 동기화
      const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
      syncToSupabase(rowData, row);
      return;
    }

    // 3) Q열(17) 체크/해제 - 2025수임 및 포괄관리 처리 + 🆕 Slack 알림
    if (col === 17) {
      const isChecked = sheet.getRange(row, 17).getValue() === true;
      if (isChecked) {
        // 기존 동기화
        syncAllCheckedData();
        
        // Supabase 동기화
        const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
        syncToSupabase(rowData, row);
        
        // 🆕 Slack 알림 전송!
        sendSlackNotification(rowData);
      } else {
        removeOverviewRow(e);
        removeUncheckedOverviewData();
        
        // Supabase 동기화
        const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
        syncToSupabase(rowData, row);
      }
      return;
    }

    // 4) R열(18) 입력 시 (단, Q열이 체크된 행만 처리)
    if (col === 18 && sheet.getRange(row, 17).getValue() === true) {
      syncAllCheckedData();
      // Supabase 동기화
      const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
      syncToSupabase(rowData, row);
      return;
    }

    // 5) S열(19) 입력 시 (단, Q열이 체크된 행만 처리)
    if (col === 19 && sheet.getRange(row, 17).getValue() === true) {
      syncAllCheckedData();
      // Supabase 동기화
      const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
      syncToSupabase(rowData, row);
      return;
    }

    // 6) 나머지 데이터 열 편집 시에도 Supabase 동기화 (D, E, F, G, I, J, K, N, O, P)
    const syncCols = [4, 5, 6, 7, 9, 10, 11, 14, 15, 16];
    if (syncCols.includes(col)) {
      const rowData = sheet.getRange(row, 2, 1, 18).getValues()[0];
      syncToSupabase(rowData, row);
      return;
    }

  } catch (error) {
    console.error('onEdit 오류:', error);
    
    // 사용자에게 알림 표시
    try {
      SpreadsheetApp.getUi().alert(
        '⚠️ 스크립트 오류',
        `데이터 처리 중 오류가 발생했습니다.\n오류: ${error.message}`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (uiError) {
      console.error('UI 알림 표시 실패:', uiError);
    }
  }
}

// ========================================
// 🗑️ onChange 핸들러 - 행 삭제 감지
// ========================================
function onChange(e) {
  if (!e) {
    console.log('onChange는 설치 가능한 트리거 함수입니다. 수동 실행하지 마세요.');
    return;
  }

  try {
    console.log('변경 타입:', e.changeType);
    
    // 행 삭제 또는 구조 변경 감지
    if (e.changeType === 'REMOVE_ROW' || e.changeType === 'REMOVE_GRID') {
      console.log('행 삭제 또는 구조 변경 감지 - Supabase 동기화 시작');
      syncDeletedRows();
    }
  } catch (error) {
    console.error('onChange 오류:', error);
  }
}

// ========================================
// 🔄 Supabase 동기화 함수
// ========================================

/** 개별 행을 Supabase에 동기화 (INSERT or UPDATE) */
function syncToSupabase(rowData, rowNumber) {
  try {
    // 필수 필드 확인: D열(접수유형)만 필수
    const receptionType = rowData[2]; // D열 (인덱스 2)
    
    // 디버깅: 필수 필드 값 출력
    console.log(`🔍 ${rowNumber}행 필수 필드 체크:`);
    console.log(`   - D열(접수유형): [${receptionType}] (타입: ${typeof receptionType})`);
    
    // D열(접수유형)이 비어있으면 동기화 건너뜀
    if (!receptionType || receptionType === '') {
      console.log(`⏭️ ${rowNumber}행: D열(접수유형) 비어있음 - 동기화 건너뜀`);
      return;
    }

    // 기본값 설정
    const date = rowData[0];  // B열
    const time = rowData[1];  // C열
    const phone = rowData[6]; // H열

    // 날짜 포맷팅
    let formattedDate = '';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    } else if (typeof date === 'string' && date) {
      formattedDate = date;
    } else {
      // 날짜가 없으면 오늘 날짜로 설정
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    // 시간 포맷팅 (HH:MM 형식)
    let timeValue = '';
    if (time instanceof Date) {
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      timeValue = `${hours}:${minutes}`;
    } else if (typeof time === 'string' && time) {
      timeValue = String(time);
    } else {
      // 시간이 없으면 현재 시간
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeValue = `${hours}:${minutes}`;
    }
    
    // 전화번호가 없으면 빈 문자열 사용
    const phoneValue = phone ? String(phone) : '';

    // Q열(수임여부) 체크 여부로 테이블 결정
    const isCommissioned = rowData[15] === true; // Q열 (인덱스 15)
    const tableName = 'inquiries'; // 모든 데이터는 inquiries 테이블에 저장

    // 데이터 매핑 - inquiries 테이블 스키마에 맞춤
    const payload = {
      date: formattedDate,
      time: timeValue,
      receipt_type: String(receptionType),          // D열: 접수유형
      detail_source: String(rowData[3] || ''),      // E열: 세부매체
      inquiry_type: String(rowData[3] || ''),       // F열 대신 E열 사용 (임시)
      field: String(rowData[4] || ''),              // G열: 분야 (원래 F열)
      phone: phoneValue,                            // H열: 전화번호
      consulting_attorney: String(rowData[12] || ''), // I열: 상담변리사 (원래 N열)
      content: String(rowData[9] || ''),            // J열: 내용 (원래 K열)
      response_content: String(rowData[13] || ''),  // K열: 회신내용 (원래 O열)
      customer_name: String(rowData[5] || ''),      // L열: 고객명 (원래 G열)
      company_name: String(rowData[6] || ''),       // M열: 회사명 (임시로 H열 사용)
      contract_status: isCommissioned ? '수임' : null, // Q열: 수임여부
      contract_attorney: isCommissioned ? String(rowData[12] || '') : null, // R열: 수임변리사
      contract_amount: isCommissioned && rowData[17] ? parseFloat(String(rowData[17]).replace(/[^0-9.]/g, '')) : null // S열: 수임금액
    };

    console.log(`🔍 동기화 시도: 테이블=${tableName}, 접수유형=${receptionType}, 날짜=${formattedDate}, 시간=${timeValue}`);

    // Supabase Upsert
    const fullUrl = SUPABASE_URL + '/rest/v1/' + tableName + '?on_conflict=date,phone,time';
    
    console.log(`🔍 요청 URL: ${fullUrl}`);
    
    const options = {
      method: 'post',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    console.log('🔍 요청 전송 중...');
    const response = UrlFetchApp.fetch(fullUrl, options);
    const statusCode = response.getResponseCode();

    if (statusCode === 200 || statusCode === 201) {
      console.log(`✅ ${rowNumber}행 동기화 성공 (${tableName}): ${receptionType}, ${formattedDate}, ${timeValue}`);
    } else {
      console.error(`❌ ${rowNumber}행 동기화 실패 (${statusCode}):`, response.getContentText());
    }

  } catch (error) {
    console.error(`❌ syncToSupabase 오류 (${rowNumber}행):`, error);
    console.error(`❌ 에러 이름: ${error.name}`);
    console.error(`❌ 에러 메시지: ${error.message}`);
    console.error(`❌ 에러 스택:`, error.stack);
  }
}

/** Supabase에서 삭제된 행 동기화 */
function syncDeletedRows() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('2025상담');
    
    // 스프레드시트의 모든 데이터 가져오기 (5행부터)
    const lastRow = sheet.getLastRow();
    const sheetData = sheet.getRange(5, 2, lastRow - 4, 18).getValues();
    
    // 스프레드시트 키 목록 생성 (date, phone, time)
    const sheetKeys = new Set();
    sheetData.forEach(row => {
      const date = row[0];       // B열
      const time = row[1];       // C열
      const receptionType = row[2]; // D열
      const phone = row[6];      // H열
      
      // D열(접수유형)이 있는 행만 처리 (Supabase에 저장된 데이터만)
      if (!receptionType || receptionType === '') {
        return; // 접수유형 없으면 건너뜀
      }
      
      // 날짜 포맷팅
      let formattedDate = '';
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else if (typeof date === 'string' && date) {
        formattedDate = String(date);
      } else {
        // 날짜 없으면 오늘 날짜
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
      
      // 시간이 없으면 현재 시간
      const timeValue = time ? String(time) : new Date().toTimeString().substring(0, 5);
      
      // 전화번호가 없으면 빈 문자열
      const phoneValue = phone ? String(phone) : '';
      
      const key = `${formattedDate}|${phoneValue}|${timeValue}`;
      sheetKeys.add(key);
    });

    console.log('스프레드시트 키 개수:', sheetKeys.size);

    // Supabase에서 데이터 가져오기 (inquiries만)
    let deletedCount = 0;
    
    // inquiries 테이블 확인
    const inquiriesUrl = `${SUPABASE_URL}/rest/v1/inquiries?select=date,phone,time`;
    const inquiriesResponse = UrlFetchApp.fetch(inquiriesUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    const inquiriesData = JSON.parse(inquiriesResponse.getContentText());
    
    console.log('Supabase inquiries 키 개수:', inquiriesData.length);
    
    // 스프레드시트에 없는 데이터 삭제
    inquiriesData.forEach(item => {
      const key = `${item.date}|${item.phone}|${item.time}`;
      if (!sheetKeys.has(key)) {
        deleteFromSupabase('inquiries', item.date, item.phone, item.time);
        deletedCount++;
      }
    });

    console.log(`✅ 삭제 동기화 완료: ${deletedCount}건 삭제됨`);

  } catch (error) {
    console.error('❌ syncDeletedRows 오류:', error);
  }
}

/** Supabase에서 특정 행 삭제 */
function deleteFromSupabase(tableName, date, phone, time) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?date=eq.${date}&phone=eq.${encodeURIComponent(phone)}&time=eq.${encodeURIComponent(time)}`;
    const options = {
      method: 'delete',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();

    if (statusCode === 200 || statusCode === 204) {
      console.log(`✅ Supabase 삭제 성공 (${tableName}): ${date}, ${phone}, ${time}`);
    } else {
      console.error(`❌ Supabase 삭제 실패 (${statusCode}):`, response.getContentText());
    }

  } catch (error) {
    console.error('❌ deleteFromSupabase 오류:', error);
  }
}

// ========================================
// 🔔 Slack 알림
// ========================================
function sendSlackNotification(rowData) {
  try {
    // Slack Webhook URL이 설정되지 않았으면 건너뛰기
    if (!SLACK_WEBHOOK_URL || SLACK_WEBHOOK_URL.includes('YOUR/WEBHOOK/URL')) {
      console.log('⚠️ Slack Webhook URL이 설정되지 않았습니다. 알림을 건너뜁니다.');
      return;
    }

    const date = rowData[0];
    const time = rowData[1];
    const receptionType = rowData[2];
    const client = rowData[4];
    const phone = rowData[6];
    const counselor = rowData[9];

    // 날짜 포맷팅
    let formattedDate = '';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    } else {
      formattedDate = String(date);
    }

    // Slack 메시지 구성
    const message = {
      text: '🎉 신규 수임 발생!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 신규 수임이 발생했습니다!',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*날짜:*\n${formattedDate} ${time}`
            },
            {
              type: 'mrkdwn',
              text: `*고객명:*\n${client || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*접수유형:*\n${receptionType || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*상담사:*\n${counselor || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*연락처:*\n${phone || '-'}`
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `📊 <https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}|스프레드시트에서 확인>`
            }
          ]
        }
      ]
    };

    // Slack Webhook 호출
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(message),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
    const statusCode = response.getResponseCode();

    if (statusCode === 200) {
      console.log('✅ Slack 알림 전송 성공');
    } else {
      console.error('❌ Slack 알림 전송 실패:', response.getContentText());
    }

  } catch (error) {
    console.error('❌ sendSlackNotification 오류:', error);
  }
}

// ========================================
// 📋 기존 시트 연동 함수들
// ========================================

/** M열 체크 시 Remind 시트에 추가 */
function appendRemindRow(e) {
  try {
    const sourceSheet = e.range.getSheet();
    const sourceRow = e.range.getRow();
    const ss = sourceSheet.getParent();
    const remindSheet = ss.getSheetByName('Remind');
    
    if (!remindSheet) {
      console.log('Remind 시트를 찾을 수 없습니다.');
      return;
    }

    // 원본 데이터 가져오기
    const sourceData = sourceSheet.getRange(sourceRow, 2, 1, 13).getValues()[0];
    
    // Remind 시트에 추가
    remindSheet.appendRow(sourceData);
    console.log(`✅ Remind 시트에 ${sourceRow}행 추가됨`);

  } catch (error) {
    console.error('appendRemindRow 오류:', error);
  }
}

/** M열 체크 해제 시 Remind 시트에서 삭제 */
function removeRemindRow(e) {
  try {
    const sourceSheet = e.range.getSheet();
    const sourceRow = e.range.getRow();
    const ss = sourceSheet.getParent();
    const remindSheet = ss.getSheetByName('Remind');
    
    if (!remindSheet) return;

    // 원본 데이터의 B열 값 (날짜)
    const dateValue = sourceSheet.getRange(sourceRow, 2).getValue();
    
    // Remind 시트에서 해당 행 찾아서 삭제
    const remindData = remindSheet.getDataRange().getValues();
    for (let i = remindData.length - 1; i >= 0; i--) {
      if (remindData[i][0] && remindData[i][0].toString() === dateValue.toString()) {
        remindSheet.deleteRow(i + 1);
        console.log(`✅ Remind 시트에서 ${i + 1}행 삭제됨`);
        break;
      }
    }

  } catch (error) {
    console.error('removeRemindRow 오류:', error);
  }
}

/** Q열 체크된 모든 데이터를 2025수임 시트에 동기화 */
function syncAllCheckedData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName('2025상담');
    const targetSheet = ss.getSheetByName('2025수임');
    
    if (!targetSheet) {
      console.log('2025수임 시트를 찾을 수 없습니다.');
      return;
    }

    // 2025수임 시트 초기화 (헤더 제외)
    const lastRow = targetSheet.getLastRow();
    if (lastRow > 4) {
      targetSheet.deleteRows(5, lastRow - 4);
    }

    // Q열이 체크된 행 찾기
    const sourceData = sourceSheet.getDataRange().getValues();
    const checkedRows = [];
    
    for (let i = 4; i < sourceData.length; i++) { // 5행부터 시작 (인덱스 4)
      if (sourceData[i][16] === true) { // Q열 (인덱스 16)
        // B~S열 데이터 (인덱스 1~18)
        checkedRows.push(sourceData[i].slice(1, 19));
      }
    }

    // 2025수임 시트에 추가
    if (checkedRows.length > 0) {
      targetSheet.getRange(5, 2, checkedRows.length, 18).setValues(checkedRows);
      console.log(`✅ 2025수임 시트에 ${checkedRows.length}건 동기화됨`);
    }

  } catch (error) {
    console.error('syncAllCheckedData 오류:', error);
  }
}

/** Q열 체크 해제 시 2025수임 시트에서 해당 행 삭제 */
function removeOverviewRow(e) {
  try {
    const sourceSheet = e.range.getSheet();
    const sourceRow = e.range.getRow();
    const ss = sourceSheet.getParent();
    const targetSheet = ss.getSheetByName('2025수임');
    
    if (!targetSheet) return;

    // 원본 데이터의 B열 값 (날짜)
    const dateValue = sourceSheet.getRange(sourceRow, 2).getValue();
    const phoneValue = sourceSheet.getRange(sourceRow, 8).getValue();
    
    // 2025수임 시트에서 해당 행 찾아서 삭제
    const targetData = targetSheet.getDataRange().getValues();
    for (let i = targetData.length - 1; i >= 4; i--) {
      if (targetData[i][1] && targetData[i][1].toString() === dateValue.toString() &&
          targetData[i][7] && targetData[i][7].toString() === phoneValue.toString()) {
        targetSheet.deleteRow(i + 1);
        console.log(`✅ 2025수임 시트에서 ${i + 1}행 삭제됨`);
        break;
      }
    }

  } catch (error) {
    console.error('removeOverviewRow 오류:', error);
  }
}

/** Q열 체크 해제된 데이터를 2025수임 ���트에서 제거 */
function removeUncheckedOverviewData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName('2025상담');
    const targetSheet = ss.getSheetByName('2025수임');
    
    if (!targetSheet) return;

    // Q열이 체크된 행의 키 목록 생성
    const sourceData = sourceSheet.getDataRange().getValues();
    const checkedKeys = new Set();
    
    for (let i = 4; i < sourceData.length; i++) {
      if (sourceData[i][16] === true) { // Q열
        const key = `${sourceData[i][1]}|${sourceData[i][7]}`; // 날짜|전화번호
        checkedKeys.add(key);
      }
    }

    // 2025수임 시트에서 체크되지 않은 행 삭제
    const targetData = targetSheet.getDataRange().getValues();
    for (let i = targetData.length - 1; i >= 4; i--) {
      const key = `${targetData[i][1]}|${targetData[i][7]}`;
      if (!checkedKeys.has(key)) {
        targetSheet.deleteRow(i + 1);
        console.log(`✅ 2025수임 시트에서 ${i + 1}행 삭제됨 (체크 해제)`);
      }
    }

  } catch (error) {
    console.error('removeUncheckedOverviewData 오류:', error);
  }
}

// ========================================
// 🧪 테스트 함수
// ========================================

/** 기본 네트워크 연결 테스트 */
function testBasicConnection() {
  console.log('🧪 기본 네트워크 연결 테스트...');
  
  try {
    const response = UrlFetchApp.fetch('https://www.google.com', {
      muteHttpExceptions: true
    });
    
    const statusCode = response.getResponseCode();
    console.log('✅ Google.com 연결 성공! 응답 코드:', statusCode);
    
    // 이제 Supabase 테스트
    console.log('🧪 Supabase 연결 시도...');
    const supabaseResponse = UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/inquiries?limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      muteHttpExceptions: true
    });
    
    const supabaseStatus = supabaseResponse.getResponseCode();
    console.log('✅ Supabase 연결 성공! 응답 코드:', supabaseStatus);
    console.log('데이터:', supabaseResponse.getContentText().substring(0, 200));
    
  } catch (error) {
    console.error('❌ 연결 실패:', error);
    console.error('에러 타입:', error.name);
    console.error('에러 메시지:', error.message);
  }
}

/** Supabase 연결 테스트 */
function testSupabaseConnection() {
  console.log('🧪 Supabase 연결 테스트 시작...');
  
  const url = `${SUPABASE_URL}/rest/v1/inquiries?limit=1`;
  
  try {
    const response = UrlFetchApp.fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      muteHttpExceptions: true
    });
    
    const statusCode = response.getResponseCode();
    
    if (statusCode === 200) {
      console.log('✅ Supabase 연결 성공!');
      console.log('응답 코드:', statusCode);
      console.log('데이터 샘플:', response.getContentText().substring(0, 200));
    } else {
      console.error('❌ Supabase 연결 실패');
      console.error('응답 코드:', statusCode);
      console.error('응답 내용:', response.getContentText());
    }
    
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error);
    console.error('에러 상세:', JSON.stringify(error));
  }
}