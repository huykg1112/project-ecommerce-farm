import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { InvenstoryClient } from "../types/product";
import { axiosInstance } from "./axios-instance";

export const inventoryServiceManagement = {
  async getInventoryForUser(): Promise<InvenstoryClient[]> {
    try {
      const response = await axiosInstance.get("/invenstory/for-users");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách kho hàng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
