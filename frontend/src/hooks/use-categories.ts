"use client";

import { showToast } from "@/lib/toast-provider";
import { categoryServiceManagement } from "@/lib_dashboard/services/category-service-management";
import {
  addCategoryModalAtom,
  categoriesDataAtom,
  categoriesLoadingAtom,
  categoriesPaginationAtom,
  CategoryFilters,
  categoryFiltersAtom,
  categoryFormDataAtom,
  deleteCategoryModalAtom,
  editCategoryModalAtom,
  resetCategoryFormAtom,
  selectedCategoriesAtom,
  selectedCategoryIdAtom,
  type CategoryFormData,
} from "@/lib_dashboard/store/category-store";
import type {
  Category,
  CreateCategoryRequest,
} from "@/lib_dashboard/types/category";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

export function useCategories() {
  const [filters, setFilters] = useAtom(categoryFiltersAtom);
  const [categories, setCategories] = useAtom(categoriesDataAtom);
  const [loading, setLoading] = useAtom(categoriesLoadingAtom);
  const [pagination, setPagination] = useAtom(categoriesPaginationAtom);
  const [selectedCategories, setSelectedCategories] = useAtom(
    selectedCategoriesAtom
  );
  const [formData, setFormData] = useAtom(categoryFormDataAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addCategoryModalAtom);
  const [editModalOpen, setEditModalOpen] = useAtom(editCategoryModalAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(
    deleteCategoryModalAtom
  );
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(
    selectedCategoryIdAtom
  );
  const resetForm = useSetAtom(resetCategoryFormAtom);

  // Lưu toàn bộ categories lấy từ API
  const allCategoriesRef = useRef<Category[]>([]);

  // Lọc và phân trang trên FE
  const filterAndPaginate = useCallback(() => {
    let filtered = allCategoriesRef.current;
    // Lọc theo search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchLower) ||
          cat.description.toLowerCase().includes(searchLower)
      );
    }
    // Lọc theo status
    if (filters.status) {
      filtered = filtered.filter((cat) =>
        filters.status === "active" ? cat.isActive : !cat.isActive
      );
    }
    // Phân trang
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    setCategories(paginated);
    setPagination({
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }, [filters, setCategories, setPagination]);

  // Lấy danh sách danh mục từ API
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryServiceManagement.getCategories();

      // Map backend data to frontend format
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      allCategoriesRef.current = mappedData;
      filterAndPaginate();
    } catch (error) {
      showToast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [filterAndPaginate, setLoading]);

  // Cập nhật bộ lọc
  const updateFilters = useCallback(
    (newFilters: Partial<CategoryFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setSelectedCategories([]); // Xóa danh sách chọn khi bộ lọc thay đổi
    },
    [setFilters, setSelectedCategories]
  );

  // Đặt lại bộ lọc
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      page: 1,
      limit: filters.limit,
    });
    setSelectedCategories([]);
  }, [setFilters, filters.limit, setSelectedCategories]);

  // Chọn/bỏ chọn một danh mục
  const toggleCategorySelection = useCallback(
    (categoryId: string) => {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    },
    [setSelectedCategories]
  );

  // Chọn/bỏ chọn tất cả danh mục trong trang hiện tại
  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedCategories(
        checked ? categories.map((cat) => cat.id || cat.id) : []
      );
    },
    [setSelectedCategories, categories]
  );

  // Xóa danh sách chọn
  const clearSelection = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  // Thêm danh mục
  const addCategory = useCallback(
    async (data: CategoryFormData, imageFile?: File) => {
      try {
        if (imageFile) {
          const createData: CreateCategoryRequest = {
            name: data.name,
            description: data.description,
            isActive: data.isActive || true,
          };
          await categoryServiceManagement.createCategoryWithImage(
            createData,
            imageFile
          );
        } else {
          const createData: CreateCategoryRequest = {
            name: data.name,
            description: data.description,
            isActive: data.isActive || true,
          };
          await categoryServiceManagement.createCategory(
            createData as CreateCategoryRequest
          );
        }
        showToast.success("Thêm danh mục thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể thêm danh mục");
        return false;
      }
    },
    [fetchList]
  );

  // Sửa danh mục
  const editCategory = useCallback(
    async (id: string, data: CategoryFormData, imageFile?: File) => {
      try {
        await categoryServiceManagement.updateCategory(id, data);

        // Nếu có ảnh mới, upload riêng
        if (imageFile) {
          await categoryServiceManagement.uploadCategoryImage(id, imageFile);
        }

        showToast.success("Cập nhật danh mục thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật danh mục");
        return false;
      }
    },
    [fetchList]
  );

  // Xóa danh mục
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await categoryServiceManagement.deleteCategory(id);
        showToast.success("Xóa danh mục thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể xóa danh mục");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái danh mục
  const toggleStatus = useCallback(
    async (id: string) => {
      try {
        await categoryServiceManagement.toggleCategoryStatus(id);
        showToast.success("Cập nhật trạng thái danh mục thành công");
        await fetchList();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái danh mục");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái hàng loạt
  const batchToggleStatus = useCallback(
    async (status: boolean) => {
      try {
        await Promise.all(
          selectedCategories.map((id) =>
            categoryServiceManagement.updateCategoryStatus(id)
          )
        );
        showToast.success(
          `Cập nhật trạng thái cho ${selectedCategories.length} danh mục thành công`
        );
        await fetchList();
        clearSelection();
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái hàng loạt");
      }
    },
    [selectedCategories, fetchList, clearSelection]
  );

  // Xóa hàng loạt
  const batchDeleteCategories = useCallback(async () => {
    try {
      await Promise.all(
        selectedCategories.map((id) =>
          categoryServiceManagement.deleteCategory(id)
        )
      );
      showToast.success(`Xóa ${selectedCategories.length} danh mục thành công`);
      await fetchList();
      clearSelection();
    } catch (error) {
      showToast.error("Không thể xóa danh mục hàng loạt");
    }
  }, [selectedCategories, fetchList, clearSelection]);

  // Mở modal thêm
  const openAddModal = useCallback(() => {
    resetForm();
    setAddModalOpen(true);
  }, [resetForm, setAddModalOpen]);

  // Mở modal sửa
  const openEditModal = useCallback(
    async (categoryId: string) => {
      try {
        const category = await categoryServiceManagement.getCategoryById(
          categoryId
        );
        if (category) {
          // Map backend data to frontend format
          setFormData({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive,
          });
          setEditModalOpen(true);
        }
      } catch (error) {
        showToast.error("Không thể tải thông tin danh mục");
      }
    },
    [setFormData, setEditModalOpen]
  );

  // Mở modal xóa
  const openDeleteModal = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      setDeleteModalOpen(true);
    },
    [setSelectedCategoryId, setDeleteModalOpen]
  );

  // Đóng tất cả modal
  const closeModals = useCallback(() => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCategoryId("");
    resetForm();
  }, [
    setAddModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setSelectedCategoryId,
    resetForm,
  ]);

  // Effect để fetch dữ liệu khi mount
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Effect để lọc lại dữ liệu khi filters thay đổi
  useEffect(() => {
    filterAndPaginate();
  }, [filterAndPaginate]);

  return {
    categories,
    allCategories: allCategoriesRef.current,
    loading,
    pagination,
    filters,
    selectedCategories,
    formData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedCategoryId,
    fetchList,
    updateFilters,
    resetFilters,
    toggleCategorySelection,
    toggleSelectAll,
    clearSelection,
    addCategory,
    editCategory,
    deleteCategory,
    toggleStatus,
    batchToggleStatus,
    batchDeleteCategories,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  };
}
