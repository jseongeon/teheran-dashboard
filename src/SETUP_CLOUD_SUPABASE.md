# ☁️ 클라우드 Supabase 설정 가이드

외부에서도 SQL 분석이 가능하도록 클라우드 Supabase를 설정하는 가이드입니다.

## 🎯 최종 구조

```
[구글 스프레드시트] (데이터 원본)
        ↓
[Figma Make 대시보드] (실시간 조회)
        ↓
   자동 동기화 (하루 1-2번)
        ↓
[클라우드 Supabase DB] (백업 + SQL 분석)
        ↓
   어디서든 접속 가능!
```

---

## 📋 사전 준비

- [x] GitHub 계정
- [x] 이메일 주소
- [ ] Supabase 계정 (무료)

---

## 1️⃣ Supabase 프로젝트 생성 (5분)

### 1. Supabase 가입

1. [Supabase.com](https://supabase.com) 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성

1. **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `patent-office-dashboard`
   - **Database Password**: 강력한 비밀번호 생성 (⚠️ 저장해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: `Free` 선택

3. **Create new project** 클릭 (1-2분 소요)

### 3. 프로젝트 정보 확인

프로젝트 생성 완료 후:
1. 좌측 메뉴 → **Settings** → **API**
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ 절대 공개 금지!)

---

## 2️⃣ 데이터베이스 테이블 생성 (3분)

### 1. SQL Editor 열기

1. 좌측 메뉴 → **SQL Editor**
2. **New query** 클릭

### 2. 테이블 생성 SQL 실행

아래 SQL을 복사해서 붙여넣고 **Run** 클릭:

```sql
-- 문의 테이블 생성
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  
  -- 기본 정보
  date DATE NOT NULL,
  receipt_type VARCHAR(50),           -- 접수유형 (D열)
  detail_source VARCHAR(100),         -- 세부출처 (E열)
  inquiry_type VARCHAR(100),          -- 문의유형 (F열)
  field VARCHAR(50),                  -- 분야 (G열)
  phone VARCHAR(50),                  -- 핸드폰 (H열)
  consulting_attorney VARCHAR(50),    -- 상담변리사 (I열)
  
  -- 문의 상세
  content TEXT,                       -- 내용 (J열)
  response_content TEXT,              -- 회신내용 (K열)
  customer_name VARCHAR(100),         -- 고객명 (L열)
  company_name VARCHAR(200),          -- 회사명 (M열)
  
  -- 수임 관련
  contract_status VARCHAR(20),        -- 수임여부 (Q열)
  contract_attorney VARCHAR(50),      -- 수임변리사 (R열)
  contract_amount DECIMAL(15, 2),     -- 수임금액 (S열)
  
  -- 메타 정보
  is_excluded BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  original_row_number INTEGER,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 수임 테이블 생성
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  inquiry_id BIGINT REFERENCES inquiries(id),
  
  -- 기본 정보
  date DATE NOT NULL,
  receipt_type VARCHAR(50),
  detail_source VARCHAR(100),
  inquiry_type VARCHAR(100),
  field VARCHAR(50),
  phone VARCHAR(50),
  
  -- 수임 정보
  contract_attorney VARCHAR(50) NOT NULL,
  contract_amount DECIMAL(15, 2),
  consulting_attorney VARCHAR(50),
  
  -- 고객 정보
  customer_name VARCHAR(100),
  company_name VARCHAR(200),
  content TEXT,
  response_content TEXT,
  
  -- 메타 정보
  original_row_number INTEGER,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 동기화 로그 테이블
CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGSERIAL PRIMARY KEY,
  sync_type VARCHAR(50) NOT NULL,
  records_processed INTEGER,
  records_inserted INTEGER,
  records_updated INTEGER,
  records_skipped INTEGER,
  error_message TEXT,
  status VARCHAR(20) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_inquiries_date ON inquiries(date);
CREATE INDEX idx_inquiries_phone ON inquiries(phone);
CREATE INDEX idx_inquiries_field ON inquiries(field);
CREATE INDEX idx_inquiries_consulting_attorney ON inquiries(consulting_attorney);
CREATE INDEX idx_inquiries_contract_status ON inquiries(contract_status);
CREATE INDEX idx_inquiries_receipt_type ON inquiries(receipt_type);
CREATE INDEX idx_inquiries_synced_at ON inquiries(synced_at);

CREATE INDEX idx_contracts_date ON contracts(date);
CREATE INDEX idx_contracts_field ON contracts(field);
CREATE INDEX idx_contracts_contract_attorney ON contracts(contract_attorney);
CREATE INDEX idx_contracts_inquiry_id ON contracts(inquiry_id);
CREATE INDEX idx_contracts_synced_at ON contracts(synced_at);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. 테이블 확인

1. 좌측 메뉴 → **Table Editor**
2. `inquiries`, `contracts`, `sync_logs` 테이블이 생성되었는지 확인

---

## 3️⃣ Figma Make에 환경 변수 추가 (5분)

### 1. Supabase Dashboard 접속

1. [Figma Make 프로젝트](https://figma.com) 열기
2. Supabase 프로젝트 설정으로 이동

또는 직접 Supabase Dashboard:
- URL: `https://supabase.com/dashboard/project/<project-id>`

### 2. Edge Function Secret 추가

Supabase Dashboard에서:
1. **Project Settings** → **Edge Functions**
2. **Add secret** 클릭
3. 다음 환경 변수 추가:

```
Name: CLOUD_SUPABASE_URL
Value: https://xxxxx.supabase.co (위에서 복사한 Project URL)

Name: CLOUD_SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
```

⚠️ **주의**: `SUPABASE_URL`이 아니라 `CLOUD_SUPABASE_URL`로 만드세요!
(기존 Figma Make 환경 변수와 구분하기 위함)

---

## 4️⃣ 동기화 테스트 (3분)

### 1. Figma Make 대시보드 접속

1. 대시보드 로그인
2. 브라우저 개발자 도구 열기 (F12)
3. Console 탭 열기

### 2. 동기화 API 호출

Console에서 실행:

```javascript
const syncData = async () => {
  const response = await fetch(
    'https://<project-id>.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-cloud-db',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer <anon-key>',
      },
    }
  );
  
  const result = await response.json();
  console.log('동기화 결과:', result);
};

syncData();
```

### 3. 결과 확인

Supabase Dashboard → **Table Editor** → `inquiries` 테이블에 데이터가 들어왔는지 확인!

---

## 5️⃣ SQL 분석 시작! 🎉

### 어디서든 접속

1. [Supabase Dashboard](https://supabase.com/dashboard)
2. 프로젝트 선택
3. **SQL Editor** 클릭

### 예제 쿼리

#### 1. 월별 수임율
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

#### 2. 변리사별 수임 현황
```sql
SELECT 
  contract_attorney,
  COUNT(*) AS contract_count,
  SUM(contract_amount) AS total_amount,
  ROUND(AVG(contract_amount), 0) AS avg_amount
FROM contracts
WHERE contract_attorney IS NOT NULL
  AND date >= '2025-01-01'
GROUP BY contract_attorney
ORDER BY contract_count DESC;
```

#### 3. 매체별 수임율 TOP 10
```sql
SELECT 
  detail_source,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE contract_status = '수임') AS contracts,
  ROUND(COUNT(*) FILTER (WHERE contract_status = '수임')::NUMERIC / COUNT(*) * 100, 2) AS rate
FROM inquiries
WHERE is_excluded = FALSE
  AND detail_source != ''
GROUP BY detail_source
HAVING COUNT(*) >= 10
ORDER BY rate DESC
LIMIT 10;
```

#### 4. 분야별 월별 트렌드
```sql
SELECT 
  DATE_TRUNC('month', date) AS month,
  field,
  COUNT(*) AS count
FROM inquiries
WHERE is_excluded = FALSE
  AND field IS NOT NULL
GROUP BY month, field
ORDER BY month DESC, count DESC;
```

#### 5. 최근 동기화 로그
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

---

## 6️⃣ 자동 스케줄 동기화 (선택사항)

### 옵션 A: GitHub Actions (무료, 추천!)

`.github/workflows/sync-database.yml` 파일 생성:

```yaml
name: Sync Database

on:
  schedule:
    # 매일 오전 9시, 오후 6시 (한국 시간 기준)
    - cron: '0 0,9 * * *'  # UTC 기준
  workflow_dispatch:  # 수동 실행도 가능

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to Supabase
        run: |
          curl -X POST https://${{ secrets.SUPABASE_PROJECT_ID }}.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-cloud-db \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

GitHub 저장소 Settings → Secrets → Actions에 추가:
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY`

### 옵션 B: Supabase Edge Function Cron (유료 플랜 필요)

```typescript
// supabase/functions/schedule-sync/index.ts
Deno.cron("sync database", "0 0,9 * * *", async () => {
  await fetch('https://xxx.supabase.co/functions/v1/make-server-1da81fff/api/sync-to-cloud-db', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer xxx' }
  });
});
```

### 옵션 C: 수동 실행 (가장 간단!)

필요할 때마다 대시보드에서 "DB 동기화" 버튼 클릭!
(다음 단계에서 버튼 추가 가능)

---

## 7️⃣ 모바일에서도 SQL 분석!

### 1. Supabase 모바일 앱 (iOS/Android)

1. App Store/Play Store에서 "Supabase" 검색
2. 앱 설치 및 로그인
3. 프로젝트 선택
4. SQL 쿼리 실행 가능!

### 2. 웹 브라우저 (어디서든)

스마트폰 브라우저에서:
- https://supabase.com/dashboard
- 로그인 → SQL Editor

---

## 💰 비용 정보

### Supabase Free Tier 제한

- ✅ **500MB 데이터베이스** (약 100만 건 데이터)
- ✅ **50,000 월간 활성 사용자**
- ✅ **2GB 파일 스토리지**
- ✅ **무제한 API 요청**

### 예상 사용량 (변리사 사무소)

- 연간 문의 데이터: ~10,000건 = **약 5MB**
- 10년치 데이터: **50MB** (여유 있음!)

**결론: 완전 무료로 사용 가능!** 🎉

---

## 🔐 보안 체크리스트

- [x] `service_role key`는 서버에서만 사용 (클라이언트 노출 금지)
- [x] `anon key`는 클라이언트에서 사용 가능
- [x] Row Level Security (RLS) 설정 (선택사항)
- [x] Database 비밀번호 안전하게 보관

---

## 🎯 최종 워크플로우

### 일상 업무

1. 직원들이 구글 스프레드시트에 데이터 입력
2. Figma Make 대시보드에서 실시간 조회
3. (자동) 하루 1-2번 Supabase DB에 백업

### 데이터 분석

1. 외출 중에도 스마트폰으로 Supabase 접속
2. SQL로 복잡한 통계 분석
3. 엑셀로 내보내기 (Export to CSV)

---

## ❓ 문제 해결

### Q1: "테이블이 생성되지 않아요"

```sql
-- SQL Editor에서 실행
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS sync_logs CASCADE;

-- 그 후 다시 CREATE TABLE 실행
```

### Q2: "동기화가 실패해요"

1. 환경 변수 확인:
   - `CLOUD_SUPABASE_URL` 설정되어 있나요?
   - `CLOUD_SUPABASE_SERVICE_KEY` 설정되어 있나요?

2. SQL Editor에서 확인:
   ```sql
   SELECT COUNT(*) FROM inquiries;
   ```

### Q3: "SQL 쿼리가 느려요"

```sql
-- 인덱스 재생성
REINDEX TABLE inquiries;
REINDEX TABLE contracts;

-- 통계 업데이트
ANALYZE inquiries;
ANALYZE contracts;
```

---

## 📚 추가 학습 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/)
- [SQL 치트시트](https://www.sqltutorial.org/sql-cheat-sheet/)

---

## 🎉 완료!

이제 **어디서든** SQL로 데이터를 분석할 수 있습니다! 🚀

- ✅ Figma Make: 대시보드 운영
- ✅ 클라우드 Supabase: 데이터 백업 + SQL 분석
- ✅ 무료로 평생 사용 가능!

궁금한 점이 있으면 언제든 물어보세요! 😊
