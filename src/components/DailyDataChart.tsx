import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Button } from "./ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Separator } from "./ui/separator"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { useState, useMemo } from "react"
import { InquiryData, ContractData } from "../types"
import { filterByMonth } from "../lib/googleSheets"

interface DailyDataChartProps {
  inquiries: InquiryData[]
  contracts: ContractData[]
  isDarkMode?: boolean
}

type MetricType = '문의건' | '수임건' | '수임율'

// 월 이름 배열
const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

export function DailyDataChart({ inquiries, contracts, isDarkMode = false }: DailyDataChartProps) {
  const [metricType, setMetricType] = useState<MetricType>('문의건')
  // 각 컴포넌트가 독립적으로 월을 선택할 수 있도록 내부 상태로 관리
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 11, 1)) // ⭐ 2025년 12월로 고정
  const [selectedYear, setSelectedYear] = useState(2025) // ⭐ 2025년 고정
  const monthName = selectedMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  const currentMonthIndex = selectedMonth.getMonth()
  
  // 연도 목록 생성 (2025년만 표시)
  const availableYears = useMemo(() => {
    return [2025] // ⭐ 2026년 제외
  }, [])
  
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedYear, monthIndex, 1)
    setSelectedMonth(newDate)
  }
  
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    const newDate = new Date(year, currentMonthIndex, 1)
    setSelectedMonth(newDate)
  }
  
  // 선택한 월의 데이터 필터링
  const monthlyInquiries = useMemo(() => 
    filterByMonth(inquiries, selectedMonth.getFullYear(), selectedMonth.getMonth()),
    [inquiries, selectedMonth]
  )
  
  const monthlyContracts = useMemo(() => 
    filterByMonth(contracts, selectedMonth.getFullYear(), selectedMonth.getMonth()),
    [contracts, selectedMonth]
  )
  
  // 일자별 데이터 생성
  const dailyData = useMemo(() => {
    console.log('📅 일자별 데이터 계산 시작')
    console.log('  - 선택한 월:', selectedMonth.toLocaleDateString('ko-KR'))
    console.log('  - 문의건 수:', monthlyInquiries.length)
    console.log('  - 수임건 수:', monthlyContracts.length)
    
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // 일자별 카운트 초기화 (1일~31일)
    const inquiryCounts = new Array(daysInMonth).fill(0)
    const contractCounts = new Array(daysInMonth).fill(0)
    
    // 문의건을 일자별로 집계
    monthlyInquiries.forEach((inquiry) => {
      const date = new Date(inquiry.date)
      const day = date.getDate() // 1~31
      if (day >= 1 && day <= daysInMonth) {
        inquiryCounts[day - 1]++
      }
    })
    
    // ⭐ 수임건: 문의 기준 (B열 문의날짜로 필터링 + Q열 TRUE)
    const monthlyContractsFromInquiries = monthlyInquiries.filter(i => i.isContract)
    console.log('  - 수임건 (문의 기준):', monthlyContractsFromInquiries.length, '건')
    
    // 수임건을 일자별로 집계 (문의날짜 기준)
    monthlyContractsFromInquiries.forEach((inquiry) => {
      const date = new Date(inquiry.date)
      const day = date.getDate()
      if (day >= 1 && day <= daysInMonth) {
        contractCounts[day - 1]++
      }
    })
    
    console.log('  - 일자별 문의건 집계:', inquiryCounts)
    console.log('  - 일자별 수임건 집계:', contractCounts)
    
    // 차트 데이터 형식으로 변환
    const inquiryData = Array.from({ length: daysInMonth }, (_, index) => ({
      day: (index + 1).toString(),
      value: inquiryCounts[index]
    }))
    
    const contractData = Array.from({ length: daysInMonth }, (_, index) => ({
      day: (index + 1).toString(),
      value: contractCounts[index]
    }))
    
    // 수임율 계산
    const rateData = Array.from({ length: daysInMonth }, (_, index) => {
      const rate = inquiryCounts[index] > 0 
        ? (contractCounts[index] / inquiryCounts[index] * 100)
        : 0
      return {
        day: (index + 1).toString(),
        value: parseFloat(rate.toFixed(1))
      }
    })
    
    console.log('✅ 일자별 데이터 생성 완료')
    
    return {
      문의건: inquiryData,
      수임건: contractData,
      수임율: rateData
    }
  }, [monthlyInquiries, monthlyContracts, selectedMonth])
  
  const chartData = dailyData[metricType]
  
  // 최대값 찾기
  const maxValue = Math.max(...chartData.map(d => d.value))
  
  const getMetricLabel = () => {
    switch (metricType) {
      case '문의건': return '문의 건수'
      case '수임건': return '수임 건수'
      case '수임율': return '수임율 (%)'
      default: return '건수'
    }
  }
  
  const getMetricUnit = () => {
    return metricType === '수임율' ? '%' : '건'
  }
  
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
  
  return (
    <Card className="col-span-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>일자별 데이터</CardTitle>
            <CardDescription>
              {monthName} 일별 {getMetricLabel()} 분포
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={metricType} onValueChange={(value) => value && setMetricType(value as MetricType)} size="sm">
              <ToggleGroupItem value="문의건" aria-label="문의건">
                문의건
              </ToggleGroupItem>
              <ToggleGroupItem value="수임건" aria-label="수임건">
                수임건
              </ToggleGroupItem>
              <ToggleGroupItem value="수임율" aria-label="수임율">
                수임율
              </ToggleGroupItem>
            </ToggleGroup>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedYear}년 {monthNames[currentMonthIndex]}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-3">
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
                  <div>
                    <h4 className="font-medium text-sm mb-2">월 선택</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {monthNames.map((month, index) => (
                        <Button
                          key={month}
                          variant={currentMonthIndex === index ? "default" : "ghost"}
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{ value: '일', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value}${getMetricUnit()}`, metricType]}
              labelFormatter={(label) => `${selectedMonth.getMonth() + 1}월 ${label}일`}
              itemStyle={tooltipItemStyle}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value === maxValue && maxValue > 0 ? '#f59e0b' : '#d1d5db'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}