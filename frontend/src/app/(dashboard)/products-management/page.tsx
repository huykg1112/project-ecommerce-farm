"use client";

import { ProductFilters } from "@/components/(dashboard)/products/product-filters";
import { ProductFormModal } from "@/components/(dashboard)/products/product-form-modal";
import { ProductPagination } from "@/components/(dashboard)/products/product-pagination";
import { ProductTable } from "@/components/(dashboard)/products/product-table";
import { BatchActions } from "@/components/(dashboard)/shared/batch-actions";
import DeleteModal from "@/components/(dashboard)/shared/delete-modal";
import { StatisticsCards } from "@/components/(dashboard)/shared/statistics-cards";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-provider";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import {
  Product,
  ProductFormData,
  ProductStatsResponse,
} from "@/lib_dashboard/types/product";
import { Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ProductFiltersState {
  search?: string;
  category_ids?: string[]; // Changed from category_id to category_ids array
  status?: "active" | "inactive" | "all";
  price_min?: number;
  price_max?: number;
  sort_by?: "name" | "price" | "created_at" | "rating";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ProductsManagementPage() {
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [productStats, setProductStats] = useState<ProductStatsResponse>({
    total_products: 0,
    active_products: 0,
    inactive_products: 0,
    avg_price: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [batchOperationLoading, setBatchOperationLoading] = useState(false);

  // Modal states
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);

  const [productFormData, setProductFormData] = useState<ProductFormData>({
    product_name: "",
    description: "",
    usage_instructions: "",
    unit_product_price: 0,
    category_ids: [],
    manufacturer_id: "",
    ingredient_ids: [],
    disease_ids: [],
    ingredient_id_primary: "",
    disease_id_primary: "",
    is_active: true,
    product_images: [], // For image uploads
  });

  // Filter states
  const [filters, setFilters] = useState<ProductFiltersState>({
    search: "",
    category_ids: [], // Changed to empty array for multi-select
    status: "all",
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchProductStats();
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productServiceManagement.getProducts();
      setProducts(response);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product stats
  const fetchProductStats = useCallback(async () => {
    try {
      const stats = await productServiceManagement.getMyProductStats();
      setProductStats(stats);
    } catch (error) {
      console.error("Error fetching product stats:", error);
    }
  }, []);

  // Filtered and paginated products using useMemo
  const filteredProducts = useMemo(() => {
    console.log("🔄 filteredProducts recomputing with:", {
      sortBy: filters.sort_by,
      sortOrder: filters.sort_order,
    });
    let filtered = products;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(filters.search!.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(filters.search!.toLowerCase())
      );
    }

    // Apply category filter - support multiple categories
    if (filters.category_ids && filters.category_ids.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => filters.category_ids!.includes(cat.id))
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((product) =>
        filters.status === "active" ? product.is_active : !product.is_active
      );
    }

    // Apply price filter
    if (filters.price_min !== undefined) {
      filtered = filtered.filter(
        (product) => product.unit_product_price >= filters.price_min!
      );
    }
    if (filters.price_max !== undefined) {
      filtered = filtered.filter(
        (product) => product.unit_product_price <= filters.price_max!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const order = filters.sort_order === "asc" ? 1 : -1;
      switch (filters.sort_by) {
        case "name":
          return a.product_name.localeCompare(b.product_name) * order;
        case "price":
          return (a.unit_product_price - b.unit_product_price) * order;
        case "created_at":
          return (
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()) *
            order
          );
        case "rating":
          // Calculate rating from reviews instead of using avg_rating
          const getCalculatedRating = (product: Product) => {
            if (!product.reviews || product.reviews.length === 0) return 0;
            const reviewsWithRating = product.reviews.filter(
              (review) => review.rating != null
            );
            if (reviewsWithRating.length === 0) return 0;
            const totalRating = reviewsWithRating.reduce(
              (sum, review) => sum + (review.rating || 0),
              0
            );
            return totalRating / reviewsWithRating.length;
          };

          const ratingA = getCalculatedRating(a);
          const ratingB = getCalculatedRating(b);
          return (ratingA - ratingB) * order;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (filters.page! - 1) * filters.limit!;
    const endIndex = startIndex + filters.limit!;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, filters.page, filters.limit]);

  // Update pagination when filtered products change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / filters.limit!),
    }));
  }, [filteredProducts, filters.limit]);

  // Statistics using useMemo - calculated from filtered products instead of API stats
  const stats = useMemo(
    () => ({
      total: filteredProducts.length,
      active: filteredProducts.filter((product) => product.is_active).length,
      inactive: filteredProducts.filter((product) => !product.is_active).length,
    }),
    [filteredProducts]
  );

  // Filter handlers
  const updateFilters = useCallback((updates: Partial<ProductFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 });
    },
    [updateFilters]
  );

  const handleCategoryChange = useCallback(
    (category_ids: string[]) => {
      updateFilters({
        category_ids: category_ids,
        page: 1,
      });
    },
    [updateFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({
        status: status === "all" ? "all" : (status as "active" | "inactive"),
        page: 1,
      });
    },
    [updateFilters]
  );

  const handlePriceRangeChange = useCallback(
    (priceRange: { min?: number; max?: number }) => {
      updateFilters({
        price_min: priceRange.min,
        price_max: priceRange.max,
        page: 1,
      });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      category_ids: [],
      status: "all",
      sort_by: "created_at",
      sort_order: "desc",
      page: 1,
      limit: 10,
    });
  }, []);

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

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      updateFilters({ sort_by: sortBy as any, sort_order: sortOrder, page: 1 });
    },
    [updateFilters]
  );

  // Selection handlers
  const toggleProductSelection = useCallback((productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const toggleAllProductsSelection = useCallback(() => {
    const allIds = paginatedProducts.map((p) => p.product_id);
    setSelectedProducts((prev) =>
      prev.length === allIds.length ? [] : allIds
    );
  }, [paginatedProducts]);

  const clearSelections = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const getSelectedCount = useCallback(() => {
    return selectedProducts.length;
  }, [selectedProducts]);

  // Action handlers
  const handleViewDetails = useCallback((productId: string) => {
    showToast.info("Tính năng xem chi tiết đang được phát triển");
  }, []);

  const handleEditProduct = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.product_id === productId);
      if (product) {
        setSelectedProduct(product);
        setProductFormData({
          product_name: product.product_name,
          description: product.description || "",
          usage_instructions: product.usage_instructions || "",
          unit_product_price: product.unit_product_price,
          category_ids: product.categories.map((cat) => cat.id),
          manufacturer_id: product.manufacturer?.id || "",
          ingredient_ids: product.product_ingredients.map(
            (ing) => ing.ingredient_id
          ),
          disease_ids: product.productDiseases.map((dis) => dis.disease_id),
          ingredient_id_primary:
            product.product_ingredients.find((ing) => ing.is_primary)
              ?.ingredient_id || "",
          disease_id_primary:
            product.productDiseases.find((dis) => dis.is_primary)?.disease_id ||
            "",
          is_active: product.is_active,
          product_images: [],
        });
        setEditProductModal(true);
      }
    },
    [products]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.product_id === productId);
      if (product) {
        setSelectedProduct(product);
        setDeleteProductModal(true);
      }
    },
    [products]
  );

  const handleToggleStatus = useCallback(
    async (productId: string) => {
      try {
        await productServiceManagement.toggleProductStatus(productId);
        await fetchProducts();
        await fetchProductStats();
      } catch (error) {
        showToast.error("Không thể thay đổi trạng thái sản phẩm");
      }
    },
    [fetchProducts, fetchProductStats]
  );

  const handleExport = useCallback(() => {
    showToast.info("Tính năng xuất dữ liệu đang được phát triển");
  }, []);

  // Modal handlers
  const openAddModal = useCallback(() => {
    setProductFormData({
      product_name: "",
      description: "",
      usage_instructions: "",
      unit_product_price: 0,
      category_ids: [],
      manufacturer_id: "",
      ingredient_ids: [],
      disease_ids: [],
      ingredient_id_primary: "",
      disease_id_primary: "",
      is_active: true,
      product_images: [], // For image uploads
    });
    setAddProductModal(true);
  }, []);

  const closeModals = useCallback(() => {
    setAddProductModal(false);
    setEditProductModal(false);
    setDeleteProductModal(false);
    setSelectedProduct(null);
  }, []);

  // Form handlers
  const updateProductForm = useCallback((updates: Partial<ProductFormData>) => {
    setProductFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCreateProduct = useCallback(async () => {
    try {
      console.log("Creating product with data:", productFormData);
      await productServiceManagement.createProduct(productFormData);
      await fetchProducts();
      await fetchProductStats();
      closeModals();
      return true;
    } catch (error) {
      showToast.error("Không thể tạo sản phẩm mới");
      return false;
    }
  }, [productFormData, fetchProducts, fetchProductStats, closeModals]);

  const handleUpdateProduct = useCallback(async () => {
    if (!selectedProduct?.product_id) return false;

    try {
      console.log("Updating product with data:", productFormData);

      await productServiceManagement.updateProduct(
        selectedProduct.product_id,
        productFormData
      );
      await fetchProducts();
      await fetchProductStats();
      closeModals();
      return true;
    } catch (error) {
      showToast.error("Không thể cập nhật sản phẩm");
      return false;
    }
  }, [
    selectedProduct,
    productFormData,
    fetchProducts,
    fetchProductStats,
    closeModals,
  ]);

  const handleDeleteProductConfirm = useCallback(async () => {
    if (!selectedProduct?.product_id) return false;

    try {
      await productServiceManagement.deleteProduct(selectedProduct.product_id);
      await fetchProducts();
      await fetchProductStats();
      closeModals();
      return true;
    } catch (error) {
      showToast.error("Không thể xóa sản phẩm");
      return false;
    }
  }, [selectedProduct, fetchProducts, fetchProductStats, closeModals]);

  // Batch action handlers
  const handleBatchActivate = useCallback(async () => {
    setBatchOperationLoading(true);
    try {
      await productServiceManagement.batchToggleStatus({
        product_ids: selectedProducts,
        is_active: true,
      });
      await fetchProducts();
      await fetchProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể kích hoạt sản phẩm");
    } finally {
      setBatchOperationLoading(false);
    }
  }, [selectedProducts, fetchProducts, fetchProductStats, clearSelections]);

  const handleBatchDeactivate = useCallback(async () => {
    setBatchOperationLoading(true);
    try {
      await productServiceManagement.batchToggleStatus({
        product_ids: selectedProducts,
        is_active: false,
      });
      await fetchProducts();
      await fetchProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể tạm dừng sản phẩm");
    } finally {
      setBatchOperationLoading(false);
    }
  }, [selectedProducts, fetchProducts, fetchProductStats, clearSelections]);

  const handleBatchDelete = useCallback(async () => {
    setBatchOperationLoading(true);
    try {
      await productServiceManagement.batchDeleteProducts({
        product_ids: selectedProducts,
      });
      await fetchProducts();
      await fetchProductStats();
      clearSelections();
    } catch (error) {
      showToast.error("Không thể xóa sản phẩm");
    } finally {
      setBatchOperationLoading(false);
    }
  }, [selectedProducts, fetchProducts, fetchProductStats, clearSelections]);

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
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button
            onClick={openAddModal}
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} title="sản phẩm" loading={loading} />

      {/* Filters */}
      <ProductFilters
        search={filters.search || ""}
        category_ids={filters.category_ids || []}
        status={filters.status || "all"}
        price_min={filters.price_min}
        price_max={filters.price_max}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onPriceRangeChange={handlePriceRangeChange}
        onReset={resetFilters}
      />

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
        products={paginatedProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={toggleProductSelection}
        onSelectAll={toggleAllProductsSelection}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
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
        isEdit={false}
      />

      <ProductFormModal
        open={editProductModal}
        onClose={closeModals}
        onSubmit={handleUpdateProduct}
        formData={productFormData}
        onUpdateFormData={updateProductForm}
        title="Chỉnh sửa sản phẩm"
        submitText="Cập nhật"
        isEdit={true}
        currentImages={selectedProduct?.images}
      />

      <DeleteModal
        open={deleteProductModal}
        handleConfirm={handleDeleteProductConfirm}
        setOpen={closeModals}
        title="Xoá sản phẩm"
        nameDelete={selectedProduct?.product_name}
      />
    </div>
  );
}
