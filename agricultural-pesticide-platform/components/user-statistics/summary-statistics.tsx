"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, TrendingUp, Calendar, Activity } from "lucide-react"
import { formatNumber } from "@/lib/utils/formatters"

interface SummaryStatisticsProps {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
  newUsersThisYear: number
  filteredUsersCount: number
}

export const SummaryStatistics = memo<SummaryStatisticsProps>(
  ({ totalUsers, activeUsers, inactiveUsers, newUsersThisMonth, newUsersThisYear, filteredUsersCount }) => {
    const stats = [
      {
        title: "Tổng số người dùng",
        value: formatNumber(totalUsers),
        icon: Users,
        color: "text-[#74a65d]",
        bgColor: "bg-[#accc8b]/20",
        description: "Tất cả người dùng đã đăng ký",
      },
      {
        title: "Người dùng hoạt động",
        value: formatNumber(activeUsers),
        icon: UserCheck,
        color: "text-[#90c577]",
        bgColor: "bg-[#90c577]/20",
        description: "Tài khoản đang hoạt động",
      },
      {
        title: "Tài khoản bị khóa",
        value: formatNumber(inactiveUsers),
        icon: UserX,
        color: "text-red-500",
        bgColor: "bg-red-50",
        description: "Tài khoản tạm thời bị khóa",
      },
      {
        title: "Đăng ký tháng này",
        value: formatNumber(newUsersThisMonth),
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Người dùng mới tháng này",
      },
      {
        title: "Đăng ký năm nay",
        value: formatNumber(newUsersThisYear),
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        description: "Người dùng mới năm nay",
      },
      {
        title: "Kết quả lọc",
        value: formatNumber(filteredUsersCount),
        icon: Activity,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Số người dùng theo bộ lọc",
      },
    ]

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="card-agricultural hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-[#44703d]">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#44703d] mb-1">{stat.value}</div>
              <p className="text-xs text-[#74a65d]">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  },
)

SummaryStatistics.displayName = "SummaryStatistics"
