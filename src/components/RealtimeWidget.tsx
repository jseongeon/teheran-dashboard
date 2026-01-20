import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Activity, Globe, Users } from "lucide-react"
import { InquiryData, ContractData } from "../types"
import { useMemo } from "react"
import { countInquiries } from "../lib/googleSheets"

interface RealtimeWidgetProps {
  selectedMonth: Date
  inquiries: InquiryData[]
  contracts: ContractData[]
}

// 월별 실시간 데이터 생성 함수
const generateRealtimeData = (selectedMonth: Date, inquiries: InquiryData[], contracts: ContractData[]) => {
  const today = new Date().toISOString().split('T')[0]
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()
  
  // 선택한 월의 데이터 필터링
  const monthlyInquiries = inquiries.filter(i => {
    const date = new Date(i.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
  
  const monthlyContracts = contracts.filter(c => {
    const date = new Date(c.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
  
  // 오늘 날짜의 문의건
  const todayInquiriesData = inquiries.filter(i => i.date === today)
  const todayInquiries = todayInquiriesData.length
  
  // 오늘 날짜의 수임건 (문의 날짜가 오늘이면서 수임된 건)
  const todayContracts = inquiries.filter(i => i.date === today && i.isContract === true).length
  
  // 선택한 월의 방문상담건 (isVisit === true)
  const monthlyVisits = monthlyInquiries.filter(i => i.isVisit === true).length
  
  // 금일 접수 유형별 문의건 현황 (B열 날짜가 오늘인 것만, D열 receiptType 기준)
  const sourceTypes = ["홈페이지", "유선", "채팅", "기타", "문의건X"]
  const sourceStats = sourceTypes.map(sourceType => {
    const count = todayInquiriesData.filter(i => i.receiptType === sourceType).length
    return { source: sourceType, count }
  })
  
  // 금일 변리사님별 상담 현황 (B열 날짜가 오늘인 것만, N열 attorney 기준)
  const attorneys = ["윤웅채", "김신연", "이상담", "김봉근", "상담완료"]
  const attorneyStats = attorneys.map(attorney => {
    const count = todayInquiriesData.filter(i => i.attorney.includes(attorney)).length
    return { attorney: attorney === "상담완료" ? attorney : `${attorney} 변리사님`, count }
  })
  
  return {
    todayInquiries,
    todayContracts,
    monthlyVisits,
    sourceStats,
    attorneyStats
  }
}

export function RealtimeWidget({ selectedMonth, inquiries, contracts }: RealtimeWidgetProps) {
  const realtimeData = useMemo(() => 
    generateRealtimeData(selectedMonth, inquiries, contracts),
    [selectedMonth, inquiries, contracts]
  )
  
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          실시간
        </CardTitle>
        <CardDescription>
          {selectedMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 활동 현황
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {/* 왼쪽: 통계 */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{realtimeData.todayInquiries}</div>
              <div className="text-sm text-muted-foreground mt-1">금일 문의건</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold">{realtimeData.todayContracts}</div>
              <div className="text-sm text-muted-foreground mt-1">금일 수임건</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold">{realtimeData.monthlyVisits}</div>
              <div className="text-sm text-muted-foreground mt-1">월 방문상담건</div>
            </div>
          </div>

          {/* 중간: 접수 유형 현황 */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              금일 접수 유형 현황
            </h4>
            <div className="space-y-2">
              {realtimeData.sourceStats.map((stat, index) => (
                <div key={stat.source} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                  <span className="truncate flex-1">{stat.source}</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 변리사님별 현황 */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              금일 변리사님별 상담 현황
            </h4>
            <div className="space-y-2">
              {realtimeData.attorneyStats.map((stat, index) => (
                <div key={stat.attorney} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                  <span className="truncate flex-1">{stat.attorney}</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}