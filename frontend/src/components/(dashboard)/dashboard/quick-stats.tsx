"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib_dashboard/utils/formatters";
import { Building2, Clock, Package, Users } from "lucide-react";
import { memo, useMemo } from "react";

interface QuickStatsProps {
  stats: {
    activeUsers: number;
    activeDistributors: number;
    totalProducts: number;
    pendingOrders: number;
  };
}

export const QuickStats = memo<QuickStatsProps>(({ stats }) => {
  const quickStats = useMemo(
    () => [
      {
        label: "Người dùng hoạt động",
        value: stats.activeUsers,
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Nhà phân phối hoạt động",
        value: stats.activeDistributors,
        icon: Building2,
        color: "text-primary-strong",
        bgColor: "bg-primary-light/20",
      },
      {
        label: "Tổng sản phẩm",
        value: stats.totalProducts,
        icon: Package,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        label: "Đơn hàng chờ xử lý",
        value: stats.pendingOrders,
        icon: Clock,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
    ],
    [stats]
  );

  return (
    <Card className="card-agricultural">
      <CardHeader>
        <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
          ⚡ Tổng quan nhanh
        </CardTitle>
        <p className="text-sm text-agricultural-secondary">
          Các chỉ số quan trọng của hệ thống
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-primary-light/30 hover:bg-primary-light/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-agricultural-primary">
                  {stat.label}
                </span>
              </div>
              <span className="text-lg font-bold text-agricultural-primary">
                {formatNumber(stat.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

QuickStats.displayName = "QuickStats";
