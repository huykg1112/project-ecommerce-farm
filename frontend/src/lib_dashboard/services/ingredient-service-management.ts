import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { axiosInstance } from "./axios-instance";

export interface CreateIngredientRequest {
  ingredient_name: string;
  description?: string;
  hazard_level?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  is_active?: boolean;
}

export interface UpdateIngredientRequest {
  ingredient_name?: string;
  description?: string;
  hazard_level?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  is_active?: boolean;
}

export const ingredientServiceManagement = {
  async getIngredients() {
    try {
      const response = await axiosInstance.get("/active-ingredient");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getIngredientById(id: string) {
    try {
      const response = await axiosInstance.get(`/active-ingredient/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createIngredient(data: CreateIngredientRequest) {
    try {
      const response = await axiosInstance.post("/active-ingredient", data);
      showToast.success("Tạo hoạt chất thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateIngredient(id: string, data: UpdateIngredientRequest) {
    try {
      const response = await axiosInstance.patch(
        `/active-ingredient/${id}`,
        data
      );
      showToast.success("Cập nhật hoạt chất thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateIngredientStatus(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/active-ingredient/${id}/update-status`
      );
      showToast.success("Cập nhật trạng thái thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteIngredient(id: string) {
    try {
      const response = await axiosInstance.delete(`/active-ingredient/${id}`);
      showToast.success("Xóa hoạt chất thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchToggleStatus(ingredientIds: string[]) {
    try {
      const response = await axiosInstance.patch(
        "/active-ingredient/batch-toggle-status",
        {
          ingredientIds,
        }
      );
      showToast.success("Cập nhật trạng thái hàng loạt thành công");
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

  async getProductsForIngredient(id: string) {
    try {
      const response = await axiosInstance.get(
        `/active-ingredient/${id}/products`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
