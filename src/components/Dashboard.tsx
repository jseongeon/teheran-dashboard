import { MetricCard } from "./MetricCard"
import { TrafficChart } from "./TrafficChart"
import { DeviceChart } from "./DeviceChart"
import { TopPagesTable } from "./TopPagesTable"
import { RealtimeWidget } from "./RealtimeWidget"
import { WeekdayChart } from "./WeekdayChart"
import { DailyDataChart } from "./DailyDataChart"
import { Button } from "./ui/button"
import { Calendar, Download, Filter, FileText, FileSpreadsheet } from "lucide-react"
import { Users, Eye, Clock, TrendingUp } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useState, useRef, useMemo } from "react"
import { format } from "date-fns"
import { InquiryData, ContractData } from "../types"
import { filterByMonth, calculateStats, countInquiries, countMonthlyInquiries } from "../lib/googleSheets"

// 월별 메트릭 데이터 생성 함수
const generateMetricsData = (selectedMonth: Date) => {
  const monthIndex = selectedMonth.getMonth()
  const seasonalFactor = 1 + Math.sin((monthIndex / 12) * Math.PI * 2) * 0.2
  
  const inquiries = Math.floor((40000 + Math.random() * 10000) * seasonalFactor)
  const contracts = Math.floor((80000 + Math.random() * 15000) * seasonalFactor)
  const inquiryTrend = Math.floor((200000 + Math.random() * 50000) * seasonalFactor)
  
  // 전월 대비 변화율 계산 (랜덤)
  const inquiryChange = (Math.random() * 20 - 5).toFixed(1)
  const contractChange = (Math.random() * 15 - 3).toFixed(1)
  const trendChange = (Math.random() * 10 - 5).toFixed(1)
  const rateChange = (Math.random() * 12 - 2).toFixed(1)
  
  return [
    {
      title: "문의건",
      value: inquiries.toLocaleString(),
      change: parseFloat(inquiryChange),
      changeLabel: "지난 월 대비",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "수임건",
      value: contracts.toLocaleString(),
      change: parseFloat(contractChange),
      changeLabel: "지난 월 대비",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "전월 대비 문의 추이",
      value: inquiryTrend.toLocaleString(),
      change: parseFloat(trendChange),
      changeLabel: "지난 월 대비",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "전월 대비 수임율 추이",
      value: `${Math.floor(60 + Math.random() * 20)}%`,
      change: parseFloat(rateChange),
      changeLabel: "지난 월 ��비",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />
    }
  ]
}

interface DashboardProps {
  inquiries: InquiryData[]
  contracts: ContractData[]
  isDarkMode?: boolean
}

export function Dashboard({ inquiries, contracts, isDarkMode = false }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(11) // ⭐ 12월 (0-11이므로 11)
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 11, 1)) // ⭐ 2025년 12월
  const [selectedYear, setSelectedYear] = useState(2025) // 2025년 고정
  
  // 선택한 월의 데이터 필터링
  const monthlyInquiries = useMemo(() => 
    filterByMonth(inquiries, selectedYear, selectedMonth.getMonth()),
    [inquiries, selectedYear, selectedMonth]
  )
  
  const monthlyContracts = useMemo(() => 
    filterByMonth(contracts, selectedYear, selectedMonth.getMonth()),
    [contracts, selectedYear, selectedMonth]
  )
  
  // 전월 데이터 (비교용)
  const prevMonth = new Date(selectedYear, selectedMonth.getMonth() - 1, 1)
  
  const prevMonthInquiries = useMemo(() => 
    filterByMonth(inquiries, prevMonth.getFullYear(), prevMonth.getMonth()),
    [inquiries, prevMonth]
  )
  
  const prevMonthContracts = useMemo(() => 
    filterByMonth(contracts, prevMonth.getFullYear(), prevMonth.getMonth()),
    [contracts, prevMonth]
  )
  
  // 통계 계산
  const currentStats = calculateStats(monthlyInquiries, monthlyContracts)
  const prevStats = calculateStats(prevMonthInquiries, prevMonthContracts)
  
  // 변화율 계산
  const inquiryChange = prevStats.totalInquiries > 0 
    ? ((currentStats.totalInquiries - prevStats.totalInquiries) / prevStats.totalInquiries * 100)
    : 0
    
  const contractChange = prevStats.totalContracts > 0
    ? ((currentStats.totalContracts - prevStats.totalContracts) / prevStats.totalContracts * 100)
    : 0
    
  const rateChange = parseFloat(currentStats.contractRate) - parseFloat(prevStats.contractRate)
  
  // 트래픽 차트용 최근 10개월 데이터 생성
  const trafficData = useMemo(() => {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    const data = []
    const currentMonth = selectedMonth.getMonth()
    const currentYear = selectedMonth.getFullYear()
    
    // 최근 10개월 데이터 계산
    for (let i = 9; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1)
      const monthInquiries = filterByMonth(inquiries, targetDate.getFullYear(), targetDate.getMonth())
      const monthContracts = filterByMonth(contracts, targetDate.getFullYear(), targetDate.getMonth())
      const stats = calculateStats(monthInquiries, monthContracts)
      
      data.push({
        date: monthNames[targetDate.getMonth()],
        inquiry: stats.totalInquiries,
        contract: stats.totalContracts,
        rate: parseFloat(stats.contractRate)
      })
    }
    
    return data
  }, [inquiries, contracts, selectedMonth])
  
  // 메트릭 데이터
  const mockMetrics = [
    {
      title: "문의건",
      value: currentStats.totalInquiries.toLocaleString(),
      change: parseFloat(inquiryChange.toFixed(2)),
      changeLabel: "지난 월 대비",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "수임건",
      value: currentStats.totalContracts.toLocaleString(),
      change: parseFloat(contractChange.toFixed(2)),
      changeLabel: "지난 월 대비",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "수임율",
      value: `${currentStats.contractRate}%`,
      change: parseFloat(rateChange.toFixed(2)),
      changeLabel: "지난 월 대비",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    }
  ]

  // 필터 상태 관리
  const [filters, setFilters] = useState({
    변리사: [] as string[],
    분야: [] as string[],
    문의유형: [] as string[]
  })

  // 필터 옵션 데이터
  const filterOptions = {
    변리사: ["윤웅채 변리사님", "김신연 변리사님", "이상담 변리사님", "김봉근 변리사님"],
    분야: ["특허", "상표", "디자인", "해외", "저작권", "분쟁", "가치평가", "권리이전", "기타"],
    문의유형: ["홈페이지", "바이럴", "기타"]
  }

  // 월 이름 배열
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  
  // 연도 목록 생성 (2025년만 표시)
  const availableYears = useMemo(() => {
    return [2025]
  }, [])

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonthIndex(monthIndex)
    const newDate = new Date(selectedYear, monthIndex, 1)
    setSelectedMonth(newDate)
  }
  
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    const newDate = new Date(year, selectedMonthIndex, 1)
    setSelectedMonth(newDate)
  }

  const handleFilterChange = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }))
  }

  const getActiveFilterCount = () => {
    return filters.변리사.length + filters.분야.length + filters.문의유형.length
  }

  const clearAllFilters = () => {
    setFilters({
      변리사: [],
      분야: [],
      문의유형: []
    })
  }

  // CSV 내보내기 함수
  const exportToCSV = () => {
    // 샘플 데이터 (실제로는 대시보드의 실제 데이터를 사용)
    const data = [
      ["메트릭", "값", "변화율"],
      ["문의건", "45,231", "12.5%"],
      ["수임건", "89,432", "8.2%"],
      ["전월 대비 문의 추이", "234,567", "-2.1%"],
      ["전월 대비 수임율 추이", "2m 34s", "5.7%"]
    ]

    const csvContent = data.map(row => row.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `대시보드_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Excel 내보내기 함수
  const exportToExcel = async () => {
    const XLSX = await import("xlsx")
    
    // 샘플 데이터
    const data = [
      { 메트릭: "문의건", 값: "45,231", 변화율: "12.5%" },
      { 메트릭: "수임건", 값: "89,432", 변화율: "8.2%" },
      { 메트릭: "전월 대비 문의 추이", 값: "234,567", 변화율: "-2.1%" },
      { 메트릭: "전월 대비 수임율 추이", 값: "2m 34s", 변화율: "5.7%" }
    ]

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "대시보드")
    
    XLSX.writeFile(workbook, `대시보드_${format(new Date(), "yyyy-MM-dd")}.xlsx`)
  }

  // PDF 내보내기 함수
  const exportToPDF = async () => {
    if (!dashboardRef.current) return

    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`대시보드_${format(new Date(), "yyyy-MM-dd")}.pdf`)
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6" ref={dashboardRef}>
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            특허법인 현황 대시보드 입니다.
            <br />
            문의사항은 정성언 주임에게 연락주세요.
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedYear}년 {monthNames[selectedMonthIndex]}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="end">
              <div className="space-y-4">
                {/* 연도 선택 */}
                <div>
                  <h4 className="font-medium text-sm mb-2">연도 선택</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableYears.map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "ghost"}
                        size="sm"
                        className="justify-center"
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* 월 선택 */}
                <div>
                  <h4 className="font-medium text-sm mb-2">월 선택</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {monthNames.map((month, index) => (
                      <Button
                        key={month}
                        variant={selectedMonthIndex === index ? "default" : "ghost"}
                        size="sm"
                        className="justify-center"
                        onClick={() => handleMonthSelect(index)}
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
                {getActiveFilterCount() > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">필터</h4>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      모두 해제
                    </Button>
                  )}
                </div>

                {/* 변리사별 필터 */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">변리사</Label>
                    <div className="mt-2 space-y-2">
                      {filterOptions.변리사.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`변리사-${option}`}
                            checked={filters.변리사.includes(option)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("변리사", option, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`변리사-${option}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* 분야별 필터 */}
                  <div>
                    <Label className="text-sm font-medium">분야</Label>
                    <div className="mt-2 space-y-2">
                      {filterOptions.분야.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`분야-${option}`}
                            checked={filters.분야.includes(option)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("분야", option, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`분야-${option}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* 문의 유형별 필터 */}
                  <div>
                    <Label className="text-sm font-medium">문의 유형</Label>
                    <div className="mt-2 space-y-2">
                      {filterOptions.문의유형.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`문의유형-${option}`}
                            checked={filters.문의유형.includes(option)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("문의유형", option, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`문의유형-${option}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">내보내기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                CSV 파일로 내보내기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel 파일로 내보내기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF로 내보내기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 메트릭 카드 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {mockMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeLabel={metric.changeLabel}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* 실시간 섹션 */}
      <div className="grid gap-3 md:gap-4">
        <RealtimeWidget selectedMonth={selectedMonth} inquiries={inquiries} contracts={contracts} />
      </div>

      {/* 트래픽 개요 */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-6">
        <TrafficChart data={trafficData} isDarkMode={isDarkMode} />
        <DeviceChart inquiries={inquiries} isDarkMode={isDarkMode} />
      </div>

      {/* 일자별 데이터 섹션 */}
      <div className="grid gap-3 md:gap-4 md:grid-cols-6">
        <DailyDataChart 
          inquiries={inquiries}
          contracts={contracts}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* 활성화 요일 섹션 */}
      <div className="grid gap-3 md:gap-4 md:grid-cols-6">
        <WeekdayChart 
          inquiries={inquiries}
          contracts={contracts}
          isDarkMode={isDarkMode} 
        />
      </div>

      {/* 활성화 시간 섹션 */}
      <div className="grid gap-3 md:gap-4 md:grid-cols-6">
        <TopPagesTable 
          inquiries={inquiries}
          contracts={contracts}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}