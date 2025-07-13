import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { DiseaseCreateData, DiseaseFormData } from "../types/disease";
import { axiosInstance } from "./axios-instance";

export const diseaseServiceManagement = {
  async getDiseases() {
    try {
      const response = await axiosInstance.get(`/disease`);
      // console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async getDiseaseById(id: string) {
    try {
      const response = await axiosInstance.get(`/disease/${id}`);
      return response.data as DiseaseFormData;
    } catch (error) {
      let msg = "Lỗi khi tìm bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async createDisease(data: DiseaseCreateData) {
    try {
      const response = await axiosInstance.post("/disease", data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateDisease(id: string, data: DiseaseFormData) {
    try {
      const response = await axiosInstance.patch(`/disease/${id}`, data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateDiseaseStatus(id: string) {
    try {
      const response = await axiosInstance.patch(`/disease/${id}/status`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async batchUpdateStatus(diseaseIds: string[], is_active: boolean) {
    try {
      const response = await axiosInstance.patch(
        "/disease/batch-toggle-status",
        {
          diseaseIds,
          is_active,
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái bệnh hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteDisease(id: string) {
    try {
      const response = await axiosInstance.delete(`/disease/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchDeleteDiseases(diseaseIds: string[]) {
    try {
      const response = await axiosInstance.delete("/disease/soft-delete", {
        data: { ids: diseaseIds },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa bệnh hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
