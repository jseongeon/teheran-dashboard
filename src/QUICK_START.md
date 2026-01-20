# ⚡ 빠른 시작 가이드

## 🎯 목표

**구글 스프레드시트 → 클라우드 DB 백업 → 어디서든 SQL 분석!**

---

## 📋 5단계로 완료 (총 15분)

### 1단계: Supabase 프로젝트 생성 (5분)

1. [Supabase.com](https://supabase.com) 접속
2. GitHub 계정으로 로그인
3. **New Project** 클릭
4. 정보 입력:
   - Name: `patent-office-dashboard`
   - Password: 강력한 비밀번호 (저장!)
   - Region: **Northeast Asia (Seoul)**
   - Plan: **Free**

5. **Create** 클릭 (1-2분 대기)

---

### 2단계: 데이터베이스 테이블 생성 (3분)

1. 좌측 메뉴 → **SQL Editor**
2. **New query** 클릭
3. [SETUP_CLOUD_SUPABASE.md](./SETUP_CLOUD_SUPABASE.md)의 **2단계 SQL 코드** 복사
4. 붙여넣고 **Run** 클릭
5. 좌측 메뉴 → **Table Editor**에서 `inquiries`, `contracts` 테이블 확인

---

### 3단계: API 키 복사 (2분)

1. 좌측 메뉴 → **Settings** → **API**
2. 다음 정보 복사:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (비밀!)
```

---

### 4단계: Figma Make 환경 변수 추가 (3분)

**⚠️ 중요: Figma Make Supabase Dashboard에서 설정**

Supabase Dashboard → **Project Settings** → **Edge Functions** → **Add secret**

두 개의 환경 변수 추가:

```
Name: CLOUD_SUPABASE_URL
Value: https://xxxxx.supabase.co (위에서 복사한 Project URL)

Name: CLOUD_SUPABASE_SERVICE_KEY
Value: eyJhbGci... (위에서 복사한 service_role key)
```

**저장 후 Edge Function 재배포** (자동으로 적용됨)

---

### 5단계: 동기화 테스트! (2분)

1. Figma Make 대시보드 로그인
2. 우측 상단 **"DB 동기화"** 버튼 클릭
3. 알림 확인:
   - ✅ "DB 동기화 완료!" → 성공!
   - ⚠️ "미설정" → 4단계 다시 확인

4. Supabase Dashboard → **Table Editor** → `inquiries` 테이블에 데이터 확인!

---

## 🎉 완료!

이제 **어디서든** SQL로 데이터 분석 가능!

### 데스크탑/노트북
- [Supabase Dashboard](https://supabase.com/dashboard)
- SQL Editor에서 쿼리 실행

### 스마트폰/태블릿
- 웹: https://supabase.com/dashboard
- 또는 Supabase 모바일 앱 설치

---

## 📊 바로 사용 가능한 SQL 쿼리

### 월별 수임율
```sql
SELECT 
  DATE_TRUNC('month', date) AS month,
  COUNT(*) AS inquiries,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contracts,
  ROUND(COUNT(*) FILTER (WHERE contract_status = '수임')::NUMERIC / COUNT(*) * 100, 2) AS rate
FROM inquiries
WHERE is_excluded = FALSE
GROUP BY month
ORDER BY month DESC;
```

### 변리사별 수임 현황
```sql
SELECT 
  contract_attorney,
  COUNT(*) AS count,
  SUM(contract_amount) AS total,
  ROUND(AVG(contract_amount), 0) AS avg
FROM contracts
GROUP BY contract_attorney
ORDER BY count DESC;
```

### 매체별 수임율 TOP 10
```sql
SELECT 
  detail_source,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contracts,
  ROUND(COUNT(*) FILTER (WHERE contract_status = '수임')::NUMERIC / COUNT(*) * 100, 2) AS rate
FROM inquiries
WHERE is_excluded = FALSE AND detail_source != ''
GROUP BY detail_source
HAVING COUNT(*) >= 10
ORDER BY rate DESC
LIMIT 10;
```

더 많은 쿼리: [SETUP_CLOUD_SUPABASE.md](./SETUP_CLOUD_SUPABASE.md#5%EF%B8%8F⃣-sql-분석-시작-)

---

## 🔄 일상 사용법

### 직원들
1. 구글 스프레드시트에 데이터 입력 (평소대로)
2. Figma Make 대시보드에서 실시간 조회

### 관리자/분석가
1. 필요할 때 **"DB 동기화"** 버튼 클릭 (하루 1-2번)
2. 외출 중에도 스마트폰으로 Supabase 접속
3. SQL로 원하는 통계 분석
4. 엑셀 내보내기 (Export to CSV)

---

## ❓ 자주 묻는 질문

**Q: 동기화는 언제 해야 하나요?**
- A: 필요할 때마다! 하루 1-2번이면 충분합니다.

**Q: 자동 동기화는 안되나요?**
- A: [SETUP_CLOUD_SUPABASE.md](./SETUP_CLOUD_SUPABASE.md#6%EF%B8%8F⃣-자동-스케줄-동기화-선택사항)의 GitHub Actions 참고

**Q: 비용이 드나요?**
- A: Supabase 무료 플랜으로 평생 무료! (500MB까지)

**Q: 데이터가 안전한가요?**
- A: Supabase는 PostgreSQL 기반으로 안전하며, service_role key는 절대 공개하지 마세요!

**Q: 스마트폰에서도 되나요?**
- A: 네! 웹 브라우저 또는 Supabase 앱으로 가능합니다.

---

## 📚 추가 문서

- 🔍 **전체 가이드**: [SETUP_CLOUD_SUPABASE.md](./SETUP_CLOUD_SUPABASE.md)
- 🏠 **로컬 개발**: [SETUP_LOCAL_SUPABASE.md](./SETUP_LOCAL_SUPABASE.md)
- 📤 **GitHub 업로드**: [GITHUB_SETUP.md](./GITHUB_SETUP.md)
- 📖 **프로젝트 설명**: [README.md](./README.md)

---

## 🎊 축하합니다!

이제 변리사 사무소 데이터를 **언제 어디서든** 분석할 수 있습니다! 🚀
