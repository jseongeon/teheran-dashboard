import { InquiryData, ContractData, AttorneyStats, FieldStats, GoogleSheetsConfig } from "../types"

// 구글 시트 API 기본 URL
const GOOGLE_SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets"

// 환경 변수 안전하게 가져오기
const getEnvVar = (key: string): string => {
  try {
    return (import.meta.env && import.meta.env[key]) || ""
  } catch (e) {
    return ""
  }
}

// 환경 변수에서 설정 가져오기 (없으면 기본값 사용)
const DEFAULT_CONFIG: GoogleSheetsConfig = {
  apiKey: getEnvVar("VITE_GOOGLE_SHEETS_API_KEY"),
  spreadsheetId: getEnvVar("VITE_SPREADSHEET_ID"),
  ranges: {
    inquiries: "상담!A2:G", // 문의 시트의 A2부터 G열까지
    contracts: "수임!A2:H", // 수임 시트의 A2부터 H열까지
    attorneys: "변리사현황!A2:D", // 변리사 현황 시트
    fields: "분야현황!A2:B" // 분야 현황 시트
  }
}

/**
 * 구글 시트에서 데이터를 가져오는 함수
 */
export async function fetchSheetData(
  range: string,
  config: Partial<GoogleSheetsConfig> = {}
): Promise<any[][]> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  if (!finalConfig.apiKey) {
    console.warn("Google Sheets API 키가 설정되지 않았습니다. 목업 데이터를 사용합니다.")
    return []
  }

  if (!finalConfig.spreadsheetId) {
    console.warn("스프레드시트 ID가 설정되지 않았습니다. 목업 데이터를 사용합니다.")
    return []
  }

  try {
    const url = `${GOOGLE_SHEETS_API_BASE}/${finalConfig.spreadsheetId}/values/${range}?key=${finalConfig.apiKey}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`)
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error("구글 시트 데이터 가져오기 실패:", error)
    return []
  }
}

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 정규화
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return ""
  
  // 헤더나 잘못된 텍스트 필터링
  const invalidTexts = ["상담 유입 정보", "연월일", "날짜", "date"]
  if (invalidTexts.some(text => dateStr.toLowerCase().includes(text.toLowerCase()))) {
    return ""
  }
  
  try {
    // 이미 YYYY-MM-DD 형식인 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }
    
    // YYYY.MM.DD, YYYY/MM/DD 등의 형식을 YYYY-MM-DD로 변환
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      // 날짜로 파싱할 수 없는 경우 빈 문자열 반환 (경고 제거)
      return ""
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (error) {
    return ""
  }
}

/**
 * E열(세부매체) 값을 보고 매체 카테고리를 판단하는 함수
 * E열 값만으로 홈페이지 · 유료광고, 바이럴, 기타, 문의건X를 명확하게 구분
 */
function determineMediaCategory(detailSource: string, receiptType: string): string {
  // 홈페이지 · 유료광고 매체 리스트
  const 홈페이지유료광고Sources = [
    "게시판문의", "상담신청", "자가진단", "메일", "팝업창", "캠페인신청_폼",
    "구홈_자가", "구홈_상담신청", "구홈_게시판",
    "메인홈페이지_8230", "구홈페이지", "메인홈페이지",
    "서울플레이스_5059", "부산플레이스_1970", "파워컨텐츠_2383",
    "세모특허원페이지_5710", "파워컨텐츠", "서울플레이스", "부산플레이스",
    "세모특허원페이지", "플레이스_예약", "세모특허원페이지_폼"
  ]
  
  // 바이럴 매체 리스트
  const 바이럴Sources = [
    "shp블로그_6571", "gem블로그_3678", "jnin블로그_1016", "woo블로그_2373",
    "koo블로그_5317", "tor블로그_4194", "khai블로그_2726", "lang블로그_4786",
    "자동화카페B_3816", "icarus블로그_3452", "자동화블로그(영)_1812", "자동화블로그(영2)_4194",
    "자동화블로그(승)_4283", "자동화블로그(언)_3193", "자동화테스트(백)_3734", "자동화카페A_4346",
    "자동화카페B_3987", "수원자동화블/카_5913", "백상희지식인_2152",
    "윤웅채지식인_4246", "김신연지식인_2526", "이상담지식인_3579",
    "new티스토리_3630", "고객인터뷰폼_3816", "소책자_3193", "자동화블로그A_4746",
    "shp블_폼", "shp블_댓글/메일", "자동화카페(A)_폼", "자동화카페(B)_폼",
    "gem블_댓글/메일", "jnin블_댓글/메일", "woo블_댓글/메일", "koo블_댓글/메일",
    "lang블_댓글/메일", "jnin블_업무폰", "woo블_폼", "koo블_업무폰", "lang블_폼",
    "shp블로그", "gem블로그", "jnin블로그", "woo블로그", "koo블로그", "tor블로그",
    "khai블로그", "lang블로그", "dlk블로그", "icarus블로그",
    "자동화블로그(영)", "자동화블로그(영2)", "자동화블로그(승)", "자동화블로그(언)", "자동화블로그(백)",
    "자동화카페A", "자동화카페B", "수원자동화블/카",
    "백상희지식인", "윤웅채지식인", "김신연지식인", "이상담지식인",
    "new티스토리", "자동화블로그A", "자동화블로그A_폼"
  ]
  
  // 기타 매체 리스트
  const 기타Sources = [
    "기타", "카카오_예약", "번호추적불가", "카카오플레이스_4909",
    "유튜브_1737", "공식블로그", "공식블로그_4247", "카카오플레이스",
    "유튜브", "기타경로"
  ]
  
  // 문의건X 매체 리스트
  const 문의건XSources = [
    "연락처중복", "문의외수임", "crm메일", "리마인드CRM", "직통문의", "타법인전달"
  ]
  
  // E열 값으로 매체 분류 (우선순위: 문의건X → 홈페이지 · 유료광고 → 바이럴 → 기타)
  if (문의건XSources.includes(detailSource)) {
    return "문의건X"
  }
  
  if (홈페이지유료광고Sources.includes(detailSource)) {
    return "홈페이지 · 유료광고"
  }
  
  if (바이럴Sources.includes(detailSource)) {
    return "바이럴"
  }
  
  if (기타Sources.includes(detailSource)) {
    return "기타"
  }
  
  // 어느 것에도 해당하지 않으면 기타
  return "기타"
}

/**
 * 문의 데이터 파싱
 * 2025상담 시트 구조:
 * B열(0): 날짜, C열(1): 문의시간, D열(2): 접수유형, E열(3): 세부매체, 
 * F열(4): 세부분야, G열(5): 고객성함, H열(6): 고객연락처, I열(7): 고객이메일,
 * J열(8): 1차접수자, K열(9): 접수내용, L열(10): 첨부파일, M열(11): 리마인드CRM,
 * N열(12): 변리사님, O열(13): 상담내용, P열(14): 방문/출장, Q열(15): 수임여부,
 * R열(16): 수임일, S열(17): 수임금액
 * 
 * 필터링 조건:
 * - D열(접수유형)에 데이터가 있는 것만 포함
 * - D열이 "문의건X"일 경우, E열(세부매체)이 "문의건X", "특허관리팀전달", "AI응대"이면 제외
 */
export function parseInquiryData(rows: any[][]): InquiryData[] {
  
  const result = rows
    .map((row, index) => {
      const receiptType = row[2] || "" // D열: 접수유형 (유선, 채팅, 기타, 문의건X)
      const detailSource = row[3] || "" // E열: 세부매체
      const isContract = row[15] === true || row[15] === "TRUE"
      const isReminder = row[11] === true || row[11] === "TRUE" // M열: 리마인드CRM
      
      // E열(세부매체)을 기준으로 홈페이지/바이럴/기타 카테고리 결정
      const mediaCategory = determineMediaCategory(detailSource, receiptType)
      
      return {
        id: `INQ-${(index + 1).toString().padStart(4, '0')}`,
        date: normalizeDate(row[0] || ""), // B열: 날짜 (row[0]!)
        time: row[1] || "", // C열: 문의시간
        type: row[4] || "", // F열: 세부분야
        attorney: (row[12] || "").trim(), // N열: 변리사님 (공백 제거)
        status: isContract ? "수임" : "상담중", // Q열: 수임여부
        client: row[5] || "", // G열: 고객성함
        source: mediaCategory, // E열 기반으로 결정된 매체 카테고리 (홈페이지, 바이럴, 기타, 문의건X)
        detailSource: detailSource, // E열: 세부매체
        isVisit: row[14] === true || row[14] === "TRUE", // P열: 방문/출장 여부
        isContract: isContract, // Q열: 수임 여부
        field: row[4] || "", // F열: 분야
        customerName: row[5] || "", // G열: 고객 성함
        phone: row[6] || "", // H열: 고객 연락처
        email: row[7] || "", // I열: 고객 이메일
        receptionist: row[8] || "", // J열: 접수자
        receiptType: receiptType, // D열: 접수유형 (유선, 채팅, 기타)
        contactDuplicate: detailSource, // E열: 세부매체
        contractDate: row[16] || "", // R열: 수임일
        isReminder: isReminder // M열: 리마인드CRM 여부
      }
    })
    .filter(item => {
      // 날짜가 없으면 제외
      if (item.date === "") return false
      
      // D열(접수유형)이 없으면 제외
      if (!item.receiptType) return false
      
      // D열이 "문의건X"이고, E열이 "문의건X", "특허관리팀전달", "AI응대"이면 제외
      if (item.receiptType === "문의건X") {
        const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"]
        if (excludeDetailSources.includes(item.detailSource)) {
          return false
        }
      }
      
      return true
    })
  
  return result
}

/**
 * 수임 데이터 파싱
 * Q열(index 15)이 TRUE인 데이터만 수임 데이터로 처리
 * 
 * 날짜 기준: R열(수임일) 사용 - 매출 계산은 수임일 기준!
 * 
 * 주석: 중복 제거 로직은 현재 비활성화됨 (Q열 TRUE만 카운트)
 */
export function parseContractData(rows: any[][]): ContractData[] {
  
  // 수임여부가 TRUE인 데이터만 필터링하고 파싱
  const contracts = rows
    .map((row, originalIndex) => {
      const contractDate = normalizeDate(row[16] || "") // R열: 수임일
      const inquiryDate = normalizeDate(row[0] || "") // B열: 문의날짜
      
      // 날짜 우선순위: R열(수임일) 우선, 없으면 B열(문의날짜) 사용
      const finalDate = contractDate || inquiryDate
      
      return {
        row,
        originalIndex,
        isContract: row[15] === true || row[15] === "TRUE", // Q열: 수임여부
        receiptType: row[2] || "", // D열: 접수유형
        detailSource: row[3] || "", // E열: 세부매체
        phoneNumber: row[6] || "", // H열: 고객연락처
        inquiryDate: inquiryDate, // B열: 문의날짜
        contractDate: contractDate, // R열: 수임일
        date: finalDate, // R열 우선, 없으면 B열 사용
      }
    })
    .filter(item => {
      // Q열(수임여부)만으로 판단
      if (!item.isContract) return false
      
      // 날짜가 전혀 없는 경우만 제외 (R열, B열 둘 다 없음)
      if (item.date === "") return false
      
      // D열이 "문의건X"이고, E열이 "문의건X", "특허관리팀전달", "AI응대"이면 제외
      if (item.receiptType === "문의건X") {
        const excludeDetailSources = ["문의건X", "특허관리팀전달", "AI응대"]
        if (excludeDetailSources.includes(item.detailSource)) {
          return false
        }
      }
      
      return true
    })
  
  console.log('✅ Q열=TRUE 필터링 후:', contracts.length, '건')
  console.log('   - R열(수임일) 있음:', contracts.filter(c => c.contractDate !== "").length, '건')
  console.log('   - R열 없어서 B열(문의날짜) 사용:', contracts.filter(c => c.contractDate === "" && c.inquiryDate !== "").length, '건')
  console.log('   - 날짜 없어서 제외됨:', rows.filter((row, i) => (row[15] === true || row[15] === "TRUE") && !normalizeDate(row[16] || "") && !normalizeDate(row[0] || "")).length, '건')
  
  // S열(수임금액) 실제 데이터 샘플 출력
  console.log('💰 [S열 수임금액 샘플 데이터 - 처음 10건]:')
  contracts.slice(0, 10).forEach((item, idx) => {
    const rawAmount = item.row[17]
    console.log(`  [${idx + 1}] 원본 S열 값:`, rawAmount, `(타입: ${typeof rawAmount})`)
  })
  
  /* ============================================================
   * 중복 제거 로직 (현재 비활성화)
   * ============================================================
   * 조건: D열 = "문의건X" AND E열 = ("연락처중복" OR "리마인드CRM")
   * 로직: 같은 달 내에서 H열(고객연락처)가 중복되면 첫 번째만 카운트
   * ============================================================
   
  // 2단계: 중복 체크를 위한 Map (월별 전화번호 추적)
  const phoneNumbersByMonth = new Map<string, Set<string>>()
  
  // 3단계: 중복 제거 필터링
  let duplicateCount = 0
  const filteredContracts = contracts.filter(item => {
    // D열 = "문의건X" AND E열 = ("연락처중복" OR "리마인CRM")인 경우만 중복 체크
    if (item.sourceType === "문의건X" && 
        (item.detailSource === "연락처중복" || item.detailSource === "리마인드CRM")) {
      
      // 전화번호가 없으면 카운트 (안전장치)
      if (!item.phoneNumber) return true
      
      // 날짜에서 년월 추출 (YYYY-MM)
      const itemDate = new Date(item.date)
      const yearMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`
      
      // 해당 월의 전화번호 Set 가져오기 (없으면 생성)
      if (!phoneNumbersByMonth.has(yearMonth)) {
        phoneNumbersByMonth.set(yearMonth, new Set())
      }
      
      const phoneSet = phoneNumbersByMonth.get(yearMonth)!
      
      // 이미 같은 달에 이 전화번호가 있으면 제외
      if (phoneSet.has(item.phoneNumber)) {
        duplicateCount++
        console.log(`❌ [중복 제외] ${yearMonth} - ${item.phoneNumber} (D:${item.sourceType}, E:${item.detailSource})`)
        return false
      }
      
      // 없으면 추가하고 포함
      phoneSet.add(item.phoneNumber)
      console.log(`✅ [중복 체크 통과] ${yearMonth} - ${item.phoneNumber} (D:${item.sourceType}, E:${item.detailSource})`)
      return true
    }
    
    // 다른 경우는 모두 포함
    return true
  })
  
  console.log('✅ [2단계] 중복 제거 후:', filteredContracts.length, '건 (제외:', duplicateCount, '건)')
  
  ============================================================ */
  
  // 월별 집계
  console.log('📊 [최종 결과] 월별 수임건 수 (R열 수임일 기준):')
  const monthlyCount = new Map<string, number>()
  contracts.forEach(item => {
    const itemDate = new Date(item.date)
    const yearMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`
    monthlyCount.set(yearMonth, (monthlyCount.get(yearMonth) || 0) + 1)
  })
  
  Array.from(monthlyCount.entries()).sort().forEach(([month, count]) => {
    console.log(`  ${month}: ${count}건`)
  })
  
  // ContractData 형식으로 변환
  return contracts.map((item, index) => {
    // E열(세부매체)를 기준으로 매체 카테고리 결정 (문의 데이터와 동일한 로직)
    const mediaCategory = determineMediaCategory(item.detailSource, item.receiptType)
    
    return {
      id: `CON-${(index + 1).toString().padStart(4, '0')}`,
      date: item.date, // R열 수임일 사용
      inquiryDate: item.inquiryDate, // B열: 문의날짜
      contractDate: item.contractDate, // R열: 수임날짜
      time: item.row[1] || "", // C열: 문의시간 - row[1]로 수정!
      type: item.row[4] || "", // F열: 세부분야 - row[4]로 수정!
      attorney: (item.row[12] || "").trim(), // N열: 변리사님 (공백 제거) - row[12]로 수정!
      client: item.row[5] || "", // G열: 고객성함 - row[5]로 수정!
      customerName: item.row[5] || "", // G열: 고객성함 - row[5]로 수정!
      phone: item.row[6] || "", // H열: 고객연락처
      email: item.row[7] || "", // I열: 고객이메일 - row[7]로 수정!
      amount: parseAmount(item.row[17] || ""), // S열: 수임금액 (파싱 함수 사용) - row[17]로 수정!
      status: "수임완료",
      source: mediaCategory, // E열 기반으로 결정된 매체 카테고리 (홈페이지, 바이럴, 기타, 문의건X)
      detailSource: item.detailSource, // E열: 세부매체 추가
      receiptType: item.receiptType // D열: 접수유형 추가
    }
  })
}

/**
 * 금액 파싱 함수
 * 괄호 제거, 여러 구분자로 분리된 금액을 합산
 * 
 * 지원하는 구분자: 줄바꿈(\n), 쉼표(,), or
 * 
 * 예시:
 * - "275,000" → "275,000"
 * - "275,000(상표)\n165,000(갱신)" → "440,000"
 * - "1980000, 550000" → "2,530,000"
 * - "110000 or 275000" → "385,000"
 */
function parseAmount(rawAmount: string): string {
  if (!rawAmount) return "0"
  
  try {
    // 1. 괄호와 괄호 안의 내용 제거
    const withoutParentheses = rawAmount.replace(/\([^)]*\)/g, '')
    
    // 2. 여러 구분자로 분리: 줄바꿈, 쉼표+공백, "or"
    // "1980000, 550000" → ["1980000", "550000"]
    // "110000 or 275000" → ["110000", "275000"]
    // "275000\n165000" → ["275000", "165000"]
    let parts = withoutParentheses
      .split(/[\r\n]+|,\s+|\s+or\s+/i) // 줄바꿈, ", ", " or " 로 분리
      .map(part => part.trim())
      .filter(part => part.length > 0)
    
    // 3. 각 파트에서 숫자만 추출하여 합산
    const total = parts.reduce((sum, part) => {
      const numbers = part.replace(/[^0-9]/g, '')
      const amount = parseInt(numbers || '0')
      return sum + amount
    }, 0)
    
    // 4. 쉼표 포함 문자열로 반환
    return total.toLocaleString()
  } catch (error) {
    console.error('금액 파싱 오류:', rawAmount, error)
    return "0"
  }
}

/**
 * 변리사별 현황 데이터 파싱
 * N열(변리사님)으로 그룹핑하여 통계 계산
 * 
 * 주의: 이 함수는 원본 rows를 받으므로, 먼저 InquiryData로 파싱한 후
 * 문의건 카운트 로직을 적용해야 합니다.
 */
export function parseAttorneyStats(rows: any[][]): AttorneyStats[] {
  // 1단계: InquiryData로 파싱 (필터링 적용)
  const inquiries = parseInquiryData(rows)
  
  // 2단계: 변리사별 문의건 집계 (중복 제거 로직 적용)
  const attorneyMap = new Map<string, InquiryData[]>()
  
  inquiries.forEach(inquiry => {
    const attorney = inquiry.attorney || "미지정"
    if (!attorneyMap.has(attorney)) {
      attorneyMap.set(attorney, [])
    }
    attorneyMap.get(attorney)!.push(inquiry)
  })
  
  // 3단계: 각 변리사별로 문의건 카운트 및 수임건 계산
  return Array.from(attorneyMap.entries()).map(([name, attorneyInquiries]) => {
    const inquiryCount = countInquiries(attorneyInquiries)
    const contractCount = attorneyInquiries.filter(i => i.isContract).length
    
    return {
      name,
      inquiries: inquiryCount,
      contracts: contractCount,
      rate: inquiryCount > 0 ? (contractCount / inquiryCount) * 100 : 0
    }
  })
}

/**
 * 분야별 현황 데이터 파싱
 * F열(세부분야)으로 그룹핑하여 통계 계산
 * 
 * 주의: 문의건 카운트 로직을 적용하여 정확한 집계를 수행합니.
 */
export function parseFieldStats(rows: any[][]): FieldStats[] {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#6b7280", "#14b8a6", "#f97316"]
  
  // 1단계: InquiryData로 파싱 (필터링 적용)
  const inquiries = parseInquiryData(rows)
  
  // 2단계: 분야별 문의건 집계 (중복 제거 로직 적용)
  const fieldMap = new Map<string, InquiryData[]>()
  
  inquiries.forEach(inquiry => {
    const field = inquiry.field || "기타" // F열: 세부분야
    if (!fieldMap.has(field)) {
      fieldMap.set(field, [])
    }
    fieldMap.get(field)!.push(inquiry)
  })
  
  // 3단계: 각 분야별로 문의건 카운트
  return Array.from(fieldMap.entries()).map(([name, fieldInquiries], index) => ({
    name,
    value: countInquiries(fieldInquiries),
    color: colors[index % colors.length]
  }))
}

/**
 * 월별 필터링 헬퍼 함수
 */
export function filterByMonth<T extends { date: string }>(
  data: T[],
  year: number,
  month: number
): T[] {
  return data.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate.getFullYear() === year && itemDate.getMonth() === month
  })
}

/**
 * 출처별 필터링 헬퍼 함수
 */
export function filterBySource<T extends { source: string }>(
  data: T[],
  source: string
): T[] {
  return data.filter(item => item.source === source)
}

/**
 * 변리사별 필터링 헬퍼 함수
 */
export function filterByAttorney<T extends { attorney: string }>(
  data: T[],
  attorneys: string[]
): T[] {
  if (attorneys.length === 0) return data
  return data.filter(item => attorneys.some(a => item.attorney.includes(a)))
}

/**
 * 분야별 필터링 헬퍼 함수
 */
export function filterByField<T extends { type: string }>(
  data: T[],
  fields: string[]
): T[] {
  if (fields.length === 0) return data
  return data.filter(item => fields.includes(item.type))
}

/**
 * 통계 계산 헬퍼
 * 
 * ⚠️ 중요: 수임율은 "문의 기준"으로 계산합니다!
 * - 문의건: B열(문의날짜) 기준으로 필터링
 * - 수임건: B열(문의날짜) 기준 + Q열(수임여부) TRUE
 * 
 * 예시: 12월 15일 문의 → 1월 10일 수임
 *   → 12월 문의건 1건, 12월 수임건 1건으로 집계 ✅
 * 
 * 단, 매출은 R열(수임일) 기준으로 계산 (contracts 배열 사용)
 */
export function calculateStats(
  inquiries: InquiryData[],
  contracts: ContractData[]
) {
  // 문의건 중복 제거 로직 적용
  const totalInquiries = countInquiries(inquiries)
  
  // ⭐ 수임건: 문의 기준 (B열 기준으로 필터링된 inquiries에서 Q열 TRUE인 것만 카운트)
  const totalContracts = inquiries.filter(i => i.isContract).length
  
  // 매출 금액 합계 계산 (R열 기준 - contracts 배열 사용)
  
  // 2025년 12월 데이터 확인
  const december2025 = contracts.filter(c => {
    const date = c.contractDate || c.date
    return date.startsWith('2025-12')
  })

  if (december2025.length > 0) {
    // 로그 제거
  }

  const totalRevenue = contracts.reduce((sum, contract) => {
    return sum + (contract.contractAmount || 0)
  }, 0)

  return {
    totalInquiries: totalInquiries,
    totalContracts: totalContracts, // ⭐ 문의 기준 수임건
    totalRevenue: totalRevenue, // 매출 합계 (R열 기준)
    contractRate: totalInquiries > 0 
      ? ((totalContracts / totalInquiries) * 100).toFixed(1)
      : "0.0"
  }
}

/**
 * 문의건 카운트 로직 (중복 제거 및 제외 조건 적용)
 * 
 * 규칙:
 * 1. E열="AI응대" OR "문의건X" OR "특허관리팀전달"
 *    → 카운트하지 않음
 * 
 * 2. E열="리마인드CRM" OR "연락처중복"
 *    → 같은 달 내 H열(전화번호) 중복 제거 (1건으로만 카운트)
 * 
 * 3. 위 조건에 해당하지 않는 경우
 *    → 모두 카운트
 */
export function countInquiries(inquiries: InquiryData[]): number {
  // 1. E열이 "AI응대" 또는 "문의건X" 또는 "특허관리팀전달"이면 제외
  const excludedDetailSources = ["AI응대", "문의건X", "특허관리팀전달"]
  const validInquiries = inquiries.filter(i => 
    !excludedDetailSources.includes(i.contactDuplicate)
  )
  
  // 2. 중복 체크가 필요한 건들과 일반 건들 분리
  // E열이 "리마인드CRM" 또는 "연락처중복"�� 경우만 중복 체크
  const needsDuplicateCheck = validInquiries.filter(i => 
    i.contactDuplicate === "리마인드CRM" || i.contactDuplicate === "연락처중복"
  )
  
  const normalInquiries = validInquiries.filter(i => 
    !(i.contactDuplicate === "리마인드CRM" || i.contactDuplicate === "연락처중복")
  )
  
  // 3. 중복 체크 대상: 같은 달 내 전화번호 중복 제거
  const phoneNumbersByMonth = new Map<string, Set<string>>()
  
  needsDuplicateCheck.forEach(inquiry => {
    if (!inquiry.phone) return
    
    // 날짜에서 년월 추출 (YYYY-MM)
    const itemDate = new Date(inquiry.date)
    const yearMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`
    
    // 해당 월의 전화번호 Set 가져오기 (없으면 생성)
    if (!phoneNumbersByMonth.has(yearMonth)) {
      phoneNumbersByMonth.set(yearMonth, new Set())
    }
    
    const phoneSet = phoneNumbersByMonth.get(yearMonth)!
    phoneSet.add(inquiry.phone)
  })
  
  // 4. 중복 제거된 건수 계산
  let deduplicatedCount = 0
  phoneNumbersByMonth.forEach(phoneSet => {
    deduplicatedCount += phoneSet.size
  })
  
  // 5. 최종 카운트 = 일반 문의건 + 중복 제거된 문의건
  return normalInquiries.length + deduplicatedCount
}

/**
 * 월별 문의건 카운트 (중복 제거 로직 적용)
 */
export function countMonthlyInquiries(
  inquiries: InquiryData[],
  year: number,
  month: number
): number {
  const monthlyData = filterByMonth(inquiries, year, month)
  return countInquiries(monthlyData)
}

/**
 * 홈페이지/유료광고 매체별 필터링 헬퍼 함수
 * D열(접수유형)과 E열(세부매체) 조합으로 필터링
 */
export function filterHomepageByType<T extends { source: string; detailSource?: string; receiptType?: string }>(
  data: T[],
  contactType: "유선" | "채팅" | "기타" | "전체"
): T[] {
  // 먼저 홈페이지 · 유료광고 소스만 필터링
  const homepageData = data.filter(item => item.source === "홈페이지 · 유료광고")
  
  // 유선 매체 (전화번호 포함)
  const 유선Sources = [
    "메인홈페이지_8230", "서울플레이스_5059", "부산플레이스_1970", 
    "파워컨텐츠_2383", "세모특허원페이지_5710"
  ]
  
  // 채팅 매체
  const 채팅Sources = [
    "메인홈페이지", "구홈페이지", "세모특허원페이지", "서울플레이스", 
    "부산플레이스", "파워컨텐츠"
  ]
  
  // 기타 매체 (폼, 신청 등)
  const 기타Sources = [
    "게시판문의", "상담신청", "자가진단", "메일", "팝업창", "캠페인신청_폼",
    "구홈_자가", "구홈_상담신청", "구홈_게시판", "플레��스_예약", "세모특허원페이지_폼"
  ]
  
  if (contactType === "전체") {
    return homepageData
  }
  
  if (contactType === "유선") {
    return homepageData.filter(item => 
      item.receiptType === "유선" && 
      유선Sources.includes(item.detailSource || "")
    )
  }
  
  if (contactType === "채팅") {
    return homepageData.filter(item => 
      item.receiptType === "채팅" && 
      채팅Sources.includes(item.detailSource || "")
    )
  }
  
  if (contactType === "기타") {
    return homepageData.filter(item => 
      item.receiptType === "기타" && 
      기타Sources.includes(item.detailSource || "")
    )
  }
  
  return []
}

/**
 * 바이럴 매체별 필터링 헬퍼 함수
 * D열(접수유형)과 E열(세부매체) 조합으로 필터링
 */
export function filterViralByType<T extends { source: string; receiptType?: string; detailSource?: string }>(
  data: T[],
  contactType: "유선" | "채팅" | "기타" | "전체"
): T[] {
  // 먼저 바이럴 소스만 필터링
  const viralData = data.filter(item => item.source === "바이럴")
  
  // 유선 바이럴 세부 매체 (전화번호 포함)
  const 유선Sources = [
    "shp블로그_6571", "gem블로그_3678", "jnin블로그_1016", "woo블로그_2373",
    "koo블로그_5317", "tor블로그_4194", "khai블로그_2726", "lang블로그_4786",
    "자동화카페B_3816", "icarus블로그_3452", "자동화블로그(영)_1812", "자동화블로그(영2)_4194",
    "자동화블로그(승)_4283", "자동화블로그(언)_3193", "자동화테스트(백)_3734", "자동화카페A_4346",
    "자동화카페B_3987", "수원자동화블/카_5913", "백상희지식인_2152",
    "윤웅채지식인_4246", "김신연지식인_2526", "이상담지식인_3579",
    "new티스토리_3630", "고객인터뷰폼_3816", "소책자_3193", "자동화블로그A_4746"
  ]

  // 채팅 바이럴 세부 매체
  const 채팅Sources = [
    "shp블로그", "gem블로그", "jnin블로그", "woo블로그", "koo블로그", "tor블로그",
    "khai블로그", "lang블로그", "dlk블로그", "icarus블로그", "자동화블로그(영)",
    "자동화블로그(영2)", "자동화블로그(승)", "자동화블로그(언)", "자동화블로그(백)",
    "자동화카페A", "자동화카페B", "수원자동화블/카", "백상희지식인",
    "윤웅채지식인", "김신연지식인", "이상담지식인",
    "new티스토리", "자동화블로그A"
  ]

  // 기타 바이럴 세부 매체 (폼/댓글/메일)
  const 기타Sources = [
    "shp블_폼", "shp블_댓글/메일", "자동화카페(A)_폼", "자동화카페(B)_폼",
    "gem블_댓글/메일", "jnin블_댓글/메일", "woo블_댓글/메일", "koo블_댓글/메일",
    "lang블_댓글/메일", "jnin블_업무폰", "woo블_폼", "koo블_업무폰", "lang블_폼",
    "자동화블로그A_폼"
  ]

  if (contactType === "전체") {
    return viralData
  }
  
  if (contactType === "유선") {
    return viralData.filter(item => 
      item.receiptType === "유선" && 
      유선Sources.includes(item.detailSource || "")
    )
  }
  
  if (contactType === "채팅") {
    return viralData.filter(item => 
      item.receiptType === "채팅" && 
      채팅Sources.includes(item.detailSource || "")
    )
  }
  
  if (contactType === "기타") {
    return viralData.filter(item => 
      item.receiptType === "기타" && 
      기타Sources.includes(item.detailSource || "")
    )
  }
  
  return []
}