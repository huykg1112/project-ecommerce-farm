import {
  activeProductsAtom,
  activeProductsLoadingAtom,
  fetchActiveProductsAtom,
  fetchProductForUserAtom,
  toggleFavoriteProductAtom,
  userCartProductsAtom,
  userFavoriteProductsAtom,
} from "@/lib_dashboard/store/product-store-management";
import { ProductFilters } from "@/lib_dashboard/types/product";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { useProductQueryCommon } from "./use-product-common";

/**
 * Hook dành cho khách hàng - Chỉ truy vấn sản phẩm đang hoạt động
 */
export const useProductQueryClient = () => {
  // === INHERIT FROM COMMON ===
  const common = useProductQueryCommon();

  // === CLIENT-SPECIFIC DATA ===
  const activeProducts = useAtomValue(activeProductsAtom);
  const activeProductsLoading = useAtomValue(activeProductsLoadingAtom);
  const userFavorites = useAtomValue(userFavoriteProductsAtom);
  const userCartProducts = useAtomValue(userCartProductsAtom);

  // === CLIENT-SPECIFIC ACTIONS ===
  const [, fetchActiveProducts] = useAtom(fetchActiveProductsAtom);
  const [, fetchProductForUser] = useAtom(fetchProductForUserAtom);
  const [, toggleFavorite] = useAtom(toggleFavoriteProductAtom);

  // === CLIENT QUERY FUNCTIONS ===

  /**
   * Lấy danh sách sản phẩm đang hoạt động cho khách hàng
   */
  const getActiveProducts = useCallback(
    async (filters?: ProductFilters) => {
      return await fetchActiveProducts(filters);
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy chi tiết sản phẩm cho khách hàng (chỉ active)
   */
  const getActiveProductDetail = useCallback(
    async (productId: string) => {
      return await fetchProductForUser(productId);
    },
    [fetchProductForUser]
  );

  /**
   * Lấy sản phẩm yêu thích của user
   */
  const getFavoriteProducts = useCallback(() => {
    return activeProducts.filter((product) =>
      userFavorites.includes(product.product_id)
    );
  }, [activeProducts, userFavorites]);

  /**
   * Lấy sản phẩm theo category cho user
   */
  const getProductsByCategory = useCallback(
    async (categoryId: string) => {
      return await fetchActiveProducts({
        category_id: categoryId,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm theo manufacturer cho user
   */
  const getProductsByManufacturer = useCallback(
    async (manufacturerId: string) => {
      return await fetchActiveProducts({
        manufacturer_id: manufacturerId,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm theo khoảng giá
   */
  const getProductsByPriceRange = useCallback(
    async (minPrice: number, maxPrice: number) => {
      return await fetchActiveProducts({
        price_min: minPrice,
        price_max: maxPrice,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm theo rating
   */
  const getProductsByRating = useCallback(
    async (minRating: number) => {
      return await fetchActiveProducts({
        rating_min: minRating,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Tìm kiếm sản phẩm cho user
   */
  const searchActiveProducts = useCallback(
    async (searchTerm: string) => {
      return await fetchActiveProducts({
        search: searchTerm,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm mới nhất
   */
  const getLatestProducts = useCallback(
    async (limit: number = 10) => {
      return await fetchActiveProducts({
        sort_by: "created_at",
        sort_order: "desc",
        limit,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm bán chạy (theo rating)
   */
  const getBestSellingProducts = useCallback(
    async (limit: number = 10) => {
      return await fetchActiveProducts({
        sort_by: "rating",
        sort_order: "desc",
        limit,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  /**
   * Lấy sản phẩm giá tốt nhất
   */
  const getBestPriceProducts = useCallback(
    async (limit: number = 10) => {
      return await fetchActiveProducts({
        sort_by: "price",
        sort_order: "asc",
        limit,
        status: "active",
      });
    },
    [fetchActiveProducts]
  );

  // === FAVORITE FUNCTIONS ===

  /**
   * Toggle yêu thích sản phẩm
   */
  const toggleProductFavorite = useCallback(
    (productId: string) => {
      toggleFavorite(productId);
    },
    [toggleFavorite]
  );

  /**
   * Kiểm tra sản phẩm có được yêu thích không
   */
  const isProductFavorite = useCallback(
    (productId: string) => {
      return userFavorites.includes(productId);
    },
    [userFavorites]
  );

  /**
   * Lấy số lượng sản phẩm yêu thích
   */
  const getFavoriteCount = useCallback(() => {
    return userFavorites.length;
  }, [userFavorites]);

  // === CART FUNCTIONS ===

  /**
   * Kiểm tra sản phẩm có trong giỏ hàng không
   */
  const isProductInCart = useCallback(
    (productId: string) => {
      return userCartProducts.some(
        (product) => product.product_id === productId
      );
    },
    [userCartProducts]
  );

  /**
   * Lấy số lượng sản phẩm trong giỏ hàng
   */
  const getCartCount = useCallback(() => {
    return userCartProducts.length;
  }, [userCartProducts]);

  // === UTILITY FUNCTIONS ===

  /**
   * Lấy sản phẩm tương tự
   */
  const getSimilarProducts = useCallback(
    async (productId: string, limit: number = 5) => {
      const product = activeProducts.find((p) => p.product_id === productId);
      if (!product) return [];

      // Lấy sản phẩm cùng category
      const similarProducts = activeProducts.filter(
        (p) =>
          p.product_id !== productId &&
          p.categories.some((cat) =>
            product.categories.some(
              (pCat) => pCat.category_id === cat.category_id
            )
          )
      );

      return similarProducts.slice(0, limit);
    },
    [activeProducts]
  );

  /**
   * Lấy sản phẩm được đề xuất
   */
  const getRecommendedProducts = useCallback(
    async (limit: number = 10) => {
      // Logic đề xuất dựa trên favorite và cart
      const favoriteCategories = new Set();
      const cartCategories = new Set();

      // Lấy categories từ favorites
      userFavorites.forEach((favId) => {
        const product = activeProducts.find((p) => p.product_id === favId);
        if (product) {
          product.categories.forEach((cat) =>
            favoriteCategories.add(cat.category_id)
          );
        }
      });

      // Lấy categories từ cart
      userCartProducts.forEach((cartProduct) => {
        cartProduct.categories.forEach((cat) =>
          cartCategories.add(cat.category_id)
        );
      });

      // Tìm sản phẩm trong các categories này
      const recommended = activeProducts.filter(
        (product) =>
          product.categories.some(
            (cat) =>
              favoriteCategories.has(cat.category_id) ||
              cartCategories.has(cat.category_id)
          ) &&
          !userFavorites.includes(product.product_id) &&
          !userCartProducts.some((cp) => cp.product_id === product.product_id)
      );

      return recommended.slice(0, limit);
    },
    [activeProducts, userFavorites, userCartProducts]
  );

  // === AUTO-LOAD DATA ===
  useEffect(() => {
    // Auto load active products khi component mount
    if (activeProducts.length === 0 && !activeProductsLoading) {
      fetchActiveProducts();
    }
  }, [activeProducts.length, activeProductsLoading, fetchActiveProducts]);

  return {
    // === INHERIT FROM COMMON ===
    ...common,

    // === CLIENT-SPECIFIC DATA ===
    activeProducts,
    activeProductsLoading,
    userFavorites,
    userCartProducts,

    // === CLIENT QUERY FUNCTIONS ===
    getActiveProducts,
    getActiveProductDetail,
    getFavoriteProducts,
    getProductsByCategory,
    getProductsByManufacturer,
    getProductsByPriceRange,
    getProductsByRating,
    searchActiveProducts,
    getLatestProducts,
    getBestSellingProducts,
    getBestPriceProducts,
    getSimilarProducts,
    getRecommendedProducts,

    // === FAVORITE FUNCTIONS ===
    toggleProductFavorite,
    isProductFavorite,
    getFavoriteCount,

    // === CART FUNCTIONS ===
    isProductInCart,
    getCartCount,
  };
};
