"use client";

import { useMemo } from "react";

import { CategoryFilters } from "@/components/(dashboard)/categories/category-filters";
import { CategoryFormModal } from "@/components/(dashboard)/categories/category-form-modal";
import { CategoryPagination } from "@/components/(dashboard)/categories/category-pagination";
import { CategoryTable } from "@/components/(dashboard)/categories/category-table";
import { DeleteCategoryModal } from "@/components/(dashboard)/categories/delete-category-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import {
  addCategoryModalAtom,
  categoriesDataAtom,
  categoriesPaginationAtom,
  categoryFiltersAtom,
  CategoryFormData,
  categoryFormDataAtom,
  editCategoryModalAtom,
  selectedCategoryIdAtom,
} from "@/lib_dashboard/store/category-store";
import { useAtomValue, useSetAtom } from "jotai";
import { Eye, EyeOff, Package, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function CategoriesPage() {
  const { toast } = useToast();

  const {
    fetchList,
    addCategory,
    editCategory,
    toggleStatus,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    setFilters,
  } = useCategories();

  const categories = useAtomValue(categoriesDataAtom);
  const pagination = useAtomValue(categoriesPaginationAtom);
  const formData = useAtomValue(categoryFormDataAtom);
  const addOpen = useAtomValue(addCategoryModalAtom);
  const editOpen = useAtomValue(editCategoryModalAtom);
  const filters = useAtomValue(categoryFiltersAtom);
  const selectedId = useAtomValue(selectedCategoryIdAtom);
  const setFormData = useSetAtom(categoryFormDataAtom);
  /* initial load */
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter handlers

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setFilters({ ...filters, page });
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setFilters({ ...filters, limit });
  }, []);

  // Action handlers
  const handleEditCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find((c) => c.category_id === categoryId);
      if (cat)
        openEditModal(categoryId, {
          category_name: cat.category_name,
          description: cat.description,
          category_img: cat.category_img,
          is_active: cat.is_active,
        });
    },
    [categories, openEditModal]
  );

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      openDeleteModal(categoryId);
    },
    [openDeleteModal]
  );

  const handleExport = useCallback(() => {
    toast({
      title: "Thông báo",
      description: "Tính năng xuất dữ liệu đang được phát triển",
    });
  }, [toast]);

  // Form handlers
  const handleCreateCategory = useCallback(async () => {
    const success = await addCategory(formData);
    return success;
  }, [addCategory, formData]);

  const handleUpdateCategory = useCallback(async () => {
    if (!formData.category_id) return false;
    const success = await editCategory(formData.category_id, formData);
    return success;
  }, [editCategory, formData]);

  const handleToggleStatus = useCallback(
    async (categoryId: string) => {
      await toggleStatus(categoryId);
    },
    [toggleStatus]
  );

  // Statistics
  const stats = useMemo(() => {
    const totalCategories = pagination.total;
    const activeCategories = categories.filter(
      (category) => category.is_active
    ).length;
    const inactiveCategories = categories.filter(
      (category) => !category.is_active
    ).length;

    return { totalCategories, activeCategories, inactiveCategories };
  }, [categories, pagination.total]);

  // Get selected category name for delete modal
  const selectedCategoryName = useMemo(() => {
    const cat = categories.find((c) => c.category_id === selectedId);
    return cat?.category_name || "";
  }, [categories, selectedId]);

  const handleCloseAddModal = useCallback(() => {
    closeAddModal();
  }, [closeAddModal]);

  const updateFormData = useCallback(
    (data: Partial<CategoryFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [setFormData]
  );

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý danh mục</h1>
        <Button
          className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng số danh mục
            </CardTitle>
            <Package className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalCategories}
            </div>
            <p className="text-xs text-[#74a65d]">
              Tất cả danh mục trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đang hoạt động
            </CardTitle>
            <Eye className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.activeCategories}
            </div>
            <p className="text-xs text-[#74a65d]">
              Danh mục hiển thị công khai
            </p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã tắt
            </CardTitle>
            <EyeOff className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.inactiveCategories}
            </div>
            <p className="text-xs text-[#74a65d]">Danh mục tạm thời ẩn</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <CategoryFilters />

      {/* Table */}
      <CategoryTable
        categories={categories}
        onToggleStatus={handleToggleStatus}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Pagination */}
      <CategoryPagination
        currentPage={filters.page ?? 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit ?? 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      {/* Add */}
      <CategoryFormModal
        open={addOpen}
        title="Thêm danh mục mới"
        submitText="Tạo mới"
        onClose={handleCloseAddModal}
        formData={formData}
        onUpdateFormData={updateFormData}
        onSubmit={handleCreateCategory}
      />
      {/* Edit */}
      <CategoryFormModal
        open={editOpen}
        title="Chỉnh sửa danh mục"
        submitText="Lưu thay đổi"
        isEdit
        onClose={handleCloseAddModal}
        formData={formData}
        onUpdateFormData={updateFormData}
        onSubmit={handleUpdateCategory}
      />
      {/* Delete confirmation */}
      <DeleteCategoryModal />
    </section>
  );
}
