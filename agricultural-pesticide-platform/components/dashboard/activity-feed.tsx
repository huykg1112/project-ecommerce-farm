"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Package, ShoppingCart, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface Activity {
  id: string
  type: "user" | "distributor" | "product" | "order"
  message: string
  timestamp: Date
  user?: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export const ActivityFeed = memo<ActivityFeedProps>(({ activities }) => {
  const getActivityConfig = useMemo(
    () => (type: Activity["type"]) => {
      const configs = {
        user: { icon: Users, color: "bg-blue-50 text-blue-600 border-blue-200" },
        distributor: { icon: Building2, color: "bg-primary-light/20 text-primary-strong border-primary-light" },
        product: { icon: Package, color: "bg-orange-50 text-orange-600 border-orange-200" },
        order: { icon: ShoppingCart, color: "bg-green-50 text-green-600 border-green-200" },
      }
      return configs[type] || { icon: Clock, color: "bg-gray-50 text-gray-600 border-gray-200" }
    },
    [],
  )

  return (
    <Card className="card-agricultural">
      <CardHeader>
        <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
          🔔 Hoạt động gần đây
        </CardTitle>
        <p className="text-sm text-agricultural-secondary">Theo dõi các hoạt động mới nhất trên hệ thống</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => {
            const { icon: Icon, color } = getActivityConfig(activity.type)

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-light/10 transition-colors"
              >
                <div className={`p-2 rounded-full ${color} border`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-agricultural-primary font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-agricultural-secondary">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                    {activity.user && (
                      <Badge variant="outline" className="text-xs">
                        {activity.user}
                      </Badge>
                    )}
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-6 mt-12 w-px h-4 bg-primary-light/30" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
})

ActivityFeed.displayName = "ActivityFeed"
