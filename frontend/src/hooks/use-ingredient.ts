"use client";

import { showToast } from "@/lib/toast-provider";
import { activeIngredientService } from "@/lib_dashboard/services/active-ingredient-service";
import {
  ActiveIngredientFilters,
  ActiveIngredientFormData,
  activeIngredientsDataAtom,
  activeIngredientsFiltersAtom,
  activeIngredientsFormDataAtom,
  activeIngredientsLoadingAtom,
  activeIngredientsPaginationAtom,
  addActiveIngredientModalAtom,
  deleteActiveIngredientModalAtom,
  editActiveIngredientModalAtom,
  resetActiveIngredientFormAtom,
  selectedActiveIngredientIdAtom,
  selectedActiveIngredientsAtom,
} from "@/lib_dashboard/store/active-ingredient-store";
import type { ActiveIngredient } from "@/types/entities";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

export function useIngredient() {
  const [filters, setFilters] = useAtom(activeIngredientsFiltersAtom);
  const [ingredients, setIngredients] = useAtom(activeIngredientsDataAtom);
  const [loading, setLoading] = useAtom(activeIngredientsLoadingAtom);
  const [pagination, setPagination] = useAtom(activeIngredientsPaginationAtom);
  const [selectedIngredients, setSelectedIngredients] = useAtom(
    selectedActiveIngredientsAtom
  );
  const [formData, setFormData] = useAtom(activeIngredientsFormDataAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addActiveIngredientModalAtom);
  const [editModalOpen, setEditModalOpen] = useAtom(
    editActiveIngredientModalAtom
  );
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(
    deleteActiveIngredientModalAtom
  );
  const [selectedIngredientId, setSelectedIngredientId] = useAtom(
    selectedActiveIngredientIdAtom
  );
  const resetForm = useSetAtom(resetActiveIngredientFormAtom);

  // Lưu toàn bộ ingredients lấy từ API
  const allIngredientsRef = useRef<ActiveIngredient[]>([]);

  // Lọc và phân trang trên FE
  const filterAndPaginate = useCallback(() => {
    let filtered = allIngredientsRef.current;

    // Lọc theo search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (ingredient) =>
          ingredient.ingredient_name.toLowerCase().includes(searchLower) ||
          ingredient.description.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo status
    if (filters.status) {
      filtered = filtered.filter((ingredient) =>
        filters.status === "active"
          ? ingredient.is_active
          : !ingredient.is_active
      );
    }

    // Lọc theo hazard level
    if (filters.hazard_level) {
      filtered = filtered.filter(
        (ingredient) => ingredient.hazard_level === filters.hazard_level
      );
    }

    // Phân trang
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    setIngredients(paginated);
    setPagination({
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: page,
      itemsPerPage: limit,
    });
  }, [filters, setIngredients, setPagination]);

  // Lấy danh sách hoạt chất từ API
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await activeIngredientService.list(filters);

      // Map backend data to frontend format
      const mappedData = data.map((item: any) => ({
        ingredient_id: item.ingredient_id,
        ingredient_name: item.ingredient_name,
        description: item.description,
        hazard_level: item.hazard_level,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      allIngredientsRef.current = mappedData;
      filterAndPaginate();
    } catch (error) {
      showToast.error("Không thể tải danh sách hoạt chất");
    } finally {
      setLoading(false);
    }
  }, [filterAndPaginate, setLoading]);

  // Cập nhật bộ lọc
  const updateFilters = useCallback(
    (newFilters: Partial<ActiveIngredientFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setSelectedIngredients([]); // Xóa danh sách chọn khi bộ lọc thay đổi
    },
    [setFilters, setSelectedIngredients]
  );

  // Đặt lại bộ lọc
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      hazard_level: "",
      page: 1,
      limit: filters.limit,
    });
    setSelectedIngredients([]);
  }, [setFilters, filters.limit, setSelectedIngredients]);

  // Chọn/bỏ chọn một hoạt chất
  const toggleIngredientSelection = useCallback(
    (ingredientId: string) => {
      setSelectedIngredients((prev) =>
        prev.includes(ingredientId)
          ? prev.filter((id) => id !== ingredientId)
          : [...prev, ingredientId]
      );
    },
    [setSelectedIngredients]
  );

  // Chọn/bỏ chọn tất cả hoạt chất trong trang hiện tại
  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIngredients(
        checked ? ingredients.map((ingredient) => ingredient.ingredient_id) : []
      );
    },
    [setSelectedIngredients, ingredients]
  );

  // Xóa danh sách chọn
  const clearSelection = useCallback(() => {
    setSelectedIngredients([]);
  }, [setSelectedIngredients]);

  // Thêm hoạt chất
  const addIngredient = useCallback(
    async (data: ActiveIngredientFormData) => {
      try {
        await activeIngredientService.create(data);
        showToast.success("Thêm hoạt chất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể thêm hoạt chất");
        return false;
      }
    },
    [fetchList]
  );

  // Sửa hoạt chất
  const editIngredient = useCallback(
    async (id: string, data: ActiveIngredientFormData) => {
      try {
        await activeIngredientService.update(id, data);
        showToast.success("Cập nhật hoạt chất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật hoạt chất");
        return false;
      }
    },
    [fetchList]
  );

  // Xóa hoạt chất
  const deleteIngredient = useCallback(
    async (id: string) => {
      try {
        await activeIngredientService.remove(id);
        showToast.success("Xóa hoạt chất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể xóa hoạt chất");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái hoạt chất
  const toggleStatus = useCallback(
    async (id: string) => {
      try {
        await activeIngredientService.toggle(id);
        showToast.success("Cập nhật trạng thái hoạt chất thành công");
        await fetchList();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái hoạt chất");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái hàng loạt
  const batchToggleStatus = useCallback(
    async (status: boolean) => {
      try {
        await activeIngredientService.batchToggleStatus(selectedIngredients);
        showToast.success(
          `Cập nhật trạng thái cho ${selectedIngredients.length} hoạt chất thành công`
        );
        await fetchList();
        clearSelection();
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái hàng loạt");
      }
    },
    [selectedIngredients, fetchList, clearSelection]
  );

  // Xóa hàng loạt
  const batchDeleteIngredients = useCallback(async () => {
    try {
      await Promise.all(
        selectedIngredients.map((id) => activeIngredientService.remove(id))
      );
      showToast.success(
        `Xóa ${selectedIngredients.length} hoạt chất thành công`
      );
      await fetchList();
      clearSelection();
    } catch (error) {
      showToast.error("Không thể xóa hoạt chất hàng loạt");
    }
  }, [selectedIngredients, fetchList, clearSelection]);

  // Mở modal thêm
  const openAddModal = useCallback(() => {
    resetForm();
    setAddModalOpen(true);
  }, [resetForm, setAddModalOpen]);

  // Mở modal sửa
  const openEditModal = useCallback(
    async (ingredientId: string) => {
      try {
        const ingredient = await activeIngredientService.findOne(ingredientId);
        if (ingredient) {
          setFormData({
            ingredient_id: ingredient.ingredient_id,
            ingredient_name: ingredient.ingredient_name,
            description: ingredient.description,
            hazard_level: ingredient.hazard_level,
            is_active: ingredient.is_active,
          });
          setSelectedIngredientId(ingredientId);
          setEditModalOpen(true);
        }
      } catch (error) {
        showToast.error("Không thể tải thông tin hoạt chất");
      }
    },
    [setFormData, setSelectedIngredientId, setEditModalOpen]
  );

  // Mở modal xóa
  const openDeleteModal = useCallback(
    (ingredientId: string) => {
      setSelectedIngredientId(ingredientId);
      setDeleteModalOpen(true);
    },
    [setSelectedIngredientId, setDeleteModalOpen]
  );

  // Đóng tất cả modal
  const closeModals = useCallback(() => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedIngredientId("");
    resetForm();
  }, [
    setAddModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setSelectedIngredientId,
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
    ingredients,
    allIngredients: allIngredientsRef.current,
    loading,
    pagination,
    filters,
    selectedIngredients,
    formData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedIngredientId,
    fetchList,
    updateFilters,
    resetFilters,
    toggleIngredientSelection,
    toggleSelectAll,
    clearSelection,
    addIngredient,
    editIngredient,
    deleteIngredient,
    toggleStatus,
    batchToggleStatus,
    batchDeleteIngredients,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  };
}
