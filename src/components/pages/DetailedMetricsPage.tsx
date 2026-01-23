import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { InquiryData, ContractData } from "../../types"
import { countInquiries } from "../../lib/googleSheets"
import { Lock, Unlock } from "lucide-react"

// 매출 확인 암호
const REVENUE_PASSWORD = "wjdtjddjs"

const metricTypes = ["월 실적", "분기 실적", "연 실적"] as const
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const quarters = [1, 2, 3, 4] as const

interface DetailedMetricsPageProps {
  subPage?: string
  inquiries: InquiryData[]
  contracts: ContractData[]
  isDarkMode?: boolean
}

// 매출 카드 컴포넌트 (암호 보호)
function RevenueCard({
  revenue,
  label,
  isUnlocked,
  password,
  onPasswordChange,
  onUnlock
}: {
  revenue: number
  label: string
  isUnlocked: boolean
  password: string
  onPasswordChange: (value: string) => void
  onUnlock: () => void
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUnlock()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
        <CardTitle className="text-xs md:text-sm font-medium">총 매출</CardTitle>
        {isUnlocked ? (
          <Unlock className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
        ) : (
          <Lock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
        {isUnlocked ? (
          <>
            <div className="text-lg md:text-2xl font-bold">
              ₩{revenue.toLocaleString()}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {label}
            </p>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-xs md:text-sm text-muted-foreground">
              암호 필요
            </p>
            <div className="flex gap-1 md:gap-2">
              <Input
                type="password"
                placeholder="암호"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 md:h-8 text-xs md:text-sm"
              />
              <Button size="sm" onClick={onUnlock} className="h-7 md:h-8 text-xs px-2 md:px-3">
                확인
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DetailedMetricsPage({ subPage, inquiries, contracts, isDarkMode }: DetailedMetricsPageProps) {
  const [activeTab, setActiveTab] = useState(subPage || "월 실적")

  // 매출 암호 관련 상태
  const [revenueUnlocked, setRevenueUnlocked] = useState(false)
  const [revenuePassword, setRevenuePassword] = useState("")

  // 매출 잠금 해제 핸들러
  const handleUnlockRevenue = () => {
    if (revenuePassword === REVENUE_PASSWORD) {
      setRevenueUnlocked(true)
      setRevenuePassword("")
    } else {
      alert("암호가 올바르지 않습니다.")
    }
  }

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

    // B열(문의일) 기준으로 필터링
    const monthInquiries = inquiries.filter(i => {
      const d = new Date(i.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

    // ⭐ 수임건: 문의 기준 (B열 기준 + Q열 isContract === true)
    const monthContractsFromInquiries = monthInquiries.filter(i => i.isContract)

    // 매출 계산용 (R열 수임일 기준)
    const monthContractsForRevenue = contracts.filter(c => {
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

    // ⭐ 수임건도 문의일(B열) 기준으로 차트 데이터 생성
    monthContractsFromInquiries.forEach(i => {
      const d = new Date(i.date)
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

    // 매출은 R열(수임일) 기준
    const revenue = monthContractsForRevenue.reduce((sum, c) => {
      const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
      return sum + amount
    }, 0)

    return {
      totalInquiries: countInquiries(monthInquiries),
      totalContracts: monthContractsFromInquiries.length, // ⭐ 문의 기준 수임건
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

      // B열(문의일) 기준으로 필터링
      const monthInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === year && d.getMonth() === month
      })

      // ⭐ 수임건: 문의 기준 (B열 기준 + Q열 isContract === true)
      const monthContractsFromInquiries = monthInquiries.filter(i => i.isContract)

      // 매출 계산용 (R열 수임일 기준)
      const monthContractsForRevenue = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === year && d.getMonth() === month
      })

      const revenue = monthContractsForRevenue.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)

      return {
        month: monthName,
        inquiries: countInquiries(monthInquiries),
        contracts: monthContractsFromInquiries.length, // ⭐ 문의 기준 수임건
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

      // B열(문의일) 기준으로 필터링
      const monthInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === currentYear && d.getMonth() === month
      })

      // ⭐ 수임건: 문의 기준 (B열 기준 + Q열 isContract === true)
      const monthContractsFromInquiries = monthInquiries.filter(i => i.isContract)

      // 매출 계산용 (R열 수임일 기준)
      const monthContractsForRevenue = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === currentYear && d.getMonth() === month
      })

      const revenue = monthContractsForRevenue.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)

      return {
        month: monthName,
        inquiries: countInquiries(monthInquiries),
        contracts: monthContractsFromInquiries.length, // ⭐ 문의 기준 수임건
        revenue
      }
    })

    // 분기별 데이터 생성
    const quarterlyData = Array.from({ length: 4 }, (_, index) => {
      const quarter = index
      const quarterName = `${quarter + 1}분기`
      const quarterMonths = [quarter * 3, quarter * 3 + 1, quarter * 3 + 2]

      // B열(문의일) 기준으로 필터링
      const quarterInquiries = inquiries.filter(i => {
        const d = new Date(i.date)
        return d.getFullYear() === currentYear && quarterMonths.includes(d.getMonth())
      })

      // ⭐ 수임건: 문의 기준 (B열 기준 + Q열 isContract === true)
      const quarterContractsFromInquiries = quarterInquiries.filter(i => i.isContract)

      // 매출 계산용 (R열 수임일 기준)
      const quarterContractsForRevenue = contracts.filter(c => {
        const dateToUse = c.contractDate || c.date
        const d = new Date(dateToUse)
        return d.getFullYear() === currentYear && quarterMonths.includes(d.getMonth())
      })

      const revenue = quarterContractsForRevenue.reduce((sum, c) => {
        const amount = parseInt(c.amount?.replace(/[^0-9]/g, '') || '0')
        return sum + amount
      }, 0)

      return {
        quarter: quarterName,
        inquiries: countInquiries(quarterInquiries),
        contracts: quarterContractsFromInquiries.length, // ⭐ 문의 기준 수임건
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
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">연도 선택</CardTitle>
                <CardDescription className="text-xs md:text-sm">조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full text-xs md:text-sm"
                      size="sm"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">월 선택</CardTitle>
                <CardDescription className="text-xs md:text-sm">조회할 월을 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 md:gap-2">
                  {months.map((month) => (
                    <Button
                      key={month}
                      variant={selectedMonth === month ? "default" : "outline"}
                      onClick={() => setSelectedMonth(month)}
                      className="w-full text-xs md:text-sm"
                      size="sm"
                    >
                      {month}월
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{selectedMonthStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {selectedMonth}월
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{selectedMonthStats.totalContracts.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {selectedMonth}월
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">수임율</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">
                    {selectedMonthStats.totalInquiries > 0
                      ? ((selectedMonthStats.totalContracts / selectedMonthStats.totalInquiries) * 100).toFixed(1)
                      : "0.0"}%
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    월 수임율
                  </p>
                </CardContent>
              </Card>

              <RevenueCard
                revenue={selectedMonthStats.revenue}
                label="월 총액"
                isUnlocked={revenueUnlocked}
                password={revenuePassword}
                onPasswordChange={setRevenuePassword}
                onUnlock={handleUnlockRevenue}
              />
            </div>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">월별 일별 추이</CardTitle>
                <CardDescription className="text-xs md:text-sm">문의건 및 수임건 일별 변화</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                  <LineChart data={selectedMonthStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
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
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">연도 선택</CardTitle>
                <CardDescription className="text-xs md:text-sm">조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full text-xs md:text-sm"
                      size="sm"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">분기 선택</CardTitle>
                <CardDescription className="text-xs md:text-sm">조회할 분기를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                  {quarters.map((quarter) => (
                    <Button
                      key={quarter}
                      variant={selectedQuarter === quarter ? "default" : "outline"}
                      onClick={() => setSelectedQuarter(quarter)}
                      className="w-full text-xs md:text-sm"
                      size="sm"
                    >
                      {quarter}분기
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{selectedQuarterStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {selectedQuarterStats.quarterName}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{selectedQuarterStats.totalContracts.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {selectedQuarterStats.quarterName}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">평균 수임율</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{selectedQuarterStats.avgRate.toFixed(1)}%</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    분기 평균
                  </p>
                </CardContent>
              </Card>

              <RevenueCard
                revenue={selectedQuarterStats.totalRevenue}
                label="분기 총액"
                isUnlocked={revenueUnlocked}
                password={revenuePassword}
                onPasswordChange={setRevenuePassword}
                onUnlock={handleUnlockRevenue}
              />
            </div>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">{selectedQuarterStats.quarterName} 월별 실적</CardTitle>
                <CardDescription className="text-xs md:text-sm">월별 비교</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                  <BarChart data={selectedQuarterStats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
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
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">연도 선택</CardTitle>
                <CardDescription className="text-xs md:text-sm">조회할 연도를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      onClick={() => setSelectedYear(year)}
                      className="w-full text-xs md:text-sm"
                      size="sm"
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <div className="text-base md:text-lg font-semibold">{yearlyStats.year}년 전체 실적</div>
            </div>

            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 문의건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{yearlyStats.totalInquiries.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {yearlyStats.year}년
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">총 수임건</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{yearlyStats.totalContracts.toLocaleString()}</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {yearlyStats.year}년
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">평균 수임율</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold">{yearlyStats.avgRate.toFixed(1)}%</div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    연 평균
                  </p>
                </CardContent>
              </Card>

              <RevenueCard
                revenue={yearlyStats.totalRevenue}
                label="연 총액"
                isUnlocked={revenueUnlocked}
                password={revenuePassword}
                onPasswordChange={setRevenuePassword}
                onUnlock={handleUnlockRevenue}
              />
            </div>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">월별 실적</CardTitle>
                <CardDescription className="text-xs md:text-sm">전체 월별 비교</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                  <BarChart data={yearlyStats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar yAxisId="left" dataKey="inquiries" fill="#3b82f6" name="문의건" />
                    <Bar yAxisId="left" dataKey="contracts" fill="#10b981" name="수임건" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">분기별 실적</CardTitle>
                <CardDescription className="text-xs md:text-sm">전체 분기별 비교</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <ResponsiveContainer width="100%" height={280} className="md:!h-[400px]">
                  <BarChart data={yearlyStats.quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
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
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">세부 지표</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          월별, 분기별, 연별 상세 실적을 확인하세요
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
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

      {renderContent()}
    </div>
  )
}