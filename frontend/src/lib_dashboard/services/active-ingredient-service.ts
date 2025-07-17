import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { ActiveIngredientFormData } from "../store/active-ingredient-store";
import { axiosInstance } from "./axios-instance";

export interface CreateActiveIngredientRequest {
  ingredient_name: string;
  description?: string;
  hazard_level?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  is_active?: boolean;
}

export interface UpdateActiveIngredientRequest {
  ingredient_name?: string;
  description?: string;
  hazard_level?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  is_active?: boolean;
}

class ActiveIngredientService {
  async list() {
    try {
      const response = await axiosInstance.get("/active-ingredient");
      const result = response.data;

      // Apply client-side filtering if needed

      return result;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách hoạt chất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  }

  async findOne(id: string) {
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
  }

  async create(payload: ActiveIngredientFormData) {
    try {
      const data: CreateActiveIngredientRequest = {
        ingredient_name: payload.ingredient_name,
        description: payload.description,
        hazard_level: payload.hazard_level,
        is_active: payload.is_active,
      };

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
  }

  async update(id: string, payload: ActiveIngredientFormData) {
    try {
      const data: UpdateActiveIngredientRequest = {
        ingredient_name: payload.ingredient_name,
        description: payload.description,
        hazard_level: payload.hazard_level,
        is_active: payload.is_active,
      };

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
  }

  async remove(id: string) {
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
  }

  async toggle(id: string) {
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
  }

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
  }

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
  }
}

export const activeIngredientService = new ActiveIngredientService();
