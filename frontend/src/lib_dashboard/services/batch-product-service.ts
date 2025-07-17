import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  BatchOperationResponse,
  BatchProduct,
  BatchProductFilters,
  BatchProductPaginationResponse,
  BatchProductStats,
  BatchToggleStatusRequest,
  CreateBatchProductDto,
  UpdateBatchProductDto,
} from "../types/batch-product";
import { axiosInstance } from "./axios-instance";

export const batchProductService = {
  // === CRUD Operations ===

  async getBatchProducts(
    filters?: BatchProductFilters
  ): Promise<BatchProductPaginationResponse> {
    try {
      const response = await axiosInstance.get("/batch-product", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getBatchProductById(id: string): Promise<BatchProduct> {
    try {
      const response = await axiosInstance.get(`/batch-product/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createBatchProduct(data: CreateBatchProductDto): Promise<BatchProduct> {
    try {
      const response = await axiosInstance.post("/batch-product", data);
      showToast.success("Tạo lô sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateBatchProduct(
    id: string,
    data: Partial<UpdateBatchProductDto>
  ): Promise<BatchProduct> {
    try {
      const response = await axiosInstance.patch(`/batch-product/${id}`, data);
      showToast.success("Cập nhật lô sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteBatchProduct(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/batch-product/${id}`);
      showToast.success("Xóa lô sản phẩm thành công!");
    } catch (error) {
      let msg = "Lỗi khi xóa lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Batch Operations ===

  async batchUpdateBatchProducts(
    updateDatas: Partial<UpdateBatchProductDto>[]
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch("/batch-product", updateDatas);
      showToast.success("Cập nhật nhiều lô sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật nhiều lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchToggleStatus(
    request: BatchToggleStatusRequest
  ): Promise<BatchOperationResponse> {
    try {
      const updates = request.batch_ids.map((batch_id) => ({
        batch_id,
        is_active: request.is_active,
      }));
      
      const response = await axiosInstance.patch("/batch-product", updates);
      const statusText = request.is_active ? "kích hoạt" : "vô hiệu hóa";
      showToast.success(`${statusText} ${request.batch_ids.length} lô sản phẩm thành công!`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi thay đổi trạng thái lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Special Features ===

  async getExpiringSoonBatches(days: number = 7): Promise<BatchProduct[]> {
    try {
      const response = await axiosInstance.get("/batch-product/expiring-soon", {
        params: { days },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách lô sản phẩm sắp hết hạn";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getLowStockBatches(): Promise<BatchProduct[]> {
    try {
      const response = await axiosInstance.get("/batch-product/low-stock");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách lô sản phẩm sắp hết hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async decreaseQuantity(batchId: string, amount: number): Promise<BatchProduct> {
    try {
      const response = await axiosInstance.patch(
        `/batch-product/${batchId}/decrease-quantity`,
        { amount }
      );
      showToast.success("Giảm số lượng thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi giảm số lượng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Statistics ===

  async getBatchProductStats(): Promise<BatchProductStats> {
    try {
      const allBatches = await this.getBatchProducts({ limit: 1000 });
      const batches = allBatches.data;

      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const stats: BatchProductStats = {
        totalBatches: batches.length,
        activeBatches: batches.filter(b => b.is_active).length,
        expiringSoonBatches: batches.filter(
          b => b.is_active && new Date(b.expiry_date) <= sevenDaysFromNow
        ).length,
        lowStockBatches: batches.filter(
          b => b.is_active && b.quantity <= b.low_stock_threshold
        ).length,
        totalQuantity: batches.reduce((sum, b) => sum + (b.is_active ? b.quantity : 0), 0),
        averageQuantity: 0,
      };

      const activeBatches = batches.filter(b => b.is_active);
      stats.averageQuantity = activeBatches.length > 0 
        ? Math.round(stats.totalQuantity / activeBatches.length)
        : 0;

      return stats;
    } catch (error) {
      let msg = "Lỗi khi lấy thống kê lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Search ===

  async searchBatchProducts(query: string): Promise<BatchProduct[]> {
    try {
      const response = await this.getBatchProducts({
        search: query,
        limit: 50,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm kiếm lô sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};