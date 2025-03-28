"use client";

import ActiveFilters from "@/components/products/productsPage/ActiveFilters";
import Breadcrumb from "@/components/products/productsPage/Breadcrumb";
import FiltersSidebar from "@/components/products/productsPage/FiltersSidebar";
import MobileFiltersSheet from "@/components/products/productsPage/MobileFiltersSheet";
import ProductList from "@/components/products/productsPage/ProductList";
import SortSelect from "@/components/products/productsPage/SortSelect";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { FilterState, SortOption } from "@/types/products";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [categoryParam, setCategoryParam] = useState<string | null>(null);
  useEffect(() => {
    setCategoryParam(searchParams.get("category"));
  }, [searchParams]);

  // Giá trị mặc định cho bộ lọc
  const initialFilters: FilterState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 500000],
    rating: null,
    sellers: [],
    onSale: false,
  };
  const initSearchTerm = searchParams.get("search") || "";

  // State cho bộ lọc và sắp xếp
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initSearchTerm) {
      setSearchTerm(initSearchTerm);
    } else {
      setSearchTerm("");
    }
  }, [initSearchTerm]);

  // Cập nhật filters khi categoryParam thay đổi
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryParam],
      }));
    }
  }, [categoryParam]);

  // Lấy giá thấp nhất và cao nhất từ danh sách sản phẩm
  const minPrice = 0;
  const maxPrice = 500000;

  // Danh sách các đại lý
  const sellers = Array.from(
    new Set(products.map((product) => product.seller.name))
  );

  // Lọc sản phẩm dựa trên bộ lọc
  const filteredProducts = products.filter((product) => {
    // Lọc theo danh mục
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    // Lọc theo khoảng giá
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Lọc theo đánh giá
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    // Lọc theo đại lý
    if (
      filters.sellers.length > 0 &&
      !filters.sellers.includes(product.seller.name)
    ) {
      return false;
    }

    // Lọc theo khuyến mãi
    if (filters.onSale && (!product.discount || product.discount <= 0)) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Xử lý thay đổi danh mục
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

  // Xử lý thay đổi đại lý
  const handleSellerChange = (seller: string) => {
    setFilters((prev) => {
      const newSellers = prev.sellers.includes(seller)
        ? prev.sellers.filter((s) => s !== seller)
        : [...prev.sellers, seller];
      return {
        ...prev,
        sellers: newSellers,
      };
    });
  };

  // Xử lý thay đổi đánh giá
  const handleRatingChange = (rating: number | null) => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
  };

  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };

  // Xóa tất cả bộ lọc
  const clearAllFilters = () => {
    setCategoryParam(null);
    setFilters(initialFilters);
    setSearchTerm("");
  };

  // Đếm số lượng bộ lọc đang áp dụng
  const activeFilterCount =
    filters.categories.length +
    (filters.rating ? 1 : 0) +
    filters.sellers.length +
    (filters.onSale ? 1 : 0) +
    (searchTerm ? 1 : 0);

  // Hiển thị các bộ lọc đang áp dụng
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
    filters.sellers.forEach((seller) => {
      activeFilters.push(
        <Badge
          key={`seller-${seller}`}
          variant="outline"
          className="flex items-center gap-1 m-1"
        >
          {seller}
          <button onClick={() => handleSellerChange(seller)}>
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
          categories={categories}
          sellers={sellers}
          filters={filters}
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleCategoryChange={handleCategoryChange}
          handleSellerChange={handleSellerChange}
          handleRatingChange={handleRatingChange}
          handlePriceChange={handlePriceChange}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
        />

        {/* Mobile Filters */}
        <MobileFiltersSheet
          categories={categories}
          sellers={sellers}
          filters={filters}
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleCategoryChange={handleCategoryChange}
          handleSellerChange={handleSellerChange}
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
