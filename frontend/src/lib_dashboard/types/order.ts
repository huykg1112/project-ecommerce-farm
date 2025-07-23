import { User } from "@/types/entities";
import { BatchProduct } from "./batch-product";

// Order Status Enums
export enum OrderStatusEnum {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  COMPLETED = "COMPLETED",
}

export const OrderStatusLabels = {
  [OrderStatusEnum.PENDING]: "Chờ xác nhận",
  [OrderStatusEnum.CONFIRMED]: "Đã xác nhận",
  [OrderStatusEnum.SHIPPING]: "Đang giao hàng",
  [OrderStatusEnum.DELIVERED]: "Đã giao hàng",
  [OrderStatusEnum.CANCELLED]: "Đã hủy",
  [OrderStatusEnum.RETURNED]: "Đã trả hàng",
  [OrderStatusEnum.FAILED]: "Giao hàng thất bại",
  [OrderStatusEnum.REFUNDED]: "Đã hoàn tiền",
  [OrderStatusEnum.COMPLETED]: "Hoàn thành",
};

export const OrderStatusColors = {
  [OrderStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatusEnum.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatusEnum.SHIPPING]: "bg-purple-100 text-purple-800",
  [OrderStatusEnum.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatusEnum.CANCELLED]: "bg-red-100 text-red-800",
  [OrderStatusEnum.RETURNED]: "bg-orange-100 text-orange-800",
  [OrderStatusEnum.FAILED]: "bg-gray-100 text-gray-800",
  [OrderStatusEnum.REFUNDED]: "bg-pink-100 text-pink-800",
  [OrderStatusEnum.COMPLETED]: "bg-teal-100 text-teal-800",
};

// Core Order interfaces
export interface OrderStatus {
  status_id: string;
  status_name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  payment_method_id: string;
  method_name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderDetail {
  order_detail_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
  batch_product: BatchProduct;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  order_id: string;
  order_code: string;
  user: User;
  distributor: User;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  notes?: string;
  shipping_address?: string;
  estimated_delivery_date?: Date;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  order_details: OrderDetail[];
}

// Filter interfaces
export interface OrderFilters {
  search?: string;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

// Request/Response interfaces
export interface OrderPaginationResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatsResponse {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipping_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  completed_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface UpdateOrderStatusRequest {
  status_id: string;
  notes?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}

// Form data interfaces
export interface OrderFormData {
  user_id: string;
  distributor_id: string;
  payment_method_id: string;
  total_amount: number;
  notes?: string;
  shipping_address?: string;
  estimated_delivery_date?: string;
  order_details: Array<{
    batch_id: string;
    quantity: number;
    unit_price: number;
    notes?: string;
  }>;
}

export interface OrderFormErrors {
  user_id?: string;
  distributor_id?: string;
  payment_method_id?: string;
  total_amount?: string;
  notes?: string;
  shipping_address?: string;
  estimated_delivery_date?: string;
  order_details?: string;
  general?: string;
}

// UI state interfaces
export interface OrderTableColumn {
  order_code: boolean;
  customer: boolean;
  distributor: boolean;
  status: boolean;
  payment_method: boolean;
  total_amount: boolean;
  created_at: boolean;
  actions: boolean;
}

export type OrderViewMode = "table" | "grid" | "list";

// Batch operation interfaces
export interface BatchUpdateStatusRequest {
  order_ids: string[];
  status_id: string;
  notes?: string;
}

export interface BatchOperationResponse {
  message: string;
  success_count: number;
  failed_count: number;
  failed_orders?: string[];
}

export interface CreateOrderDetailDto {
  batch_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}
export interface CreateOrderDto {
  distributor_id: string;
  payment_method_id: string;
  voucher_id?: string;
  total_amount: number;
  notes?: string;
  shipping_address?: string;
  estimated_delivery_date?: string;
  order_details: CreateOrderDetailDto[];
}

export interface VNPayParams {
  amount: number; // giá tiền VND (đã làm tròn, không có số thập phân)
  orderId: string; // mã đơn hàng order_code
  orderInfo: string; // thông tin đơn hàng
  bankCode?: "NCB"; // mã ngân hàng mật định ko đc đổi
}
