import { showToast } from "@/lib/toast-provider";
import { getCookie } from "@/lib/utils";
import { Voucher } from "@/types/entities";
import axios from "axios";
import { axiosInstance } from "./axios-instance";

export interface CreateVoucherRequest {
  voucher_code: string;
  min_order_value?: number;
  max_discount_value?: number;
  usage_limit?: number;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean;
  distributor_id: string;
}

export interface UpdateVoucherRequest {
  voucher_code?: string;
  min_order_value?: number;
  max_discount_value?: number;
  usage_limit?: number;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean;
}

export const voucherService = {
  async getVouchers(distributorId?: string): Promise<Voucher[]> {
    try {
      const params = distributorId ? { distributor_id: distributorId } : {};
      const response = await axiosInstance.get("/voucher", { params });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getMyVouchers(): Promise<Voucher[]> {
    try {
      const response = await axiosInstance.get(`/voucher/my-vouchers`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách voucher của tôi";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getVoucherById(id: string): Promise<Voucher> {
    try {
      const response = await axiosInstance.get(`/voucher/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createVoucher(data: CreateVoucherRequest): Promise<Voucher> {
    try {
      if (!data.distributor_id) {
        data.distributor_id = getCookie("user_id") || "";
      }
      const response = await axiosInstance.post("/voucher", data);
      showToast.success("Tạo voucher thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateVoucher(
    id: string,
    data: UpdateVoucherRequest
  ): Promise<Voucher> {
    try {
      const updatedData: UpdateVoucherRequest = {
        ...data,
        max_discount_value: Number(data.max_discount_value) || 0,
        min_order_value: Number(data.min_order_value) || 0,
        usage_limit: Number(data.usage_limit) || 0,
      };
      const response = await axiosInstance.patch(`/voucher/${id}`, updatedData);
      showToast.success("Cập nhật voucher thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteVoucher(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/voucher/${id}`);
      showToast.success("Xóa voucher thành công");
    } catch (error) {
      let msg = "Lỗi khi xóa voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async toggleVoucherStatus(id: string): Promise<Voucher> {
    try {
      const response = await axiosInstance.patch(
        `/voucher/${id}/toggle-active`
      );
      showToast.success("Cập nhật trạng thái voucher thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchToggleStatus(ids: string[]): Promise<void> {
    try {
      await axiosInstance.patch("/voucher/batch-toggle-status", { ids });
      showToast.success("Cập nhật trạng thái voucher hàng loạt thành công");
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái voucher hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchDelete(ids: string[]): Promise<void> {
    try {
      await axiosInstance.delete("/voucher/batch-delete", { data: { ids } });
      showToast.success("Xóa voucher hàng loạt thành công");
    } catch (error) {
      let msg = "Lỗi khi xóa voucher hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async collectVoucher(id: string): Promise<Voucher> {
    try {
      const response = await axiosInstance.post(`/voucher/${id}/collect`);
      showToast.success("Thu thập voucher thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi thu thập voucher";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async findByCode(code: string): Promise<Voucher> {
    try {
      const response = await axiosInstance.get(`/voucher/code/${code}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm voucher theo mã";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
