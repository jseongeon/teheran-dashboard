import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useState, useEffect, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AttorneyStats, FieldStats, InquiryData } from "../../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Calendar } from "lucide-react"
import { countInquiries } from "../../lib/googleSheets"

const metricTypes = ["변리사님별 현황", "분야별 현황", "업무시간 현황", "업무외시간 현황"] as const

const months = [
  { value: "all", label: "전체" },
  { value: "1", label: "1월" },
  { value: "2", label: "2월" },
  { value: "3", label: "3월" },
  { value: "4", label: "4월" },
  { value: "5", label: "5월" },
  { value: "6", label: "6월" },
  { value: "7", label: "7월" },
  { value: "8", label: "8월" },
  { value: "9", label: "9월" },
  { value: "10", label: "10월" },
  { value: "11", label: "11월" },
  { value: "12", label: "12월" },
]

interface AdditionalMetricsPageProps {
  subPage?: string
  attorneyStats: AttorneyStats[]
  fieldStats: FieldStats[]
  inquiries: InquiryData[]
  isDarkMode?: boolean
}

export function AdditionalMetricsPage({ subPage, attorneyStats, fieldStats, inquiries, isDarkMode = false }: AdditionalMetricsPageProps) {
  const [activeTab, setActiveTab] = useState(subPage || "변리사님별 현황")
  const [selectedYear, setSelectedYear] = useState<number>(2025) // 2025년 고정
  const [selectedMonth, setSelectedMonth] = useState("all")
  
  // 연도 목록 생성 (2025년만 표시)
  const availableYears = useMemo(() => {
    return [2025]
  }, [])

  // subPage가 변경되면 activeTab 업데이트
  useEffect(() => {
    if (subPage) {
      setActiveTab(subPage)
    }
  }, [subPage])

  // 연도와 월별 필터링된 문의 데이터
  const filteredInquiries = useMemo(() => {
    let filtered = inquiries
    
    // 연도 필터링
    filtered = filtered.filter(inquiry => {
      if (!inquiry.date) return false
      const date = new Date(inquiry.date)
      return date.getFullYear() === selectedYear
    })
    
    // 월 필터링
    if (selectedMonth !== "all") {
      filtered = filtered.filter(inquiry => {
        if (!inquiry.date) return false
        const date = new Date(inquiry.date)
        const month = date.getMonth() + 1 // 0-based to 1-based
        return month === parseInt(selectedMonth)
      })
    }
    
    return filtered
  }, [inquiries, selectedYear, selectedMonth])

  // 필터링된 데이터로 변리사별 통계 재계산
  const filteredAttorneyStats = useMemo(() => {
    const attorneyMap = new Map<string, InquiryData[]>()
    
    filteredInquiries.forEach(inquiry => {
      const attorney = inquiry.attorney || "미지정"
      if (!attorneyMap.has(attorney)) {
        attorneyMap.set(attorney, [])
      }
      attorneyMap.get(attorney)!.push(inquiry)
    })
    
    return Array.from(attorneyMap.entries()).map(([name, attorneyInquiries]) => {
      const inquiryCount = countInquiries(attorneyInquiries)
      const contractCount = attorneyInquiries.filter(i => i.isContract).length
      
      return {
        name,
        inquiries: inquiryCount,
        contracts: contractCount,
        rate: inquiryCount > 0 ? Math.round((contractCount / inquiryCount) * 100) : 0
      }
    })
  }, [filteredInquiries])

  // 필터링된 데이터로 분야별 통계 재계산
  const filteredFieldStats = useMemo(() => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#6b7280", "#14b8a6", "#f97316"]
    const fieldMap = new Map<string, InquiryData[]>()
    
    filteredInquiries.forEach(inquiry => {
      const field = inquiry.field || "기타"
      if (!fieldMap.has(field)) {
        fieldMap.set(field, [])
      }
      fieldMap.get(field)!.push(inquiry)
    })
    
    return Array.from(fieldMap.entries()).map(([name, fieldInquiries], index) => ({
      name,
      value: countInquiries(fieldInquiries),
      color: colors[index % colors.length]
    }))
  }, [filteredInquiries])

  // 시간대별 데이터 계산 (구글 시트의 C열 문의시간 기반)
  const workHoursData = useMemo(() => {
    const hourCounts = new Map<number, number>()
    
    // 09시~18시 초기화
    for (let i = 9; i <= 18; i++) {
      hourCounts.set(i, 0)
    }
    
    // 문의 데이터에서 시간 추출 및 카운트
    filteredInquiries.forEach(inquiry => {
      if (!inquiry.time) return
      
      // "09:30", "14:25" 형식에서 시간 추출
      const hourMatch = inquiry.time.match(/^(\d{1,2})/)
      if (hourMatch) {
        const hour = parseInt(hourMatch[1])
        if (hour >= 9 && hour <= 18) {
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
        }
      }
    })
    
    // 차트 데이터 형식으로 변환
    return Array.from(hourCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hour, count]) => ({
        hour: `${hour.toString().padStart(2, '0')}시`,
        count
      }))
  }, [filteredInquiries])

  const afterHoursData = useMemo(() => {
    const hourCounts = new Map<number, number>()
    
    // 18시~23시, 00시~08시 초기화
    for (let i = 18; i <= 23; i++) {
      hourCounts.set(i, 0)
    }
    for (let i = 0; i <= 8; i++) {
      hourCounts.set(i, 0)
    }
    
    // 문의 데이터에서 시간 추출 및 카운트
    filteredInquiries.forEach(inquiry => {
      if (!inquiry.time) return
      
      // "09:30", "14:25" 형식에서 시간 추출
      const hourMatch = inquiry.time.match(/^(\d{1,2})/)
      if (hourMatch) {
        const hour = parseInt(hourMatch[1])
        // 18시 이후 또는 09시 이전
        if (hour >= 18 || hour < 9) {
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
        }
      }
    })
    
    // 차트 데이터 형식으로 변환 (18시~23시, 00시~08시 순서)
    const evening = Array.from(hourCounts.entries())
      .filter(([hour]) => hour >= 18)
      .sort((a, b) => a[0] - b[0])
    
    const morning = Array.from(hourCounts.entries())
      .filter(([hour]) => hour < 9)
      .sort((a, b) => a[0] - b[0])
    
    return [...evening, ...morning].map(([hour, count]) => ({
      hour: `${hour.toString().padStart(2, '0')}시`,
      count
    }))
  }, [filteredInquiries])

  // 다크모드에 따른 툴팁 스타일
  const tooltipStyle = isDarkMode
    ? {
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        border: '1px solid #374151',
        borderRadius: '8px'
      }
    : {
        backgroundColor: '#ffffff',
        color: '#111827',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }
  
  const tooltipItemStyle = { 
    color: isDarkMode ? '#f9fafb' : '#111827' 
  }

  const renderContent = () => {
    switch (activeTab) {
      case "변리사님별 현황":
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              {filteredAttorneyStats.map((attorney) => (
                <Card key={attorney.name}>
                  <CardHeader className="p-3 md:p-6">
                    <CardTitle className="text-sm md:text-base truncate">{attorney.name === "상담완료" ? "상담완료" : `${attorney.name} 변리사님`}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3 pt-0 md:p-6 md:pt-0">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">문의건</p>
                      <p className="text-xl md:text-2xl font-bold">{attorney.inquiries}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">수임건</p>
                      <p className="text-xl md:text-2xl font-bold">{attorney.contracts}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">수임율</p>
                      <p className="text-xl md:text-2xl font-bold">{attorney.rate}%</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">변리사님별 실적 비교</CardTitle>
                <CardDescription className="text-xs md:text-sm">문의건 및 수임건 비교</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
                  <BarChart data={filteredAttorneyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipItemStyle} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="inquiries" fill="#3b82f6" name="문의건" />
                    <Bar dataKey="contracts" fill="#10b981" name="수임건" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "분야별 현황":
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg">분야별 문의 분포</CardTitle>
                  <CardDescription className="text-xs md:text-sm">각 분야별 문의 비중</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
                    <PieChart>
                      <Pie
                        data={filteredFieldStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {filteredFieldStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipItemStyle} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg">분야별 상세 통계</CardTitle>
                  <CardDescription className="text-xs md:text-sm">각 분야별 건수</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="space-y-2 md:space-y-3">
                    {filteredFieldStats.map((field) => (
                      <div key={field.name} className="flex items-center justify-between text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: field.color }}
                          />
                          <span className="truncate">{field.name}</span>
                        </div>
                        <span className="font-bold">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "업무시간 현황":
        return (
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">시간대별 업무 현황</CardTitle>
              <CardDescription className="text-xs md:text-sm">업무 시간(09:00-18:00) 동안의 활동</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                <BarChart data={workHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipItemStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#3b82f6" name="문의 건수" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )

      case "업무외시간 현황":
        return (
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">시간외 업무 현황</CardTitle>
              <CardDescription className="text-xs md:text-sm">업무 시간 외(18:00 이후) 활동</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                <BarChart data={afterHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipItemStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#ef4444" name="문의 건수" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">추가 지표</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          상세한 업무 현황 지표를 확인하세요
        </p>
      </div>

      <div className="flex gap-1.5 md:gap-2 flex-wrap">
        {metricTypes.map((type) => (
          <Button
            key={type}
            variant={activeTab === type ? "default" : "outline"}
            onClick={() => setActiveTab(type)}
            size="sm"
            className="text-xs md:text-sm"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 md:gap-2">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
          <Select value={selectedYear.toString()} onValueChange={value => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-24 md:w-40 h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="연도" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-20 md:w-40 h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}