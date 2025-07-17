import { showToast } from "@/lib/toast-provider";
import { atom } from "jotai";
import { productServiceManagement } from "../services/product-service-management";
import {
  AdvancedProductFilterRequest,
  Product,
  ProductFilters,
  ProductFormData,
  ProductPaginationResponse,
  ProductStatsResponse,
} from "../types/product";

// ================================================
// 📊 CORE DATA ATOMS - COMMON (Tất cả người dùng)
// ================================================

// Main products data
export const productsDataAtom = atom<Product[]>([]);

// Pagination data
export const productPaginationAtom = atom<
  ProductPaginationResponse["pagination"]
>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

// Loading states
export const productsLoadingAtom = atom<boolean>(false);
export const productDetailLoadingAtom = atom<boolean>(false);
export const productStatsLoadingAtom = atom<boolean>(false);

// Error states
export const productsErrorAtom = atom<string | null>(null);
export const productDetailErrorAtom = atom<string | null>(null);

// Selected product for viewing
export const selectedProductAtom = atom<Product | null>(null);

// ================================================
// 🔍 FILTER & SEARCH ATOMS - COMMON
// ================================================

// Basic filters for all users
export const productFiltersAtom = atom<ProductFilters>({
  search: "",
  category_id: "",
  manufacturer_id: "",
  distributor_id: "",
  status: "all",
  price_min: undefined,
  price_max: undefined,
  rating_min: undefined,
  rating_max: undefined,
  sort_by: "created_at",
  sort_order: "desc",
  page: 1,
  limit: 10,
});

// Advanced search filters
export const advancedFiltersAtom = atom<AdvancedProductFilterRequest>({
  search: "",
  category_ids: [],
  distributor_ids: [],
  ingredient_ids: [],
  disease_ids: [],
  price_min: undefined,
  price_max: undefined,
  rating_min: undefined,
  rating_max: undefined,
  sort_by: "created_at",
  sort_order: "desc",
});

// Search suggestions and history
export const searchSuggestionsAtom = atom<string[]>([]);
export const searchHistoryAtom = atom<string[]>([]);

// ================================================
// 👥 USER-SPECIFIC ATOMS - FOR CUSTOMERS
// ================================================

// Active products for users (only active products)
export const activeProductsAtom = atom<Product[]>([]);
export const activeProductsLoadingAtom = atom<boolean>(false);

// User's cart-related product data
export const userCartProductsAtom = atom<Product[]>([]);

// User's favorite products
export const userFavoriteProductsAtom = atom<string[]>([]);

// ================================================
// 🏢 DISTRIBUTOR-SPECIFIC ATOMS
// ================================================

// Distributor's own products
export const myProductsAtom = atom<Product[]>([]);
export const myProductsLoadingAtom = atom<boolean>(false);

// Distributor's product statistics
export const myProductStatsAtom = atom<ProductStatsResponse>({
  total_products: 0,
  active_products: 0,
  inactive_products: 0,
  avg_price: 0,
});

// Form management for distributor
export const productFormDataAtom = atom<ProductFormData>({
  product_name: "",
  description: "",
  usage_instructions: "",
  unit_product_price: 0,
  category_ids: [],
  manufacturer_id: "",
  ingredient_ids: [],
  disease_ids: [],
  is_active: true,
  // images: [],
});

export const productFormErrorsAtom = atom<Record<string, string>>({});
export const productFormLoadingAtom = atom<boolean>(false);

// Modal states for distributor
export const addProductModalAtom = atom<boolean>(false);
export const editProductModalAtom = atom<boolean>(false);
export const deleteProductModalAtom = atom<boolean>(false);
export const productDetailModalAtom = atom<boolean>(false);

// Selected products for batch operations
export const selectedProductsAtom = atom<string[]>([]);

// Batch operation loading
export const batchOperationLoadingAtom = atom<boolean>(false);

// ================================================
// 👑 ADMIN-SPECIFIC ATOMS
// ================================================

// All products for admin (including inactive)
export const allProductsAdminAtom = atom<Product[]>([]);

// Admin product statistics (can filter by distributor)
export const adminProductStatsAtom = atom<ProductStatsResponse>({
  total_products: 0,
  active_products: 0,
  inactive_products: 0,
  avg_price: 0,
});

// Admin can see stats by distributor
export const statsDistributorIdAtom = atom<string>("");

// Bulk operations for admin
export const bulkDeleteModalAtom = atom<boolean>(false);
export const bulkStatusModalAtom = atom<boolean>(false);

// ================================================
// 🎨 UI STATE ATOMS - COMMON
// ================================================

// View mode
export const productViewModeAtom = atom<"table" | "grid" | "list">("table");

// Table column visibility
export const productTableColumnsAtom = atom({
  image: true,
  name: true,
  price: true,
  category: true,
  manufacturer: true,
  distributor: true,
  status: true,
  rating: true,
  created_at: true,
  actions: true,
});

// Advanced search toggle
export const advancedSearchModeAtom = atom<boolean>(false);

// ================================================
// 📊 DERIVED ATOMS - COMPUTED VALUES
// ================================================

// Filtered products (client-side filtering)
export const filteredProductsAtom = atom((get) => {
  const products = get(productsDataAtom);
  const filters = get(productFiltersAtom);

  let filtered = [...products];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.manufacturer?.name.toLowerCase().includes(searchLower) ||
        product.distributor?.full_name.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((product) =>
      filters.status === "active" ? product.is_active : !product.is_active
    );
  }

  // Category filter
  if (filters.category_id) {
    filtered = filtered.filter((product) =>
      product.categories.some((cat) => cat.id === filters.category_id)
    );
  }

  // Manufacturer filter
  if (filters.manufacturer_id) {
    filtered = filtered.filter(
      (product) => product.manufacturer?.id === filters.manufacturer_id
    );
  }

  // Distributor filter
  if (filters.distributor_id) {
    filtered = filtered.filter(
      (product) =>
        product.distributor?.distributor_id === filters.distributor_id
    );
  }

  // Price filters
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

  // Rating filters
  if (filters.rating_min !== undefined) {
    filtered = filtered.filter(
      (product) => (product.avg_rating || 0) >= filters.rating_min!
    );
  }

  if (filters.rating_max !== undefined) {
    filtered = filtered.filter(
      (product) => (product.avg_rating || 0) <= filters.rating_max!
    );
  }

  // Sort products
  if (filters.sort_by) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sort_by) {
        case "name":
          aValue = a.product_name;
          bValue = b.product_name;
          break;
        case "price":
          aValue = a.unit_product_price;
          bValue = b.unit_product_price;
          break;
        case "rating":
          aValue = a.avg_rating || 0;
          bValue = b.avg_rating || 0;
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (filters.sort_order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return filtered;
});

// Selection state helpers
export const isAllProductsSelectedAtom = atom((get) => {
  const products = get(productsDataAtom);
  const selectedProducts = get(selectedProductsAtom);
  return products.length > 0 && selectedProducts.length === products.length;
});

export const isProductsIndeterminateAtom = atom((get) => {
  const products = get(productsDataAtom);
  const selectedProducts = get(selectedProductsAtom);
  return (
    selectedProducts.length > 0 && selectedProducts.length < products.length
  );
});

// Product counts by status
export const productCountsByStatusAtom = atom((get) => {
  const products = get(productsDataAtom);
  return {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    inactive: products.filter((p) => !p.is_active).length,
  };
});

// ================================================
// 🔄 COMMON ACTION ATOMS - For All Users
// ================================================

// Fetch products with pagination
export const fetchProductsAtom = atom(
  null,
  async (get, set, filters?: ProductFilters) => {
    set(productsLoadingAtom, true);
    set(productsErrorAtom, null);

    try {
      const response = await productServiceManagement.getProducts(filters);
      set(productsDataAtom, response.data);
      set(productPaginationAtom, response.pagination);

      if (filters) {
        set(productFiltersAtom, { ...get(productFiltersAtom), ...filters });
      }
    } catch (error) {
      set(
        productsErrorAtom,
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      set(productsLoadingAtom, false);
    }
  }
);

// Fetch product by ID
export const fetchProductByIdAtom = atom(null, async (get, set, id: string) => {
  set(productDetailLoadingAtom, true);
  set(productDetailErrorAtom, null);

  try {
    const product = await productServiceManagement.getProductById(id);
    set(selectedProductAtom, product);
    return product;
  } catch (error) {
    set(
      productDetailErrorAtom,
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  } finally {
    set(productDetailLoadingAtom, false);
  }
});

// Advanced search
export const advancedSearchAtom = atom(
  null,
  async (get, set, filters: AdvancedProductFilterRequest) => {
    set(productsLoadingAtom, true);
    set(productsErrorAtom, null);

    try {
      const products = await productServiceManagement.advancedSearch(filters);
      set(productsDataAtom, products);
      set(advancedFiltersAtom, filters);

      // Update pagination (mock since advanced search doesn't return pagination)
      set(productPaginationAtom, {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      });
    } catch (error) {
      set(
        productsErrorAtom,
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      set(productsLoadingAtom, false);
    }
  }
);

// Update filters
export const updateFiltersAtom = atom(
  null,
  (get, set, newFilters: Partial<ProductFilters>) => {
    const currentFilters = get(productFiltersAtom);
    set(productFiltersAtom, { ...currentFilters, ...newFilters });
  }
);

// Reset filters
export const resetFiltersAtom = atom(null, (get, set) => {
  set(productFiltersAtom, {
    search: "",
    category_id: "",
    manufacturer_id: "",
    distributor_id: "",
    status: "all",
    price_min: undefined,
    price_max: undefined,
    rating_min: undefined,
    rating_max: undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
  });
});

// ================================================
// 👥 USER-SPECIFIC ACTIONS
// ================================================

// Fetch active products for users
export const fetchActiveProductsAtom = atom(
  null,
  async (get, set, filters?: ProductFilters) => {
    set(activeProductsLoadingAtom, true);

    try {
      const products = await productServiceManagement.getProductsForUser(
        filters
      );
      set(activeProductsAtom, products);
    } catch (error) {
      console.error("Error fetching active products:", error);
    } finally {
      set(activeProductsLoadingAtom, false);
    }
  }
);

// Fetch product for user (only active)
export const fetchProductForUserAtom = atom(
  null,
  async (get, set, id: string) => {
    set(productDetailLoadingAtom, true);

    try {
      const product = await productServiceManagement.getProductByIdForUser(id);
      set(selectedProductAtom, product);
      return product;
    } catch (error) {
      throw error;
    } finally {
      set(productDetailLoadingAtom, false);
    }
  }
);

// Toggle favorite product
export const toggleFavoriteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const favorites = get(userFavoriteProductsAtom);
    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
      set(
        userFavoriteProductsAtom,
        favorites.filter((id) => id !== productId)
      );
    } else {
      set(userFavoriteProductsAtom, [...favorites, productId]);
    }
  }
);

// ================================================
// 🏢 DISTRIBUTOR-SPECIFIC ACTIONS
// ================================================

// Fetch my products
export const fetchMyProductsAtom = atom(null, async (get, set) => {
  set(myProductsLoadingAtom, true);

  try {
    const products = await productServiceManagement.getMyProducts();
    set(myProductsAtom, products);
  } catch (error) {
    console.error("Error fetching my products:", error);
  } finally {
    set(myProductsLoadingAtom, false);
  }
});

// Fetch my product stats
export const fetchMyProductStatsAtom = atom(null, async (get, set) => {
  set(productStatsLoadingAtom, true);

  try {
    const stats = await productServiceManagement.getMyProductStats();
    set(myProductStatsAtom, stats);
  } catch (error) {
    console.error("Error fetching my product stats:", error);
  } finally {
    set(productStatsLoadingAtom, false);
  }
});

// Create product
export const createProductAtom = atom(
  null,
  async (get, set, data: ProductFormData, files?: File[]) => {
    set(productFormLoadingAtom, true);
    set(productFormErrorsAtom, {});

    try {
      const product = await productServiceManagement.createProduct(data);

      // Update my products list
      const myProducts = get(myProductsAtom);
      set(myProductsAtom, [product, ...myProducts]);

      // Reset form
      set(productFormDataAtom, {
        product_name: "",
        description: "",
        usage_instructions: "",
        unit_product_price: 0,
        category_ids: [],
        manufacturer_id: "",
        ingredient_ids: [],
        disease_ids: [],
        is_active: true,
        // images: [],
      });

      set(addProductModalAtom, false);
      showToast.success("Tạo sản phẩm thành công!");

      return product;
    } catch (error) {
      if (error instanceof Error) {
        set(productFormErrorsAtom, { general: error.message });
      }
      throw error;
    } finally {
      set(productFormLoadingAtom, false);
    }
  }
);

// Update product
export const updateProductAtom = atom(
  null,
  async (get, set, id: string, data: ProductFormData) => {
    set(productFormLoadingAtom, true);
    set(productFormErrorsAtom, {});

    try {
      const product = await productServiceManagement.updateProduct(id, data);

      // Update my products list
      const myProducts = get(myProductsAtom);
      const updatedProducts = myProducts.map((p) =>
        p.product_id === id ? product : p
      );
      set(myProductsAtom, updatedProducts);

      // Update selected product if it's the same
      const selectedProduct = get(selectedProductAtom);
      if (selectedProduct?.product_id === id) {
        set(selectedProductAtom, product);
      }

      set(editProductModalAtom, false);
      showToast.success("Cập nhật sản phẩm thành công!");

      return product;
    } catch (error) {
      if (error instanceof Error) {
        set(productFormErrorsAtom, { general: error.message });
      }
      throw error;
    } finally {
      set(productFormLoadingAtom, false);
    }
  }
);

// Delete product
export const deleteProductAtom = atom(null, async (get, set, id: string) => {
  try {
    await productServiceManagement.deleteProduct(id);

    // Remove from my products list
    const myProducts = get(myProductsAtom);
    set(
      myProductsAtom,
      myProducts.filter((p) => p.product_id !== id)
    );

    // Clear selected product if it's the same
    const selectedProduct = get(selectedProductAtom);
    if (selectedProduct?.product_id === id) {
      set(selectedProductAtom, null);
    }

    set(deleteProductModalAtom, false);
    showToast.success("Xóa sản phẩm thành công!");
  } catch (error) {
    throw error;
  }
});

// Toggle product status
export const toggleProductStatusAtom = atom(
  null,
  async (get, set, id: string) => {
    try {
      const product = await productServiceManagement.toggleProductStatus(id);

      // Update my products list
      const myProducts = get(myProductsAtom);
      const updatedProducts = myProducts.map((p) =>
        p.product_id === id ? product : p
      );
      set(myProductsAtom, updatedProducts);

      showToast.success(
        `${product.is_active ? "Kích hoạt" : "Tạm dừng"} sản phẩm thành công!`
      );
    } catch (error) {
      throw error;
    }
  }
);

// Batch operations
export const batchToggleStatusAtom = atom(
  null,
  async (get, set, productIds: string[], isActive: boolean) => {
    set(batchOperationLoadingAtom, true);

    try {
      const response = await productServiceManagement.batchToggleStatus({
        product_ids: productIds,
        is_active: isActive,
      });

      // Refresh my products directly
      set(myProductsLoadingAtom, true);
      try {
        const products = await productServiceManagement.getMyProducts();
        set(myProductsAtom, products);
      } finally {
        set(myProductsLoadingAtom, false);
      }

      // Clear selections
      set(selectedProductsAtom, []);

      showToast.success(response.message);
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

export const batchDeleteProductsAtom = atom(
  null,
  async (get, set, productIds: string[]) => {
    set(batchOperationLoadingAtom, true);

    try {
      const response = await productServiceManagement.batchDeleteProducts({
        product_ids: productIds,
      });

      // Refresh my products directly
      set(myProductsLoadingAtom, true);
      try {
        const products = await productServiceManagement.getMyProducts();
        set(myProductsAtom, products);
      } finally {
        set(myProductsLoadingAtom, false);
      }

      // Clear selections
      set(selectedProductsAtom, []);

      showToast.success(response.message);
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// Selection management
export const toggleProductSelectionAtom = atom(
  null,
  (get, set, productId: string) => {
    const selected = get(selectedProductsAtom);
    const isSelected = selected.includes(productId);

    if (isSelected) {
      set(
        selectedProductsAtom,
        selected.filter((id) => id !== productId)
      );
    } else {
      set(selectedProductsAtom, [...selected, productId]);
    }
  }
);

export const toggleAllProductsSelectionAtom = atom(
  null,
  (get, set, checked: boolean) => {
    if (checked) {
      const products = get(myProductsAtom);
      set(
        selectedProductsAtom,
        products.map((p) => p.product_id)
      );
    } else {
      set(selectedProductsAtom, []);
    }
  }
);

// Form management
export const updateProductFormAtom = atom(
  null,
  (get, set, updates: Partial<ProductFormData>) => {
    const currentData = get(productFormDataAtom);
    set(productFormDataAtom, { ...currentData, ...updates });
  }
);

export const setProductForEditingAtom = atom(
  null,
  (get, set, product: Product) => {
    set(productFormDataAtom, {
      product_id: product.product_id,
      product_name: product.product_name,
      description: product.description || "",
      usage_instructions: product.usage_instructions || "",
      unit_product_price: product.unit_product_price,
      category_ids: product.categories.map((c) => c.id),
      manufacturer_id: product.manufacturer?.id || "",
      ingredient_ids: product.product_ingredients.map((i) => i.ingredient_id),
      disease_ids: product.diseases.map((d) => d.disease_id),
      is_active: product.is_active,
      // images: product.images.map((img) => img.image_url), // Assuming images are stored as URLs
    });
    set(selectedProductAtom, product);
  }
);

export const resetProductFormAtom = atom(null, (get, set) => {
  set(productFormDataAtom, {
    product_name: "",
    description: "",
    usage_instructions: "",
    unit_product_price: 0,
    category_ids: [],
    manufacturer_id: "",
    ingredient_ids: [],
    disease_ids: [],
    is_active: true,
    // images: [],
  });
  set(productFormErrorsAtom, {});
});

// ================================================
// 👑 ADMIN-SPECIFIC ACTIONS
// ================================================

// Fetch all products for admin
export const fetchAllProductsAdminAtom = atom(
  null,
  async (get, set, filters?: ProductFilters) => {
    set(productsLoadingAtom, true);

    try {
      const response = await productServiceManagement.getProducts(filters);
      set(allProductsAdminAtom, response.data);
      set(productPaginationAtom, response.pagination);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      set(productsLoadingAtom, false);
    }
  }
);

// Fetch product stats for admin
export const fetchAdminProductStatsAtom = atom(
  null,
  async (get, set, distributorId?: string) => {
    set(productStatsLoadingAtom, true);

    try {
      const stats = await productServiceManagement.getProductStats(
        distributorId
      );
      set(adminProductStatsAtom, stats);
    } catch (error) {
      console.error("Error fetching admin product stats:", error);
    } finally {
      set(productStatsLoadingAtom, false);
    }
  }
);

// ================================================
// 🔧 UTILITY ACTIONS
// ================================================

// Clear all selections
export const clearSelectionsAtom = atom(null, (get, set) => {
  set(selectedProductsAtom, []);
});

// Refresh data
export const refreshDataAtom = atom(null, async (get, set) => {
  // Refresh my products
  set(myProductsLoadingAtom, true);
  try {
    const products = await productServiceManagement.getMyProducts();
    set(myProductsAtom, products);
  } finally {
    set(myProductsLoadingAtom, false);
  }

  // Refresh my product stats
  set(productStatsLoadingAtom, true);
  try {
    const stats = await productServiceManagement.getMyProductStats();
    set(myProductStatsAtom, stats);
  } finally {
    set(productStatsLoadingAtom, false);
  }
});

// Add to search history
export const addToSearchHistoryAtom = atom(
  null,
  (get, set, searchTerm: string) => {
    const history = get(searchHistoryAtom);
    const filtered = history.filter((term) => term !== searchTerm);
    set(searchHistoryAtom, [searchTerm, ...filtered].slice(0, 10));
  }
);

// ================================================
// 💾 PERSISTENCE ACTIONS
// ================================================

// Save preferences
export const savePreferencesAtom = atom(null, (get, set) => {
  const filters = get(productFiltersAtom);
  const viewMode = get(productViewModeAtom);
  const tableColumns = get(productTableColumnsAtom);

  localStorage.setItem(
    "product-preferences",
    JSON.stringify({
      filters,
      viewMode,
      tableColumns,
    })
  );
});

// Load preferences
export const loadPreferencesAtom = atom(null, (get, set) => {
  const saved = localStorage.getItem("product-preferences");
  if (saved) {
    try {
      const { filters, viewMode, tableColumns } = JSON.parse(saved);
      set(productFiltersAtom, filters);
      set(productViewModeAtom, viewMode);
      set(productTableColumnsAtom, tableColumns);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  }
});
