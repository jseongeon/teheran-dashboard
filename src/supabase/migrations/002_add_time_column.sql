-- time 컬럼 추가
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS time TIME;

-- 기존 데이터에 기본값 설정 (00:00)
UPDATE inquiries SET time = '00:00:00' WHERE time IS NULL;

-- time 컬럼 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_inquiries_time ON inquiries(time);

-- date, phone, time 조합으로 유니크 제약조건 추가
-- 기존 중복 데이터가 있을 수 있으므로 먼저 확인 후 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'inquiries_date_phone_time_unique'
  ) THEN
    ALTER TABLE inquiries 
    ADD CONSTRAINT inquiries_date_phone_time_unique 
    UNIQUE (date, phone, time);
  END IF;
END $$;
