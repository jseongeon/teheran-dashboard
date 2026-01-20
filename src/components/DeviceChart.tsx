import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Button } from "./ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Separator } from "./ui/separator"
import { useState, useMemo } from "react"
import { InquiryData } from "../types"
import { filterByMonth } from "../lib/googleSheets"

interface DeviceChartProps {
  inquiries: InquiryData[]
  isDarkMode?: boolean
}

const COLORS = [
  '#FF5722', // 진한 주황색 - 홈페이지
  '#9C27B0', // 보라색 - 유선
  '#2196F3', // 파란색 - 채팅
  '#FFC107', // 노란색 - 기타
  '#4CAF50'  // 초록색 - 문의건X
]

// 월 이름 배열
const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

export function DeviceChart({ inquiries, isDarkMode = false }: DeviceChartProps) {
  // 각 컴포넌트가 독립적으로 월을 선택할 수 있도록 내부 상태로 관리
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 11, 1)) // ⭐ 2025년 12월로 고정
  const [selectedYear, setSelectedYear] = useState(2025) // 2025년 고정
  const monthName = selectedMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  const currentMonthIndex = selectedMonth.getMonth()
  
  // 연도 목록 생성 (2025년만 표시)
  const availableYears = useMemo(() => {
    return [2025]
  }, [])
  
  // 선택된 월의 데이터만 필터링
  const monthlyInquiries = inquiries.filter(inquiry => {
    const inquiryDate = new Date(inquiry.date)
    return (
      inquiryDate.getFullYear() === selectedMonth.getFullYear() &&
      inquiryDate.getMonth() === selectedMonth.getMonth()
    )
  })

  const receiptTypeCounts: { [key: string]: number } = {}
  
  monthlyInquiries.forEach(inquiry => {
    const type = inquiry.receiptType || '기타'
    receiptTypeCounts[type] = (receiptTypeCounts[type] || 0) + 1
  })

  const data = Object.entries(receiptTypeCounts)
    .map(([type, count]) => ({
      name: type,
      value: count,
      percentage: ((count / monthlyInquiries.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
  
  // 전체 합계
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
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
  
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedYear, monthIndex, 1)
    setSelectedMonth(newDate)
  }
  
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>접수유형별 트래픽</CardTitle>
            <CardDescription>
              {monthName} 접수 채널별 분포
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {monthNames[currentMonthIndex]}
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
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => {
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                  return [`${value}건 (${percentage}%)`, '접수유형']
                }}
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipItemStyle}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            데이터가 없습니다
          </div>
        )}
      </CardContent>
    </Card>
  )
}