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
  
  -- 수임 관련 (문의 시점에는 NULL)
  contract_status VARCHAR(20),        -- 수임여부 (Q열: '수임', '미수임', NULL)
  contract_attorney VARCHAR(50),      -- 수임변리사 (R열)
  contract_amount DECIMAL(15, 2),     -- 수임금액 (S열)
  
  -- 메타 정보
  is_excluded BOOLEAN DEFAULT FALSE,  -- 문의건X로 완전 제외 여부
  is_duplicate BOOLEAN DEFAULT FALSE, -- 중복 문의 여부
  original_row_number INTEGER,        -- 원본 스프레드시트 행 번호
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 수임 테이블 생성 (수임 확정된 건만 별도 관리)
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  inquiry_id BIGINT REFERENCES inquiries(id),  -- 원본 문의 참조
  
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

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 적용
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 동기화 로그 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGSERIAL PRIMARY KEY,
  sync_type VARCHAR(50) NOT NULL,     -- 'full', 'incremental'
  records_processed INTEGER,
  records_inserted INTEGER,
  records_updated INTEGER,
  records_skipped INTEGER,
  error_message TEXT,
  status VARCHAR(20) NOT NULL,        -- 'success', 'failed', 'partial'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_sync_logs_started_at ON sync_logs(started_at);
