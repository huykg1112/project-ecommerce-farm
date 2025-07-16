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
} from "@/lib_dashboard/store/product-store-management";
import { ProductFilters } from "@/lib_dashboard/types/product";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { useProductQueryCommon } from "./use-product-common";

/**
 * Hook dành cho quản lý sản phẩm - Distributor và Admin
 */
export const useProductQueryManagement = () => {
  // === INHERIT FROM COMMON ===
  const common = useProductQueryCommon();

  // === MANAGEMENT-SPECIFIC DATA ===
  const myProducts = useAtomValue(myProductsAtom);
  const myProductsLoading = useAtomValue(myProductsLoadingAtom);
  const myProductStats = useAtomValue(myProductStatsAtom);
  const selectedProducts = useAtomValue(selectedProductsAtom);
  const productCounts = useAtomValue(productCountsByStatusAtom);

  // === ADMIN-SPECIFIC DATA ===
  const allProductsAdmin = useAtomValue(allProductsAdminAtom);
  const adminProductStats = useAtomValue(adminProductStatsAtom);
  const statsDistributorId = useAtomValue(statsDistributorIdAtom);

  // === MANAGEMENT ACTIONS ===
  const [, fetchMyProducts] = useAtom(fetchMyProductsAtom);
  const [, fetchMyProductStats] = useAtom(fetchMyProductStatsAtom);
  const [, fetchAllProductsAdmin] = useAtom(fetchAllProductsAdminAtom);
  const [, fetchAdminProductStats] = useAtom(fetchAdminProductStatsAtom);

  // === DISTRIBUTOR QUERY FUNCTIONS ===

  /**
   * Lấy danh sách sản phẩm của distributor hiện tại
   */
  const getMyProducts = useCallback(async () => {
    return await fetchMyProducts();
  }, [fetchMyProducts]);

  /**
   * Lấy thống kê sản phẩm của distributor hiện tại
   */
  const getMyProductStats = useCallback(async () => {
    return await fetchMyProductStats();
  }, [fetchMyProductStats]);

  /**
   * Lấy sản phẩm của tôi theo trạng thái
   */
  const getMyProductsByStatus = useCallback(
    (status: "active" | "inactive") => {
      return myProducts.filter((product) =>
        status === "active" ? product.is_active : !product.is_active
      );
    },
    [myProducts]
  );

  /**
   * Lấy sản phẩm của tôi theo category
   */
  const getMyProductsByCategory = useCallback(
    (categoryId: string) => {
      return myProducts.filter((product) =>
        product.categories.some((cat) => cat.category_id === categoryId)
      );
    },
    [myProducts]
  );

  /**
   * Lấy sản phẩm của tôi theo manufacturer
   */
  const getMyProductsByManufacturer = useCallback(
    (manufacturerId: string) => {
      return myProducts.filter(
        (product) => product.manufacturer?.id === manufacturerId
      );
    },
    [myProducts]
  );

  /**
   * Tìm kiếm trong sản phẩm của tôi
   */
  const searchMyProducts = useCallback(
    (searchTerm: string) => {
      const searchLower = searchTerm.toLowerCase();
      return myProducts.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    },
    [myProducts]
  );

  /**
   * Lấy sản phẩm có rating cao nhất của tôi
   */
  const getMyTopRatedProducts = useCallback(
    (limit: number = 10) => {
      return [...myProducts]
        .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
        .slice(0, limit);
    },
    [myProducts]
  );

  /**
   * Lấy sản phẩm bán chạy nhất của tôi
   */
  const getMyBestSellingProducts = useCallback(
    (limit: number = 10) => {
      return [...myProducts]
        .sort((a, b) => b.reviews.length - a.reviews.length)
        .slice(0, limit);
    },
    [myProducts]
  );

  /**
   * Lấy sản phẩm mới nhất của tôi
   */
  const getMyLatestProducts = useCallback(
    (limit: number = 10) => {
      return [...myProducts]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, limit);
    },
    [myProducts]
  );

  // === ADMIN QUERY FUNCTIONS ===

  /**
   * Lấy tất cả sản phẩm cho admin
   */
  const getAllProductsAdmin = useCallback(
    async (filters?: ProductFilters) => {
      return await fetchAllProductsAdmin(filters);
    },
    [fetchAllProductsAdmin]
  );

  /**
   * Lấy thống kê sản phẩm cho admin
   */
  const getAdminProductStats = useCallback(
    async (distributorId?: string) => {
      return await fetchAdminProductStats(distributorId);
    },
    [fetchAdminProductStats]
  );

  /**
   * Lấy sản phẩm theo distributor (Admin view)
   */
  const getProductsByDistributorAdmin = useCallback(
    (distributorId: string) => {
      return allProductsAdmin.filter(
        (product) => product.distributor?.distributor_id === distributorId
      );
    },
    [allProductsAdmin]
  );

  /**
   * Lấy sản phẩm theo trạng thái (Admin view)
   */
  const getProductsByStatusAdmin = useCallback(
    (status: "active" | "inactive") => {
      return allProductsAdmin.filter((product) =>
        status === "active" ? product.is_active : !product.is_active
      );
    },
    [allProductsAdmin]
  );

  /**
   * Lấy top distributors theo số lượng sản phẩm
   */
  const getTopDistributors = useCallback(
    (limit: number = 10) => {
      const distributorMap = new Map<
        string,
        {
          distributor: any;
          productCount: number;
          activeCount: number;
        }
      >();

      allProductsAdmin.forEach((product) => {
        if (product.distributor) {
          const key = product.distributor.distributor_id;
          const current = distributorMap.get(key) || {
            distributor: product.distributor,
            productCount: 0,
            activeCount: 0,
          };

          current.productCount += 1;
          if (product.is_active) {
            current.activeCount += 1;
          }

          distributorMap.set(key, current);
        }
      });

      return Array.from(distributorMap.values())
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, limit);
    },
    [allProductsAdmin]
  );

  /**
   * Lấy top categories theo số lượng sản phẩm
   */
  const getTopCategories = useCallback(
    (limit: number = 10) => {
      const categoryMap = new Map<
        string,
        {
          category: any;
          productCount: number;
        }
      >();

      allProductsAdmin.forEach((product) => {
        product.categories.forEach((category) => {
          const key = category.category_id;
          const current = categoryMap.get(key) || {
            category,
            productCount: 0,
          };

          current.productCount += 1;
          categoryMap.set(key, current);
        });
      });

      return Array.from(categoryMap.values())
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, limit);
    },
    [allProductsAdmin]
  );

  /**
   * Lấy top manufacturers theo số lượng sản phẩm
   */
  const getTopManufacturers = useCallback(
    (limit: number = 10) => {
      const manufacturerMap = new Map<
        string,
        {
          manufacturer: any;
          productCount: number;
        }
      >();

      allProductsAdmin.forEach((product) => {
        if (product.manufacturer) {
          const key = product.manufacturer.id;
          const current = manufacturerMap.get(key) || {
            manufacturer: product.manufacturer,
            productCount: 0,
          };

          current.productCount += 1;
          manufacturerMap.set(key, current);
        }
      });

      return Array.from(manufacturerMap.values())
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, limit);
    },
    [allProductsAdmin]
  );

  // === ANALYTICS FUNCTIONS ===

  /**
   * Lấy thống kê chi tiết của distributor
   */
  const getDetailedStats = useCallback(() => {
    const totalProducts = myProducts.length;
    const activeProducts = myProducts.filter((p) => p.is_active).length;
    const inactiveProducts = totalProducts - activeProducts;
    const totalReviews = myProducts.reduce(
      (sum, p) => sum + p.reviews.length,
      0
    );
    const avgRating =
      myProducts.reduce((sum, p) => sum + (p.avg_rating || 0), 0) /
      totalProducts;
    const avgPrice =
      myProducts.reduce((sum, p) => sum + p.unit_product_price, 0) /
      totalProducts;

    // Sản phẩm có rating cao nhất
    const topRatedProduct = myProducts.reduce(
      (max, p) => ((p.avg_rating || 0) > (max.avg_rating || 0) ? p : max),
      myProducts[0]
    );

    // Sản phẩm có nhiều review nhất
    const mostReviewedProduct = myProducts.reduce(
      (max, p) => (p.reviews.length > max.reviews.length ? p : max),
      myProducts[0]
    );

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalReviews,
      avgRating: isNaN(avgRating) ? 0 : avgRating,
      avgPrice: isNaN(avgPrice) ? 0 : avgPrice,
      topRatedProduct,
      mostReviewedProduct,
    };
  }, [myProducts]);

  /**
   * Lấy thống kê theo thời gian
   */
  const getTimeBasedStats = useCallback(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const productsThisWeek = myProducts.filter(
      (p) => new Date(p.created_at) >= oneWeekAgo
    ).length;

    const productsThisMonth = myProducts.filter(
      (p) => new Date(p.created_at) >= oneMonthAgo
    ).length;

    return {
      productsThisWeek,
      productsThisMonth,
    };
  }, [myProducts]);

  // === SELECTION FUNCTIONS ===

  /**
   * Lấy sản phẩm được chọn
   */
  const getSelectedProducts = useCallback(() => {
    return myProducts.filter((product) =>
      selectedProducts.includes(product.product_id)
    );
  }, [myProducts, selectedProducts]);

  /**
   * Lấy số lượng sản phẩm được chọn
   */
  const getSelectedCount = useCallback(() => {
    return selectedProducts.length;
  }, [selectedProducts]);

  // === AUTO-LOAD DATA ===
  useEffect(() => {
    // Auto load my products khi component mount
    if (myProducts.length === 0 && !myProductsLoading) {
      fetchMyProducts();
      fetchMyProductStats();
    }
  }, [
    myProducts.length,
    myProductsLoading,
    fetchMyProducts,
    fetchMyProductStats,
  ]);

  return {
    // === INHERIT FROM COMMON ===
    ...common,

    // === MANAGEMENT DATA ===
    myProducts,
    myProductsLoading,
    myProductStats,
    selectedProducts,
    productCounts,

    // === ADMIN DATA ===
    allProductsAdmin,
    adminProductStats,
    statsDistributorId,

    // === DISTRIBUTOR QUERY FUNCTIONS ===
    getMyProducts,
    getMyProductStats,
    getMyProductsByStatus,
    getMyProductsByCategory,
    getMyProductsByManufacturer,
    searchMyProducts,
    getMyTopRatedProducts,
    getMyBestSellingProducts,
    getMyLatestProducts,

    // === ADMIN QUERY FUNCTIONS ===
    getAllProductsAdmin,
    getAdminProductStats,
    getProductsByDistributorAdmin,
    getProductsByStatusAdmin,
    getTopDistributors,
    getTopCategories,
    getTopManufacturers,

    // === ANALYTICS FUNCTIONS ===
    getDetailedStats,
    getTimeBasedStats,

    // === SELECTION FUNCTIONS ===
    getSelectedProducts,
    getSelectedCount,
  };
};
