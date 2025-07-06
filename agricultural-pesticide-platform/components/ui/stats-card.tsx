import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: "up" | "down" | "neutral"
}

export const StatsCard = memo<StatsCardProps>(({ title, value, change, icon: Icon, trend }) => {
  const trendColor = {
    up: "text-primary-strong",
    down: "text-red-500",
    neutral: "text-primary-dark",
  }[trend]

  return (
    <Card className="card-agricultural hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-agricultural-secondary">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary-strong" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-agricultural-primary mb-1">{value}</div>
        <p className="text-xs text-agricultural-secondary">
          <span className={`font-medium ${trendColor}`}>{change}</span> so với tháng trước
        </p>
      </CardContent>
    </Card>
  )
})

StatsCard.displayName = "StatsCard"
