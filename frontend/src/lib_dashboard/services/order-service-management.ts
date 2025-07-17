import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  BatchOperationResponse,
  BatchUpdateStatusRequest,
  Order,
  OrderFilters,
  OrderPaginationResponse,
  OrderStatsResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "../types/order";
import { axiosInstance } from "./axios-instance";

export const orderServiceManagement = {
  // === CRUD Operations ===

  async getAllOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const response = await axiosInstance.get("/order", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await axiosInstance.get(`/order/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/order/my-orders`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách đơn hàng của người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getOrdersByDistributor(distributorId: string): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/order/distributor-orders`, {
        params: { distributor_id: distributorId },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách đơn hàng của nhà phân phối";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Order Status Operations ===

  async getOrderStatuses(): Promise<OrderStatus[]> {
    try {
      const response = await axiosInstance.get("/order-status");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách trạng thái đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Status Management ===

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axiosInstance.patch(`/order/${orderId}/status`, data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async confirmOrder(orderId: string, notes?: string): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axiosInstance.patch(`/order/${orderId}/confirm`, { notes });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xác nhận đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async cancelOrder(orderId: string, notes?: string): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axiosInstance.patch(`/order/${orderId}/cancel`, { notes });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi hủy đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Batch Operations ===

  async batchUpdateStatus(
    request: BatchUpdateStatusRequest
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch("/order/batch-status", request);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchConfirmOrders(
    orderIds: string[],
    notes?: string
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch("/order/batch-confirm", {
        order_ids: orderIds,
        notes,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xác nhận đơn hàng hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchCancelOrders(
    orderIds: string[],
    notes?: string
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch("/order/batch-cancel", {
        order_ids: orderIds,
        notes,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi hủy đơn hàng hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Statistics ===

  async getOrderStats(
    distributorId?: string,
    fromDate?: string,
    toDate?: string
  ): Promise<OrderStatsResponse> {
    try {
      const response = await axiosInstance.get("/order/statistics", {
        params: { distributorId, fromDate, toDate },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thống kê đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Export ===

  async exportOrders(filters?: OrderFilters): Promise<Blob> {
    try {
      const response = await axiosInstance.get("/order/export", {
        params: filters,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xuất dữ liệu đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};