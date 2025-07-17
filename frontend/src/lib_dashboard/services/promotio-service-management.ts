import { showToast } from "@/lib/toast-provider";
import {
  CreatePromotionResponse,
  Promotion as PromotionInterface,
  UpdatePromotionRequest,
} from "@/lib_dashboard/types/promotion";
import axios from "axios";
import { axiosInstance } from "./axios-instance";

export const promotionService = {
  async getPromotions(): Promise<PromotionInterface[]> {
    try {
      const response = await axiosInstance.get("/promotion");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getPromotionById(id: string): Promise<PromotionInterface> {
    try {
      const response = await axiosInstance.get(`/promotion/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy khuyến mãi theo ID";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createPromotion(
    data: CreatePromotionResponse
  ): Promise<PromotionInterface> {
    try {
      let response;
      // kiểm tra có batch_product_ids không nếu có thì call Api /promotion, nếu không thì call Api /promotion/nobatch
      if (!data.batch_product_ids || data.batch_product_ids.length === 0) {
        response = await axiosInstance.post("/promotion/nobatch", data);
      } else {
        response = await axiosInstance.post("/promotion", data);
      }
      showToast.success("Tạo khuyến mãi thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updatePromotion(
    id: string,
    data: Partial<UpdatePromotionRequest>
  ): Promise<PromotionInterface> {
    try {
      // kiểm tra có batch_product_ids không nếu có thì call Api /promotion, nếu không thì call Api /promotion/nobatch
      let response;
      if (!data.batch_product_ids || data.batch_product_ids.length === 0) {
        response = await axiosInstance.patch(`/promotion/${id}/nobatch`, data);
      } else {
        response = await axiosInstance.patch(`/promotion/${id}`, data);
      }
      showToast.success("Cập nhật khuyến mãi thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deletePromotion(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/promotion/${id}`);
      showToast.success("Xóa khuyến mãi thành công");
    } catch (error) {
      let msg = "Lỗi khi xóa khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async togglePromotionStatus(id: string): Promise<PromotionInterface> {
    try {
      const response = await axiosInstance.patch(`/promotion/${id}/toggle`);
      showToast.success("Thay đổi trạng thái khuyến mãi thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi thay đổi trạng thái khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async addBatchProductsToPromotion(
    id: string,
    batchProductIds: string[]
  ): Promise<PromotionInterface> {
    try {
      const response = await axiosInstance.post(
        `/promotion/${id}/batch-product`,
        { batch_product_ids: batchProductIds }
      );
      showToast.success("Thêm sản phẩm vào khuyến mãi thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi thêm sản phẩm vào khuyến mãi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getPromotionsByDistributor(
    distributorId: string
  ): Promise<PromotionInterface[]> {
    try {
      const response = await axiosInstance.get("/promotion/distributor", {
        params: { distributor_id: distributorId },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy khuyến mãi theo nhà phân phối";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
