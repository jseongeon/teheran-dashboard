import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Activity, Users, TrendingUp } from "lucide-react"
import { InquiryData, ContractData } from "../../types"
import { useMemo } from "react"
import { countInquiries } from "../../lib/googleSheets"

interface RealtimePageProps {
  inquiries: InquiryData[]
  contracts: ContractData[]
}

export function RealtimePage({ inquiries, contracts }: RealtimePageProps) {
  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0]
  
  // 이번 달의 시작과 끝 날짜
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  
  // 금일 문의건: B열 날짜가 오늘이고, 기존 필터링 로직 적용
  const todayInquiries = useMemo(() => {
    const todayData = inquiries.filter(i => i.date === today)
    return countInquiries(todayData)
  }, [inquiries, today])
  
  // 월 수임건: B열 날짜가 이번 달이고, 수임건 카운트 로직 적용
  // Q열(isContract)이 TRUE이면서
  // D열이 "문의건X"이고 E열이 "연락처중복" 또는 "리마인드CRM"인 경우
  // 같은 달 내 H열(전화번호) 중복을 제거
  const monthlyContracts = useMemo(() => {
    // 임시: 단순 카운트 (Q열이 TRUE인 이번 달 수임건)
    return inquiries.filter(i => 
      i.date >= thisMonthStart && 
      i.date <= thisMonthEnd && 
      i.isContract === true
    ).length
    
    /* TODO: 추후 활성화 - 중복 제거 로직
    // 이번 달의 수임건 필터링 (Q열이 TRUE)
    const monthContracts = inquiries.filter(i => 
      i.date >= thisMonthStart && 
      i.date <= thisMonthEnd && 
      i.isContract === true
    )
    
    // D열이 "문의건X"이고 E열이 "연락처중복" 또는 "리마인드CRM"인 경우
    // 전화번호(H열) 중복 제거
    const duplicateCheckNeeded = monthContracts.filter(i => 
      i.receiptType === "문의건X" && 
      (i.contactDuplicate === "연락처중복" || i.contactDuplicate === "리마인드CRM")
    )
    
    // 전화번호로 중복 제거 (같은 전화번호는 1건으로만 집계)
    const uniquePhones = new Set(duplicateCheckNeeded.map(i => i.phone))
    const deduplicatedCount = uniquePhones.size
    
    // 나머지 수임건 (중복 제거가 필요 없는 건들)
    const normalContracts = monthContracts.filter(i => 
      !(i.receiptType === "문의건X" && 
        (i.contactDuplicate === "연락처중복" || i.contactDuplicate === "리마인드CRM"))
    )
    
    return deduplicatedCount + normalContracts.length
    */
  }, [inquiries, thisMonthStart, thisMonthEnd])
  
  // 월 방문상담건: B열 날짜가 이번 달이고, P열(isVisit)이 TRUE
  const monthlyVisits = useMemo(() => 
    inquiries.filter(i => i.date >= thisMonthStart && i.date <= thisMonthEnd && i.isVisit === true).length,
    [inquiries, thisMonthStart, thisMonthEnd]
  )
  
  // 오늘의 최근 활동 데이터 (실제 구글 시트 데이터 사용)
  const { recentInquiries, recentContracts } = useMemo(() => {
    // R열(수임일)을 날짜 형식으로 정규화하는 함수
    const normalizeContractDate = (dateStr: string): string => {
      if (!dateStr) return ""
      try {
        // 이미 YYYY-MM-DD 형식인 경우
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return dateStr
        }
        // 날짜 파싱
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ""
        
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch {
        return ""
      }
    }
    
    // 상대 시간 계산 함수
    const getRelativeTime = (timestamp: number): string => {
      const now = new Date()
      const diffMs = now.getTime() - timestamp
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      if (diffMins < 1) {
        return "방금 전"
      } else if (diffMins < 60) {
        return `${diffMins}분 전`
      } else {
        const diffHours = Math.floor(diffMins / 60)
        return `${diffHours}시간 전`
      }
    }
    
    // 1. 새로운 문의: B열(문의날짜)이 오늘이고, G열(고객 성함)이 있는 것
    const todayInquiries = inquiries.filter(i => 
      i.date === today && 
      i.customerName
      // 수임건도 포함 (문의와 동시에 수임되는 경우 있음)
    ).map(item => {
      // C열의 시간 파싱 ("09:30" 형식)
      const timeStr = item.time || "00:00"
      const [hours, minutes] = timeStr.split(':').map(Number)
      const itemDateTime = new Date()
      itemDateTime.setHours(hours || 0, minutes || 0, 0, 0)
      
      // 데이터 구성: 문의일 | 시간 | 성함 | 연락처 | 이메일 | 접수 | 담당자 | 수임일 순
      const details = []
      if (item.date) details.push(`문의일: ${item.date}`) // B열: 문의날짜
      if (timeStr) details.push(timeStr) // C열: 시간
      if (item.customerName) details.push(item.customerName) // G열: 고객 성함
      if (item.phone) details.push(item.phone) // H열: 고객 연락처
      if (item.email) details.push(item.email) // I열: 고객 이메일
      if (item.receptionist) details.push(`접수: ${item.receptionist}`) // J열: 접수자
      // N열: 변리사님 (상담필요가 아닐 때만)
      if (item.attorney && item.attorney !== "상담필요") {
        details.push(`담당: ${item.attorney}`)
      }
      if (item.contractDate) {
        details.push(`수임일: ${item.contractDate}`) // R열: 수임일
      }
      
      return {
        time: getRelativeTime(itemDateTime.getTime()),
        detail: details.filter(d => d).join(' | '),
        timestamp: itemDateTime.getTime()
      }
    }).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
    
    // 2-1. 이번 달의 모든 수임건 (중복 체크용)
    const thisMonthContracts = inquiries.filter(i => {
      if (!i.isContract) return false
      if (!i.contractDate) return false
      
      const contractDate = normalizeContractDate(i.contractDate)
      if (!contractDate) return false
      
      // R열(수임일)이 이번 달인지 확인
      return contractDate >= thisMonthStart && contractDate <= thisMonthEnd
    })
    
    // 2-2. 오늘 수임된 건만 필터링 (최근 활동 표시용)
    const todayContracts = thisMonthContracts.filter(i => {
      const contractDate = normalizeContractDate(i.contractDate!)
      return contractDate === today
    }).map(item => {
      // C열의 시간 파싱 ("09:30" 형식)
      const timeStr = item.time || "00:00"
      const [hours, minutes] = timeStr.split(':').map(Number)
      const itemDateTime = new Date()
      itemDateTime.setHours(hours || 0, minutes || 0, 0, 0)
      
      // 수임건 카운트 로직 적용 (같은 달 내 중복 체크)
      let shouldInclude = true
      // D열="문의건X" AND E열="연락처중복"/"리마인드CRM"인 경우 중복 체크
      if (item.receiptType === "문의건X" && 
          (item.contactDuplicate === "연락처중복" || item.contactDuplicate === "리마인드CRM")) {
        // 같은 달 내에서 전화번호 중복인 경우 제외 (첫 번째만 표시)
        const hasDuplicate = thisMonthContracts.some(other => {
          if (other.phone !== item.phone || !other.phone) return false
          if (other.receiptType !== "문의건X") return false
          if (other.contactDuplicate !== "연락처중복" && other.contactDuplicate !== "리마인드CRM") return false
          
          // R열(수임일) 기준으로 더 이른 것이 있는지 확인
          const otherContractDate = normalizeContractDate(other.contractDate || "")
          const itemContractDate = normalizeContractDate(item.contractDate || "")
          
          if (!otherContractDate || !itemContractDate) return false
          
          // 수임일이 더 이르거나, 같은 날이면 시간으로 비교
          if (otherContractDate < itemContractDate) return true
          if (otherContractDate === itemContractDate && other.time && other.time < item.time) return true
          
          return false
        })
        shouldInclude = !hasDuplicate
      }
      
      // 데이터 구성
      const details = []
      if (timeStr) details.push(timeStr) // C열: 시간
      if (item.field) details.push(item.field) // F열: 분야
      if (item.customerName) details.push(item.customerName) // G열: 고객 성함
      if (item.phone) details.push(item.phone) // H열: 고객 연락처
      if (item.email) details.push(item.email) // I열: 고객 이메일
      if (item.receptionist) details.push(`접수: ${item.receptionist}`) // J열: 접수자
      // N열: 변리사님 (상담필요가 아닐 때만)
      if (item.attorney && item.attorney !== "상담필요") {
        details.push(`담당: ${item.attorney}`)
      }
      if (item.date) {
        details.push(`문의일: ${item.date}`) // B열: 문의날짜
      }
      if (item.contractDate) {
        details.push(`수임일: ${item.contractDate}`) // R열: 수임일
      }
      
      return {
        time: getRelativeTime(itemDateTime.getTime()),
        detail: details.filter(d => d).join(' | '),
        timestamp: itemDateTime.getTime(),
        shouldInclude
      }
    }).filter(item => item.shouldInclude)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
    
    return {
      recentInquiries: todayInquiries,
      recentContracts: todayContracts
    }
  }, [inquiries, today, thisMonthStart, thisMonthEnd])
  
  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">실시간 현황</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          실시간으로 발생하는 문의 및 수임 현황을 확인하세요
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">금일 문의건</CardTitle>
            <Activity className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{todayInquiries}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              오늘 등록된 문의
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">월 수임건</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{monthlyContracts}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              이번 달 수임
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">월 방문상담건</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{monthlyVisits}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              이번 달 방문/출장 상담
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">최근 상담 접수 내역</CardTitle>
            <CardDescription className="text-xs md:text-sm">오늘 등록된 상담 접수</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {recentInquiries.length > 0 ? (
                recentInquiries.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3 pb-2 md:pb-3 border-b last:border-0">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1.5 md:mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm md:text-base">새로운 문의</p>
                        <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground break-words">{item.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground text-center py-6 md:py-8">
                  오늘 등록된 상담 접수 내역이 없습니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">최근 수임 완료 내역</CardTitle>
            <CardDescription className="text-xs md:text-sm">오늘 수임 완료된 건</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {recentContracts.length > 0 ? (
                recentContracts.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3 pb-2 md:pb-3 border-b last:border-0">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1.5 md:mt-2 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm md:text-base">수임 완료</p>
                        <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground break-words">{item.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground text-center py-6 md:py-8">
                  오늘 수임 완료된 내역이 없습니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}