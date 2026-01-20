# 🚀 로컬 Supabase 설정 가이드

이 가이드는 변리사 사무소 대시보드를 로컬 환경에서 실행하고, Supabase DB에 데이터를 동기화하는 방법을 설명합니다.

## 📋 목차
1. [사전 준비](#사전-준비)
2. [프로젝트 클론](#프로젝트-클론)
3. [로컬 Supabase 설정](#로컬-supabase-설정)
4. [데이터베이스 마이그레이션](#데이터베이스-마이그레이션)
5. [환경 변수 설정](#환경-변수-설정)
6. [개발 서버 실행](#개발-서버-실행)
7. [DB 동기화 사용법](#db-동기화-사용법)
8. [SQL 쿼리 예제](#sql-쿼리-예제)

---

## 🛠️ 사전 준비

### 필수 설치
1. **Node.js** (v18 이상)
   ```bash
   node --version  # v18.0.0 이상 확인
   ```

2. **Docker Desktop** (로컬 Supabase 실행용)
   - [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
   - 설치 후 Docker Desktop 실행 확인

3. **Supabase CLI**
   ```bash
   # macOS (Homebrew)
   brew install supabase/tap/supabase

   # Windows (Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase

   # npm (모든 OS)
   npm install -g supabase
   ```

4. **Git**
   ```bash
   git --version
   ```

---

## 📥 프로젝트 클론

### 1. GitHub에서 클론
```bash
git clone <your-repo-url>
cd patent-office-dashboard
```

### 2. 의존성 설치
```bash
npm install
```

---

## 🐳 로컬 Supabase 설정

### 1. Supabase 초기화 (처음 한 번만)
```bash
supabase init
```

### 2. 로컬 Supabase 시작
```bash
supabase start
```

이 명령어는 Docker 컨테이너로 다음을 실행합니다:
- PostgreSQL 데이터베이스
- Supabase Studio (관리 UI)
- Auth 서버
- Storage 서버
- Edge Functions 런타임

**출력 예시:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase Studio 접속
브라우저에서 http://localhost:54323 을 열어 Supabase Studio에 접속하세요.

---

## 🗄️ 데이터베이스 마이그레이션

### 1. 마이그레이션 적용
```bash
supabase db reset
```

이 명령어는 `/supabase/migrations/001_create_tables.sql` 파일의 내용을 실행하여:
- `inquiries` 테이블 생성 (문의 데이터)
- `contracts` 테이블 생성 (수임 데이터)
- `sync_logs` 테이블 생성 (동기화 로그)
- 인덱스 및 트리거 설정

### 2. 테이블 확인
Supabase Studio (http://localhost:54323)에서:
1. 좌측 메뉴 → **Table Editor** 클릭
2. `inquiries`, `contracts`, `sync_logs` 테이블 확인

또는 SQL Editor에서:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🔑 환경 변수 설정

### 1. `.env` 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```bash
cp .env.example .env
```

### 2. `.env` 파일 수정
```env
# Supabase 로컬 설정
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<supabase start 출력의 anon key>

# Google Sheets
VITE_SPREADSHEET_ID=1gga84mxgkUI99PF-tFoeuWxFztMUxThgeHbSMphSF5M
```

### 3. Google Service Account 키 설정
1. `GOOGLE_SERVICE_ACCOUNT_KEY.txt` 파일 내용을 복사
2. 프로젝트 루트에 `GOOGLE_SERVICE_ACCOUNT_KEY.json` 파일 생성
3. 내용 붙여넣기

**⚠️ 주의:** `.gitignore`에 이미 추가되어 있어 Git에 커밋되지 않습니다.

---

## 🚀 개발 서버 실행

### 1. 프론트엔드 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 2. 로그인
- ID: `admin`
- PW: `wjdtjddjs`

---

## 🔄 DB 동기화 사용법

### 방법 1: 대시보드에서 수동 동화

1. 대시보드 로그인 후 상단에 **"DB 동기화"** 버튼 추가 예정
2. 버튼 클릭 시 구글 스프레드시트 → Supabase DB로 데이터 복사
3. 동기화 결과 확인

### 방법 2: API로 직접 호출

```bash
curl -X POST http://localhost:54321/functions/v1/make-server-1da81fff/api/sync-to-db \
  -H "Authorization: Bearer <anon-key>"
```

### 동기화 로직
1. **구글 시트 데이터 가져오기**: `'2025상담'!B2:S` 범위
2. **데이터 변환**: 
   - 문의건X 제외 조건 적용
   - 중복 문의 체크 (같은 달 내 핸드폰 중복)
3. **DB 저장**:
   - 신규 데이터 → INSERT
   - 기존 데이터 → UPDATE (행 번호로 매칭)
4. **수임 테이블 업데이트**:
   - `contract_status = '수임'`인 데이터만 별도 저장

---

## 📊 SQL 쿼리 예제

Supabase Studio의 SQL Editor에서 다음 쿼리를 실행할 수 있습니다.

### 1. 월별 문의건 통계
```sql
SELECT 
  DATE_TRUNC('month', date) AS month,
  COUNT(*) AS total_inquiries,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contracts,
  ROUND(COUNT(*) FILTER (WHERE contract_status = '수임')::NUMERIC / COUNT(*) * 100, 2) AS contract_rate
FROM inquiries
WHERE is_excluded = FALSE
GROUP BY month
ORDER BY month DESC;
```

### 2. 변리사별 수임 현황
```sql
SELECT 
  contract_attorney,
  COUNT(*) AS contract_count,
  SUM(contract_amount) AS total_amount,
  AVG(contract_amount) AS avg_amount
FROM contracts
WHERE contract_attorney IS NOT NULL
GROUP BY contract_attorney
ORDER BY contract_count DESC;
```

### 3. 분야별 문의 건수
```sql
SELECT 
  field,
  COUNT(*) AS inquiry_count,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contract_count
FROM inquiries
WHERE is_excluded = FALSE
  AND field IS NOT NULL
GROUP BY field
ORDER BY inquiry_count DESC;
```

### 4. 매체별 수임율
```sql
SELECT 
  detail_source,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contracts,
  ROUND(COUNT(*) FILTER (WHERE contract_status = '수임')::NUMERIC / COUNT(*) * 100, 2) AS contract_rate
FROM inquiries
WHERE is_excluded = FALSE
  AND detail_source != ''
GROUP BY detail_source
HAVING COUNT(*) >= 10  -- 10건 이상인 매체만
ORDER BY contract_rate DESC;
```

### 5. 최근 동기화 로그
```sql
SELECT 
  sync_type,
  records_processed,
  records_inserted,
  records_updated,
  status,
  started_at,
  completed_at,
  completed_at - started_at AS duration
FROM sync_logs
ORDER BY started_at DESC
LIMIT 10;
```

### 6. 중복 문의 확인
```sql
SELECT 
  phone,
  DATE_TRUNC('month', date) AS month,
  COUNT(*) AS duplicate_count,
  ARRAY_AGG(original_row_number ORDER BY original_row_number) AS row_numbers
FROM inquiries
WHERE is_duplicate = TRUE
GROUP BY phone, month
ORDER BY duplicate_count DESC;
```

---

## 🔧 유용한 명령어

### Supabase 관리
```bash
# 로컬 Supabase 시작
supabase start

# 로컬 Supabase 중지
supabase stop

# 로컬 Supabase 상태 확인
supabase status

# 데이터베이스 리셋 (마이그레이션 재적용)
supabase db reset

# 마이그레이션 생성
supabase migration new <migration_name>
```

### 프로젝트 관리
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

---

## 🎯 다음 단계

### 1. 대시보드에 "DB 동기화" 버튼 추가
프론트엔드에서 API 호출:

```typescript
const syncToDatabase = async () => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/make-server-1da81fff/api/sync-to-db`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
      },
    }
  );
  
  const result = await response.json();
  console.log('동기화 결과:', result);
};
```

### 2. 스케줄 동기화 (선택사항)
매일 자정에 자동 동기화:
- Supabase Edge Functions의 Cron Jobs 사용
- 또는 GitHub Actions로 스케줄링

### 3. 데이터 분석
- Supabase Studio에서 실시간 쿼리 실행
- SQL로 복잡한 통계 분석
- Excel/Python으로 데이터 export 후 분석

---

## ❓ 문제 해결

### 1. Docker가 실행되지 않음
```bash
# Docker Desktop이 실행 중인지 확인
docker ps
```

### 2. 마이그레이션 오류
```bash
# 데이터베이스 리셋
supabase db reset

# 마이그레이션 파일 확인
cat supabase/migrations/001_create_tables.sql
```

### 3. 환경 변수 로드 안됨
```bash
# .env 파일이 프로젝트 루트에 있는지 확인
ls -la .env

# Vite는 VITE_ 접두사 필요
echo $VITE_SUPABASE_URL
```

### 4. Google Sheets API 오류
- `GOOGLE_SERVICE_ACCOUNT_KEY.json` 파일 확인
- 스프레드시트 공유 권한 확인 (Service Account 이메일에 뷰어 권한)

---

## 📚 추가 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase CLI 가이드](https://supabase.com/docs/guides/cli)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## 🎉 완료!

이제 로컬 환경에서 대시보드를 실행하고, SQL 쿼리로 데이터를 분석할 수 있습니다! 🚀