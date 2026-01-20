import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "./ui/utils"

interface MetricCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon?: React.ReactNode
}

export function MetricCard({ title, value, change, changeLabel, icon }: MetricCardProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold">{value}</div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {isPositive && <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />}
              {isNegative && <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500 mr-1" />}
              <span
                className={cn(
                  "text-base md:text-xl font-semibold",
                  isPositive && "text-green-500",
                  isNegative && "text-red-500",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
              >
                {change > 0 ? "+" : ""}{change}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">{changeLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}