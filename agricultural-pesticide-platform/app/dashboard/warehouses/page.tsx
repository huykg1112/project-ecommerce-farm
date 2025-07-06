"use client"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WarehouseTable } from "@/components/warehouses/warehouse-table"
import { WarehouseFilters } from "@/components/warehouses/warehouse-filters"
import { WarehousePagination } from "@/components/warehouses/warehouse-pagination"
import { WarehouseFormModal } from "@/components/warehouses/warehouse-form-modal"
import { DeleteWarehouseModal } from "@/components/warehouses/delete-warehouse-modal"
import { Plus, Building, Lock, Unlock, Download } from "lucide-react"
import { useWarehouses, useWarehouseForm } from "@/hooks/use-warehouses"
import { useToast } from "@/hooks/use-toast"

export default function WarehousesPage() {
  const { toast } = useToast()

  const {
    warehouses,
    distributors,
    loading,
    pagination,
    filters,
    fetchWarehouses,
    updateFilters,
    resetFilters,
    toggleWarehouseLock,
  } = useWarehouses()

  const {
    formData,
    updateFormData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedWarehouseId,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouseForm()

  // Filter handlers
  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 })
    },
    [updateFilters],
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({ status: status === "all" ? "" : status, page: 1 })
    },
    [updateFilters],
  )

  const handleDistributorChange = useCallback(
    (distributor: string) => {
      updateFilters({ distributor: distributor === "all" ? "" : distributor, page: 1 })
    },
    [updateFilters],
  )

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
    },
    [updateFilters],
  )

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 })
    },
    [updateFilters],
  )

  // Action handlers
  const handleEditWarehouse = useCallback(
    (warehouseId: string) => {
      openEditModal(warehouseId)
    },
    [openEditModal],
  )

  const handleDeleteWarehouse = useCallback(
    (warehouseId: string) => {
      openDeleteModal(warehouseId)
    },
    [openDeleteModal],
  )

  const handleExport = useCallback(() => {
    toast({
      title: "Thông báo",
      description: "Tính năng xuất dữ liệu đang được phát triển",
    })
  }, [toast])

  // Form handlers
  const handleCreateWarehouse = useCallback(async () => {
    const success = await createWarehouse()
    if (success) {
      await fetchWarehouses()
    }
    return success
  }, [createWarehouse, fetchWarehouses])

  const handleUpdateWarehouse = useCallback(async () => {
    const success = await updateWarehouse()
    if (success) {
      await fetchWarehouses()
    }
    return success
  }, [updateWarehouse, fetchWarehouses])

  const handleDeleteWarehouseConfirm = useCallback(async () => {
    const success = await deleteWarehouse()
    if (success) {
      await fetchWarehouses()
    }
    return success
  }, [deleteWarehouse, fetchWarehouses])

  const handleToggleLock = useCallback(
    async (warehouseId: string) => {
      await toggleWarehouseLock(warehouseId)
    },
    [toggleWarehouseLock],
  )

  // Statistics
  const stats = useMemo(() => {
    const totalWarehouses = pagination.total
    const activeWarehouses = warehouses.filter((warehouse) => !warehouse.is_locked).length
    const lockedWarehouses = warehouses.filter((warehouse) => warehouse.is_locked).length

    return { totalWarehouses, activeWarehouses, lockedWarehouses }
  }, [warehouses, pagination.total])

  // Get selected warehouse name for delete modal
  const selectedWarehouseName = useMemo(() => {
    const warehouse = warehouses.find((w) => w.invenstory_id === selectedWarehouseId)
    return warehouse?.name
  }, [warehouses, selectedWarehouseId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">🏪 Quản lý kho đại lý</h1>
          <p className="text-[#74a65d] mt-1">Quản lý kho hàng của các nhà phân phối trên nền tảng</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button onClick={openAddModal} className="bg-[#90c577] hover:bg-[#74a65d] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Thêm kho hàng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Tổng số kho</CardTitle>
            <Building className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.totalWarehouses}</div>
            <p className="text-xs text-[#74a65d]">Tất cả kho hàng trong hệ thống</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đang hoạt động</CardTitle>
            <Unlock className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.activeWarehouses}</div>
            <p className="text-xs text-[#74a65d]">Kho đang vận hành bình thường</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đã khóa</CardTitle>
            <Lock className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.lockedWarehouses}</div>
            <p className="text-xs text-[#74a65d]">Kho tạm thời ngừng hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <WarehouseFilters
        search={filters.search || ""}
        status={filters.status || "all"}
        distributor={filters.distributor || "all"}
        distributors={distributors}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onDistributorChange={handleDistributorChange}
        onReset={resetFilters}
      />

      {/* Warehouses Table */}
      <WarehouseTable
        warehouses={warehouses}
        onToggleLock={handleToggleLock}
        onEditWarehouse={handleEditWarehouse}
        onDeleteWarehouse={handleDeleteWarehouse}
        loading={loading}
      />

      {/* Pagination */}
      <WarehousePagination
        currentPage={filters.page || 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit || 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      <WarehouseFormModal
        open={addModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateWarehouse}
        formData={formData}
        onUpdateFormData={updateFormData}
        distributors={distributors}
        title="Thêm kho hàng mới"
        submitText="Tạo kho hàng"
      />

      <WarehouseFormModal
        open={editModalOpen}
        onClose={closeModals}
        onSubmit={handleUpdateWarehouse}
        formData={formData}
        onUpdateFormData={updateFormData}
        distributors={distributors}
        title="Chỉnh sửa kho hàng"
        submitText="Cập nhật"
        isEdit
      />

      <DeleteWarehouseModal
        open={deleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteWarehouseConfirm}
        warehouseName={selectedWarehouseName}
      />
    </div>
  )
}
