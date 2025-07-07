"use client";

import { useMemo } from "react";

import { DeleteIngredientsModal } from "@/components/(dashboard)/ingredients/delete-ingredients-modal";
import { IngredientsFilters } from "@/components/(dashboard)/ingredients/ingredients-filters";
import { IngredientFormModal } from "@/components/(dashboard)/ingredients/ingredients-form-modal";
import { IngredientsPagination } from "@/components/(dashboard)/ingredients/ingredients-pagination";
import { IngredientsTable } from "@/components/(dashboard)/ingredients/ingredients-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIngredient } from "@/hooks/use-ingredient";
import { useToast } from "@/hooks/use-toast";
import {
  activeIngredientsDataAtom,
  activeIngredientsFormDataAtom,
  activeIngredientsPaginationAtom,
  addActiveIngredientModalAtom,
  editActiveIngredientModalAtom,
} from "@/lib_dashboard/store/active-ingredient-store";
import { useAtomValue } from "jotai";
import { Eye, EyeOff, Package, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
export default function IngredientsPage() {
  const { toast } = useToast();

  const {
    fetchList,
    addIngredient,
    editIngredient,
    toggleStatus,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
  } = useIngredient();

  const ingredients = useAtomValue(activeIngredientsDataAtom);
  const pagination = useAtomValue(activeIngredientsPaginationAtom);
  const formData = useAtomValue(activeIngredientsFormDataAtom);
  const addOpen = useAtomValue(addActiveIngredientModalAtom);
  const editOpen = useAtomValue(editActiveIngredientModalAtom);

  /* initial load */
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter handlers
  const handleSearchChange = useCallback((search: string) => {
    // Update filters logic here if needed
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    // Update filters logic here if needed
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    // Update pagination logic here if needed
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    // Update pagination logic here if needed
  }, []);

  // Action handlers
  const handleEditIngredient = useCallback(
    (ingredientId: string) => {
      const ing = ingredients.find((c) => c.ingredient_id === ingredientId);
      if (ing)
        openEditModal(ingredientId, {
          ingredient_name: ing.ingredient_name,
          description: ing.description,
          hazard_level: ing.hazard_level,
          chemical_formula: ing.chemical_formula,
          cas_number: ing.cas_number,
          is_active: ing.is_active,
        });
    },
    [ingredients, openEditModal]
  );

  const handleDeleteIngredient = useCallback(
    (ingredientId: string) => {
      openDeleteModal(ingredientId);
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
  const handleCreateIngredient = useCallback(async () => {
    await addIngredient(formData);
    return true;
  }, [addIngredient, formData]);

  const handleUpdateIngredient = useCallback(async () => {
    if (!formData.ingredient_id) return false;
    await editIngredient(formData.ingredient_id, formData);
    return true;
  }, [editIngredient, formData]);

  const handleDeleteIngredientConfirm = useCallback(async () => {
    // Delete category logic here if needed
    return true;
  }, []);

  const handleToggleStatus = useCallback(
    async (ingredientId: string) => {
      await toggleStatus(ingredientId);
    },
    [toggleStatus]
  );

  // Statistics
  const stats = useMemo(() => {
    const totalIngredients = pagination.total;
    const activeIngredients = ingredients.filter(
      (ingredient) => ingredient.is_active
    ).length;
    const inactiveIngredients = ingredients.filter(
      (ingredient) => !ingredient.is_active
    ).length;

    return { totalIngredients, activeIngredients, inactiveIngredients };
  }, [ingredients, pagination.total]);

  // Get selected ingredient name for delete modal
  const selectedIngredientName = useMemo(() => {
    // Logic to get selected ingredient name here if needed
    return "";
  }, []);

  const handleCloseAddModal = useCallback(() => {
    closeAddModal();
  }, [closeAddModal]);

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý hoạt chất</h1>
        <Button
          className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm hoạt chất
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng số hoạt chất
            </CardTitle>
            <Package className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalIngredients}
            </div>
            <p className="text-xs text-[#74a65d]">
              Tất cả hoạt chất trong hệ thống
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
              {stats.activeIngredients}
            </div>
            <p className="text-xs text-[#74a65d]">
              Hoạt chất hiển thị công khai
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
              {stats.inactiveIngredients}
            </div>
            <p className="text-xs text-[#74a65d]">Hoạt chất tạm thời ẩn</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <IngredientsFilters />

      {/* Table */}
      <IngredientsTable
        ingredients={ingredients}
        onToggleStatus={handleToggleStatus}
        onEditIngredient={handleEditIngredient}
        onDeleteIngredient={handleDeleteIngredient}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <IngredientsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Modals */}
      {/* Add */}
      <IngredientFormModal
        open={addOpen}
        title="Thêm hoạt chất mới"
        submitText="Tạo mới"
        onClose={handleCloseAddModal}
        formData={formData}
        onUpdateFormData={() => {}}
        onSubmit={handleCreateIngredient}
      />
      {/* Edit */}
      <IngredientFormModal
        open={editOpen}
        title="Chỉnh sửa hoạt chất"
        submitText="Lưu thay đổi"
        isEdit
        onClose={() => openEditModal("", formData)}
        formData={formData}
        onUpdateFormData={() => {}}
        onSubmit={handleUpdateIngredient}
      />
      {/* Delete confirmation */}
      <DeleteIngredientsModal />
    </section>
  );
}
