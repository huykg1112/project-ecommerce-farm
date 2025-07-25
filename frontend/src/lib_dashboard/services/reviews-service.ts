import { Review } from "@/interfaces";
import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { axiosInstance } from "./axios-instance";

export const reviewsService = {
  // === CRUD Operations ===

  async getAllReviews(): Promise<Review[]> {
    try {
      const response = await axiosInstance.get("/batch-product");
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
};
