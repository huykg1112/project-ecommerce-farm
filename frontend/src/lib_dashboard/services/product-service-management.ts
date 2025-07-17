import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  AdvancedProductFilterRequest,
  BatchOperationResponse,
  BatchProductRequest,
  BatchToggleStatusRequest,
  CreateProductRequest,
  Product,
  ProductFilters,
  ProductPaginationResponse,
  ProductStatsResponse,
  UpdateProductRequest,
} from "../types/product";
import { axiosInstance } from "./axios-instance";

export const productServiceManagement = {
  // === CRUD Operations ===

  async getProducts(
    filters?: ProductFilters
  ): Promise<ProductPaginationResponse> {
    try {
      const response = await axiosInstance.get("/products", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getProductsForUser(filters?: ProductFilters): Promise<Product[]> {
    try {
      const response = await axiosInstance.get("/products/for-users", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getProductByIdForUser(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.get(`/products/${id}/for-user`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thông tin sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getProductsByDistributor(distributorId: string): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(
        `/products/distributor/${distributorId}`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách sản phẩm của nhà phân phối";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getMyProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get("/products/my-products");
      return response.data;
    } catch (error) {
      console.warn("API không khả dụng, sử dụng mock data:", error);
      // Return mock data for development
      return [
        {
          id: "1",
          name: "Phân bón hữu cơ",
          description: "Phân bón hữu cơ tốt cho cây trồng",
          price: 150000,
          quantity: 100,
          category: { id: "cat1", name: "Phân bón" },
          status: "ACTIVE" as const,
          images: ["/placeholder.svg"],
          activeIngredients: [],
          diseases: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2", 
          name: "Thuốc trừ sâu sinh học",
          description: "Thuốc trừ sâu an toàn cho môi trường",
          price: 250000,
          quantity: 50,
          category: { id: "cat2", name: "Thuốc bảo vệ thực vật" },
          status: "ACTIVE" as const,
          images: ["/placeholder.svg"],
          activeIngredients: [],
          diseases: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
    }
  },

  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const response = await axiosInstance.post("/products", data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạo sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product> {
    try {
      const response = await axiosInstance.patch(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Status Operations ===

  async toggleProductStatus(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.patch(
        `/products/${id}/toggle-status`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Batch Operations ===

  async batchToggleStatus(
    data: BatchToggleStatusRequest
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch(
        "/products/batch/toggle-status",
        data
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi cập nhật trạng thái sản phẩm hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchActivateProducts(
    data: BatchProductRequest
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch(
        "/products/batch/activate",
        data
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi kích hoạt sản phẩm hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchDeactivateProducts(
    data: BatchProductRequest
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.patch(
        "/products/batch/deactivate",
        data
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi tạm dừng sản phẩm hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async batchDeleteProducts(
    data: BatchProductRequest
  ): Promise<BatchOperationResponse> {
    try {
      const response = await axiosInstance.delete("/products/batch", {
        data,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi xóa sản phẩm hàng loạt";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Advanced Search ===

  async advancedSearch(
    filter: AdvancedProductFilterRequest
  ): Promise<Product[]> {
    try {
      const response = await axiosInstance.post(
        "/products/advanced-search",
        filter
      );
      return response.data.data || response.data;
    } catch (error) {
      let msg = "Lỗi khi tìm kiếm sản phẩm nâng cao";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Statistics ===

  async getProductStats(distributorId?: string): Promise<ProductStatsResponse> {
    try {
      const response = await axiosInstance.get("/products/stats", {
        params: { distributor_id: distributorId },
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thống kê sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getMyProductStats(): Promise<ProductStatsResponse> {
    try {
      const response = await axiosInstance.get("/products/my-products/stats");
      return response.data;
    } catch (error) {
      console.warn("API không khả dụng, sử dụng mock stats:", error);
      // Return mock stats for development
      return {
        totalProducts: 2,
        activeProducts: 2,
        inactiveProducts: 0,
        totalValue: 400000,
        totalQuantity: 150,
        totalViews: 245,
        totalSales: 15,
        totalRevenue: 3250000,
        categoryStats: [
          { category: "Phân bón", count: 1, percentage: 50 },
          { category: "Thuốc bảo vệ thực vật", count: 1, percentage: 50 }
        ]
      };
    }
  },

  async getPublicProductStats(): Promise<ProductStatsResponse> {
    try {
      const response = await axiosInstance.get("/products/stats/public");
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thống kê sản phẩm công khai";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Additional Features ===

  async getProductIngredients(productId: string) {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}/ingredients`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy thành phần sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getProductDiseases(productId: string) {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}/diseases`
      );
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy bệnh hại sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  // === Pagination Version ===

  async getProductsWithPagination(
    filters?: ProductFilters
  ): Promise<ProductPaginationResponse> {
    try {
      const response = await axiosInstance.get("/products", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách sản phẩm";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
