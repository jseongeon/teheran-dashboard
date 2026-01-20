-- ========================================
-- 클라우드 Supabase DB 스키마
-- ========================================

-- 1. 문의 데이터 테이블
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT,
  receipt_type TEXT,
  detail_source TEXT,
  field TEXT,
  customer_name TEXT,
  phone TEXT,
  email TEXT,
  receptionist TEXT,
  content TEXT,
  attached_file TEXT,
  is_reminder BOOLEAN DEFAULT FALSE,
  attorney TEXT,
  response_content TEXT,
  is_visit BOOLEAN DEFAULT FALSE,
  is_contract BOOLEAN DEFAULT FALSE,
  contract_date TEXT,
  contract_amount NUMERIC,
  is_excluded BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  original_row_number INTEGER UNIQUE NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_inquiries_date ON inquiries(date);
CREATE INDEX IF NOT EXISTS idx_inquiries_receipt_type ON inquiries(receipt_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_attorney ON inquiries(attorney);
CREATE INDEX IF NOT EXISTS idx_inquiries_is_contract ON inquiries(is_contract);
CREATE INDEX IF NOT EXISTS idx_inquiries_original_row ON inquiries(original_row_number);

-- 2. 수임 데이터 테이블
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT,
  receipt_type TEXT,
  detail_source TEXT,
  field TEXT,
  customer_name TEXT,
  phone TEXT,
  email TEXT,
  attorney TEXT,
  contract_date TEXT,
  contract_amount NUMERIC,
  content TEXT,
  response_content TEXT,
  original_row_number INTEGER UNIQUE NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_contracts_date ON contracts(date);
CREATE INDEX IF NOT EXISTS idx_contracts_attorney ON contracts(attorney);
CREATE INDEX IF NOT EXISTS idx_contracts_original_row ON contracts(original_row_number);

-- 3. 동기화 로그 테이블
CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGSERIAL PRIMARY KEY,
  sync_type TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error_message TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sync_logs_completed_at ON sync_logs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- Row Level Security (RLS) 비활성화 (Edge Function에서 Service Role Key 사용)
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs DISABLE ROW LEVEL SECURITY;

-- 완료!
