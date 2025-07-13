"use client";

import { CategoryFilters } from "@/components/(dashboard)/categories/category-filters";
import { CategoryFormModal } from "@/components/(dashboard)/categories/category-form-modal";
import { CategoryPagination } from "@/components/(dashboard)/categories/category-pagination";
import { CategoryTable } from "@/components/(dashboard)/categories/category-table";
import { BatchActions } from "@/components/common/batch-actions";

import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import {
  categoryFormDataAtom,
  deleteCategoryModalAtom,
  selectedCategoryIdAtom,
  type CategoryFormData,
} from "@/lib_dashboard/store/category-store";
import { useAtom, useSetAtom } from "jotai";
import { Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

export default function CategoriesPage() {
  const { toast } = useToast();

  const {
    categories,
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
    batchToggleStatus,
    batchDeleteCategories,
    addCategory,
    editCategory,
    deleteCategory,
    toggleStatus,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  } = useCategories();

  const setFormData = useSetAtom(categoryFormDataAtom);
  const [open, setOpen] = useAtom(deleteCategoryModalAtom);
  const [catId] = useAtom(selectedCategoryIdAtom);
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === catId),
    [categories, catId]
  );
  // Fetch categories on mount
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 }); // Reset to page 1 when changing items per page
    },
    [updateFilters]
  );

  // Action handlers
  const handleEditCategory = useCallback(
    (categoryId: string) => {
      openEditModal(categoryId);
    },
    [openEditModal]
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
  const handleCreateCategory = useCallback(
    async (imageFile?: File) => {
      const success = await addCategory(formData, imageFile);
      return success;
    },
    [addCategory, formData]
  );

  const handleUpdateCategory = useCallback(
    async (imageFile?: File) => {
      if (!formData.id) return false;
      const success = await editCategory(formData.id, formData, imageFile);
      return success;
    },
    [editCategory, formData]
  );

  const handleToggleStatus = useCallback(
    async (categoryId: string) => {
      await toggleStatus(categoryId);
    },
    [toggleStatus]
  );

  // Batch action handlers
  const handleBatchActivate = useCallback(async () => {
    await batchToggleStatus(true);
  }, [batchToggleStatus]);

  const handleBatchDeactivate = useCallback(async () => {
    await batchToggleStatus(false);
  }, [batchToggleStatus]);

  const handleBatchDelete = useCallback(async () => {
    await batchDeleteCategories();
  }, [batchDeleteCategories]);

  // Statistics
  const stats = useMemo(() => {
    const totalCategories = pagination.total;
    const activeCategories = categories.filter(
      (category) => category.isActive
    ).length;
    const inactiveCategories = categories.filter(
      (category) => !category.isActive
    ).length;

    return { totalCategories, activeCategories, inactiveCategories };
  }, [categories, pagination.total]);

  // Get selected category name for delete modal
  const selectedCategoryName = useMemo(() => {
    const cat = categories.find((c) => c.id === selectedCategoryId);
    return cat?.name || "";
  }, [categories, selectedCategoryId]);

  const updateFormData = useCallback(
    (data: Partial<CategoryFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [setFormData]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedCategoryId) {
      deleteCategory(selectedCategoryId);
    }
  }, [deleteCategory, selectedCategoryId]);

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý danh mục</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
            onClick={openAddModal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
        </div>
      </header>

      {/* Statistics Cards */}
      <StatisticsCards
        stats={{
          total: stats.totalCategories,
          active: stats.activeCategories,
          inactive: stats.inactiveCategories,
        }}
        title="danh mục"
      />

      <div className="mt-6 space-y-4">
        {/* Filters */}
        <CategoryFilters
          search={filters.search ?? ""}
          status={filters.status ?? ""}
          onSearchChange={(value: string) => updateFilters({ search: value })}
          onStatusChange={(value: string) => updateFilters({ status: value })}
          onReset={resetFilters}
        />

        {/* Batch Actions */}
        <BatchActions
          selectedCount={selectedCategories.length}
          onBatchActivate={handleBatchActivate}
          onBatchDeactivate={handleBatchDeactivate}
          onBatchDelete={handleBatchDelete}
          loading={loading}
          title="danh mục"
        />

        {/* Table */}
        <CategoryTable
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={toggleCategorySelection}
          onSelectAll={toggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          loading={loading}
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
        <CategoryFormModal
          open={addModalOpen}
          title="Thêm danh mục mới"
          submitText="Tạo mới"
          onClose={closeModals}
          formData={formData}
          onUpdateFormData={updateFormData}
          onSubmit={handleCreateCategory}
        />
        <CategoryFormModal
          open={editModalOpen}
          title="Chỉnh sửa danh mục"
          submitText="Lưu thay đổi"
          isEdit
          onClose={closeModals}
          formData={formData}
          onUpdateFormData={updateFormData}
          onSubmit={handleUpdateCategory}
        />
        <DeleteModal
          open={open}
          setOpen={setOpen}
          handleConfirm={handleConfirmDelete}
          title="Xoá danh mục"
          nameDelete={selectedCategory?.name}
        />
      </div>
    </section>
  );
}
