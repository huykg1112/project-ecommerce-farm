"use client";

import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { Button } from "@/components/ui/button";
import { useIngredient } from "@/hooks/use-ingredient";
import { useToast } from "@/hooks/use-toast";
import { ActiveIngredientFormData } from "@/lib_dashboard/store/active-ingredient-store";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { IngredientsFilters } from "@/components/(dashboard)/ingredients/ingredients-filters";
import { IngredientFormModal } from "@/components/(dashboard)/ingredients/ingredients-form-modal";
import { IngredientsTable } from "@/components/(dashboard)/ingredients/ingredients-table";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { activeIngredientsFormDataAtom } from "@/lib_dashboard/store/active-ingredient-store";

export default function IngredientsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useAtom(activeIngredientsFormDataAtom);

  const {
    // Data
    ingredients,
    allIngredients,
    loading,
    pagination,
    filters,
    selectedIngredients,

    // Modals
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedIngredientId,

    // Actions
    fetchList,
    addIngredient,
    editIngredient,
    deleteIngredient,
    toggleStatus,
    batchToggleStatus,
    batchDeleteIngredients,

    // Filters
    updateFilters,
    resetFilters,

    // Selection
    toggleIngredientSelection,
    toggleSelectAll,
    clearSelection,

    // Modals
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  } = useIngredient();

  // Initial load
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Filter handlers
  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({ status });
    },
    [updateFilters]
  );

  const handleHazardLevelChange = useCallback(
    (hazardLevel: string) => {
      updateFilters({ hazard_level: hazardLevel });
    },
    [updateFilters]
  );

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    // Pagination is handled by filter/search on frontend
    console.log("Page changed to:", page);
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    // Items per page is handled by filter/search on frontend
    console.log("Items per page changed to:", limit);
  }, []);

  // Action handlers
  const handleEditIngredient = useCallback(
    (ingredientId: string) => {
      const ingredient = ingredients.find(
        (c) => c.ingredient_id === ingredientId
      );
      if (ingredient) {
        openEditModal(ingredientId);
      }
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
    try {
      await addIngredient(formData);
      toast({
        title: "Thành công",
        description: "Tạo hoạt chất mới thành công",
      });
      return true;
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo hoạt chất mới",
        variant: "destructive",
      });
      return false;
    }
  }, [addIngredient, formData, toast]);

  const handleUpdateIngredient = useCallback(async () => {
    if (!formData.ingredient_id) return false;
    try {
      await editIngredient(formData.ingredient_id, formData);
      toast({
        title: "Thành công",
        description: "Cập nhật hoạt chất thành công",
      });
      return true;
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hoạt chất",
        variant: "destructive",
      });
      return false;
    }
  }, [editIngredient, formData, toast]);

  const handleDeleteIngredientConfirm = useCallback(async () => {
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.ingredient_id === selectedIngredients[0]
    );
    if (!selectedIngredient) return false;

    try {
      await deleteIngredient(selectedIngredient.ingredient_id);
      toast({
        title: "Thành công",
        description: "Xóa hoạt chất thành công",
      });
      return true;
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa hoạt chất",
        variant: "destructive",
      });
      return false;
    }
  }, [deleteIngredient, ingredients, selectedIngredients, toast]);

  const handleToggleStatus = useCallback(
    async (ingredientId: string) => {
      await toggleStatus(ingredientId);
    },
    [toggleStatus]
  );

  // Batch actions
  const handleBatchActivate = useCallback(async () => {
    try {
      await batchToggleStatus(true);
      toast({
        title: "Thành công",
        description: `Đã kích hoạt ${selectedIngredients.length} hoạt chất`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể kích hoạt hoạt chất",
        variant: "destructive",
      });
    }
  }, [batchToggleStatus, selectedIngredients, toast]);

  const handleBatchDeactivate = useCallback(async () => {
    try {
      await batchToggleStatus(false);
      toast({
        title: "Thành công",
        description: `Đã tắt ${selectedIngredients.length} hoạt chất`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tắt hoạt chất",
        variant: "destructive",
      });
    }
  }, [batchToggleStatus, selectedIngredients, toast]);

  const handleBatchDelete = useCallback(async () => {
    try {
      await batchDeleteIngredients();
      toast({
        title: "Thành công",
        description: `Đã xóa ${selectedIngredients.length} hoạt chất`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa hoạt chất",
        variant: "destructive",
      });
    }
  }, [batchDeleteIngredients, selectedIngredients, toast]);

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
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.ingredient_id === selectedIngredients[0]
    );
    return selectedIngredient?.ingredient_name || "";
  }, [ingredients, selectedIngredients]);

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
      <StatisticsCards
        stats={{
          total: stats.totalIngredients,
          active: stats.activeIngredients,
          inactive: stats.inactiveIngredients,
        }}
        title="hoạt chất"
      />

      {/* Filters */}
      <div className="mb-6">
        <IngredientsFilters
          search={filters.search}
          status={filters.status}
          hazardLevel={filters.hazard_level}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onHazardLevelChange={handleHazardLevelChange}
          onReset={resetFilters}
        />
      </div>

      {/* Batch Actions */}
      {selectedIngredients.length > 0 && (
        <div className="mb-4">
          <BatchActions
            selectedCount={selectedIngredients.length}
            onBatchActivate={handleBatchActivate}
            onBatchDeactivate={handleBatchDeactivate}
            onBatchDelete={handleBatchDelete}
            title="hoạt chất"
          />
        </div>
      )}

      {/* Table */}
      <div className="mb-6">
        <IngredientsTable
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          onSelectIngredient={toggleIngredientSelection}
          onSelectAll={toggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onEditIngredient={handleEditIngredient}
          onDeleteIngredient={handleDeleteIngredient}
        />
      </div>

      {/* Modals */}
      <IngredientFormModal
        open={addModalOpen}
        title="Thêm hoạt chất mới"
        submitText="Tạo mới"
        onClose={closeModals}
        formData={formData}
        onUpdateFormData={(data: Partial<ActiveIngredientFormData>) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSubmit={handleCreateIngredient}
      />

      <IngredientFormModal
        open={editModalOpen}
        title="Chỉnh sửa hoạt chất"
        submitText="Lưu thay đổi"
        isEdit
        onClose={closeModals}
        formData={formData}
        onUpdateFormData={(data: Partial<ActiveIngredientFormData>) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSubmit={handleUpdateIngredient}
      />

      <DeleteModal
        open={deleteModalOpen}
        setOpen={() => closeModals()}
        handleConfirm={handleDeleteIngredientConfirm}
        title="Xóa hoạt chất"
        nameDelete={selectedIngredientName}
      />
    </section>
  );
}
