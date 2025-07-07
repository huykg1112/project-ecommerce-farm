import { mockCategoriesData } from "@/lib_dashboard/mock/categories";
import type {
  CategoryFilters,
  CategoryFormData,
} from "@/lib_dashboard/store/category-store";
import type { Category } from "@/types/entities";
import { categoryAPI, type UpdateCategoryRequest } from "../mock/server";
import type { CreateCategoryRequest } from "../mock/server";

/**
 * A tiny in-memory service that mimics CRUD behaviour.
 * In a real project you would replace this with real API calls.
 */
export class CategoryService {
  static async list(filters: CategoryFilters) {
    try {
      return await categoryAPI.getCategories(filters);
    } catch (error) {
      throw new Error("Không thể tải danh sách danh mục");
    }
  }

  static async getById(id: string) {
    try {
      return await categoryAPI.getCategoryById(id);
    } catch (error) {
      throw new Error("Không thể tải danh mục");
    }
  }
  static async create(payload: CreateCategoryRequest): Promise<Category> {
    try {
      return await categoryAPI.createCategory(payload as CreateCategoryRequest);
    } catch (error) {
      throw new Error("Không thể tạo danh mục");
    }
  }
  static async update(payload: UpdateCategoryRequest): Promise<Category> {
    try {
      return await categoryAPI.updateCategory(payload);
    } catch (error) {
      throw new Error("Không thể cập nhật danh mục");
    }
  }
  static async delete(id: string) {
    try {
      return await categoryAPI.deleteCategory(id);
    } catch (error) {
      throw new Error("Không thể xóa danh mục");
    }
  }
  static async toggleStatus(id: string) {
    try {
      return await categoryAPI.toggleCategoryStatus(id);
    } catch (error) {
      throw new Error("Không thể chuyển đổi trạng thái danh mục");
    }
  }
  static async batchToggleStatus(ids: string[], status: boolean) {
    try {
      return await categoryAPI.batchToggleStatus(ids, status);
    } catch (error) {
      throw new Error("Không thể chuyển đổi trạng thái danh mục");
    }
  }
  static async batchDelete(ids: string[]) {
    try {
      return await categoryAPI.batchDeleteCategories(ids);
    } catch (error) {
      throw new Error("Không thể xóa danh mục");
    }
  }
}

export const categoryService = new CategoryService();
