"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueStatistics } from "@/lib_dashboard/types/revenue";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface RevenueCardsProps {
  statistics: RevenueStatistics;
  loading?: boolean;
}

export function RevenueCards({ statistics, loading }: RevenueCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng doanh thu",
      value: statistics.totalRevenue,
      unit: "triệu đồng",
      icon: DollarSign,
      change: statistics.revenueChangePercent,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tổng doanh thu trong kỳ",
    },
    {
      title: "Tổng đơn hàng",
      value: statistics.totalOrders,
      unit: "đơn hàng",
      icon: ShoppingCart,
      change: statistics.ordersChangePercent,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Số lượng đơn hàng đã tạo",
    },
    {
      title: "Giá trị TB/đơn",
      value: statistics.averageOrderValue,
      unit: "triệu đồng",
      icon: TrendingUp,
      change: 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Giá trị trung bình mỗi đơn hàng",
    },
    {
      title: "DT hoàn thành",
      value: statistics.completedRevenue,
      unit: "triệu đồng",
      icon: Package,
      change: 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Doanh thu từ đơn hoàn thành",
    },
    {
      title: "DT chờ xử lý",
      value: statistics.pendingRevenue,
      unit: "triệu đồng",
      icon: Users,
      change: 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Doanh thu đơn chờ xử lý",
    },
    {
      title: "DT bị hủy",
      value: statistics.cancelledRevenue,
      unit: "triệu đồng",
      icon: ArrowDown,
      change: 0,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Doanh thu từ đơn bị hủy",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: statistics.conversionRate,
      unit: "%",
      icon: Zap,
      change: 0,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Tỷ lệ đơn hàng hoàn thành",
    },
    {
      title: "Top sản phẩm",
      value: statistics.topProducts.length,
      unit: "sản phẩm",
      icon: TrendingUp,
      change: 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Số sản phẩm bán chạy",
    },
  ];

  const formatValue = (value: number, unit: string) => {
    // Handle NaN and invalid values
    if (isNaN(value) || !isFinite(value)) {
      return "0";
    }

    if (unit === "triệu đồng") {
      return value.toFixed(2);
    }
    if (unit === "%") {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatValue(card.value, card.unit)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{card.unit}</div>
                </div>
                {card.change !== 0 && (
                  <div
                    className={`flex items-center text-xs ${getChangeColor(
                      card.change
                    )}`}
                  >
                    {getChangeIcon(card.change)}
                    <span className="ml-1">
                      {Math.abs(card.change).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
