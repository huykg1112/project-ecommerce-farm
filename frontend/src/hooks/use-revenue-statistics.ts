"use client";

import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import { Order } from "@/lib_dashboard/types/order";
import {
  ChartVisibility,
  RevenueByPaymentMethod,
  RevenueByStatus,
  RevenueByTime,
  RevenueFilters,
  RevenueGrowth,
  RevenueStatistics,
  STATUS_COLORS,
  TopProduct,
} from "@/lib_dashboard/types/revenue";
import { useCallback, useEffect, useMemo, useState } from "react";

const MILLION = 1000000;

export function useRevenueStatistics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RevenueFilters>({
    timeRange: "month",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    revenueByTime: true,
    revenueByStatus: true,
    revenueByPaymentMethod: true,
    topProducts: true,
    growthTrend: true,
  });

  // Fetch orders data
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderServiceManagement.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      // Status filter
      if (filters.status && order.status.status_name !== filters.status) {
        return false;
      }

      // Payment method filter
      if (
        filters.paymentMethod &&
        order.payment_method.method_name !== filters.paymentMethod
      ) {
        return false;
      }

      // Time range filter
      if (
        filters.timeRange === "custom" &&
        filters.dateFrom &&
        filters.dateTo
      ) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        return orderDate >= fromDate && orderDate <= toDate;
      }

      if (filters.timeRange === "year" && filters.year) {
        return orderDate.getFullYear() === filters.year;
      }

      if (filters.timeRange === "month" && filters.year && filters.month) {
        return (
          orderDate.getFullYear() === filters.year &&
          orderDate.getMonth() + 1 === filters.month
        );
      }

      if (filters.timeRange === "day" && filters.dateFrom && filters.dateTo) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        return orderDate >= fromDate && orderDate <= toDate;
      }

      return true;
    });
  }, [orders, filters]);

  // Calculate revenue by time periods
  const revenueByTime = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    const result: RevenueByTime[] = [];

    if (filters.timeRange === "custom" || filters.timeRange === "day") {
      // 12 columns for date range
      if (!filters.dateFrom || !filters.dateTo) return [];

      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      const totalDays =
        Math.ceil(
          (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      const interval = Math.max(1, Math.floor(totalDays / 12));

      for (let i = 0; i < 12; i++) {
        const periodStart = new Date(fromDate);
        periodStart.setDate(fromDate.getDate() + i * interval);
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + interval - 1);

        if (periodEnd > toDate) periodEnd.setTime(toDate.getTime());

        const periodOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= periodStart && orderDate <= periodEnd;
        });

        const revenue =
          periodOrders.reduce((sum, order) => sum + order.total_amount, 0) /
          MILLION;

        result.push({
          period: `${periodStart.getDate()}/${periodStart.getMonth() + 1}`,
          revenue,
          orders: periodOrders.length,
          averageOrder:
            periodOrders.length > 0 ? revenue / periodOrders.length : 0,
          label: `${periodStart.getDate()}/${
            periodStart.getMonth() + 1
          } - ${periodEnd.getDate()}/${periodEnd.getMonth() + 1}`,
        });
      }
    } else if (filters.timeRange === "month") {
      // 10 columns for month periods
      const year = filters.year || new Date().getFullYear();
      const month = filters.month || new Date().getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      const interval = Math.max(1, Math.floor(daysInMonth / 10));

      for (let i = 0; i < 10; i++) {
        const periodStart = new Date(year, month - 1, 1 + i * interval);
        const periodEnd = new Date(
          year,
          month - 1,
          Math.min(daysInMonth, 1 + (i + 1) * interval - 1)
        );

        const periodOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= periodStart && orderDate <= periodEnd;
        });

        const revenue =
          periodOrders.reduce((sum, order) => sum + order.total_amount, 0) /
          MILLION;

        result.push({
          period: `${periodStart.getDate()}-${periodEnd.getDate()}`,
          revenue,
          orders: periodOrders.length,
          averageOrder:
            periodOrders.length > 0 ? revenue / periodOrders.length : 0,
          label: `Ngày ${periodStart.getDate()}-${periodEnd.getDate()}`,
        });
      }
    } else if (filters.timeRange === "year") {
      // 12 columns for 12 months
      const year = filters.year || new Date().getFullYear();

      for (let month = 1; month <= 12; month++) {
        const periodOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return (
            orderDate.getFullYear() === year &&
            orderDate.getMonth() + 1 === month
          );
        });

        const revenue =
          periodOrders.reduce((sum, order) => sum + order.total_amount, 0) /
          MILLION;

        result.push({
          period: `T${month}`,
          revenue,
          orders: periodOrders.length,
          averageOrder:
            periodOrders.length > 0 ? revenue / periodOrders.length : 0,
          label: `Tháng ${month}`,
        });
      }
    }

    return result;
  }, [filteredOrders, filters]);

  // Calculate revenue by status
  const revenueByStatus = useMemo(() => {
    const statusMap = new Map<string, { revenue: number; orders: number }>();
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    filteredOrders.forEach((order) => {
      const status = order.status.status_name;
      const current = statusMap.get(status) || { revenue: 0, orders: 0 };
      statusMap.set(status, {
        revenue: current.revenue + order.total_amount,
        orders: current.orders + 1,
      });
    });

    const result: RevenueByStatus[] = [];
    statusMap.forEach((data, status) => {
      result.push({
        status,
        revenue: data.revenue / MILLION,
        orders: data.orders,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280",
      });
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Calculate revenue by payment method
  const revenueByPaymentMethod = useMemo(() => {
    const paymentMap = new Map<string, { revenue: number; orders: number }>();
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    filteredOrders.forEach((order) => {
      const method = order.payment_method.method_name;
      const current = paymentMap.get(method) || { revenue: 0, orders: 0 };
      paymentMap.set(method, {
        revenue: current.revenue + order.total_amount,
        orders: current.orders + 1,
      });
    });

    const result: RevenueByPaymentMethod[] = [];
    paymentMap.forEach((data, method) => {
      result.push({
        method,
        revenue: data.revenue / MILLION,
        orders: data.orders,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      });
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Calculate top products
  const topProducts = useMemo(() => {
    const productMap = new Map<string, TopProduct>();

    filteredOrders.forEach((order) => {
      if (order.order_details) {
        order.order_details.forEach((detail) => {
          const productId =
            detail.batch_product?.product?.product_id || "unknown";
          const productName =
            detail.batch_product?.product?.product_name ||
            "Sản phẩm không xác định";
          const current = productMap.get(productId) || {
            productId,
            productName,
            revenue: 0,
            quantity: 0,
            orders: 0,
          };

          productMap.set(productId, {
            ...current,
            revenue: current.revenue + detail.unit_price * detail.quantity,
            quantity: current.quantity + detail.quantity,
            orders: current.orders + 1,
          });
        });
      }
    });

    return Array.from(productMap.values())
      .map((product) => ({
        ...product,
        revenue: product.revenue / MILLION,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  // Calculate revenue growth (compare with previous period)
  const revenueGrowth = useMemo(() => {
    // This would require comparing current period with previous period
    // For now, return empty array - can be implemented based on specific requirements
    const result: RevenueGrowth[] = [];
    return result;
  }, [filteredOrders, filters]);

  // Calculate main statistics
  const statistics = useMemo(() => {
    const totalRevenue =
      filteredOrders.reduce((sum, order) => sum + order.total_amount, 0) /
      MILLION;
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const completedOrders = filteredOrders.filter(
      (order) =>
        order.status.status_name === "COMPLETED" ||
        order.status.status_name === "DELIVERED"
    );
    const completedRevenue =
      completedOrders.reduce((sum, order) => sum + order.total_amount, 0) /
      MILLION;

    const pendingOrders = filteredOrders.filter(
      (order) =>
        order.status.status_name === "PENDING" ||
        order.status.status_name === "CONFIRMED"
    );
    const pendingRevenue =
      pendingOrders.reduce((sum, order) => sum + order.total_amount, 0) /
      MILLION;

    const cancelledOrders = filteredOrders.filter(
      (order) =>
        order.status.status_name === "CANCELLED" ||
        order.status.status_name === "FAILED"
    );
    const cancelledRevenue =
      cancelledOrders.reduce((sum, order) => sum + order.total_amount, 0) /
      MILLION;

    const conversionRate =
      totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

    const result: RevenueStatistics = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completedRevenue,
      pendingRevenue,
      cancelledRevenue,
      revenueByTime,
      revenueByStatus,
      revenueByPaymentMethod,
      topProducts,
      revenueGrowth,
      filteredOrders,
      revenueChangePercent: 0, // Would need previous period data
      ordersChangePercent: 0, // Would need previous period data
      conversionRate,
    };

    return result;
  }, [
    filteredOrders,
    revenueByTime,
    revenueByStatus,
    revenueByPaymentMethod,
    topProducts,
    revenueGrowth,
  ]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<RevenueFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      timeRange: "month",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
  }, []);

  // Toggle chart visibility
  const toggleChartVisibility = useCallback((chart: keyof ChartVisibility) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chart]: !prev[chart],
    }));
  }, []);

  return {
    orders,
    loading,
    filters,
    chartVisibility,
    statistics,
    updateFilters,
    resetFilters,
    toggleChartVisibility,
    refetch: fetchOrders,
  };
}
