# 🚀 배포 가이드

## 📋 **빠른 배포 (3단계)**

### **1단계: 코드 복사**

1. 이 프로젝트의 `/supabase/functions/server/index-unified.tsx` 파일을 엽니다
2. **전체 코드를 복사**합니다 (Ctrl+A → Ctrl+C)

---

### **2단계: Supabase Dashboard에 붙여넣기**

1. **Supabase Dashboard 접속**:
   ```
   https://supabase.com/dashboard/project/nhhuesrmapuweitfvoqw/functions
   ```

2. **`make-server-1da81fff`** 함수 클릭

3. 코드 에디터 화면에서:
   - 기존 코드 **전체 선택** (Ctrl+A)
   - **삭제**
   - 복사한 코드 **붙여넣기** (Ctrl+V)

4. **Deploy** 버튼 클릭

5. 배포 완료 대기 (30초~1분)

---

### **3단계: 배포 확인**

1. **웹사이트 새로고침** (Ctrl+F5)

2. Header 우측 상단에서:
   - ✅ **"서버 연결 성공"** 표시 확인
   - **"배치 동기화"** 버튼 확인

3. 테스트:
   - **"배치 동기화"** 버튼 클릭
   - Toast 알림으로 진행률 확인
   - `🎉 전체 동기화 완료!` 메시지 확인

---

## 🔍 **문제 해결**

### **배포 실패**

**증상**:
```
Deploy failed
```

**해결**:
1. 코드에 **문법 오류**가 없는지 확인
2. Supabase Dashboard 로그 확인
3. 다시 Deploy 클릭

---

### **서버 연결 실패**

**증상**:
- Header에 "서버 연결 성공" 표시 안 됨

**해결**:
1. **Health Check** 확인:
   ```
   https://nhhuesrmapuweitfvoqw.supabase.co/functions/v1/make-server-1da81fff/health
   ```
2. 환경 변수 확인:
   - `SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `CLOUD_SUPABASE_URL`
   - `CLOUD_SUPABASE_SERVICE_KEY`

---

### **배치 동기화 버튼 없음**

**증상**:
- Header에 버튼이 보이지 않음

**해결**:
1. 브라우저 **강력 새로고침** (Ctrl+Shift+R)
2. 캐시 삭제 후 재시도

---

## ✅ **배포 체크리스트**

- [ ] `/supabase/functions/server/index-unified.tsx` 파일 전체 복사
- [ ] Supabase Dashboard에 붙여넣기
- [ ] Deploy 버튼 클릭
- [ ] 배포 완료 대기 (30초~1분)
- [ ] 웹사이트 새로고침 (Ctrl+F5)
- [ ] "서버 연결 성공" 표시 확인
- [ ] "배치 동기화" 버튼 확인
- [ ] 테스트 실행 (배치 동기화 버튼 클릭)
- [ ] 완료 메시지 확인: `🎉 전체 동기화 완료!`

---

## 📞 **추가 지원**

문제가 계속되면:
1. Supabase Dashboard → Logs 확인
2. 브라우저 콘솔 (F12) 확인
3. Health Check API 테스트
