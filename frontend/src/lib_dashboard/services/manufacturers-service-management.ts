import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  CreateManufacturerRequest,
  UpdateManufacturerRequest,
} from "../types/manufacturer";
import { axiosInstance } from "./axios-instance";

export const manufacturerServiceManagement = {
  async getManufacturers() {
    try {
      const response = await axiosInstance.get(`/manufacturers`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getManufacturersForUser() {
    try {
      const response = await axiosInstance.get(`/manufacturers/for-users`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách nhà sản xuất cho người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getManufacturerById(id: string) {
    try {
      const response = await axiosInstance.get(`/manufacturers/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createManufacturer(data: CreateManufacturerRequest) {
    try {
      const backendData = {
        name: data.name,
        description: data.description,
        isActive: true,
      };

      const response = await axiosInstance.post("/manufacturers", backendData);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createManufacturerWithLogo(
    data: CreateManufacturerRequest,
    logoFile?: File
  ) {
    try {
      const createData = {
        name: data.name,
        description: data.description,
      };
      const formData = new FormData();
      formData.append("name", createData.name || "");
      formData.append("description", createData.description || "");
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axiosInstance.post(
        "/manufacturers/with-logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo nhà sản xuất với logo";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateManufacturer(
    id: string,
    data: UpdateManufacturerRequest,
    logoFile?: File
  ) {
    try {
      const backendData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      };
      let response;
      if (logoFile) {
        const formData = new FormData();
        formData.append("name", data.name || "");
        formData.append("description", data.description || "");
        formData.append("isActive", String(data.isActive));
        formData.append("logo", logoFile);
        response = await axiosInstance.patch(
          `/manufacturers/${id}/update-with-logo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axiosInstance.patch(
          `/manufacturers/${id}`,
          backendData
        );
      }
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteManufacturer(id: string) {
    try {
      const response = await axiosInstance.delete(`/manufacturers/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async uploadManufacturerLogo(id: string, logoFile: File) {
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await axiosInstance.post(
        `/manufacturers/${id}/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tải lên logo nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async toggleManufacturerStatus(id: string) {
    try {
      // Sử dụng endpoint toggle-status nếu có trong backend
      const response = await axiosInstance.patch(
        `/manufacturers/${id}/toggle-status`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async softDeleteManufacturer(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/manufacturers/${id}/soft-delete`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa mềm nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async restoreManufacturer(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/manufacturers/${id}/restore`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi khôi phục nhà sản xuất";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchToggleStatus(manufacturerIds: string[], isActive: boolean) {
    try {
      const response = await axiosInstance.patch(
        "/manufacturers/batch-toggle-status",
        {
          manufacturerIds,
          isActive,
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái nhà sản xuất hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchDeleteManufacturers(manufacturerIds: string[]) {
    try {
      const response = await axiosInstance.delete(
        "/manufacturers/batch-delete",
        {
          data: { manufacturerIds },
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa nhà sản xuất hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
