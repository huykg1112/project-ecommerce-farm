"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/lib_dashboard/types/order";
import {
  CheckCircle,
  ClipboardCheck,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

interface OrderStatisticsCardsProps {
  orders: Order[];
  loading?: boolean;
}

export function OrderStatisticsCards({
  orders,
  loading = false,
}: OrderStatisticsCardsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    return {
      pending: orders.filter((order) => order.status.status_name === "PENDING")
        .length,
      confirmed: orders.filter(
        (order) => order.status.status_name === "CONFIRMED"
      ).length,
      shipping: orders.filter(
        (order) => order.status.status_name === "SHIPPING"
      ).length,
      delivered: orders.filter(
        (order) => order.status.status_name === "DELIVERED"
      ).length,
      completed: orders.filter(
        (order) => order.status.status_name === "COMPLETED"
      ).length,
      others: orders.filter((order) =>
        ["CANCELLED", "RETURNED", "FAILED", "REFUNDED"].includes(
          order.status.status_name
        )
      ).length,
    };
  }, [orders]);

  const statisticCards = [
    {
      title: "Chờ xác nhận",
      value: stats.pending,
      color: "text-yellow-600",
      icon: <Loader2 className="h-5 w-5 text-yellow-600" />,
    },
    {
      title: "Đã xác nhận",
      value: stats.confirmed,
      color: "text-[#74a65d]",
      icon: <CheckCircle className="h-5 w-5 text-[#74a65d]" />,
    },
    {
      title: "Đang giao",
      value: stats.shipping,
      color: "text-blue-600",
      icon: <Truck className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Đã giao",
      value: stats.delivered,
      color: "text-purple-600",
      icon: <Package className="h-5 w-5 text-purple-600" />,
    },
    {
      title: "Hoàn thành",
      value: stats.completed,
      color: "text-[#44703d]",
      icon: <ClipboardCheck className="h-5 w-5 text-[#44703d]" />,
    },
    {
      title: "Hủy hoặc hoàn tiền",
      value: stats.others,
      color: "text-red-600",
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: statisticCards.length }).map((_, index) => (
          <Card key={index} className="border-[#accc8b]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statisticCards.map((card, index) => (
        <Card
          key={index}
          className="border-[#accc8b]/30 bg-white hover:bg-[#90c577]/10 hover:shadow-md hover:border-[#74a65d] transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="transform transition-transform duration-200 group-hover:scale-110">
                {card.icon}
              </div>
              <CardTitle className="text-sm font-medium text-[#44703d]">
                {card.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${card.color} transform transition-transform duration-200 group-hover:scale-105`}
            >
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
