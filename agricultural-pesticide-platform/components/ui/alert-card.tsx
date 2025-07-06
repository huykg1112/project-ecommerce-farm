import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface AlertItem {
  id: string
  title: string
  subtitle: string
  value: string
  threshold?: string
  variant: "destructive" | "warning" | "default"
}

interface AlertCardProps {
  title: string
  description: string
  icon: LucideIcon
  items: AlertItem[]
  valueLabel: string
}

export const AlertCard = memo<AlertCardProps>(({ title, description, icon: Icon, items, valueLabel }) => {
  return (
    <Card className="card-agricultural border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-agricultural-primary">
          <Icon className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
        <p className="text-sm text-agricultural-secondary">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border border-orange-100 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors"
            >
              <div>
                <h4 className="font-semibold text-agricultural-primary">{item.title}</h4>
                <p className="text-sm text-agricultural-secondary">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <Badge variant={item.variant} className="mb-1">
                  {item.threshold ? `${item.value} / ${item.threshold}` : item.value}
                </Badge>
                <p className="text-xs text-agricultural-secondary">{valueLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

AlertCard.displayName = "AlertCard"
