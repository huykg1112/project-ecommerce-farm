"use client";

import { BatchProductFilters } from "@/components/(dashboard)/batch-products/batch-product-filters";
import { BatchProductFormModal } from "@/components/(dashboard)/batch-products/batch-product-form-modal";
import { BatchProductTable } from "@/components/(dashboard)/batch-products/batch-product-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBatchProductManagement } from "@/hooks/use-batch-product-management";
import { showToast } from "@/lib/toast-provider";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import {
  AlertTriangle,
  Calendar,
  Download,
  Package,
  Plus,
  TrendingDown,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function BatchProductsManagementPage() {
  const {
    // Data states
    batchProducts,
    selectedBatchProducts,
    batchProductCounts,
    batchProductStats,
    pagination,
    filters,

    // Loading states
    batchProductsLoading,
    batchProductStatsLoading,
    batchOperationLoading,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,

    // Management functions
    handleCreateBatchProduct,
    handleUpdateBatchProduct,
    handleDeleteBatchProduct,
    handleBatchToggleStatus,

    // Filter functions
    updateBatchProductFilters,
    resetBatchProductFilters,
    changePage,
    changeLimit,
    sortBatchProducts,

    // Selection functions
    toggleBatchProductSelection,
    toggleAllBatchProductsSelection,
    clearBatchProductSelections,
    getSelectedCount,
    isAllSelected,
    isSomeSelected,

    // Data loading functions
    loadBatchProducts,
    loadBatchProductStats,

    // Form functions
    formData,
    updateFormData,
    resetFormData,
    loadFormDropdownData,

    // Form dropdown data
    products,
    productTypes,
    promotions,
    warehouses,
  } = useBatchProductManagement();

  // Local state
  const [selectedBatchProductForDelete, setSelectedBatchProductForDelete] =
    useState<BatchProduct | null>(null);

  // Statistics cards data
  const statisticsData = useMemo(
    () => [
      {
        title: "Tổng lô sản phẩm",
        value: batchProductStats.totalBatches.toLocaleString(),
        icon: Package,
        change: "+12% so với tháng trước",
        changeType: "positive" as const,
      },
      {
        title: "Lô đang hoạt động",
        value: batchProductStats.activeBatches.toLocaleString(),
        icon: Package,
        change: `${Math.round(
          (batchProductStats.activeBatches / batchProductStats.totalBatches) *
            100 || 0
        )}% tổng số`,
        changeType: "neutral" as const,
      },
      {
        title: "Sắp hết hạn",
        value: batchProductStats.expiringSoonBatches.toLocaleString(),
        icon: Calendar,
        change: "Trong 7 ngày tới",
        changeType:
          batchProductStats.expiringSoonBatches > 0
            ? ("negative" as const)
            : ("positive" as const),
      },
      {
        title: "Sắp hết hàng",
        value: batchProductStats.lowStockBatches.toLocaleString(),
        icon: TrendingDown,
        change: "Cần nhập thêm",
        changeType:
          batchProductStats.lowStockBatches > 0
            ? ("negative" as const)
            : ("positive" as const),
      },
    ],
    [batchProductStats]
  );

  // Handle edit batch product
  const handleEditBatchProduct = useCallback((batchProduct: BatchProduct) => {
    setSelectedBatchProductForDelete(batchProduct); // Store for editing
    setIsEditModalOpen(true);
  }, [setIsEditModalOpen]);

  // Handle delete batch product
  const handleDeleteBatchProductClick = useCallback(
    (batchProduct: BatchProduct) => {
      setSelectedBatchProductForDelete(batchProduct);
      setIsDeleteModalOpen(true);
    },
    [setIsDeleteModalOpen]
  );

  const confirmDeleteBatchProduct = useCallback(async () => {
    if (!selectedBatchProductForDelete) return;

    const success = await handleDeleteBatchProduct(
      selectedBatchProductForDelete.batch_id
    );

    if (success) {
      setSelectedBatchProductForDelete(null);
    }
  }, [selectedBatchProductForDelete, handleDeleteBatchProduct]);

  // Handle batch actions
  const handleBatchActivate = useCallback(async () => {
    const selectedIds = Array.from(
      new Set(selectedBatchProducts.map((bp) => bp.batch_id))
    );
    const success = await handleBatchToggleStatus(selectedIds, true);
    if (success) {
      clearBatchProductSelections();
    }
  }, [selectedBatchProducts, handleBatchToggleStatus, clearBatchProductSelections]);

  const handleBatchDeactivate = useCallback(async () => {
    const selectedIds = Array.from(
      new Set(selectedBatchProducts.map((bp) => bp.batch_id))
    );
    const success = await handleBatchToggleStatus(selectedIds, false);
    if (success) {
      clearBatchProductSelections();
    }
  }, [selectedBatchProducts, handleBatchToggleStatus, clearBatchProductSelections]);

  // Handle sort
  const handleSort = useCallback(
    (column: string) => {
      const newOrder =
        filters.sort_by === column && filters.sort_order === "desc"
          ? "asc"
          : "desc";
      sortBatchProducts(column, newOrder);
    },
    [filters.sort_by, filters.sort_order, sortBatchProducts]
  );

  // Handle export
  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    showToast.info("Chức năng xuất dữ liệu sẽ được phát triển");
  }, []);

  // Handle create new batch product
  const handleCreateBatchProductClick = useCallback(() => {
    resetFormData();
    setIsCreateModalOpen(true);
  }, [resetFormData, setIsCreateModalOpen]);

  // Quick filter functions
  const handleQuickFilterExpiringSoon = useCallback(() => {
    updateBatchProductFilters({
      expiring_soon_days: 7,
      is_active: true,
    });
  }, [updateBatchProductFilters]);

  const handleQuickFilterLowStock = useCallback(() => {
    updateBatchProductFilters({
      low_stock: true,
      is_active: true,
    });
  }, [updateBatchProductFilters]);

  const handleQuickFilterActive = useCallback(() => {
    updateBatchProductFilters({
      is_active: true,
    });
  }, [updateBatchProductFilters]);

  const handleQuickFilterInactive = useCallback(() => {
    updateBatchProductFilters({
      is_active: false,
    });
  }, [updateBatchProductFilters]);

  // Initial load
  useEffect(() => {
    loadBatchProducts();
    loadBatchProductStats();
    loadFormDropdownData();
  }, [loadBatchProducts, loadBatchProductStats, loadFormDropdownData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý kho</h1>
          <p className="text-gray-600 mt-2">
            Quản lý các lô sản phẩm, theo dõi tồn kho và hạn sử dụng
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
          <Button
            onClick={handleCreateBatchProductClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tạo lô mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        data={statisticsData}
        loading={batchProductStatsLoading}
      />

      {/* Quick Filters */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Bộ lọc nhanh:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFilterExpiringSoon}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Sắp hết hạn ({batchProductStats.expiringSoonBatches})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFilterLowStock}
            className="flex items-center gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            Sắp hết hàng ({batchProductStats.lowStockBatches})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFilterActive}
          >
            Đang hoạt động ({batchProductCounts.active})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFilterInactive}
          >
            Không hoạt động ({batchProductCounts.inactive})
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Hiển thị {batchProducts.length} / {pagination.total} lô sản phẩm
          </span>
          <Select
            value={filters.limit?.toString() || "10"}
            onValueChange={(value) => changeLimit(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <BatchProductFilters
        filters={filters}
        onUpdateFilters={updateBatchProductFilters}
        onResetFilters={resetBatchProductFilters}
        loading={batchProductsLoading}
      />

      {/* Batch Actions */}
      {getSelectedCount() > 0 && (
        <BatchActions
          selectedCount={getSelectedCount()}
          onActivate={handleBatchActivate}
          onDeactivate={handleBatchDeactivate}
          onClearSelection={clearBatchProductSelections}
          loading={batchOperationLoading}
          activateText="Kích hoạt lô"
          deactivateText="Vô hiệu hóa lô"
        />
      )}

      {/* Table */}
      <BatchProductTable
        batchProducts={batchProducts}
        selectedIds={new Set(selectedBatchProducts.map((bp) => bp.batch_id))}
        loading={batchProductsLoading}
        onToggleSelection={toggleBatchProductSelection}
        onToggleAllSelection={toggleAllBatchProductsSelection}
        onEdit={handleEditBatchProduct}
        onDelete={handleDeleteBatchProductClick}
        onSort={handleSort}
        sortBy={filters.sort_by}
        sortOrder={filters.sort_order}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-700">
          Hiển thị{" "}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          đến{" "}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          trong tổng số <span className="font-medium">{pagination.total}</span>{" "}
          lô sản phẩm
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page <= 1 || batchProductsLoading}
          >
            Trước
          </Button>
          
          <span className="text-sm text-gray-700">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || batchProductsLoading}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Create Modal */}
      <BatchProductFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBatchProduct}
        formData={formData}
        onFormDataChange={updateFormData}
        loading={batchOperationLoading}
        products={products}
        productTypes={productTypes}
        promotions={promotions}
        warehouses={warehouses}
      />

      {/* Edit Modal */}
      <BatchProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBatchProductForDelete(null);
        }}
        onSubmit={(data) => {
          if (selectedBatchProductForDelete) {
            return handleUpdateBatchProduct(selectedBatchProductForDelete.batch_id, data);
          }
          return Promise.resolve(false);
        }}
        initialData={selectedBatchProductForDelete}
        formData={formData}
        onFormDataChange={updateFormData}
        loading={batchOperationLoading}
        products={products}
        productTypes={productTypes}
        promotions={promotions}
        warehouses={warehouses}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBatchProductForDelete(null);
        }}
        onConfirm={confirmDeleteBatchProduct}
        title="Xóa lô sản phẩm"
        description={
          selectedBatchProductForDelete
            ? `Bạn có chắc chắn muốn xóa lô "${selectedBatchProductForDelete.batch_number}"? Hành động này không thể hoàn tác.`
            : ""
        }
        loading={batchOperationLoading}
      />
    </div>
  );
}