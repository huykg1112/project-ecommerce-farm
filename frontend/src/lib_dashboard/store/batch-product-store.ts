import { atom } from "jotai";
import { batchProductService } from "../services/batch-product-service";
import { productServiceManagement } from "../services/product-service-management";
import { productTypeService } from "../services/product-type-service";
import { promotionService } from "../services/promotio-service-management";
import {
  BatchProduct,
  BatchProductFilters,
  BatchProductFormData,
  BatchProductStats,
  ProductType,
} from "../types/batch-product";
import { Product } from "../types/product";
import { Promotion } from "../types/promotion";

// ================================================
// 📊 CORE DATA ATOMS
// ================================================

// Main batch products data
export const batchProductsDataAtom = atom<BatchProduct[]>([]);

// Loading states
export const batchProductsLoadingAtom = atom<boolean>(false);
export const batchProductDetailLoadingAtom = atom<boolean>(false);
export const batchProductStatsLoadingAtom = atom<boolean>(false);
export const batchOperationLoadingAtom = atom<boolean>(false);

// Error states
export const batchProductsErrorAtom = atom<string | null>(null);
export const batchProductDetailErrorAtom = atom<string | null>(null);

// Selected batch product for viewing/editing
export const selectedBatchProductAtom = atom<BatchProduct | null>(null);

// Statistics
export const batchProductStatsAtom = atom<BatchProductStats>({
  totalBatches: 0,
  activeBatches: 0,
  expiringSoonBatches: 0,
  lowStockBatches: 0,
  totalQuantity: 0,
  averageQuantity: 0,
});

// Related data for form dropdowns
export const productsListAtom = atom<Product[]>([]);
export const productTypesListAtom = atom<ProductType[]>([]);
export const promotionsListAtom = atom<Promotion[]>([]);
export const warehousesListAtom = atom<Array<{ id: string; name: string }>>([]);

// ================================================
// 🔍 FILTER & SEARCH ATOMS
// ================================================

export const batchProductFiltersAtom = atom<BatchProductFilters>({
  search: "",
  product_id: "",
  product_type_id: "",
  is_active: undefined,
  expiring_soon_days: undefined,
  low_stock: undefined,
  batch_number: "",
  from_date: "",
  to_date: "",
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
});

// ================================================
// 🎯 SELECTION ATOMS
// ================================================

export const selectedBatchProductIdsAtom = atom<string[]>([]);

// Derived atom for selected batch products
export const selectedBatchProductsAtom = atom((get) => {
  const selectedIds = get(selectedBatchProductIdsAtom);
  const allBatchProducts = get(batchProductsDataAtom);
  return allBatchProducts.filter((batch) =>
    selectedIds.includes(batch.batch_id)
  );
});

// ================================================
// 📝 FORM ATOMS
// ================================================

export const batchProductFormDataAtom = atom<BatchProductFormData>({
  product_id: "",
  invenstory_id: "",

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

export const isCreateBatchProductModalOpenAtom = atom<boolean>(false);
export const isEditBatchProductModalOpenAtom = atom<boolean>(false);
export const isDeleteBatchProductModalOpenAtom = atom<boolean>(false);

// ================================================
// 🔄 ACTION ATOMS
// ================================================

// Get all batch products
export const getBatchProductsAtom = atom(
  null,
  async (get, set, filters?: Partial<BatchProductFilters>) => {
    set(batchProductsLoadingAtom, true);
    set(batchProductsErrorAtom, null);

    try {
      const currentFilters = get(batchProductFiltersAtom);
      const mergedFilters = { ...currentFilters, ...filters };

      const response = await batchProductService.getBatchProducts(
        mergedFilters
      );

      set(batchProductsDataAtom, response);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi không xác định";
      set(batchProductsErrorAtom, message);
      throw error;
    } finally {
      set(batchProductsLoadingAtom, false);
    }
  }
);

// Get batch product by ID
export const getBatchProductByIdAtom = atom(
  null,
  async (get, set, id: string) => {
    set(batchProductDetailLoadingAtom, true);
    set(batchProductDetailErrorAtom, null);

    try {
      const batchProduct = await batchProductService.getBatchProductById(id);
      set(selectedBatchProductAtom, batchProduct);
      return batchProduct;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi không xác định";
      set(batchProductDetailErrorAtom, message);
      throw error;
    } finally {
      set(batchProductDetailLoadingAtom, false);
    }
  }
);

// Get batch product stat

// Create batch product
export const createBatchProductAtom = atom(
  null,
  async (get, set, formData: BatchProductFormData) => {
    set(batchOperationLoadingAtom, true);

    try {
      const newBatchProduct = await batchProductService.createBatchProduct({
        ...formData,
      });

      // Refresh the list
      await set(getBatchProductsAtom);

      set(isCreateBatchProductModalOpenAtom, false);
      set(batchProductFormDataAtom, {
        product_id: "",
        invenstory_id: "",
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

      return newBatchProduct;
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// Update batch product
export const updateBatchProductAtom = atom(
  null,
  async (get, set, id: string, formData: Partial<BatchProductFormData>) => {
    set(batchOperationLoadingAtom, true);

    try {
      const updatedBatchProduct = await batchProductService.updateBatchProduct(
        id,
        {
          batch_id: id,
          ...formData,
        } as any
      );

      // Update in the list
      const currentData = get(batchProductsDataAtom);
      const updatedData = currentData.map((batch) =>
        batch.batch_id === id ? updatedBatchProduct : batch
      );
      set(batchProductsDataAtom, updatedData);

      // Update selected batch product if it's the one being edited
      const selectedBatch = get(selectedBatchProductAtom);
      if (selectedBatch?.batch_id === id) {
        set(selectedBatchProductAtom, updatedBatchProduct);
      }
      set(isEditBatchProductModalOpenAtom, false);

      return updatedBatchProduct;
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// Delete batch product
export const deleteBatchProductAtom = atom(
  null,
  async (get, set, id: string) => {
    set(batchOperationLoadingAtom, true);

    try {
      await batchProductService.deleteBatchProduct(id);

      // Remove from the list
      const currentData = get(batchProductsDataAtom);
      const updatedData = currentData.filter((batch) => batch.batch_id !== id);
      set(batchProductsDataAtom, updatedData);

      // Clear selection if deleted
      const selectedIds = get(selectedBatchProductIdsAtom);
      if (selectedIds.includes(id)) {
        const newSelectedIds = selectedIds.filter(
          (selectedId) => selectedId !== id
        );
        set(selectedBatchProductIdsAtom, newSelectedIds);
      }

      set(isDeleteBatchProductModalOpenAtom, false);
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// Load related data for form dropdowns
export const loadFormDataAtom = atom(null, async (get, set) => {
  try {
    // Load products
    const productsResponse = await productServiceManagement.getProducts();
    set(productsListAtom, productsResponse.data);

    // Load product types
    const productTypes = await productTypeService.getActiveProductTypes();
    set(productTypesListAtom, productTypes);

    // Load promotions
    const promotions = await promotionService.getPromotionManagement();
    set(
      promotionsListAtom,
      promotions.filter((p) => p.is_active)
    );

    // Load warehouses (mock data for now)
    set(warehousesListAtom, [
      { id: "warehouse1", name: "Kho chính" },
      { id: "warehouse2", name: "Kho phụ" },
      { id: "warehouse3", name: "Kho miền Nam" },
    ]);
  } catch (error) {
    console.error("Error loading form data:", error);
  }
});

// Batch toggle status
export const batchToggleStatusAtom = atom(
  null,
  async (get, set, batchIds: string[], isActive: boolean) => {
    set(batchOperationLoadingAtom, true);

    try {
      await batchProductService.batchToggleStatus({
        batch_ids: batchIds,
        is_active: isActive,
      });

      // Update in the list
      const currentData = get(batchProductsDataAtom);
      const updatedData = currentData.map((batch) =>
        batchIds.includes(batch.batch_id)
          ? { ...batch, is_active: isActive }
          : batch
      );
      set(batchProductsDataAtom, updatedData);

      // Clear selections
      set(selectedBatchProductIdsAtom, []);
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// ================================================
// 🔍 FILTER ACTIONS
// ================================================

export const updateBatchProductFiltersAtom = atom(
  null,
  (get, set, updates: Partial<BatchProductFilters>) => {
    const currentFilters = get(batchProductFiltersAtom);
    const newFilters = { ...currentFilters, ...updates };
    set(batchProductFiltersAtom, newFilters);
  }
);

export const resetBatchProductFiltersAtom = atom(null, (get, set) => {
  set(batchProductFiltersAtom, {
    search: "",
    product_id: "",
    product_type_id: "",
    is_active: undefined,
    expiring_soon_days: undefined,
    low_stock: undefined,
    batch_number: "",
    from_date: "",
    to_date: "",
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
});

// Reset form data
export const resetFormDataAtom = atom(null, (get, set) => {
  set(batchProductFormDataAtom, {
    product_id: "",
    invenstory_id: "",
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
});

// ================================================
// 🎯 SELECTION ACTIONS
// ================================================

export const toggleBatchProductSelectionAtom = atom(
  null,
  (get, set, batchId: string) => {
    const selectedIds = get(selectedBatchProductIdsAtom);
    const newSelectedIds = selectedIds.slice();

    if (newSelectedIds.includes(batchId)) {
      newSelectedIds.splice(newSelectedIds.indexOf(batchId), 1);
    } else {
      newSelectedIds.push(batchId);
    }

    set(selectedBatchProductIdsAtom, newSelectedIds);
  }
);

export const toggleAllBatchProductsSelectionAtom = atom(null, (get, set) => {
  const selectedIds = get(selectedBatchProductIdsAtom);
  const allBatchProducts = get(batchProductsDataAtom);
  const allIds = allBatchProducts.map((batch) => batch.batch_id);

  if (selectedIds.length === allIds.length) {
    // Deselect all
    set(selectedBatchProductIdsAtom, []);
  } else {
    // Select all
    set(selectedBatchProductIdsAtom, allIds);
  }
});

export const clearBatchProductSelectionsAtom = atom(null, (get, set) => {
  set(selectedBatchProductIdsAtom, []);
});

// ================================================
// 📈 DERIVED ATOMS
// ================================================

// Filtered and sorted batch products
export const filteredBatchProductsAtom = atom((get) => {
  const batchProducts = get(batchProductsDataAtom);
  const filters = get(batchProductFiltersAtom);

  let filtered = [...batchProducts];

  // Apply client-side filters if needed
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (batch) =>
        batch.batch_number.toLowerCase().includes(searchTerm) ||
        batch.product.product_name.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
});

// Batch product counts
export const batchProductCountsAtom = atom((get) => {
  const batchProducts = get(batchProductsDataAtom);
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    total: batchProducts.length,
    active: batchProducts.filter((b) => b.is_active).length,
    inactive: batchProducts.filter((b) => !b.is_active).length,
    expiringSoon: batchProducts.filter(
      (b) => b.is_active && new Date(b.expiry_date) <= sevenDaysFromNow
    ).length,
    lowStock: batchProducts.filter(
      (b) => b.is_active && b.quantity <= b.low_stock_threshold
    ).length,
  };
});
