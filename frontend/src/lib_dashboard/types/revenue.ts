import { Order } from "./order";

export interface RevenueFilters {
  timeRange: "custom" | "month" | "year" | "day";
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  paymentMethod?: string;
  year?: number;
  month?: number;
}

export interface RevenueByTime {
  period: string;
  revenue: number;
  orders: number;
  averageOrder: number;
  label: string;
}

export interface RevenueByStatus {
  status: string;
  revenue: number;
  orders: number;
  percentage: number;
  color: string;
}

export interface RevenueByPaymentMethod {
  method: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface RevenueGrowth {
  period: string;
  current: number;
  previous: number;
  growth: number;
  growthPercentage: number;
}

export interface RevenueStatistics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedRevenue: number;
  pendingRevenue: number;
  cancelledRevenue: number;
  revenueByTime: RevenueByTime[];
  revenueByStatus: RevenueByStatus[];
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  topProducts: TopProduct[];
  revenueGrowth: RevenueGrowth[];
  filteredOrders: Order[];
  // Comparative metrics
  revenueChangePercent: number;
  ordersChangePercent: number;
  conversionRate: number;
}

export interface ChartVisibility {
  revenueByTime: boolean;
  revenueByStatus: boolean;
  revenueByPayment: boolean;
  topProducts: boolean;
  growthTrend: boolean;
}

export const STATUS_COLORS = {
  PENDING: "#fbbf24",
  CONFIRMED: "#3b82f6",
  SHIPPING: "#8b5cf6",
  DELIVERED: "#10b981",
  COMPLETED: "#059669",
  CANCELLED: "#ef4444",
  RETURNED: "#f97316",
  FAILED: "#dc2626",
  REFUNDED: "#6b7280",
} as const;

export const PAYMENT_METHOD_COLORS = {
  COD: "#f97316",
  VNPAY: "#3b82f6",
  BANK_TRANSFER: "#10b981",
  CASH: "#fbbf24",
} as const;
