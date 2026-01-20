# 📊 초기 10,000건 데이터 동기화 가이드

## 🎯 목표
구글 시트의 10,000건 데이터를 클라우드 Supabase에 한 번에 삽입

---

## 📋 **방법 1: CSV + SQL (권장)**

### **1단계: 구글 시트 데이터 다운로드**

1. 구글 시트 열기: [2025상담 시트](https://docs.google.com/spreadsheets/d/1gga84mxgkUI99PF-tFoeuWxFztMUxThgeHbSMphSF5M/edit)

2. **파일 → 다운로드 → CSV (.csv)**

3. 다운로드된 파일을 텍스트 에디터로 열기

---

### **2단계: Supabase SQL Editor에서 삽입**

1. **Supabase Dashboard 접속**:
   - https://supabase.com/dashboard/project/YOUR_CLOUD_PROJECT_ID/editor

2. **SQL Editor 열기**

3. **테이블 구조 확인**:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inquiries'
ORDER BY ordinal_position;
```

4. **CSV 데이터 삽입**:

**방법 A: COPY 명령 (PostgreSQL 직접 연결 필요)**
```sql
COPY inquiries (
  date, time, receipt_type, detail_source, field,
  customer_name, phone, email, receptionist, content,
  attached_file, is_reminder, attorney, response_content,
  is_visit, is_contract, contract_date, contract_amount,
  is_excluded, is_duplicate, original_row_number, synced_at
)
FROM '/path/to/file.csv'
DELIMITER ','
CSV HEADER;
```

**방법 B: INSERT 문 생성 (더 쉬움)**

---

### **3단계: CSV → SQL 변환기 사용**

**온라인 도구**:
- https://www.convertcsv.com/csv-to-sql.htm
- CSV 업로드 → Table Name: `inquiries` → Generate SQL

**주의사항**:
- 날짜 형식: `YYYY-MM-DD`
- Boolean 값: `TRUE` / `FALSE`
- NULL 처리: 빈 값은 `NULL`

---

## 📋 **방법 2: Edge Function 분할 호출**

### **프론트엔드에서 범위별로 호출**

```javascript
// 1000건씩 10번 호출
async function syncInBatches() {
  const BATCH_SIZE = 1000;
  const TOTAL_ROWS = 10000;
  
  for (let start = 0; start < TOTAL_ROWS; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, TOTAL_ROWS);
    
    console.log(`🔄 배치 ${start + 2}~${end + 2} 동기화 중...`);
    
    const response = await fetch(
      'https://nhhuesrmapuweitfvoqw.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-db-range',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          startRow: start + 2, // B2부터 시작
          endRow: end + 2
        })
      }
    );
    
    const result = await response.json();
    console.log(`✅ 배치 완료:`, result);
    
    // 5초 대기 (서버 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('🎉 전체 동기화 완료!');
}
```

---

## ✅ **권장 방법**

**CSV + SQL Editor**가 가장 빠르고 안정적입니다.

1. 구글 시트 → CSV 다운로드 (1분)
2. CSV → SQL 변환 (온라인 도구 사용)
3. Supabase SQL Editor에 붙여넣기 (1분)
4. 완료! ✅

---

## 🔄 **다음 단계**

초기 동기화 완료 후 → **Google Apps Script 실시간 동기화** 구현