import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  CreateStoreOwnerRequestDto,
  StoreOwnerRequest,
} from "../types/store_owner_request";
import { axiosInstance } from "./axios-instance";
export const StoreOwnerRequests = {
  async getStoreOwnerRequests() {
    try {
      const response = await axiosInstance.get(`/store-owner-request`);
      return response.data as StoreOwnerRequest[];
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách yêu cầu chủ sở hữu cửa hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async getStoreOwnerRequestById(id: string) {
    try {
      const response = await axiosInstance.get(`/store-owner-request/getOne`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm yêu cầu chủ sở hữu cửa hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // tạo yêu cầu chủ sở hữu cửa hàng
  async createStoreOwnerRequest(data: CreateStoreOwnerRequestDto) {
    try {
      const response = await axiosInstance.post(`/store-owner-request`, data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo yêu cầu chủ sở hữu cửa hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getMyStoreOwnerRequest() {
    try {
      const response = await axiosInstance.get(
        `/store-owner-request/getMyRequest`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy yêu cầu chủ sở hữu cửa hàng của bạn";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async approveStoreOwnerRequest(request_id: string, approve: boolean) {
    try {
      const response = await axiosInstance.patch(
        `/store-owner-request/approve`,
        {
          request_id,
          approve,
        }
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi phê duyệt yêu cầu chủ sở hữu cửa hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteStoreOwnerRequest(id: string) {
    try {
      const response = await axiosInstance.delete(`/store-owner-request/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa yêu cầu chủ sở hữu cửa hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
