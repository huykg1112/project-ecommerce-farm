"use client";

import { ProductFormModal } from "@/components/(dashboard)/products/product-form-modal";
import { ProductPagination } from "@/components/(dashboard)/products/product-pagination";
import { ProductTable } from "@/components/(dashboard)/products/product-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useProductManagement } from "@/hooks/use-product-management";
import { showToast } from "@/lib/toast-provider";
import { selectedProductAtom } from "@/lib_dashboard/store/product-store-management";
import { useAtom } from "jotai";
import { Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

export default function ProductsManagementPage() {
  const {
    // Data states
    myProducts,
    myProductsLoading,
    myProductStats,
    selectedProducts,
    productCounts,
    pagination,
    filters,

    // Loading states
    productsLoading,
    batchOperationLoading,

    // Query functions
    getMyProducts,
    getMyProductStats,

    // Filter functions
    updateProductFilters,
    resetProductFilters,
    changePage,
    changeLimit,
    sortProducts,

    // Selection functions
    toggleProductSelection,
    toggleAllProductsSelection,
    clearSelections,
    getSelectedCount,

    // Management functions
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    batchToggleStatus,
    batchDeleteProducts,

    // Modal states
    addProductModal,
    editProductModal,
    deleteProductModal,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,

    // Form states
    productFormData,
    updateProductForm,
    setProductForEditing,
    resetProductForm,
  } = useProductManagement();

  const [selectedProduct] = useAtom(selectedProductAtom);

  // Load data on component mount
  useEffect(() => {
    getMyProducts();
    getMyProductStats();
  }, [getMyProducts, getMyProductStats]);

  // Filter handlers
  const handleSearchChange = useCallback(
    (search: string) => {
      updateProductFilters({ search, page: 1 });
    },
    [updateProductFilters]
  );

  const handleCategoryChange = useCallback(
    (category_id: string) => {
      updateProductFilters({
        category_id: category_id === "all" ? "" : category_id,
        page: 1,
      });
    },
    [updateProductFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      updateProductFilters({
        status: status === "all" ? "all" : (status as "active" | "inactive"),
        page: 1,
      });
    },
    [updateProductFilters]
  );

  const handlePriceRangeChange = useCallback(
    (priceRange: { min?: number; max?: number }) => {
      updateProductFilters({
        price_min: priceRange.min,
        price_max: priceRange.max,
        page: 1,
      });
    },
    [updateProductFilters]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      changePage(page);
    },
    [changePage]
  );

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      changeLimit(limit);
    },
    [changeLimit]
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      sortProducts(sortBy as any, sortOrder);
    },
    [sortProducts]
  );

  // Action handlers
  const handleViewDetails = useCallback((productId: string) => {
    showToast.info("Tính năng xem chi tiết đang được phát triển");
  }, []);

  const handleEditProduct = useCallback(
    (productId: string) => {
      const product = myProducts.find((p) => p.product_id === productId);
      if (product) {
        setProductForEditing(product);
        openEditModal();
      }
    },
    [myProducts, setProductForEditing, openEditModal]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      openDeleteModal(productId);
    },
    [openDeleteModal]
  );

  const handleToggleStatus = useCallback(
    async (productId: string) => {
      try {
        await toggleProductStatus(productId);
        await getMyProducts(); // Refresh data
      } catch (error) {
        showToast.error("Không thể thay đổi trạng thái sản phẩm");
      }
    },
    [toggleProductStatus, getMyProducts]
  );

  const handleExport = useCallback(() => {
    showToast.info("Tính năng xuất dữ liệu đang được phát triển");
  }, []);

  // Form handlers
  const handleCreateProduct = useCallback(async () => {
    try {
      await createProduct(productFormData);
      await getMyProducts();
      await getMyProductStats();
      closeModals();
      showToast.success("Tạo sản phẩm thành công!");
      return true;
    } catch (error) {
      showToast.error("Không thể tạo sản phẩm");
      return false;
    }
  }, [
    createProduct,
    productFormData,
    getMyProducts,
    getMyProductStats,
    closeModals,
  ]);

  const handleUpdateProduct = useCallback(async () => {
    if (!selectedProduct?.product_id) return false;

    try {
      await updateProduct(selectedProduct.product_id, productFormData);
      await getMyProducts();
      await getMyProductStats();
      closeModals();
      showToast.success("Cập nhật sản phẩm thành công!");
      return true;
    } catch (error) {
      showToast.error("Không thể cập nhật sản phẩm");
      return false;
    }
  }, [
    updateProduct,
    selectedProduct,
    productFormData,
    getMyProducts,
    getMyProductStats,
    closeModals,
  ]);

  const handleDeleteProductConfirm = useCallback(async () => {
    if (!selectedProduct?.product_id) return false;

    try {
      await deleteProduct(selectedProduct.product_id);
      await getMyProducts();
      await getMyProductStats();
      closeModals();
      showToast.success("Xóa sản phẩm thành công!");
      return true;
    } catch (error) {
      showToast.error("Không thể xóa sản phẩm");
      return false;
    }
  }, [
    deleteProduct,
    selectedProduct,
    getMyProducts,
    getMyProductStats,
    closeModals,
  ]);

  // Batch action handlers
  const handleBatchActivate = useCallback(async () => {
    try {
      await batchToggleStatus(selectedProducts, true);
      await getMyProducts();
      await getMyProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể kích hoạt sản phẩm");
    }
  }, [
    batchToggleStatus,
    selectedProducts,
    getMyProducts,
    getMyProductStats,
    clearSelections,
  ]);

  const handleBatchDeactivate = useCallback(async () => {
    try {
      await batchToggleStatus(selectedProducts, false);
      await getMyProducts();
      await getMyProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể tạm dừng sản phẩm");
    }
  }, [
    batchToggleStatus,
    selectedProducts,
    getMyProducts,
    getMyProductStats,
    clearSelections,
  ]);

  const handleBatchDelete = useCallback(async () => {
    try {
      await batchDeleteProducts(selectedProducts);
      await getMyProducts();
      await getMyProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể xóa sản phẩm");
    }
  }, [
    batchDeleteProducts,
    selectedProducts,
    getMyProducts,
    getMyProductStats,
    clearSelections,
  ]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: myProductStats.total_products,
      active: myProductStats.active_products,
      inactive: myProductStats.inactive_products,
    }),
    [myProductStats]
  );

  // Get selected product name for delete modal
  const selectedProductName = useMemo(() => {
    return selectedProduct?.product_name;
  }, [selectedProduct]);

  const handleOpenAddModal = useCallback(() => {
    resetProductForm();
    openAddModal();
  }, [resetProductForm, openAddModal]);

  console.log("myProducts:", myProducts);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            🌾 Quản lý sản phẩm
          </h1>
          <p className="text-[#74a65d] mt-1">
            Quản lý sản phẩm thuốc bảo vệ thực vật của bạn
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
            disabled={myProductsLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
            disabled={myProductsLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>
      Statistics Cards
      <StatisticsCards
        stats={stats}
        title="sản phẩm"
        loading={myProductsLoading}
      />
      {/* Filters */}
      {/* <ProductFilters
        search={filters.search || ""}
        category_id={filters.category_id || "all"}
        status={filters.status || "all"}
        price_min={filters.price_min}
        price_max={filters.price_max}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onPriceRangeChange={handlePriceRangeChange}
        onReset={resetProductFilters}
      /> */}
      {/* Batch Actions */}
      <BatchActions
        selectedCount={getSelectedCount()}
        onBatchActivate={handleBatchActivate}
        onBatchDeactivate={handleBatchDeactivate}
        onBatchDelete={handleBatchDelete}
        loading={batchOperationLoading}
        title="sản phẩm"
      />
      {/* Products Table */}
      <ProductTable
        products={myProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={toggleProductSelection}
        onSelectAll={toggleAllProductsSelection}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={myProductsLoading}
      />
      {/* Pagination */}
      <ProductPagination
        currentPage={filters.page || 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit || 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onSortChange={handleSortChange}
        sortBy={filters.sort_by || "created_at"}
        sortOrder={filters.sort_order || "desc"}
      />
      {/* Modals */}
      <ProductFormModal
        open={addProductModal}
        onClose={closeModals}
        onSubmit={handleCreateProduct}
        formData={productFormData}
        onUpdateFormData={updateProductForm}
        title="Thêm sản phẩm mới"
        submitText="Tạo sản phẩm"
      />
      <ProductFormModal
        open={editProductModal}
        onClose={closeModals}
        onSubmit={handleUpdateProduct}
        formData={productFormData}
        onUpdateFormData={updateProductForm}
        title="Chỉnh sửa sản phẩm"
        submitText="Cập nhật"
        isEdit
      />
      <DeleteModal
        open={deleteProductModal}
        handleConfirm={handleDeleteProductConfirm}
        setOpen={closeModals}
        title="Xoá sản phẩm"
        nameDelete={selectedProductName}
      />
    </div>
  );
}
