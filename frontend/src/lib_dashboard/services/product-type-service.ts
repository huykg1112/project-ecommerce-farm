import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { ProductType } from "../types/batch-product";
import { axiosInstance } from "./axios-instance";

export interface CreateProductTypeDto {
  type_name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateProductTypeDto {
  type_name?: string;
  description?: string;
  is_active?: boolean;
}

export const productTypeService = {
  // Get all product types
  async getProductTypes(): Promise<ProductType[]> {
    try {
      const response = await axiosInstance.get("/product-type");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // Get active product types (for dropdowns)
  async getActiveProductTypes(): Promise<ProductType[]> {
    try {
      const allTypes = await this.getProductTypes();
      return allTypes.filter(type => type.is_active);
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách loại sản phẩm hoạt động";
      showToast.error(msg);
      throw error;
    }
  },

  // Get product type by ID
  async getProductTypeById(id: string): Promise<ProductType> {
    try {
      const response = await axiosInstance.get(`/product-type/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // Create product type
  async createProductType(data: CreateProductTypeDto): Promise<ProductType> {
    try {
      const response = await axiosInstance.post("/product-type", data);
      showToast.success("Tạo loại sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // Update product type
  async updateProductType(
    id: string,
    data: UpdateProductTypeDto
  ): Promise<ProductType> {
    try {
      const response = await axiosInstance.patch(`/product-type/${id}`, data);
      showToast.success("Cập nhật loại sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // Delete product type
  async deleteProductType(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/product-type/${id}`);
      showToast.success("Xóa loại sản phẩm thành công!");
    } catch (error) {
      let msg = "Lỗi khi xóa loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // Restore product type
  async restoreProductType(id: string): Promise<ProductType> {
    try {
      const response = await axiosInstance.patch(`/product-type/${id}/restore`);
      showToast.success("Khôi phục loại sản phẩm thành công!");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi khôi phục loại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};