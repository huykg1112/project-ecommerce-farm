"use client";

import { toast } from "@/hooks/use-toast";
import { CategoryService } from "@/lib_dashboard/services/category-service";
import {
  addCategoryModalAtom,
  categoriesDataAtom,
  categoriesLoadingAtom,
  categoriesPaginationAtom,
  categoryFiltersAtom,
  categoryFormDataAtom,
  deleteCategoryModalAtom,
  editCategoryModalAtom,
  resetCategoryFormAtom,
  selectedCategoryIdAtom,
  type CategoryFormData,
} from "@/lib_dashboard/store/category-store";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

export function useCategories() {
  const [filters, setFilters] = useAtom(categoryFiltersAtom);
  const [, resetForm] = useAtom(resetCategoryFormAtom);
  const setCategories = useSetAtom(categoriesDataAtom);
  const setLoading = useSetAtom(categoriesLoadingAtom);
  const setPagination = useSetAtom(categoriesPaginationAtom);
  const setAddOpen = useSetAtom(addCategoryModalAtom);
  const setEditOpen = useSetAtom(editCategoryModalAtom);
  const setDeleteOpen = useSetAtom(deleteCategoryModalAtom);
  const setSelectedId = useSetAtom(selectedCategoryIdAtom);
  const setFormData = useSetAtom(categoryFormDataAtom);
  const setCloseAddModal = useSetAtom(addCategoryModalAtom);
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoryService.list(filters);
      setCategories(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
        variant: "destructive",
      });
    }
  }, [filters, setCategories, setPagination, setLoading, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const addCategory = useCallback(
    async (data: CategoryFormData) => {
      try {
        await CategoryService.create(data);
        toast({
          title: "Thành công",
          description: "Danh mục đã được thêm thành công",
        });
        await fetchList();
        setCloseAddModal(false);
        return true;
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể thêm danh mục",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchList, toast, setCloseAddModal]
  );

  const editCategory = useCallback(
    async (id: string, data: CategoryFormData) => {
      try {
        await CategoryService.update({
          category_id: id,
          ...data,
        });
        await fetchList();
        return true;
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật danh mục",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchList, toast]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await CategoryService.delete(id);
        await fetchList();
        return true;
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa danh mục",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchList, toast]
  );

  const toggleStatus = useCallback(
    async (id: string) => {
      try {
        await CategoryService.toggleStatus(id);
        await fetchList();
        return true;
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật trạng thái danh mục",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchList, toast]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      page: 1,
      limit: filters.limit,
    });
  }, [setFilters, filters.limit]);

  /* ----- helpers for opening / closing modals ----- */
  const openAddModal = useCallback(() => {
    resetFilters();
    setAddOpen(true);
  }, [resetFilters, setAddOpen]);

  const closeAddModal = useCallback(() => {
    setAddOpen(false);
  }, [setAddOpen]);

  const openEditModal = useCallback(
    (catId: string, catData: CategoryFormData) => {
      setSelectedId(catId);
      setFormData(catData);
      setEditOpen(true);
    },
    [setSelectedId, setFormData, setEditOpen]
  );

  const openDeleteModal = useCallback(
    (catId: string) => {
      setSelectedId(catId);
      setDeleteOpen(true);
    },
    [setSelectedId, setDeleteOpen]
  );

  return {
    filters,
    setFilters,
    fetchList,
    addCategory,
    editCategory,
    deleteCategory,
    toggleStatus,
    openAddModal,
    closeAddModal,
    openEditModal,
    openDeleteModal,
  };
}
