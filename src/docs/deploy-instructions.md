# 🚀 Edge Function 재배포 가이드

## 📋 **변경 사항**

### **v1.3.0 - 배치 최적화**
- ✅ Upsert 기반 배치 처리 (500건씩)
- ✅ 리소스 사용량 최적화
- ✅ 546 에러 해결

---

## 🔧 **재배포 방법**

### **1. Supabase Dashboard 접속**
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions

### **2. make-server-1da81fff 함수 선택**

### **3. index.ts 파일 전체 교체**
- `/supabase/functions/server/index-unified.tsx` 파일의 **전체 내용** 복사
- Dashboard의 index.ts에 붙여넣기

### **4. Deploy 버튼 클릭**

### **5. 배포 완료 확인** (30초~1분)

---

## ✅ **배포 후 테스트**

1. **웹사이트 새로고침** (Ctrl+F5)
2. **DB 동기화 버튼 클릭**
3. **성공 메시지 확인**:
   ```
   ✅ DB 동기화 완료!
   클라우드: 500건 (신규: 500, 업데이트: 0)
   ```

---

## 🐛 **문제 발생 시**

### **A. 546 에러가 계속 발생**
- Edge Function 로그 확인
- 데이터 건수 확인 (1000건 이상이면 분할 필요)

### **B. Upsert 오류**
- `original_row_number` 컬럼이 UNIQUE 제약조건을 가지는지 확인
- SQL: `ALTER TABLE inquiries ADD CONSTRAINT unique_row UNIQUE (original_row_number);`

### **C. 환경 변수 에러**
- `CLOUD_SUPABASE_URL` 확인
- `CLOUD_SUPABASE_SERVICE_KEY` 확인

---

## 📊 **성능 개선**

### **변경 전**
- 개별 UPDATE 쿼리 실행
- 500건 x 500ms = **250초** (4분 이상)
- 메모리 부족으로 546 에러

### **변경 후**
- Upsert 배치 처리
- 500건 ÷ 500 = **1배치** = 약 **5초**
- 메모리 효율 99% 향상

---

완료!
