import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { InquiryData, ContractData } from "../../types"
import { countInquiries } from "../../lib/googleSheets"

const metricTypes = ["월 실적", "분기 실적", "연 실적"] as const
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const quarters = [1, 2, 3, 4] as const

interface DetailedMetricsPageProps {
  subPage?: string
  inquiries: InquiryData[]
  contracts: ContractData[]
  isDarkMode?: boolean
}

export function DetailedMetricsPage({ subPage, inquiries, contracts, isDarkMode }: DetailedMetricsPageProps) {
  const [activeTab, setActiveTab] = useState(subPage || "월 실적")
  
  // 연도 선택 (기본값: 2025년)
  const [selectedYear, setSelectedYear] = useState<number>(2025) // 2025년 고정
  
  // 월 실적용 월 선택 (기본값: 현재 월)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  
  // 분기 실적용 분기 선택 (기본값: 현재 분기)
  const [selectedQuarter, setSelectedQuarter] = useState<number>(() => {
    const now = new Date()
    return Math.floor(now.getMonth() / 3) + 1
  })
  
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

  // 선택한 월의 실적 계산
  const selectedMonthStats = useMemo(() => {
    const year = selectedYear
    const month = selectedMonth - 1
    
    const monthInquiries = inquiries.filter(i => {
      const d = new Date(i.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
    
    const monthContracts = contracts.filter(c => {
      const dateToUse = c.contractDate || c.date
      const d = new Date(dateToUse)
      return d.getFullYear() === year && d.getMonth() === month
    })
    
    // 일별 데이터 생성
    const dailyData: { [key: string]: { inquiries: number, contracts: number } } = {}
    const lastDay = new Date(year, month + 1, 0).getDate()
    
    for (let day = 1; day <= lastDay; day++) {
      const dateKey = `${month + 1}/${String(day).padStart(2, '0')}`
      dailyData[dateKey] = { inquiries: 0, contracts: 0 }
    }
    
    monthInquiries.forEach(i => {
      const d = new Date(i.date)
      const dateKey = `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
      if (dailyData[dateKey]) {
        dailyData[dateKey].inquiries++
      }
    })
    
    monthContracts.forEach(c => {
      const dateToUse = c.contractDate || c.date
      const d = new Date(dateToUse)
      const dateKey = `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
      if (dailyData[dateKey]) {
        dailyData[dateKey].contracts++
      }
    })
    
    // 5일 간격으로 샘플링
    const chartData = []
    for (let day = 1; day <= lastDay; day += 5) {
      const dateKey = `${month + 1}/${String(day).padStart(2, '0')}`
      if (dailyData[dateKey]) {
        chartData.push({
          date: dateKey,
          inquiries: dailyData[dateKey].inquiries,
          contracts: dailyData[dateKey].contracts
        })
      }
    }
    // 마지막 날 추가
    const lastDateKey = `${month + 1}/${String(lastDay).padStart(2, '0')}`
    if (dailyData[lastDateKey] && lastDay % 5 !== 1) {
      chartData.push({
        date: lastDateKey,
        inquiries: dailyData[lastDateKey].inquiries,
        contracts: dailyData[lastDateKey].contracts
      })
    }
    
    const revenue = monthContracts.reduce((sum, c) => {
      const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
      return sum + amount
    }, 0)
    
    return {
      totalInquiries: countInquiries(monthInquiries),
      totalContracts: monthContracts.length,
      revenue,
      chartData
    }
  }, [inquiries, contracts, selectedMonth, selectedYear])

  // 선택한 분기의 실적 계산
  const selectedQuarterStats = useMemo(() => {
    const year = selectedYear
    const quarter = selectedQuarter - 1
    
    const quarterMonths = [
      quarter * 3,
      quarter * 3 + 1,
      quarter * 3 + 2
    ]
    
    const monthlyData = quarterMonths.map((month) => {
      const monthName = `${month + 1}월`
      
      const monthInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      
      const monthContracts = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === year && d.getMonth() === month
      })
      
      const revenue = monthContracts.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)
      
      return {
        month: monthName,
        inquiries: countInquiries(monthInquiries),
        contracts: monthContracts.length,
        revenue
      }
    })
    
    const totalInquiries = monthlyData.reduce((sum, m) => sum + m.inquiries, 0)
    const totalContracts = monthlyData.reduce((sum, m) => sum + m.contracts, 0)
    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
    const avgRate = totalInquiries > 0 ? (totalContracts / totalInquiries) * 100 : 0
    
    return {
      totalInquiries,
      totalContracts,
      totalRevenue,
      avgRate,
      quarterName: `${quarter + 1}분기`,
      monthlyData
    }
  }, [inquiries, contracts, selectedQuarter, selectedYear])

  // 전체 연도 실적 계산
  const yearlyStats = useMemo(() => {
    const currentYear = selectedYear
    
    // 월별 데이터 생성 (1월~12월)
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index
      const monthName = `${month + 1}월`
      
      const monthInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === currentYear && d.getMonth() === month
      })
      
      const monthContracts = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === currentYear && d.getMonth() === month
      })
      
      const revenue = monthContracts.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)
      
      return {
        month: monthName,
        inquiries: countInquiries(monthInquiries),
        contracts: monthContracts.length,
        revenue
      }
    })
    
    // 분기별 데이터 생성
    const quarterlyData = Array.from({ length: 4 }, (_, index) => {
      const quarter = index
      const quarterName = `${quarter + 1}분기`
      const quarterMonths = [quarter * 3, quarter * 3 + 1, quarter * 3 + 2]
      
      const quarterInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === currentYear && quarterMonths.includes(d.getMonth())
      })
      
      const quarterContracts = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === currentYear && quarterMonths.includes(d.getMonth())
      })
      
      const revenue = quarterContracts.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)
      
      return {
        quarter: quarterName,
        inquiries: countInquiries(quarterInquiries),
        contracts: quarterContracts.length,
        revenue
      }
    })
    
    const totalInquiries = monthlyData.reduce((sum, m) => sum + m.inquiries, 0)
    const totalContracts = monthlyData.reduce((sum, m) => sum + m.contracts, 0)
    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
    const avgRate = totalInquiries > 0 ? (totalContracts / totalInquiries) * 100 : 0
    
    return {
      totalInquiries,
      totalContracts,
      totalRevenue,
      avgRate,
      monthlyData,
      quarterlyData,
      year: currentYear
    }
  }, [inquiries, contracts, selectedYear])

  const renderContent = () => {
    switch (activeTab) {
      case "월 실적":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>연도 선택</CardTitle>
                <CardDescription>조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>월 선택</CardTitle>
                <CardDescription>조회할 월을 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {months.map((month) => (
                    <Button
                      key={month}
                      variant={selectedMonth === month ? "default" : "outline"}
                      onClick={() => setSelectedMonth(month)}
                      className="w-full"
                    >
                      {month}월
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedMonthStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedMonth}월
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedMonthStats.totalContracts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedMonth}월
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">수임율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedMonthStats.totalInquiries > 0 
                      ? ((selectedMonthStats.totalContracts / selectedMonthStats.totalInquiries) * 100).toFixed(1)
                      : "0.0"}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    월 수임율
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₩{selectedMonthStats.revenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    월 총액
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>월별 일별 추이</CardTitle>
                <CardDescription>문의건 및 수임건 일별 변화</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={selectedMonthStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inquiries" stroke="#3b82f6" name="문의건" strokeWidth={2} />
                    <Line type="monotone" dataKey="contracts" stroke="#10b981" name="수임건" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "분기 실적":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>연도 선택</CardTitle>
                <CardDescription>조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>분기 선택</CardTitle>
                <CardDescription>조회할 분기를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {quarters.map((quarter) => (
                    <Button
                      key={quarter}
                      variant={selectedQuarter === quarter ? "default" : "outline"}
                      onClick={() => setSelectedQuarter(quarter)}
                      className="w-full"
                    >
                      {quarter}분기
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedQuarterStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedQuarterStats.quarterName} 총 문의
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedQuarterStats.totalContracts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedQuarterStats.quarterName} 총 수임
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 수임율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedQuarterStats.avgRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    분기 평균
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₩{selectedQuarterStats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    분기 총액
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{selectedQuarterStats.quarterName} 월별 실적</CardTitle>
                <CardDescription>월별 비교</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={selectedQuarterStats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="inquiries" fill="#3b82f6" name="문의건" />
                    <Bar yAxisId="left" dataKey="contracts" fill="#10b981" name="수임건" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "연 실적":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>연도 선택</CardTitle>
                <CardDescription>조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">{yearlyStats.year}년 전체 실적</div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearlyStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {yearlyStats.year}년 총 문의
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearlyStats.totalContracts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {yearlyStats.year}년 총 수임
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 수임율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearlyStats.avgRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    연 평균
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₩{yearlyStats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    연 총액
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>월별 실적</CardTitle>
                <CardDescription>전체 월별 비교</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyStats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="inquiries" fill="#3b82f6" name="문의건" />
                    <Bar yAxisId="left" dataKey="contracts" fill="#10b981" name="수임건" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>분기별 실적</CardTitle>
                <CardDescription>전체 분기별 비교</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyStats.quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="inquiries" fill="#3b82f6" name="문의건" />
                    <Bar yAxisId="left" dataKey="contracts" fill="#10b981" name="수임건" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">세부 지표</h1>
        <p className="text-muted-foreground">
          월별, 분기별, 연별 상세 실적을 확인하세요
        </p>
      </div>

      <div className="flex gap-2">
        {metricTypes.map((type) => (
          <Button
            key={type}
            variant={activeTab === type ? "default" : "outline"}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {renderContent()}
    </div>
  )
}