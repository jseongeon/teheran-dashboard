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

/** Q열 체크 해제된 데이터를 2025수임 시트에서 제거 */
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