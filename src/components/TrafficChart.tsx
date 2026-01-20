import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrafficData {
  date: string
  inquiry: number
  contract: number
  rate: number
}

interface TrafficChartProps {
  data: TrafficData[]
  isDarkMode?: boolean
}

export function TrafficChart({ data, isDarkMode = false }: TrafficChartProps) {
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>트래픽 개요</CardTitle>
        <CardDescription>
          최근 10개월간의 문의건, 수임건, 수임율 추이
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipItemStyle}
            />
            <Line 
              type="monotone" 
              dataKey="inquiry" 
              stroke="#FF5722" 
              strokeWidth={3}
              name="문의건"
              dot={{ fill: '#FF5722', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="contract" 
              stroke="#4CAF50" 
              strokeWidth={3}
              name="수임건"
              dot={{ fill: '#4CAF50', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#2196F3" 
              strokeWidth={3}
              name="수임율(%)"
              dot={{ fill: '#2196F3', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}