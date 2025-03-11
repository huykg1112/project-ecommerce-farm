"use client";

import ProductCard from "@/components/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Filter, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Định nghĩa các loại lọc
type FilterState = {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  sellers: string[];
  onSale: boolean;
};

// Định nghĩa các loại sắp xếp
type SortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "best-selling"
  | "rating";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Giá trị mặc định cho bộ lọc
  const initialFilters: FilterState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 500000],
    rating: null,
    sellers: [],
    onSale: false,
  };

  // State cho bộ lọc và sắp xếp
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

    // Thêm danh mục
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

    // Thêm đánh giá
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

    // Thêm đại lý
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

    // Thêm khuyến mãi
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

    // Thêm từ khóa tìm kiếm
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
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Sản phẩm</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Bộ lọc sản phẩm</h2>
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </div>

            <Accordion
              type="multiple"
              defaultValue={[
                "categories",
                "price",
                "rating",
                "sellers",
                "other",
              ]}
            >
              <AccordionItem value="categories">
                <AccordionTrigger>Danh mục</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories.includes(category.name)}
                          onCheckedChange={() =>
                            handleCategoryChange(category.name)
                          }
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name} ({category.productCount})
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Khoảng giá</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[minPrice, maxPrice]}
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      min={minPrice}
                      max={maxPrice}
                      step={10000}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between">
                      <span>{filters.priceRange[0].toLocaleString()}đ</span>
                      <span>{filters.priceRange[1].toLocaleString()}đ</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rating">
                <AccordionTrigger>Đánh giá</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={filters.rating === rating}
                          onCheckedChange={() =>
                            handleRatingChange(
                              filters.rating === rating ? null : rating
                            )
                          }
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="text-sm cursor-pointer flex items-center"
                        >
                          {Array(rating)
                            .fill(0)
                            .map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          <span className="ml-1">trở lên</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sellers">
                <AccordionTrigger>Đại lý</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {sellers.map((seller) => (
                      <div key={seller} className="flex items-center space-x-2">
                        <Checkbox
                          id={`seller-${seller}`}
                          checked={filters.sellers.includes(seller)}
                          onCheckedChange={() => handleSellerChange(seller)}
                        />
                        <Label
                          htmlFor={`seller-${seller}`}
                          className="text-sm cursor-pointer"
                        >
                          {seller}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger>Khác</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={filters.onSale}
                        onCheckedChange={(checked) =>
                          handleFilterChange("onSale", checked)
                        }
                      />
                      <Label
                        htmlFor="on-sale"
                        className="text-sm cursor-pointer"
                      >
                        Đang giảm giá
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={clearAllFilters}
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Sản phẩm</h1>
            <div className="flex items-center gap-2">
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    Lọc
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <Input
                      type="search"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4"
                    />

                    <Accordion
                      type="multiple"
                      defaultValue={[
                        "categories",
                        "price",
                        "rating",
                        "sellers",
                        "other",
                      ]}
                    >
                      <AccordionItem value="categories">
                        <AccordionTrigger>Danh mục</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <div
                                key={category.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`mobile-category-${category.id}`}
                                  checked={filters.categories.includes(
                                    category.name
                                  )}
                                  onCheckedChange={() =>
                                    handleCategoryChange(category.name)
                                  }
                                />
                                <Label
                                  htmlFor={`mobile-category-${category.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {category.name} ({category.productCount})
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Các accordion item khác tương tự như desktop */}
                      <AccordionItem value="price">
                        <AccordionTrigger>Khoảng giá</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Slider
                              defaultValue={[minPrice, maxPrice]}
                              value={[
                                filters.priceRange[0],
                                filters.priceRange[1],
                              ]}
                              min={minPrice}
                              max={maxPrice}
                              step={10000}
                              onValueChange={handlePriceChange}
                            />
                            <div className="flex justify-between">
                              <span>
                                {filters.priceRange[0].toLocaleString()}đ
                              </span>
                              <span>
                                {filters.priceRange[1].toLocaleString()}đ
                              </span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="rating">
                        <AccordionTrigger>Đánh giá</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div
                                key={rating}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`mobile-rating-${rating}`}
                                  checked={filters.rating === rating}
                                  onCheckedChange={() =>
                                    handleRatingChange(
                                      filters.rating === rating ? null : rating
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`mobile-rating-${rating}`}
                                  className="text-sm cursor-pointer flex items-center"
                                >
                                  {Array(rating)
                                    .fill(0)
                                    .map((_, i) => (
                                      <svg
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                      </svg>
                                    ))}
                                  <span className="ml-1">trở lên</span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sellers">
                        <AccordionTrigger>Đại lý</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {sellers.map((seller) => (
                              <div
                                key={seller}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`mobile-seller-${seller}`}
                                  checked={filters.sellers.includes(seller)}
                                  onCheckedChange={() =>
                                    handleSellerChange(seller)
                                  }
                                />
                                <Label
                                  htmlFor={`mobile-seller-${seller}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {seller}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="other">
                        <AccordionTrigger>Khác</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-on-sale"
                                checked={filters.onSale}
                                onCheckedChange={(checked) =>
                                  handleFilterChange("onSale", checked)
                                }
                              />
                              <Label
                                htmlFor="mobile-on-sale"
                                className="text-sm cursor-pointer"
                              >
                                Đang giảm giá
                              </Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="flex gap-2 mt-6">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={clearAllFilters}
                      >
                        Xóa tất cả
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={sort}
                onValueChange={(value) => setSort(value as SortOption)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low-high">
                    Giá: Thấp đến cao
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Giá: Cao đến thấp
                  </SelectItem>
                  <SelectItem value="rating">Đánh giá cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hiển thị các bộ lọc đang áp dụng */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center mb-4">
              <span className="text-sm font-medium mr-2">Bộ lọc:</span>
              {renderActiveFilters()}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={clearAllFilters}
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>

        {/* Product List */}
        <div className="flex-1">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sản phẩm</h1>
            <div className="flex items-center gap-2">
              <Select
                value={sort}
                onValueChange={(value) => setSort(value as SortOption)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low-high">
                    Giá: Thấp đến cao
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Giá: Cao đến thấp
                  </SelectItem>
                  <SelectItem value="rating">Đánh giá cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hiển thị các bộ lọc đang áp dụng (desktop) */}
          {activeFilterCount > 0 && (
            <div className="hidden md:flex flex-wrap items-center mb-4">
              <span className="text-sm font-medium mr-2">
                Bộ lọc đang áp dụng:
              </span>
              {renderActiveFilters()}
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image
                src="/images/empty-results.svg"
                alt="Không tìm thấy sản phẩm"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">
                Không có sản phẩm nào phù hợp với bộ lọc của bạn.
              </p>
              <Button onClick={clearAllFilters}>Xóa tất cả bộ lọc</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
