import { showToast } from "@/lib/toast-provider";
import { getCookie } from "@/lib/utils";
import { OrderStatus } from "@/types/entities";
import axios from "axios";
import {
  BatchOperationResponse,
  BatchUpdateStatusRequest,
  CreateOrderDto,
  Order,
  PaymentMethod,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  VNPayParams,
} from "../types/order";
import { axiosInstance } from "./axios-instance";

const userId = getCookie("user_id");
const user = JSON.parse(getCookie("user") || "{}");

export const orderServiceManagement = {
  // === CRUD Operations ===

  // chỉ dùng cho admin, hoặc distributor lấy tất cả đơn hàng
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get("/order");
      console.log("Fetched Orders:", response.data);
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
  // async getAllMyOrders(userId: string): Promise<Order[]> {}

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

  // dùng cho role client để lấy đơn hàng của người dùng
  async getOrdersByUser(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/order/my-orders`);
      console.log("Fetched User Orders:", response.data);
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

  // tạo đơn hàng mới
  async createOrder(
    data: CreateOrderDto
  ): Promise<{ message: string; data: Order }> {
    try {
      const response = await axiosInstance.post("/order", data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo đơn hàng";
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
      return response.data.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách trạng thái đơn hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Payment Methods Operations ===

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await axiosInstance.get("/payment-method");
      console.log("Payment Methods:", response.data);
      return response.data.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách phương thức thanh toán";
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
      const response = await axiosInstance.patch(
        `/order/${orderId}/status`,
        data
      );
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

  async confirmOrder(
    orderId: string,
    notes?: string
  ): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axiosInstance.patch(`/order/${orderId}/confirm`, {
        notes,
      });
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

  async cancelOrder(
    orderId: string,
    notes?: string
  ): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axiosInstance.patch(`/order/${orderId}/cancel`, {
        notes,
      });
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
      const response = await axiosInstance.patch(
        "/order/batch-status",
        request
      );
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

  // === VNPay Operations ===
  async createVNPayParams(params: VNPayParams): Promise<string> {
    try {
      const response = await axiosInstance.post(
        "payment/vnpay/create-payment-url",
        params
      );
      console.log("VNPay Payment URL:", response.data);
      return response.data.data.paymentUrl;
    } catch (error) {
      let msg = "Lỗi khi tạo tham số VNPay";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async isOrderbyProduct(productId: string): Promise<boolean> {
    if (!userId || !productId || !user) {
      return false;
    } else {
      console.log(
        "Checking order by product for user:",
        userId,
        "and product:",
        productId,
        user
      );
    }
    try {
      const response = await axiosInstance.get(
        `/order/check-product/${productId}`
      );
      return response.data.data;
    } catch (error) {
      let msg = "Lỗi khi kiểm tra đơn hàng theo sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
