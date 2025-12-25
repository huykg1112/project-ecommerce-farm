"use client";

import ActiveFilters from "@/components/products/productsPage/ActiveFilters";
import Breadcrumb from "@/components/products/productsPage/Breadcrumb";
import FiltersSidebar from "@/components/products/productsPage/FiltersSidebar";
import MobileFiltersSheet from "@/components/products/productsPage/MobileFiltersSheet";
import ProductList from "@/components/products/productsPage/ProductList";
import SortSelect from "@/components/products/productsPage/SortSelect";
import { Badge } from "@/components/ui/badge";
import { categoryServiceManagement } from "@/lib_dashboard/services/category-service-management";
import { inventoryServiceManagement } from "@/lib_dashboard/services/invenstory-service-management";
import { manufacturerServiceManagement } from "@/lib_dashboard/services/manufacturers-service-management";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { Category } from "@/lib_dashboard/types/category";
import { Manufacturer } from "@/lib_dashboard/types/manufacturer";
import { InvenstoryClient, Product } from "@/lib_dashboard/types/product";
import { FilterState, SortOption } from "@/types/products";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [categoryParam, setCategoryParam] = useState<string | null>(null);

  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [fetchedInventory, setFetchedInventory] = useState<InvenstoryClient[]>(
    []
  );
  const [fetchedManufacturers, setFetchedManufacturers] = useState<
    Manufacturer[]
  >([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const products = await productServiceManagement.getProductsForUser();

        // console.log("Fetched Products:", products);
        if (products) {
          setFetchedProducts(products);
        }

        const inventory =
          await inventoryServiceManagement.getInventoryForUser();
        if (inventory) {
          setFetchedInventory(inventory);
        }

        const manufacturers =
          await manufacturerServiceManagement.getManufacturersForUser();
        if (manufacturers) {
          setFetchedManufacturers(manufacturers);
        }

        const categories =
          await categoryServiceManagement.getCategoriesForUser();
        if (categories) {
          setFetchedCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCategoryParam(searchParams.get("category"));
  }, [searchParams]);

  const initialFilters: FilterState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 5000000],
    rating: null,
    inventory_ids: [],
    onSale: false,
  };
  const initSearchTerm = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initSearchTerm);

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryParam],
      }));
    }
  }, [categoryParam]);

  // Removed duplicate filteredProducts declaration
  const filteredProducts = fetchedProducts.filter((product) => {
    // Filter by category
    if (
      filters.categories.length > 0 &&
      !product.categories?.some((cat) => filters.categories.includes(cat.name))
    ) {
      return false;
    }

    // Filter by price range
    if (
      product.unit_product_price < filters.priceRange[0] ||
      product.unit_product_price > filters.priceRange[1]
    ) {
      return false;
    }

    // Filter by rating (average rating from reviews)
    if (filters.rating) {
      let avgRating = 0;
      if (product.reviews && product.reviews.length > 0) {
        const ratings = product.reviews
          .filter((r) => typeof r.rating === "number")
          .map((r) => r.rating as number);
        if (ratings.length > 0) {
          avgRating =
            ratings.reduce(
              (sum, r) =>
                typeof sum === "number" && typeof r === "number"
                  ? sum + r
                  : sum,
              0
            ) / ratings.length;
        }
      }
      if (avgRating < filters.rating) {
        return false;
      }
    }

    // Filter by inventory
    if (
      filters.inventory_ids.length > 0 &&
      !filters.inventory_ids.includes(
        product.distributor?.invenstory?.invenstory_id || ""
      )
    ) {
      return false;
    }

    // Filter by onSale (discount active)
    if (filters.onSale) {
      // Check if any batch has active promotion/discount (discount_value is percent)
      const hasDiscount = product.batches?.some((batch) => {
        if (!batch || batch.is_deleted || !batch.is_active) return false;
        if (batch.promotions && batch.promotions.length > 0) {
          return batch.promotions.some(
            (promo) => promo.is_active && !promo.is_deleted
            // typeof promo.discount_value === "number" &&
            // promo.discount_value > 0 &&
            // promo.discount_value <= 100 // phần trăm giảm giá hợp lệ
          );
        }
        return false;
      });
      if (!hasDiscount) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesProductName = product.product_name
        ?.toLowerCase()
        .includes(searchLower);
      const matchesDescription = product.description
        ? product.description.toLowerCase().includes(searchLower)
        : false;
      const matchesDiseases =
        product.productDiseases?.some((productDisease) =>
          productDisease.disease?.disease_name
            ?.toLowerCase()
            .includes(searchLower)
        ) || false;
      const matchesIngredients =
        product.product_ingredients?.some((productIngredient) =>
          productIngredient.ingredient?.ingredient_name
            ?.toLowerCase()
            .includes(searchLower)
        ) || false;
      if (
        !matchesProductName &&
        !matchesDescription &&
        !matchesDiseases &&
        !matchesIngredients
      ) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "price-low-high":
        return a.unit_product_price - b.unit_product_price;
      case "price-high-low":
        return b.unit_product_price - a.unit_product_price;
      case "rating": {
        // Sort by average rating (highest first)
        const getAvgRating = (product: Product) => {
          if (!product.reviews || product.reviews.length === 0) return 0;
          const ratings = product.reviews
            .filter((r) => typeof r.rating === "number")
            .map((r) => r.rating as number);
          if (ratings.length === 0) return 0;
          return (
            ratings.reduce(
              (sum, r) =>
                typeof sum === "number" && typeof r === "number"
                  ? sum + r
                  : sum,
              0
            ) / ratings.length
          );
        };
        return getAvgRating(b) - getAvgRating(a);
      }
      default:
        return 0;
    }
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleInventoryChange = (inventory: string) => {
    setFilters((prev) => {
      const newInventory = prev.inventory_ids.includes(inventory)
        ? prev.inventory_ids.filter((i) => i !== inventory)
        : [...prev.inventory_ids, inventory];
      return {
        ...prev,
        inventory_ids: newInventory,
      };
    });
  };

  const handleRatingChange = (rating: number | null) => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };

  const clearAllFilters = () => {
    setCategoryParam(null);
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.rating ? 1 : 0) +
    filters.inventory_ids.length +
    (filters.onSale ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const renderActiveFilters = () => {
    const activeFilters = [];
    filters.categories.forEach((category) => {
      activeFilters.push(
        <Badge
          key={`category-${category}`}
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          {category}
          <button onClick={() => handleCategoryChange(category)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    });
    if (filters.rating) {
      activeFilters.push(
        <Badge
          key="rating"
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          {`${filters.rating}+ sao`}
          <button onClick={() => handleRatingChange(null)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }
    filters.inventory_ids.forEach((inventory_id) => {
      activeFilters.push(
        <Badge
          key={inventory_id}
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          {/* tìm lại tên của inventory bằng  */}
          {
            fetchedInventory.find((inv) => inv.invenstory_id === inventory_id)
              ?.name
          }
          <button onClick={() => handleInventoryChange(inventory_id)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    });
    if (filters.onSale) {
      activeFilters.push(
        <Badge
          key="on-sale"
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          Đang giảm giá
          <button onClick={() => handleFilterChange("onSale", false)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }
    if (searchTerm) {
      activeFilters.push(
        <Badge
          key="search"
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          Tìm: {searchTerm}
          <button onClick={() => setSearchTerm("")}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }
    return activeFilters;
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <FiltersSidebar
          categories={fetchedCategories}
          inventorys={fetchedInventory}
          filters={filters}
          minPrice={0}
          maxPrice={5000000}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleCategoryChange={handleCategoryChange}
          handleInventoryChange={handleInventoryChange}
          handleRatingChange={handleRatingChange}
          handlePriceChange={handlePriceChange}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
        />

        {/* Mobile Filters */}
        <MobileFiltersSheet
          categories={fetchedCategories}
          inventorys={fetchedInventory}
          filters={filters}
          minPrice={0}
          maxPrice={500000}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleCategoryChange={handleCategoryChange}
          handleInventoryChange={handleInventoryChange}
          handleRatingChange={handleRatingChange}
          handlePriceChange={handlePriceChange}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          activeFilterCount={activeFilterCount}
          sort={sort}
          setSort={setSort}
          renderActiveFilters={renderActiveFilters}
        />

        {/* Product List and Controls */}
        <div className="flex-1">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sản phẩm</h1>
            <SortSelect sort={sort} setSort={setSort} width="w-[200px]" />
          </div>

          {/* Hiển thị các bộ lọc đang áp dụng */}
          {activeFilterCount > 0 && (
            <ActiveFilters
              activeFilters={renderActiveFilters()}
              clearAllFilters={clearAllFilters}
              isMobile={false}
            />
          )}

          {/* Danh sách sản phẩm */}
          <ProductList
            sortedProducts={sortedProducts}
            clearAllFilters={clearAllFilters}
          />
        </div>
      </div>
    </div>
  );
}
