"use client";

import { BatchProductFilters } from "@/components/(dashboard)/batch-products/batch-product-filters";
import { BatchProductFormModal } from "@/components/(dashboard)/batch-products/batch-product-form-modal";
import { BatchProductStatisticsCards } from "@/components/(dashboard)/batch-products/batch-product-statistics-cards";
import { BatchProductTable } from "@/components/(dashboard)/batch-products/batch-product-table";
import { DeleteModal } from "@/components/common/delete-modal";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-provider";
import { batchProductService } from "@/lib_dashboard/services/batch-product-service";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { productTypeService } from "@/lib_dashboard/services/product-type-service";
import { promotionService } from "@/lib_dashboard/services/promotio-service-management";
import {
  BatchProduct,
  BatchProductFilters as BatchProductFiltersType,
  BatchProductFormData,
  BatchProductStats,
  ProductType,
} from "@/lib_dashboard/types/batch-product";
import { Product } from "@/lib_dashboard/types/product";
import { Promotion } from "@/lib_dashboard/types/promotion";
import { Calendar, Download, Package, Plus, TrendingDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Main component
export default function BatchProductsManagementPage() {
  // State
  const [batchProducts, setBatchProducts] = useState<BatchProduct[]>([]);
  const [dataDatchProductsFiltered, setDataDatchProductsFiltered] = useState<
    BatchProduct[]
  >([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [batchProductsLoading, setBatchProductsLoading] =
    useState<boolean>(false);
  const [batchOperationLoading, setBatchOperationLoading] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<Partial<BatchProductFiltersType>>({
    search: "",
    product_id: "",
    is_active: undefined,
    expiring_soon_days: 999999,
    low_stock: undefined,
    batch_number: "",
    from_date: "",
    to_date: "",
  });
  const [selectedBatchProductIds, setSelectedBatchProductIds] = useState<
    string[]
  >([]);
  const [formData, setFormData] = useState<BatchProductFormData>({
    product_id: "",
    batch_number: "",
    quantity: 0,
    manufactured_date: "",
    expiry_date: "",
    low_stock_threshold: 10,
    unit_product_price: 0,
    is_active: true,
    product_type_id: "",
    promotion_ids: [],
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [warehouses, setWarehouses] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [batchProductStats, setBatchProductStats] = useState<BatchProductStats>(
    {
      totalBatches: 0,
      activeBatches: 0,
      expiringSoonBatches: 0,
      lowStockBatches: 0,
      totalQuantity: 0,
      averageQuantity: 0,
    }
  );
  const [selectedBatchProductForDelete, setSelectedBatchProductForDelete] =
    useState<BatchProduct | null>(null);

  // Fetch all batch products
  const loadBatchProducts = useCallback(async () => {
    setBatchProductsLoading(true);
    try {
      const response = await batchProductService.getBatchProducts();
      const data = response;
      setBatchProducts(data);
      setPagination({
        page: 1,
        limit: 10,
        total: data.length,
        totalPages: Math.ceil(data.length / 10),
      });
      setBatchProductStats({
        totalBatches: data.length,
        activeBatches: data.filter((b: BatchProduct) => b.is_active).length,
        expiringSoonBatches: data.filter(
          (b: BatchProduct) =>
            b.is_active &&
            new Date(b.expiry_date) <=
              new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        ).length,
        lowStockBatches: data.filter(
          (b: BatchProduct) =>
            b.is_active && b.quantity <= b.low_stock_threshold
        ).length,
        totalQuantity: data.reduce(
          (sum: number, b: BatchProduct) => sum + b.quantity,
          0
        ),
        averageQuantity: data.length
          ? data.reduce((sum: number, b: BatchProduct) => sum + b.quantity, 0) /
            data.length
          : 0,
      });
    } catch (error) {
    } finally {
      setBatchProductsLoading(false);
    }
  }, []);

  // Fetch form dropdown data
  const loadFormDropdownData = useCallback(async () => {
    try {
      const productsResponse = await productServiceManagement.getMyProducts(); // Assuming product data is available via batchProductService
      setProducts(productsResponse);

      const productTypesResponse = await productTypeService.getProductTypes(); // Replace with actual product type service if available
      setProductTypes(productTypesResponse);

      const promotionsResponse = await promotionService.getPromotions(); // Replace with actual promotion service if available
      setPromotions(promotionsResponse.filter((p: Promotion) => p.is_active));

      // console.log(
      //   "data",
      //   productsResponse,
      //   productTypesResponse,
      //   promotionsResponse
      // );
    } catch (error) {
      showToast.error("Lỗi khi lấy dữ liệu dropdown");
    }
  }, []);
  // console.log("batchProducts", batchProducts);

  // Create batch product
  const handleCreateBatchProduct = useCallback(
    async (data: BatchProductFormData) => {
      setBatchOperationLoading(true);
      try {
        const response = await batchProductService.createBatchProduct(data);
        setBatchProducts((prev) => [...prev, response]);
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
          totalPages: Math.ceil((prev.total + 1) / prev.limit),
        }));
        setBatchProductStats((prev) => ({
          ...prev,
          totalBatches: prev.totalBatches + 1,
          activeBatches: response.is_active
            ? prev.activeBatches + 1
            : prev.activeBatches,
          totalQuantity: prev.totalQuantity + response.quantity,
          averageQuantity:
            (prev.totalQuantity + response.quantity) / (prev.totalBatches + 1),
        }));
        setIsCreateModalOpen(false);
        setFormData({
          product_id: "",
          batch_number: "",
          quantity: 0,
          manufactured_date: "",
          expiry_date: "",
          low_stock_threshold: 10,
          unit_product_price: 0,
          is_active: true,
          product_type_id: "",
          promotion_ids: [],
        });
        // showToast.success("Tạo lô sản phẩm thành công!");
        return true;
      } catch (error) {
        // showToast.error("Lỗi khi tạo lô sản phẩm");
        return false;
      } finally {
        setBatchOperationLoading(false);
      }
    },
    []
  );

  // Update batch product
  const handleUpdateBatchProduct = useCallback(
    async (id: string, data: Partial<BatchProductFormData>) => {
      setBatchOperationLoading(true);
      try {
        const response = await batchProductService.updateBatchProduct(id, data);
        setBatchProducts((prev) =>
          prev.map((batch) => (batch.batch_id === id ? response : batch))
        );
        setBatchProductStats((prev) => {
          const oldBatch = prev.totalBatches
            ? prev.totalQuantity / prev.totalBatches
            : 0;
          return {
            ...prev,
            activeBatches: response.is_active
              ? prev.activeBatches + 1
              : prev.activeBatches - 1,
            totalQuantity: prev.totalQuantity + response.quantity - oldBatch,
            averageQuantity: prev.totalBatches
              ? (prev.totalQuantity + response.quantity) / prev.totalBatches
              : 0,
          };
        });
        setIsEditModalOpen(false);
        setSelectedBatchProductForDelete(null);
        // showToast.success("Cập nhật lô sản phẩm thành công!");
        return true;
      } catch (error) {
        // showToast.error("Lỗi khi cập nhật lô sản phẩm");
        return false;
      } finally {
        setBatchOperationLoading(false);
      }
    },
    []
  );

  // Delete batch product
  const handleDeleteBatchProduct = useCallback(async (id: string) => {
    setBatchOperationLoading(true);
    try {
      await batchProductService.deleteBatchProduct(id);
      setBatchProducts((prev) => prev.filter((batch) => batch.batch_id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
      setSelectedBatchProductIds((prev) =>
        prev.filter((batchId) => batchId !== id)
      );
      setBatchProductStats((prev) => ({
        ...prev,
        totalBatches: prev.totalBatches - 1,
        activeBatches: prev.activeBatches - 1,
        totalQuantity: prev.totalQuantity - prev.averageQuantity,
        averageQuantity:
          prev.totalBatches - 1
            ? prev.totalQuantity / (prev.totalBatches - 1)
            : 0,
      }));
      setIsDeleteModalOpen(false);
      setSelectedBatchProductForDelete(null);
      // showToast.success("Xóa lô sản phẩm thành công!");
      return true;
    } catch (error) {
      // showToast.error("Lỗi khi xóa lô sản phẩm");
      return false;
    } finally {
      setBatchOperationLoading(false);
    }
  }, []);

  // Batch toggle status
  const handleBatchToggleStatus = useCallback(
    async (batchIds: string[], isActive: boolean) => {
      setBatchOperationLoading(true);
      try {
        const response = await batchProductService.batchToggleStatus({
          batch_ids: batchIds,
          is_active: isActive,
        });
        setBatchProducts((prev) =>
          prev.map((batch) =>
            batchIds.includes(batch.batch_id)
              ? { ...batch, is_active: isActive }
              : batch
          )
        );
        setBatchProductStats((prev) => ({
          ...prev,
          activeBatches:
            prev.activeBatches +
            (isActive ? batchIds.length : -batchIds.length),
        }));
        setSelectedBatchProductIds([]);
        showToast.success(
          `${isActive ? "Kích hoạt" : "Vô hiệu hóa"} ${
            batchIds.length
          } lô sản phẩm thành công!`
        );
        return true;
      } catch (error) {
        showToast.error("Lỗi khi thay đổi trạng thái lô sản phẩm");
        return false;
      } finally {
        setBatchOperationLoading(false);
      }
    },
    []
  );

  // Filter and sort batch products
  const filteredBatchProducts = useMemo(() => {
    let filtered: BatchProduct[] = batchProducts || [];

    // Filter by search (product name or batch number)
    if (filters.search && filters.search.trim()) {
      filtered = filtered.filter(
        (batch) =>
          batch.product.product_name
            .toLowerCase()
            .includes(filters.search!.toLowerCase()) ||
          batch.batch_number
            .toLowerCase()
            .includes(filters.search!.toLowerCase())
      );
    }

    // Filter by stock quantity thresholds
    if (filters.stock_quantity_threshold !== undefined) {
      filtered = filtered.filter(
        (batch) => batch.quantity <= filters.stock_quantity_threshold!
      );
    }

    // Filter by expiry date range
    if (filters.from_date) {
      filtered = filtered.filter(
        (batch) =>
          new Date(batch.expiry_date) >= new Date(filters.from_date || "")
      );
    }

    if (filters.to_date) {
      filtered = filtered.filter(
        (batch) =>
          new Date(batch.expiry_date) <= new Date(filters.to_date || "")
      );
    }

    return filtered;
  }, [batchProducts, filters]);

  useEffect(() => {
    setDataDatchProductsFiltered(filteredBatchProducts);
  }, [filteredBatchProducts]);

  // Selected batch products
  const selectedBatchProducts = useMemo(() => {
    return filteredBatchProducts.filter((batch) =>
      selectedBatchProductIds.includes(batch.batch_id)
    );
  }, [filteredBatchProducts, selectedBatchProductIds]);

  // Batch product counts
  const batchProductCounts = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      total: filteredBatchProducts.length,
      active: filteredBatchProducts.filter((b) => b.is_active).length,
      inactive: filteredBatchProducts.filter((b) => !b.is_active).length,
      expiringSoon: filteredBatchProducts.filter(
        (b) => b.is_active && new Date(b.expiry_date) <= sevenDaysFromNow
      ).length,
      lowStock: filteredBatchProducts.filter(
        (b) => b.is_active && b.quantity <= b.low_stock_threshold
      ).length,
    };
  }, [filteredBatchProducts]);

  // Filtered pagination
  const filteredPagination = useMemo(() => {
    const total = filteredBatchProducts.length;
    const totalPages = Math.ceil(total / pagination.limit);
    return {
      ...pagination,
      total,
      totalPages,
    };
  }, [filteredBatchProducts, pagination]);

  // Paginated filtered batch products
  const paginatedBatchProducts = useMemo(() => {
    const start = (filteredPagination.page - 1) * filteredPagination.limit;
    const end = start + filteredPagination.limit;
    return filteredBatchProducts.slice(start, end);
  }, [filteredBatchProducts, filteredPagination]);

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
          batchProductStats.expiringSoonBatches > 0 ? "negative" : "positive",
      },
      {
        title: "Sắp hết hàng",
        value: batchProductStats.lowStockBatches.toLocaleString(),
        icon: TrendingDown,
        change: "Cần nhập thêm",
        changeType:
          batchProductStats.lowStockBatches > 0 ? "negative" : "positive",
      },
    ],
    [batchProductStats]
  );

  // Handle edit batch product
  const handleEditBatchProduct = useCallback((batchProduct: BatchProduct) => {
    setSelectedBatchProductForDelete(batchProduct);
    setIsEditModalOpen(true);
  }, []);

  // Handle delete batch product click
  const handleDeleteBatchProductClick = useCallback(
    (batchProduct: BatchProduct) => {
      setSelectedBatchProductForDelete(batchProduct);
      setIsDeleteModalOpen(true);
    },
    []
  );

  // Confirm delete
  const confirmDeleteBatchProduct = useCallback(async () => {
    if (!selectedBatchProductForDelete) return;
    const success = await handleDeleteBatchProduct(
      selectedBatchProductForDelete.batch_id
    );
    if (success) {
      setSelectedBatchProductForDelete(null);
    }
  }, [selectedBatchProductForDelete, handleDeleteBatchProduct]);

  // Handle batch activate
  const handleBatchActivate = useCallback(async () => {
    const selectedIds = Array.from(
      new Set(selectedBatchProducts.map((bp) => bp.batch_id))
    );
    const success = await handleBatchToggleStatus(selectedIds, true);
    if (success) {
      setSelectedBatchProductIds([]);
    }
  }, [selectedBatchProducts, handleBatchToggleStatus]);

  // Handle batch deactivate
  const handleBatchDeactivate = useCallback(async () => {
    const selectedIds = Array.from(
      new Set(selectedBatchProducts.map((bp) => bp.batch_id))
    );
    const success = await handleBatchToggleStatus(selectedIds, false);
    if (success) {
      setSelectedBatchProductIds([]);
    }
  }, [selectedBatchProducts, handleBatchToggleStatus]);

  // Handle export
  const handleExport = useCallback(() => {
    showToast.info("Chức năng xuất dữ liệu sẽ được phát triển");
  }, []);

  // Handle create batch product click
  const handleCreateBatchProductClick = useCallback(() => {
    setFormData({
      product_id: "",
      batch_number: "",
      quantity: 0,
      manufactured_date: "",
      expiry_date: "",
      low_stock_threshold: 10,
      unit_product_price: 0,
      is_active: true,
      product_type_id: "",
      promotion_ids: [],
    });
    setIsCreateModalOpen(true);
  }, []);

  // Quick filter functions
  // Update form data
  const updateFormData = useCallback(
    (updates: Partial<BatchProductFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Toggle batch product selection
  const toggleBatchProductSelection = useCallback((batchId: string) => {
    setSelectedBatchProductIds((prev) => {
      if (prev.includes(batchId)) {
        return prev.filter((id) => id !== batchId);
      } else {
        return [...prev, batchId];
      }
    });
  }, []);

  // Toggle all batch products selection
  const toggleAllBatchProductsSelection = useCallback(() => {
    setSelectedBatchProductIds((prev) => {
      const allIds = filteredBatchProducts.map((batch) => batch.batch_id);
      if (prev.length === allIds.length) {
        return [];
      } else {
        return allIds;
      }
    });
  }, [filteredBatchProducts]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      product_id: "",
      is_active: undefined,
      from_date: "",
      to_date: "",
    });
    setDataDatchProductsFiltered(batchProducts);
  }, [batchProducts]);

  // Initial load
  useEffect(() => {
    loadBatchProducts();
    loadFormDropdownData();
  }, [loadBatchProducts, loadFormDropdownData]);

  return (
    <div className="space-y-6 gap-5">
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
      <BatchProductStatisticsCards
        batchProducts={dataDatchProductsFiltered}
        loading={batchProductsLoading}
      />

      <BatchProductFilters
        filters={filters}
        onUpdateFilters={setFilters}
        onResetFilters={handleResetFilters}
        loading={batchProductsLoading}
      />

      {/* Table */}
      <BatchProductTable
        batchProducts={dataDatchProductsFiltered}
        selectedIds={selectedBatchProductIds}
        loading={batchProductsLoading}
        onToggleSelection={toggleBatchProductSelection}
        onToggleAllSelection={toggleAllBatchProductsSelection}
        onEdit={handleEditBatchProduct}
        onDelete={handleDeleteBatchProductClick}
      />

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
            return handleUpdateBatchProduct(
              selectedBatchProductForDelete.batch_id,
              data
            );
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
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        handleConfirm={confirmDeleteBatchProduct}
        title="Xóa lô sản phẩm"
      />
    </div>
  );
}
