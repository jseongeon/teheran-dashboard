# 📘 DB 동기화 가이드

## 🎯 개요

변리사 사무소 대시보드는 **2단계 동기화** 방식을 사용합니다:

1. **초기 배치 동기화** - 기존 9,770건의 데이터를 500건씩 나누어 동기화
2. **실시간 자동 동기화** - 이후 추가되는 데이터는 Google Apps Script로 자동 동기화

---

## 📋 1단계: 초기 배치 동기화

### **배치 동기화 버튼 클릭**

1. 대시보드 상단의 **"DB 동기화"** 또는 **"배치 동기화"** 버튼 클릭
2. 자동으로 500건씩 20개 배치로 나누어 처리
3. 약 5-10분 소요
4. 콘솔에서 진행 상황 확인 가능

### **필터링 규칙**

✅ **포함되는 데이터:**
- D열(접수유형)에 데이터가 있는 행만
- 날짜가 있는 행만

❌ **제외되는 데이터:**
- D열이 비어있는 행
- 날짜가 없는 행
- D열="문의건X" AND E열="문의건X/특허관리팀전달/AI응대"

---

## 🚀 2단계: 실시간 자동 동기화 설정

### **Google Apps Script 설정**

#### **A. 스크립트 붙여넣기**

1. **구글 스프레드시트 열기**
   - https://docs.google.com/spreadsheets/d/1gga84mxgkUI99PF-tFoeuWxFztMUxThgeHbSMphSF5M

2. **Apps Script 열기**
   - 메뉴: **Extensions** → **Apps Script**

3. **코드 붙여넣기**
   - `/docs/google-apps-script-realtime-sync.js` 파일의 전체 내용을 복사
   - Apps Script 에디터에 붙여넣기

4. **환경 변수 설정**
   ```javascript
   const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co/functions/v1/make-server-1da81fff";
   const SUPABASE_SERVICE_KEY = "YOUR_SERVICE_ROLE_KEY_HERE";
   ```

#### **B. 트리거 설정**

1. **트리거 메뉴 열기**
   - Apps Script 에디터 왼쪽 메뉴: **⏰ Triggers** (시계 아이콘)

2. **트리거 추가**
   - **Add Trigger** 버튼 클릭
   - 설정:
     - **Choose which function to run:** `onEdit`
     - **Choose which deployment should run:** `Head`
     - **Select event source:** `From spreadsheet`
     - **Select event type:** `On edit`
   - **Save** 클릭

3. **권한 승인**
   - 처음 실행 시 Google 계정 승인 필요
   - "Advanced" → "Go to [Project Name] (unsafe)" → "Allow"

#### **C. 테스트**

1. **테스트 함수 실행**
   - Apps Script에서 `testSync` 함수 선택
   - **Run** 버튼 클릭
   - 하단 로그에서 결과 확인

2. **실제 테스트**
   - 스프레드시트에서 D열 또는 E열 값 변경
   - Apps Script → **Executions** 탭에서 자동 실행 확인
   - 대시보드에서 데이터 확인

---

## 🔍 동작 원리

### **자동 동기화 조건**

실시간 동기화는 다음 조건에서만 실행됩니다:

✅ **동기화됨:**
1. "2025상담" 시트에서 변경
2. B5 이후 행 (헤더 제외)
3. D열(접수유형) 또는 E열(세부매체) 변경
4. D열에 데이터가 있는 경우

❌ **동기화 안 됨:**
- 다른 시트에서 변경
- 헤더 행 (B1~B4) 변경
- D열, E열 이외의 열 변경
- D열이 비어있는 경우

### **데이터 흐름**

```
구글 스프레드시트 (D열/E열 변경)
        ↓
Google Apps Script (onEdit 트리거)
        ↓
Supabase Edge Function (/api/sync-single-row)
        ↓
Supabase Database (inquiries 테이블)
        ↓
대시보드 (실시간 반영)
```

---

## 🛠️ DB 스키마

### **inquiries 테이블**

| 칼럼명 | 타입 | 설명 |
|--------|------|------|
| date | TEXT | B열: 문의날짜 (YYYY-MM-DD) |
| time | TEXT | C열: 문의시간 |
| receipt_type | TEXT | D열: 접수유형 (유선, 채팅, 기타) |
| detail_source | TEXT | E열: 세부매체 |
| field | TEXT | F열: 세부분야 |
| customer_name | TEXT | G열: 고객성함 |
| phone | TEXT | H열: 고객연락처 |
| email | TEXT | I열: 고객이메일 |
| receptionist | TEXT | J열: 1차접수자 |
| content | TEXT | K열: 접수내용 |
| attached_file | TEXT | L열: 첨부파일 |
| is_reminder | BOOLEAN | M열: 리마인드CRM |
| attorney | TEXT | N열: 변리사님 |
| response_content | TEXT | O열: 상담내용 |
| is_visit | BOOLEAN | P열: 방문/출장 |
| is_contract | BOOLEAN | Q열: 수임여부 |
| contract_date | TEXT | R열: 수임일 |
| contract_amount | DECIMAL | S열: 수임금액 |
| is_excluded | BOOLEAN | 계산: 제외 여부 |
| is_duplicate | BOOLEAN | 계산: 중복 여부 |
| synced_at | TIMESTAMP | 동기화 시각 |

**Primary Key:** `(date, phone, time)` 조합

---

## ⚠️ 주의사항

1. **D열(접수유형)은 필수입니다!**
   - D열이 비어있으면 자동으로 DB에 동기화되지 않습니다.

2. **E열(세부매체) 변경 시 자동 동기화**
   - E열 데이터가 추가되면 즉시 DB에 반영됩니다.

3. **대량 데이터 수정 시**
   - 한 번에 많은 행을 수정하면 Apps Script 타임아웃이 발생할 수 있습니다.
   - 이 경우 "배치 동기화" 버튼을 다시 클릭하세요.

4. **서버 오류 발생 시**
   - Apps Script → **Executions** 탭에서 오류 로그 확인
   - Supabase Dashboard → Edge Functions → Logs에서 서버 로그 확인

---

## 🔧 트러블슈팅

### **Q1. 실시간 동기화가 안 돼요**

**확인 사항:**
1. Apps Script 트리거가 설정되어 있나요?
2. D열에 데이터가 있나요?
3. Apps Script → Executions에서 오류 확인

**해결 방법:**
- Apps Script에서 `testSync()` 함수 실행
- 로그에서 오류 메시지 확인
- SUPABASE_URL과 SUPABASE_SERVICE_KEY 확인

### **Q2. 배치 동기화 중 타임아웃 발생**

**원인:** 9,770건을 한 번에 처리하면 Supabase Worker 제한(30초) 초과

**해결 방법:**
1. "배치 동기화" 버튼 클릭 (500건씩 자동 분할)
2. 진행 상황 콘솔에서 확인

### **Q3. 중복 데이터가 생겨요**

**Primary Key:** `(date, phone, time)`

같은 날짜, 같은 전화번호, 같은 시간이면 **upsert(업데이트)**됩니다.
- 중복 데이터가 생기지 않습니다.

---

## 📊 성능

- **초기 배치:** 9,770건 → 약 5-10분
- **실시간 동기화:** 1건 → 1-2초
- **캐시:** 5분 (프론트엔드 데이터는 5분마다 자동 갱신)

---

## 🎉 완료!

이제 구글 스프레드시트에 데이터를 추가하면 자동으로 대시보드에 반영됩니다! 🚀