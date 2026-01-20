// ========================================
// 🧪 테스트 함수
// ========================================

/** Slack 알림 테스트 */
function testSlackNotification() {
  console.log('🧪 Slack 알림 테스트 시작...');
  
  // 테스트 데이터
  const testData = [
    new Date('2025-12-26'),           // 0: B열 - 날짜
    new Date('2025-12-26 17:30:00'),  // 1: C열 - 시간
    '유선',                           // 2: D열 - 접수유형
    '네이버',                         // 3: E열 - 세부매체
    '특허',                           // 4: F열 - 세부분야
    '홍길동',                         // 5: G열 - 고객성함
    '010-1234-5678',                  // 6: H열 - 전화번호
    'test@example.com',               // 7: I열 - 이메일
    '김접수',                         // 8: J열 - 1차접수자
    '특허 출원 문의',                 // 9: K열 - 접수내용
    '',                               // 10: L열 - 첨부파일
    false,                            // 11: M열 - 리마인드CRM
    '김변리',                         // 12: N열 - 변리사님
    '특허 출원 가능성 높음',          // 13: O열 - 상담내용
    false,                            // 14: P열 - 방문/출장
    true,                             // 15: Q열 - 수임여부
    '2025-12-26',                     // 16: R열 - 수임일
    5000000                           // 17: S열 - 수임금액
  ];
  
  sendSlackNotification(testData);
  console.log('✅ Slack 알림 테스트 완료! Slack 채널을 확인하세요.');
}

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
      console.log('응답 코드:', statusCode);
      console.log('응답 내용:', response.getContentText());
    }
    
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error);
    console.error('에러 상세:', JSON.stringify(error));
  }
}