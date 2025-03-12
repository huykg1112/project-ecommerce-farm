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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { FilterState, SortOption } from "@/types/products";
import { Filter } from "lucide-react";
import ActiveFilters from "./ActiveFilters";
import SortSelect from "./SortSelect";

interface MobileFiltersSheetProps {
  categories: any[];
  sellers: string[];
  filters: FilterState;
  minPrice: number;
  maxPrice: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleCategoryChange: (category: string) => void;
  handleSellerChange: (seller: string) => void;
  handleRatingChange: (rating: number | null) => void;
  handlePriceChange: (value: number[]) => void;
  handleFilterChange: (filterType: keyof FilterState, value: any) => void;
  clearAllFilters: () => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
  activeFilterCount: number;
  sort: SortOption;
  setSort: (value: SortOption) => void;
  renderActiveFilters: () => JSX.Element[];
}

export default function MobileFiltersSheet({
  categories,
  sellers,
  filters,
  minPrice,
  maxPrice,
  searchTerm,
  setSearchTerm,
  handleCategoryChange,
  handleSellerChange,
  handleRatingChange,
  handlePriceChange,
  handleFilterChange,
  clearAllFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  activeFilterCount,
  sort,
  setSort,
  renderActiveFilters,
}: MobileFiltersSheetProps) {
  return (
    <div className="md:hidden mb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <div className="flex items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
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
                              onCheckedChange={() => handleSellerChange(seller)}
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

          <SortSelect sort={sort} setSort={setSort} width="w-[160px]" />
        </div>
      </div>

      {/* Hiển thị các bộ lọc đang áp dụng (mobile) */}
      {activeFilterCount > 0 && (
        <ActiveFilters
          activeFilters={renderActiveFilters()}
          clearAllFilters={clearAllFilters}
          isMobile={true}
        />
      )}
    </div>
  );
}
