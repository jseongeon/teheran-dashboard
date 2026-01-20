# 🚀 완전 동기화 가이드 (10,000건 → 실시간)

---

## 📋 **전체 프로세스**

### **1단계: 초기 10,000건 동기화** (1회만)
- CSV 다운로드 → SQL 삽입
- 소요 시간: **약 5분**

### **2단계: Google Apps Script 설정** (1회만)
- 실시간 동기화 트리거 설정
- 소요 시간: **약 10분**

### **3단계: 완료!** ✅
- 이후 시트 편집 시 **자동으로 DB 동기화**

---

## 🎯 **1단계: 초기 10,000건 동기화**

### **방법 A: Edge Function 범위별 호출 (권장)**

구글 시트가 크기 때문에, **범위를 나누어서** 동기화합니다.

#### **프론트엔드에 동기화 버튼 추가**

1. `/components/Header.tsx` 파일 열기
2. "배치 동기화" 버튼 추가

---

## 🔧 **Edge Function 수정 (범위별 동기화)**

`/supabase/functions/server/index-unified.tsx`에 새 엔드포인트 추가:

```typescript
// 📦 DB 동기화 (범위 지정)
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

    // 데이터 변환
    let inquiries = rows
      .map((row, index) => transformSheetRowToInquiry(row, startRow + index - 2))
      .filter((inquiry): inquiry is NonNullable<typeof inquiry> => inquiry !== null);

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
      stats: result.stats
    });

  } catch (error) {
    console.error("❌ 범위별 동기화 오류:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});
```

---

## 🎯 **2단계: Google Apps Script 설정**

### **A. Apps Script 열기**

1. 구글 시트 열기: https://docs.google.com/spreadsheets/d/1gga84mxgkUI99PF-tFoeuWxFztMUxThgeHbSMphSF5M/edit

2. **확장 프로그램 → Apps Script**

3. 새 프로젝트 생성 (또는 기존 프로젝트 열기)

---

### **B. 코드 붙여넣기**

1. `/docs/google-apps-script-sync.js` 파일의 **전체 코드 복사**

2. Apps Script 에디터에 붙여넣기

3. **환경 변수 수정**:
```javascript
const CLOUD_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const CLOUD_SUPABASE_SERVICE_KEY = "eyJhbGc...";
```

---

### **C. 트리거 설정**

1. Apps Script 에디터에서 **⏰ 트리거 아이콘** 클릭

2. **트리거 추가** 버튼 클릭

3. 설정:
   - **실행할 함수**: `onEdit`
   - **이벤트 소스**: `스프레드시트에서`
   - **이벤트 유형**: `수정 시`
   - **실패 알림**: `즉시 알림`

4. **저장** 클릭

5. 권한 승인 (Google 계정 로그인)

---

### **D. 테스트**

1. Apps Script 에디터에서 `testSyncRow` 함수 선택

2. **실행** 버튼 클릭

3. **실행 로그** 확인:
   ```
   ✅ 동기화 성공: 행 2
   ```

4. **Supabase Table Editor**에서 데이터 확인

---

## 🎉 **완료!**

### **✅ 이제 작동 방식:**

1. **시트 편집 시**:
   - "2025상담" 시트의 B~S열 편집
   - 자동으로 `onEdit` 트리거 실행
   - Supabase에 실시간 동기화

2. **동기화 범위**:
   - ✅ B~S열 (날짜~수임금액)
   - ✅ 2행 이상 (헤더 제외)
   - ❌ 1행 (헤더) 무시
   - ❌ A열, T열 이후 무시

3. **Upsert 로직**:
   - `original_row_number`로 중복 체크
   - 기존 데이터 있으면 → 업데이트
   - 없으면 → 삽입

---

## 🔍 **문제 해결**

### **A. 트리거가 작동하지 않음**

1. Apps Script 에디터 → **실행 로그** 확인
2. 트리거 목록에서 마지막 실행 시간 확인
3. 권한 재승인 필요 시 → 트리거 삭제 후 재생성

### **B. Supabase 에러**

1. **401 Unauthorized**:
   - `CLOUD_SUPABASE_SERVICE_KEY` 확인
   - Service Role Key 사용 (Anon Key 아님!)

2. **409 Conflict**:
   - `original_row_number` UNIQUE 제약조건 확인
   - SQL: `ALTER TABLE inquiries ADD CONSTRAINT unique_row UNIQUE (original_row_number);`

3. **500 Internal Server Error**:
   - Supabase 로그 확인
   - 데이터 타입 불일치 (예: 날짜 형식)

### **C. 타임아웃**

Apps Script는 **6분 제한**이 있습니다.
- 한 번에 여러 행 편집 시 타임아웃 가능
- 이 경우 수동으로 재실행

---

## 📊 **모니터링**

### **Supabase Dashboard**

1. **Table Editor → sync_logs**:
   - 동기화 기록 확인

2. **SQL Editor**:
```sql
-- 최근 동기화 기록
SELECT * FROM sync_logs 
ORDER BY completed_at DESC 
LIMIT 10;

-- 동기화된 데이터 건수
SELECT COUNT(*) FROM inquiries;

-- 최근 동기화된 데이터
SELECT * FROM inquiries 
ORDER BY synced_at DESC 
LIMIT 10;
```

---

## 🚨 **중요 사항**

### **⚠️ 초기 10,000건 동기화 주의**

**절대 `syncAllRows()` 함수 사용 금지!**
- Apps Script 6분 제한으로 타임아웃 발생
- 대신 **CSV + SQL** 또는 **범위별 API 호출** 사용

### **🔐 보안**

- **Service Role Key**는 Apps Script에만 저장
- 절대 프론트엔드에 노출 금지
- Supabase RLS 정책으로 보호

---

## 📞 **지원**

문제 발생 시:
1. Apps Script 실행 로그 확인
2. Supabase Edge Function 로그 확인
3. 브라우저 콘솔 로그 확인