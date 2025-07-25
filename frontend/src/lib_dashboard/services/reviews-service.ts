import { Review } from "@/interfaces";
import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { CreateReviewDto, CreateReviewResponseDto } from "../types/review";
import { axiosInstance } from "./axios-instance";

export const reviewsService = {
  // === CRUD Operations ===

  //dành cho Admin quản lý review
  async getAllReviews(): Promise<Review[]> {
    try {
      const response = await axiosInstance.get("/review");
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

  // lấy thông tin chi tiết của một review, dành cho Admin
  async getReviewById(reviewId: string): Promise<Review> {
    try {
      const response = await axiosInstance.get(`/review/${reviewId}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin chi tiết review";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  //dành cho Khách hàng xem review của sản phẩm
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    try {
      const response = await axiosInstance.get(`/review/product/${productId}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách review của sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  //dành cho Khách hàng kiểm tra đã đánh giá sản phẩm hay chưa
  async hasReviewedProduct(productId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`/review/check-review/`, {
        params: {
          product_id: productId,
        },
      });
      return response.data.hasReviewed;
    } catch (error) {
      let msg = "Lỗi khi kiểm tra đánh giá sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  //dành cho Khách hàng tạo review cho sản phẩm
  async createReview(reviewData: CreateReviewDto): Promise<Review> {
    try {
      const response = await axiosInstance.post("/review", reviewData);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo đánh giá sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  //dành cho Distributor phản hồi review của người dùng
  async createDistributorResponse(
    reviewData: CreateReviewResponseDto
  ): Promise<Review> {
    try {
      const response = await axiosInstance.post("/review/response", reviewData);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi phản hồi đánh giá sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  //dành cho Admin xóa review
  async deleteReview(deleteData: {
    review_id: string;
  }): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete("/review", {
        data: deleteData,
      });
      showToast.success("Xóa đánh giá thành công");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa đánh giá";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
