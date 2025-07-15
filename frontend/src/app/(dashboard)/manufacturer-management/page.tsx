"use client";

import { ManufacturerFilters } from "@/components/(dashboard)/manufacturers/manufacturer-filters";
import { ManufacturerFormModal } from "@/components/(dashboard)/manufacturers/manufacturer-form-modal";
import { ManufacturerTable } from "@/components/(dashboard)/manufacturers/manufacturer-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useManufacturers } from "@/hooks/use-manufacturers";
import { useToast } from "@/hooks/use-toast";
import {
  deleteManufacturerModalAtom,
  ManufacturerFormData,
  manufacturerFormDataAtom,
  selectedManufacturerIdAtom,
} from "@/lib_dashboard/store/manufacturer-store";
import { useAtom, useSetAtom } from "jotai";
import { Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
export default function ManufacturersPage() {
  const { toast } = useToast();

  const {
    manufacturers,
    loading,
    pagination,
    filters,
    selectedManufacturers,
    formData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedManufacturerId,
    fetchList,
    updateFilters,
    resetFilters,
    toggleManufacturerSelection,
    toggleSelectAll,
    batchToggleStatus,
    batchDeleteManufacturers,
    addManufacturer,
    editManufacturer,
    deleteManufacturer,
    toggleStatus,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  } = useManufacturers();

  const setFormData = useSetAtom(manufacturerFormDataAtom);
  const [open, setOpen] = useAtom(deleteManufacturerModalAtom);
  const [manufacturerId] = useAtom(selectedManufacturerIdAtom);
  const selectedManufacturer = useMemo(
    () =>
      manufacturers.find((manufacturer) => manufacturer.id === manufacturerId),
    [manufacturers, manufacturerId]
  );

  // Fetch manufacturers on mount
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
      updateFilters({ limit, page: 1 });
    },
    [updateFilters]
  );

  // Action handlers
  const handleEditManufacturer = useCallback(
    (manufacturerId: string) => {
      openEditModal(manufacturerId);
    },
    [openEditModal]
  );

  const handleDeleteManufacturer = useCallback(
    (manufacturerId: string) => {
      openDeleteModal(manufacturerId);
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
  const handleCreateManufacturer = useCallback(
    async (logoFile?: File) => {
      const success = await addManufacturer(formData, logoFile);
      return success;
    },
    [addManufacturer, formData]
  );

  const handleUpdateManufacturer = useCallback(
    async (logoFile?: File) => {
      if (!formData.id) return false;
      const success = await editManufacturer(formData.id, formData, logoFile);
      return success;
    },
    [editManufacturer, formData]
  );

  const handleToggleStatus = useCallback(
    async (manufacturerId: string) => {
      await toggleStatus(manufacturerId);
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
    await batchDeleteManufacturers();
  }, [batchDeleteManufacturers]);

  // Statistics
  const stats = useMemo(() => {
    const totalManufacturers = pagination.total;
    const activeManufacturers = manufacturers.filter(
      (manufacturer) => manufacturer.isActive
    ).length;
    const inactiveManufacturers = manufacturers.filter(
      (manufacturer) => !manufacturer.isActive
    ).length;

    return { totalManufacturers, activeManufacturers, inactiveManufacturers };
  }, [manufacturers, pagination.total]);

  // Get selected manufacturer name for delete modal
  const selectedManufacturerName = useMemo(() => {
    const manufacturer = manufacturers.find(
      (m) => m.id === selectedManufacturerId
    );
    return manufacturer?.name || "";
  }, [manufacturers, selectedManufacturerId]);

  const updateFormData = useCallback(
    (data: Partial<ManufacturerFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [setFormData]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedManufacturerId) {
      deleteManufacturer(selectedManufacturerId);
    }
  }, [deleteManufacturer, selectedManufacturerId]);

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">
          Quản lý nhà sản xuất
        </h1>
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
            Thêm nhà sản xuất
          </Button>
        </div>
      </header>

      {/* Statistics Cards */}
      <StatisticsCards
        stats={{
          total: stats.totalManufacturers,
          active: stats.activeManufacturers,
          inactive: stats.inactiveManufacturers,
        }}
        title="nhà sản xuất"
      />

      <div className="mt-6 space-y-4">
        {/* Filters */}
        <ManufacturerFilters
          search={filters.search ?? ""}
          status={filters.status ?? ""}
          onSearchChange={(value: string) => updateFilters({ search: value })}
          onStatusChange={(value: string) => updateFilters({ status: value })}
          onReset={resetFilters}
        />

        {/* Batch Actions */}
        <BatchActions
          selectedCount={selectedManufacturers.length}
          onBatchActivate={handleBatchActivate}
          onBatchDeactivate={handleBatchDeactivate}
          onBatchDelete={handleBatchDelete}
          loading={loading}
          title="nhà sản xuất"
        />

        {/* Table */}
        <ManufacturerTable
          manufacturers={manufacturers}
          selectedManufacturers={selectedManufacturers}
          onSelectManufacturer={toggleManufacturerSelection}
          onSelectAll={toggleSelectAll}
          onToggleStatus={handleToggleStatus}
          onEditManufacturer={handleEditManufacturer}
          onDeleteManufacturer={handleDeleteManufacturer}
          loading={loading}
        />

        {/* Modals */}
        <ManufacturerFormModal
          open={addModalOpen}
          title="Thêm nhà sản xuất mới"
          submitText="Tạo mới"
          onClose={closeModals}
          formData={formData}
          onUpdateFormData={updateFormData}
          onSubmit={handleCreateManufacturer}
        />
        <ManufacturerFormModal
          open={editModalOpen}
          title="Chỉnh sửa nhà sản xuất"
          submitText="Lưu thay đổi"
          isEdit
          onClose={closeModals}
          formData={formData}
          onUpdateFormData={updateFormData}
          onSubmit={handleUpdateManufacturer}
        />
        <DeleteModal
          open={open}
          setOpen={setOpen}
          handleConfirm={handleConfirmDelete}
          title="Xoá nhà sản xuất"
          nameDelete={selectedManufacturer?.name}
        />
      </div>
    </section>
  );
}
