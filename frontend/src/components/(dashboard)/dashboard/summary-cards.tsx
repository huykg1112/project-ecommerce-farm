"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VI_AGRICULTURAL } from "@/lib_dashboard/localization/vi";
import { formatCurrency, formatNumber } from "@/lib_dashboard/utils/formatters";
import {
  AlertTriangle,
  Building2,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { memo, useMemo } from "react";

interface SummaryCardsProps {
  newUsers: number;
  newDistributors: number;
  productsSold: number;
  totalRevenue: number;
  timeRange: string;
  userRole?: string;
}

export const SummaryCards = memo<SummaryCardsProps>(
  ({
    newUsers,
    newDistributors,
    productsSold,
    totalRevenue,
    timeRange,
    userRole,
  }) => {
    const cards = useMemo(() => {
      const baseCards = [
        {
          title: `${VI_AGRICULTURAL.stats.totalRevenue} ${timeRange}`,
          value: formatCurrency(totalRevenue),
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
          change: "+23.1%",
        },
        {
          title: `${VI_AGRICULTURAL.products.fields.name} đã bán ${timeRange}`,
          value: formatNumber(productsSold),
          icon: Package,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          change: "+15.7%",
        },
      ];

      if (userRole === "ADMIN") {
        return [
          {
            title: `Người dùng mới ${timeRange}`,
            value: formatNumber(newUsers),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            change: "+12.5%",
          },
          {
            title: `Nhà phân phối mới ${timeRange}`,
            value: formatNumber(newDistributors),
            icon: Building2,
            color: "text-primary-strong",
            bgColor: "bg-primary-light/20",
            change: "+8.3%",
          },
          ...baseCards,
        ];
      } else {
        return [
          ...baseCards,
          {
            title: `${VI_AGRICULTURAL.stats.ordersThisMonth}`,
            value: formatNumber(89),
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            change: "+12.5%",
          },
          {
            title: `${VI_AGRICULTURAL.stats.lowStockItems}`,
            value: formatNumber(3),
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            change: "-1",
          },
        ];
      }
    }, [
      newUsers,
      newDistributors,
      productsSold,
      totalRevenue,
      timeRange,
      userRole,
    ]);

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="card-agricultural hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-agricultural-secondary">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-agricultural-primary mb-1">
                {card.value}
              </div>
              <p className="text-xs text-agricultural-secondary">
                <span className="text-primary-strong font-medium">
                  {card.change}
                </span>{" "}
                so với kỳ trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);

SummaryCards.displayName = "SummaryCards";
