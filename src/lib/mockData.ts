import { InquiryData, ContractData, AttorneyStats, FieldStats } from "../types"

/**
 * 목업 문의 데이터 (API 연동 전 테스트용)
 */
export const mockInquiries: InquiryData[] = [
  { id: "INQ-0001", date: "2024-11-04", type: "특허", attorney: "윤웅채", status: "처리중", client: "A 기업", source: "홈페이지" },
  { id: "INQ-0002", date: "2024-11-04", type: "상표", attorney: "김신연", status: "완료", client: "B 기업", source: "바이럴" },
  { id: "INQ-0003", date: "2024-11-03", type: "디자인", attorney: "이상담", status: "대기", client: "C 기업", source: "홈페이지" },
  { id: "INQ-0004", date: "2024-11-03", type: "특허", attorney: "김봉근", status: "처리중", client: "D 기업", source: "기타" },
  { id: "INQ-0005", date: "2024-11-02", type: "해외", attorney: "윤웅채", status: "완료", client: "E 기업", source: "홈페이지" },
  { id: "INQ-0006", date: "2024-11-02", type: "상표", attorney: "김신연", status: "처리중", client: "F 기업", source: "바이럴" },
  { id: "INQ-0007", date: "2024-11-01", type: "분쟁", attorney: "이상담", status: "대기", client: "G 기업", source: "홈페이지" },
  { id: "INQ-0008", date: "2024-11-01", type: "특허", attorney: "김봉근", status: "완료", client: "H 기업", source: "기타" },
  { id: "INQ-0009", date: "2024-10-31", type: "저작권", attorney: "윤웅채", status: "처리중", client: "I 기업", source: "홈페이지" },
  { id: "INQ-0010", date: "2024-10-30", type: "특허", attorney: "김신연", status: "완료", client: "J 기업", source: "바이럴" }
]

/**
 * 목업 수임 데이터 (API 연동 전 테스트용)
 */
export const mockContracts: ContractData[] = [
  { id: "CON-0001", date: "2024-11-04", type: "특허 출원", attorney: "윤웅채", amount: "5,000,000", status: "진행중", client: "A 기업", source: "홈페이지" },
  { id: "CON-0002", date: "2024-11-04", type: "상표 등록", attorney: "김신연", amount: "3,500,000", status: "완료", client: "B 기업", source: "바이럴" },
  { id: "CON-0003", date: "2024-11-03", type: "디자인 출원", attorney: "이상담", amount: "2,800,000", status: "진행중", client: "C 기업", source: "홈페이지" },
  { id: "CON-0004", date: "2024-11-03", type: "특허 출원", attorney: "김봉근", amount: "6,200,000", status: "계약", client: "D 기업", source: "기타" },
  { id: "CON-0005", date: "2024-11-02", type: "해외 특허", attorney: "윤웅채", amount: "12,000,000", status: "완료", client: "E 기업", source: "홈페이지" },
  { id: "CON-0006", date: "2024-11-02", type: "상표 등록", attorney: "김신연", amount: "4,000,000", status: "진행중", client: "F 기업", source: "바이럴" },
  { id: "CON-0007", date: "2024-11-01", type: "분쟁 대응", attorney: "이상담", amount: "8,500,000", status: "계약", client: "G 기업", source: "홈페이지" },
  { id: "CON-0008", date: "2024-11-01", type: "특허 출원", attorney: "김봉근", amount: "5,500,000", status: "완료", client: "H 기업", source: "기타" }
]

/**
 * 목업 변리사 통계 데이터
 */
export const mockAttorneyStats: AttorneyStats[] = [
  { name: "윤웅채", inquiries: 342, contracts: 234, rate: 68.4 },
  { name: "김신연", inquiries: 298, contracts: 212, rate: 71.1 },
  { name: "이상담", inquiries: 276, contracts: 189, rate: 68.5 },
  { name: "김봉근", inquiries: 318, contracts: 221, rate: 69.5 }
]

/**
 * 목업 분야별 통계 데이터
 */
export const mockFieldStats: FieldStats[] = [
  { name: "특허", value: 435, color: "#3b82f6" },
  { name: "상표", value: 324, color: "#10b981" },
  { name: "디자인", value: 198, color: "#f59e0b" },
  { name: "해외", value: 156, color: "#8b5cf6" },
  { name: "저작권", value: 87, color: "#ec4899" },
  { name: "분쟁", value: 65, color: "#ef4444" },
  { name: "기타", value: 123, color: "#6b7280" }
]
