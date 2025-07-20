import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";
import { axiosInstance } from "./axios-instance";

export const categoryServiceManagement = {
  async getCategories() {
    try {
      const response = await axiosInstance.get(`/category`);
      // console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async getCategoryById(id: string) {
    try {
      const response = await axiosInstance.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getCategoriesForUser() {
    try {
      const response = await axiosInstance.get(`/category/for-users`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách danh mục cho người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createCategory(data: CreateCategoryRequest) {
    console.log("Creating category with data:", data);
    try {
      // Map frontend fields to backend fields
      const backendData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive || true,
      };

      const response = await axiosInstance.post("/category", backendData);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createCategoryWithImage(data: CreateCategoryRequest, imageFile?: File) {
    console.log("Creating category with image data:", data, imageFile);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("isActive", (data.isActive || true).toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axiosInstance.post(
        "/category/with-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo danh mục với ảnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateCategory(id: string, data: UpdateCategoryRequest) {
    try {
      // Map frontend fields to backend fields
      console.log("Updating category with data:", id, data);
      const backendData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive || true,
      };

      const response = await axiosInstance.patch(
        `/category/${id}`,
        backendData
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateCategoryStatus(id: string) {
    try {
      const response = await axiosInstance.patch(`/category/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteCategory(id: string) {
    console.log("Deleting category with ID:", id);
    try {
      const response = await axiosInstance.delete(`/category/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async uploadCategoryImage(id: string, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axiosInstance.post(
        `/category/${id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tải lên ảnh danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async toggleCategoryStatus(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/category/${id}/update-status`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái danh mục";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchToggleStatus(categoryIds: string[], isActive: boolean) {
    try {
      const response = await axiosInstance.patch(
        "/category/batch-toggle-status",
        {
          categoryIds,
          isActive,
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái danh mục hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async batchDeleteCategories(categoryIds: string[]) {
    try {
      const response = await axiosInstance.delete("/category/batch-delete", {
        data: { categoryIds },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa danh mục hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
