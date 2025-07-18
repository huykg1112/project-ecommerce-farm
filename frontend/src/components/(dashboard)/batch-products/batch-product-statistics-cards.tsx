"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { useMemo } from "react";

interface BatchProductStatisticsCardsProps {
  batchProducts: BatchProduct[];
  loading?: boolean;
}

export function BatchProductStatisticsCards({
  batchProducts,
  loading = false,
}: BatchProductStatisticsCardsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: batchProducts.length,
      expiringSoon: batchProducts.filter(
        (batch) =>
          new Date(batch.expiry_date).getTime() - now.getTime() <=
            7 * 24 * 60 * 60 * 1000 || new Date(batch.expiry_date) < now
      ).length,
      lowStock: batchProducts.filter(
        (batch) => batch.quantity <= batch.low_stock_threshold
      ).length,
      active: batchProducts.filter((batch) => batch.is_active).length,
      inactive: batchProducts.filter((batch) => !batch.is_active).length,
    };
  }, [batchProducts]);

  const statisticCards = [
    {
      title: "Tổng số lô",
      value: stats.total,
      color: "text-[#74a65d]",
    },
    {
      title: "Sắp hết hạn",
      value: stats.expiringSoon,
      color: "text-red-600",
    },
    {
      title: "Sắp hết hàng",
      value: stats.lowStock,
      color: "text-yellow-600",
    },
    {
      title: "Đang hoạt động",
      value: stats.active,
      color: "text-[#90c577]",
    },
    {
      title: "Không hoạt động",
      value: stats.inactive,
      color: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: statisticCards.length }).map((_, index) => (
          <Card key={index}>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statisticCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#44703d]">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
