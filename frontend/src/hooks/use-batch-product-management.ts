import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import {
  batchOperationLoadingAtom,
  batchProductCountsAtom,
  batchProductFiltersAtom,
  batchProductFormDataAtom,
  batchProductPaginationAtom,
  batchProductsDataAtom,
  batchProductsLoadingAtom,
  batchProductStatsAtom,
  batchProductStatsLoadingAtom,
  batchToggleStatusAtom,
  clearBatchProductSelectionsAtom,
  createBatchProductAtom,
  deleteBatchProductAtom,
  filteredBatchProductsAtom,
  getBatchProductByIdAtom,
  getBatchProductsAtom,
  getBatchProductStatsAtom,
  isCreateBatchProductModalOpenAtom,
  isDeleteBatchProductModalOpenAtom,
  isEditBatchProductModalOpenAtom,
  loadFormDataAtom,
  productsListAtom,
  productTypesListAtom,
  promotionsListAtom,
  resetBatchProductFiltersAtom,
  resetFormDataAtom,
  selectedBatchProductAtom,
  selectedBatchProductIdsAtom,
  selectedBatchProductsAtom,
  toggleAllBatchProductsSelectionAtom,
  toggleBatchProductSelectionAtom,
  updateBatchProductAtom,
  updateBatchProductFiltersAtom,
  warehousesListAtom,
} from "@/lib_dashboard/store/batch-product-store";
import {
  BatchProductFilters,
  BatchProductFormData,
} from "@/lib_dashboard/types/batch-product";

export function useBatchProductManagement() {
  // ================================================
  // 📊 DATA STATES
  // ================================================
  const [batchProducts] = useAtom(batchProductsDataAtom);
  const [filteredBatchProducts] = useAtom(filteredBatchProductsAtom);
  const [selectedBatchProduct] = useAtom(selectedBatchProductAtom);
  const [selectedBatchProducts] = useAtom(selectedBatchProductsAtom);
  const [selectedBatchProductIds] = useAtom(selectedBatchProductIdsAtom);
  const [batchProductCounts] = useAtom(batchProductCountsAtom);
  const [batchProductStats] = useAtom(batchProductStatsAtom);
  const [pagination] = useAtom(batchProductPaginationAtom);
  const [filters] = useAtom(batchProductFiltersAtom);
  const [formData] = useAtom(batchProductFormDataAtom);

  // Form dropdown data
  const [products] = useAtom(productsListAtom);
  const [productTypes] = useAtom(productTypesListAtom);
  const [promotions] = useAtom(promotionsListAtom);
  const [warehouses] = useAtom(warehousesListAtom);

  // ================================================
  // 🔄 LOADING STATES
  // ================================================
  const [batchProductsLoading] = useAtom(batchProductsLoadingAtom);
  const [batchProductStatsLoading] = useAtom(batchProductStatsLoadingAtom);
  const [batchOperationLoading] = useAtom(batchOperationLoadingAtom);

  // ================================================
  // 📝 MODAL STATES
  // ================================================
  const [isCreateModalOpen, setIsCreateModalOpen] = useAtom(
    isCreateBatchProductModalOpenAtom
  );
  const [isEditModalOpen, setIsEditModalOpen] = useAtom(
    isEditBatchProductModalOpenAtom
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useAtom(
    isDeleteBatchProductModalOpenAtom
  );

  // ================================================
  // 🔄 ACTION FUNCTIONS
  // ================================================
  const [, getBatchProducts] = useAtom(getBatchProductsAtom);
  const [, getBatchProductById] = useAtom(getBatchProductByIdAtom);
  const [, getBatchProductStats] = useAtom(getBatchProductStatsAtom);
  const [, createBatchProduct] = useAtom(createBatchProductAtom);
  const [, updateBatchProduct] = useAtom(updateBatchProductAtom);
  const [, deleteBatchProduct] = useAtom(deleteBatchProductAtom);
  const [, batchToggleStatus] = useAtom(batchToggleStatusAtom);

  // Form data loading
  const [, loadFormData] = useAtom(loadFormDataAtom);

  // ================================================
  // 🔍 FILTER FUNCTIONS
  // ================================================
  const [, updateFilters] = useAtom(updateBatchProductFiltersAtom);
  const [, resetFilters] = useAtom(resetBatchProductFiltersAtom);

  // ================================================
  // 🎯 SELECTION FUNCTIONS
  // ================================================
  const [, toggleSelection] = useAtom(toggleBatchProductSelectionAtom);
  const [, toggleAllSelection] = useAtom(toggleAllBatchProductsSelectionAtom);
  const [, clearSelections] = useAtom(clearBatchProductSelectionsAtom);

  // ================================================
  // 📄 PAGINATION FUNCTIONS
  // ================================================
  const changePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const changeLimit = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 });
    },
    [updateFilters]
  );

  const sortBatchProducts = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      updateFilters({ sort_by: sortBy, sort_order: sortOrder, page: 1 });
    },
    [updateFilters]
  );

  // ================================================
  // 🛠️ HELPER FUNCTIONS
  // ================================================
  const getSelectedCount = useCallback(() => {
    return selectedBatchProductIds.size;
  }, [selectedBatchProductIds]);

  const isAllSelected = useCallback(() => {
    return (
      batchProducts.length > 0 &&
      selectedBatchProductIds.size === batchProducts.length
    );
  }, [batchProducts.length, selectedBatchProductIds.size]);

  const isSomeSelected = useCallback(() => {
    return (
      selectedBatchProductIds.size > 0 &&
      selectedBatchProductIds.size < batchProducts.length
    );
  }, [batchProducts.length, selectedBatchProductIds.size]);

  // ================================================
  // 📝 FORM FUNCTIONS
  // ================================================
  const [, setFormData] = useAtom(batchProductFormDataAtom);

  const updateFormData = useCallback(
    (updates: Partial<BatchProductFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    [setFormData]
  );

  const [, resetForm] = useAtom(resetFormDataAtom);

  const resetFormData = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Load form dropdown data
  const loadFormDropdownData = useCallback(async () => {
    try {
      await loadFormData();
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  }, [loadFormData]);

  // ================================================
  // 🎛️ MANAGEMENT FUNCTIONS
  // ================================================
  const handleCreateBatchProduct = useCallback(
    async (data: BatchProductFormData) => {
      try {
        await createBatchProduct(data);
        return true;
      } catch (error) {
        console.error("Error creating batch product:", error);
        return false;
      }
    },
    [createBatchProduct]
  );

  const handleUpdateBatchProduct = useCallback(
    async (id: string, data: Partial<BatchProductFormData>) => {
      try {
        await updateBatchProduct(id, data);
        return true;
      } catch (error) {
        console.error("Error updating batch product:", error);
        return false;
      }
    },
    [updateBatchProduct]
  );

  const handleDeleteBatchProduct = useCallback(
    async (id: string) => {
      try {
        await deleteBatchProduct(id);
        return true;
      } catch (error) {
        console.error("Error deleting batch product:", error);
        return false;
      }
    },
    [deleteBatchProduct]
  );

  const handleBatchToggleStatus = useCallback(
    async (batchIds: string[], isActive: boolean) => {
      try {
        await batchToggleStatus(batchIds, isActive);
        return true;
      } catch (error) {
        console.error("Error toggling batch status:", error);
        return false;
      }
    },
    [batchToggleStatus]
  );

  // ================================================
  // 🔍 FILTER HELPER FUNCTIONS
  // ================================================
  const updateBatchProductFilters = useCallback(
    (newFilters: Partial<BatchProductFilters>) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const resetBatchProductFilters = useCallback(() => {
    resetFilters();
    clearSelections();
  }, [resetFilters, clearSelections]);

  // ================================================
  // 🎯 SELECTION HELPER FUNCTIONS
  // ================================================
  const toggleBatchProductSelection = useCallback(
    (batchId: string) => {
      toggleSelection(batchId);
    },
    [toggleSelection]
  );

  const toggleAllBatchProductsSelection = useCallback(() => {
    toggleAllSelection();
  }, [toggleAllSelection]);

  const clearBatchProductSelections = useCallback(() => {
    clearSelections();
  }, [clearSelections]);

  // ================================================
  // 📊 DATA LOADING
  // ================================================
  const loadBatchProducts = useCallback(
    async (customFilters?: Partial<BatchProductFilters>) => {
      try {
        await getBatchProducts(customFilters);
      } catch (error) {
        console.error("Error loading batch products:", error);
      }
    },
    [getBatchProducts]
  );

  const loadBatchProductStats = useCallback(async () => {
    try {
      await getBatchProductStats();
    } catch (error) {
      console.error("Error loading batch product stats:", error);
    }
  }, [getBatchProductStats]);

  const loadBatchProductById = useCallback(
    async (id: string) => {
      try {
        await getBatchProductById(id);
      } catch (error) {
        console.error("Error loading batch product:", error);
      }
    },
    [getBatchProductById]
  );

  // ================================================
  // 🔄 EFFECTS
  // ================================================
  useEffect(() => {
    loadBatchProducts();
    loadBatchProductStats();
  }, [filters]); // Reload when filters change

  // ================================================
  // 📤 RETURN HOOK DATA
  // ================================================
  return {
    // Data states
    batchProducts,
    filteredBatchProducts,
    selectedBatchProduct,
    selectedBatchProducts,
    selectedBatchProductIds,
    batchProductCounts,
    batchProductStats,
    pagination,
    filters,
    formData,

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

    // Data loading functions
    loadBatchProducts,
    loadBatchProductStats,
    loadBatchProductById,

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

    // Form functions
    updateFormData,
    resetFormData,
    loadFormDropdownData,

    // Form dropdown data
    products,
    productTypes,
    promotions,
    warehouses,
  };
}