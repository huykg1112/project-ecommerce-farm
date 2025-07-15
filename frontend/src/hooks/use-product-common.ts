import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import {
  addToSearchHistoryAtom,
  advancedFiltersAtom,
  advancedSearchAtom,
  fetchProductByIdAtom,
  fetchProductsAtom,
  productDetailErrorAtom,
  productDetailLoadingAtom,
  productFiltersAtom,
  productPaginationAtom,
  productsDataAtom,
  productsErrorAtom,
  productsLoadingAtom,
  resetFiltersAtom,
  searchHistoryAtom,
  searchSuggestionsAtom,
  selectedProductAtom,
  updateFiltersAtom,
} from "@/lib_dashboard/store/product-store-management";
import {
  AdvancedProductFilterRequest,
  ProductFilters,
} from "@/lib_dashboard/types/product";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

/**
 * Hook chung cho tất cả người dùng - Truy vấn dữ liệu sản phẩm cơ bản
 */
export const useProductQueryCommon = () => {
  // === DATA STATES ===
  const products = useAtomValue(productsDataAtom);
  const selectedProduct = useAtomValue(selectedProductAtom);
  const pagination = useAtomValue(productPaginationAtom);

  // === FILTER STATES ===
  const filters = useAtomValue(productFiltersAtom);
  const advancedFilters = useAtomValue(advancedFiltersAtom);

  // === LOADING STATES ===
  const productsLoading = useAtomValue(productsLoadingAtom);
  const productDetailLoading = useAtomValue(productDetailLoadingAtom);

  // === ERROR STATES ===
  const productsError = useAtomValue(productsErrorAtom);
  const productDetailError = useAtomValue(productDetailErrorAtom);

  // === SEARCH STATES ===
  const searchHistory = useAtomValue(searchHistoryAtom);
  const searchSuggestions = useAtomValue(searchSuggestionsAtom);

  // === ACTIONS ===
  const [, fetchProducts] = useAtom(fetchProductsAtom);
  const [, fetchProductById] = useAtom(fetchProductByIdAtom);
  const [, advancedSearch] = useAtom(advancedSearchAtom);
  const [, updateFilters] = useAtom(updateFiltersAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);
  const [, addToSearchHistory] = useAtom(addToSearchHistoryAtom);

  // === QUERY FUNCTIONS ===

  /**
   * Lấy danh sách sản phẩm với filter và pagination
   */
  const getProducts = useCallback(
    async (customFilters?: Partial<ProductFilters>) => {
      const finalFilters = customFilters
        ? { ...filters, ...customFilters }
        : filters;
      return await fetchProducts(finalFilters);
    },
    [fetchProducts, filters]
  );

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  const getProductDetail = useCallback(
    async (productId: string) => {
      return await fetchProductById(productId);
    },
    [fetchProductById]
  );

  /**
   * Tìm kiếm sản phẩm nâng cao
   */
  const searchProductsAdvanced = useCallback(
    async (searchFilters: AdvancedProductFilterRequest) => {
      // Thêm vào lịch sử tìm kiếm
      if (searchFilters.search) {
        addToSearchHistory(searchFilters.search);
      }
      return await advancedSearch(searchFilters);
    },
    [advancedSearch, addToSearchHistory]
  );

  /**
   * Lấy sản phẩm theo nhà phân phối
   */
  const getProductsByDistributor = useCallback(
    async (distributorId: string) => {
      try {
        return await productServiceManagement.getProductsByDistributor(
          distributorId
        );
      } catch (error) {
        throw error;
      }
    },
    []
  );

  /**
   * Lấy thống kê sản phẩm công khai
   */
  const getPublicStats = useCallback(async () => {
    try {
      return await productServiceManagement.getPublicProductStats();
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Lấy thành phần sản phẩm
   */
  const getProductIngredients = useCallback(async (productId: string) => {
    try {
      return await productServiceManagement.getProductIngredients(productId);
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Lấy bệnh hại sản phẩm
   */
  const getProductDiseases = useCallback(async (productId: string) => {
    try {
      return await productServiceManagement.getProductDiseases(productId);
    } catch (error) {
      throw error;
    }
  }, []);

  // === FILTER FUNCTIONS ===

  /**
   * Cập nhật filter
   */
  const updateProductFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  /**
   * Reset filter về mặc định
   */
  const resetProductFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  /**
   * Tìm kiếm nhanh
   */
  const quickSearch = useCallback(
    async (searchTerm: string) => {
      const searchFilters = { ...filters, search: searchTerm, page: 1 };
      updateFilters(searchFilters);
      return await fetchProducts(searchFilters);
    },
    [filters, updateFilters, fetchProducts]
  );

  /**
   * Thay đổi page
   */
  const changePage = useCallback(
    async (page: number) => {
      const newFilters = { ...filters, page };
      updateFilters(newFilters);
      return await fetchProducts(newFilters);
    },
    [filters, updateFilters, fetchProducts]
  );

  /**
   * Thay đổi limit
   */
  const changeLimit = useCallback(
    async (limit: number) => {
      const newFilters = { ...filters, limit, page: 1 };
      updateFilters(newFilters);
      return await fetchProducts(newFilters);
    },
    [filters, updateFilters, fetchProducts]
  );

  /**
   * Sắp xếp sản phẩm
   */
  const sortProducts = useCallback(
    async (
      sortBy: ProductFilters["sort_by"],
      sortOrder: ProductFilters["sort_order"] = "desc"
    ) => {
      const newFilters = {
        ...filters,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: 1,
      };
      updateFilters(newFilters);
      return await fetchProducts(newFilters);
    },
    [filters, updateFilters, fetchProducts]
  );

  // === AUTO-LOAD DATA ===
  useEffect(() => {
    // Auto load products khi component mount
    if (products.length === 0 && !productsLoading) {
      fetchProducts();
    }
  }, [products.length, productsLoading, fetchProducts]);

  return {
    // === DATA ===
    products,
    selectedProduct,
    pagination,
    filters,
    advancedFilters,
    searchHistory,
    searchSuggestions,

    // === LOADING & ERROR ===
    productsLoading,
    productDetailLoading,
    productsError,
    productDetailError,

    // === QUERY FUNCTIONS ===
    getProducts,
    getProductDetail,
    searchProductsAdvanced,
    getProductsByDistributor,
    getPublicStats,
    getProductIngredients,
    getProductDiseases,

    // === FILTER FUNCTIONS ===
    updateProductFilters,
    resetProductFilters,
    quickSearch,
    changePage,
    changeLimit,
    sortProducts,
  };
};
