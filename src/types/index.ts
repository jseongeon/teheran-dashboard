// 문의 데이터 타입
export interface InquiryData {
  id: string
  date: string
  time?: string // C열: 시간 (예: "09:30")
  type: string // 특허, 상표, 디자인 등
  attorney: string // 변리사 이름
  status: string // 처리중, 완료, 대기
  client: string
  source: string // 홈페이지, 바이럴, 기타 (D열: 접수유형)
  detailSource?: string // E열: 세부매체
  isVisit?: boolean // 방문/출장 상담 여부 (P열)
  isContract?: boolean // 수임 여부 (Q열)
  field?: string // F열: 분야
  customerName?: string // G열: 고객 성함
  phone?: string // H열: 고객 연락처
  email?: string // I열: 고객 이메일
  receptionist?: string // J열: 접수자
  receiptType?: string // D열: 접수유형
  contactDuplicate?: string // E열: 세부매체 (연락처중복/리마인드CRM 확인용)
  contractDate?: string // R열: 수임일
  isReminder?: boolean // M열: 리마인드CRM 여부
}

// 수임 데이터 타입
export interface ContractData {
  id: string
  date: string
  inquiryDate?: string // 문의날짜 (B열 원본)
  contractDate?: string // 수임날짜 (R열)
  time?: string // C열: 시간
  type: string // 특허 출원, 상표 등록 등
  attorney: string
  amount: string // S열: 수임금액
  status: string // 진행중, 완료, 계약
  client: string
  source: string // 홈페이지, 바이럴, 기타
  customerName?: string // G열: 고객 성함
  phone?: string // H열: 고객 연락처
  email?: string // I열: 고객 이메일
  detailSource?: string // E열: 세부매체
  receiptType?: string // D열: 접수유형 (유선, 채팅, 기타)
}

// 메트릭 데이터 타입
export interface MetricData {
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon?: React.ReactNode
}

// 변리사별 현황 데이터
export interface AttorneyStats {
  name: string
  inquiries: number
  contracts: number
  rate: number
}

// 분야별 현황 데이터
export interface FieldStats {
  name: string
  value: number
  color: string
}

// 시간대별 데이터
export interface TimeStats {
  hour: string
  count: number
}

// 구글 시트 설정
export interface GoogleSheetsConfig {
  apiKey?: string
  spreadsheetId: string
  ranges: {
    inquiries: string // 문의 데이터 범위
    contracts: string // 수임 데이터 범위
    attorneys: string // 변리사 데이터 범위
    fields: string // 분야별 데이터 범위
  }
}