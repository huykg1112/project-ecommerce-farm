import {
  adminProductStatsAtom,
  allProductsAdminAtom,
  fetchAdminProductStatsAtom,
  fetchAllProductsAdminAtom,
  fetchMyProductsAtom,
  fetchMyProductStatsAtom,
  myProductsAtom,
  myProductsLoadingAtom,
  myProductStatsAtom,
  productCountsByStatusAtom,
  selectedProductsAtom,
  statsDistributorIdAtom,
  // Form management atoms
  productFormDataAtom,
  productFormErrorsAtom,
  productFormLoadingAtom,
  addProductModalAtom,
  editProductModalAtom,
  deleteProductModalAtom,
  productDetailModalAtom,
  batchOperationLoadingAtom,
  // Actions
  createProductAtom,
  updateProductAtom,
  deleteProductAtom,
  toggleProductStatusAtom,
  batchToggleStatusAtom,
  batchDeleteProductsAtom,
  toggleProductSelectionAtom,
  toggleAllProductsSelectionAtom,
  updateProductFormAtom,
  setProductForEditingAtom,
  resetProductFormAtom,
  clearSelectionsAtom,
  // Pagination and filters
  productFiltersAtom,
  productPaginationAtom,
  updateFiltersAtom,
  resetFiltersAtom,
  fetchProductsAtom,
  selectedProductAtom,
} from "@/lib_dashboard/store/product-store-management";
import { ProductFilters, ProductFormData } from "@/lib_dashboard/types/product";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
// Import removed to avoid circular dependency

/**
 * Hook tổng hợp cho quản lý sản phẩm trong dashboard
 * Kết hợp tất cả functionality cần thiết cho trang quản lý
 */
export const useProductManagement = () => {

  // === DIRECT ATOM ACCESS ===
  const myProducts = useAtomValue(myProductsAtom);
  const myProductsLoading = useAtomValue(myProductsLoadingAtom);
  const myProductStats = useAtomValue(myProductStatsAtom);
  const selectedProducts = useAtomValue(selectedProductsAtom);
  const productCounts = useAtomValue(productCountsByStatusAtom);
  const batchOperationLoading = useAtomValue(batchOperationLoadingAtom);
  
  // Pagination and filters
  const pagination = useAtomValue(productPaginationAtom);
  const filters = useAtomValue(productFiltersAtom);
  
  // Form management
  const productFormData = useAtomValue(productFormDataAtom);
  const productFormErrors = useAtomValue(productFormErrorsAtom);
  const productFormLoading = useAtomValue(productFormLoadingAtom);
  
  // Modal states
  const addProductModal = useAtomValue(addProductModalAtom);
  const editProductModal = useAtomValue(editProductModalAtom);
  const deleteProductModal = useAtomValue(deleteProductModalAtom);
  const productDetailModal = useAtomValue(productDetailModalAtom);

  // === ACTIONS ===
  const [, fetchMyProducts] = useAtom(fetchMyProductsAtom);
  const [, fetchMyProductStats] = useAtom(fetchMyProductStatsAtom);
  const [, createProduct] = useAtom(createProductAtom);
  const [, updateProduct] = useAtom(updateProductAtom);
  const [, deleteProduct] = useAtom(deleteProductAtom);
  const [, toggleProductStatus] = useAtom(toggleProductStatusAtom);
  const [, batchToggleStatus] = useAtom(batchToggleStatusAtom);
  const [, batchDeleteProducts] = useAtom(batchDeleteProductsAtom);
  
  // Selection actions
  const [, toggleProductSelection] = useAtom(toggleProductSelectionAtom);
  const [, toggleAllProductsSelection] = useAtom(toggleAllProductsSelectionAtom);
  const [, clearSelections] = useAtom(clearSelectionsAtom);
  
  // Form actions
  const [, updateProductForm] = useAtom(updateProductFormAtom);
  const [, setProductForEditing] = useAtom(setProductForEditingAtom);
  const [, resetProductForm] = useAtom(resetProductFormAtom);
  
  // Filter actions
  const [, updateFilters] = useAtom(updateFiltersAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);
  
  // Modal actions
  const [addModalOpen, setAddModalOpen] = useAtom(addProductModalAtom);
  const [editModalOpen, setEditModalOpen] = useAtom(editProductModalAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteProductModalAtom);
  const [, setSelectedProduct] = useAtom(selectedProductAtom);

  // === MANAGEMENT FUNCTIONS ===

  /**
   * Load my products
   */
  const getMyProducts = useCallback(async () => {
    return await fetchMyProducts();
  }, [fetchMyProducts]);

  /**
   * Load my product statistics
   */
  const getMyProductStats = useCallback(async () => {
    return await fetchMyProductStats();
  }, [fetchMyProductStats]);

  /**
   * Update product filters
   */
  const updateProductFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  /**
   * Reset product filters
   */
  const resetProductFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  /**
   * Change page
   */
  const changePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  /**
   * Change items per page
   */
  const changeLimit = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 });
    },
    [updateFilters]
  );

  /**
   * Sort products
   */
  const sortProducts = useCallback(
    (
      sortBy: ProductFilters["sort_by"],
      sortOrder: ProductFilters["sort_order"] = "desc"
    ) => {
      updateFilters({ sort_by: sortBy, sort_order: sortOrder, page: 1 });
    },
    [updateFilters]
  );

  /**
   * Get selected count
   */
  const getSelectedCount = useCallback(() => {
    return selectedProducts.length;
  }, [selectedProducts]);

  /**
   * Check if all products are selected
   */
  const isAllSelected = useCallback(() => {
    return myProducts.length > 0 && selectedProducts.length === myProducts.length;
  }, [myProducts, selectedProducts]);

  /**
   * Check if selection is indeterminate
   */
  const isIndeterminate = useCallback(() => {
    return selectedProducts.length > 0 && selectedProducts.length < myProducts.length;
  }, [myProducts, selectedProducts]);

  // === MODAL MANAGEMENT ===

  /**
   * Open add product modal
   */
  const openAddModal = useCallback(() => {
    setAddModalOpen(true);
  }, [setAddModalOpen]);

  /**
   * Open edit product modal
   */
  const openEditModal = useCallback(() => {
    setEditModalOpen(true);
  }, [setEditModalOpen]);

  /**
   * Open delete product modal
   */
  const openDeleteModal = useCallback((productId: string) => {
    const product = myProducts.find(p => p.product_id === productId);
    if (product) {
      setSelectedProduct(product);
      setDeleteModalOpen(true);
    }
  }, [myProducts, setSelectedProduct, setDeleteModalOpen]);

  /**
   * Close all modals
   */
  const closeModals = useCallback(() => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  }, [setAddModalOpen, setEditModalOpen, setDeleteModalOpen, setSelectedProduct]);

  // === AUTO-LOAD DATA ===
  useEffect(() => {
    // Auto load data when component mounts
    if (myProducts.length === 0 && !myProductsLoading) {
      fetchMyProducts();
      fetchMyProductStats();
    }
  }, [myProducts.length, myProductsLoading, fetchMyProducts, fetchMyProductStats]);

  return {

    // === DATA STATES ===
    myProducts,
    myProductsLoading,
    myProductStats,
    selectedProducts,
    productCounts,
    pagination,
    filters,

    // === LOADING STATES ===
    productsLoading: myProductsLoading,
    batchOperationLoading,
    productFormLoading,

    // === FORM STATES ===
    productFormData,
    productFormErrors,
    
    // === MODAL STATES ===
    addProductModal,
    editProductModal,
    deleteProductModal,
    productDetailModal,

    // === QUERY FUNCTIONS ===
    getMyProducts,
    getMyProductStats,

    // === FILTER FUNCTIONS ===
    updateProductFilters,
    resetProductFilters,
    changePage,
    changeLimit,
    sortProducts,

    // === SELECTION FUNCTIONS ===
    toggleProductSelection,
    toggleAllProductsSelection,
    clearSelections,
    getSelectedCount,
    isAllSelected,
    isIndeterminate,

    // === MANAGEMENT FUNCTIONS ===
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    batchToggleStatus,
    batchDeleteProducts,

    // === MODAL FUNCTIONS ===
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,

    // === FORM FUNCTIONS ===
    updateProductForm,
    setProductForEditing,
    resetProductForm,
  };
};
