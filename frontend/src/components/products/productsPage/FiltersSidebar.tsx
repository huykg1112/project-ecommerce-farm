import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/lib_dashboard/types/category";
import { InvenstoryClient } from "@/lib_dashboard/types/product";
import { FilterState } from "@/types/products";
import { useState } from "react";

interface FiltersSidebarProps {
  filters: FilterState;
  handleFilterChange: (filterType: keyof FilterState, value: any) => void;
  handleCategoryChange: (category: string) => void;
  handleInventoryChange: (inventory: string) => void;
  handleRatingChange: (rating: number | null) => void;
  handlePriceChange: (value: number[]) => void;
  clearAllFilters: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categories: Category[];
  inventorys: InvenstoryClient[];
  minPrice: number;
  maxPrice: number;
}

// đém số lượng sản phẩm trong mỗi danh mục
function countProductsInCategory(category: Category): number {
  return category.products.filter(
    (product) => product.is_active && !product.is_deleted
  ).length;
}

export default function FiltersSidebar({
  filters,
  handleFilterChange,
  handleCategoryChange,
  handleInventoryChange,
  handleRatingChange,
  handlePriceChange,
  clearAllFilters,
  searchTerm,
  setSearchTerm,
  categories,
  inventorys,
  minPrice,
  maxPrice,
}: FiltersSidebarProps) {
  const [searchInventory, setSearchInventory] = useState<string>("");

  const handleSearchInventoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInventory(e.target.value);
  };

  return (
    <div className="md:block w-64 shrink-0 overflow-y-auto">
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
          defaultValue={["categories", "price", "rating", "sellers", "other"]}
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
                      {category.name} ({countProductsInCategory(category)})
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
                <Input
                  type="search"
                  placeholder="Tìm kiếm đại lý..."
                  value={searchInventory}
                  onChange={handleSearchInventoryChange}
                  className="mb-4 "
                />
                {inventorys
                  .filter((inventory) =>
                    (inventory?.name || "")
                      .toLowerCase()
                      .includes(searchInventory.toLowerCase())
                  )
                  .map((inventory) => (
                    <div
                      key={inventory?.invenstory_id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={inventory?.invenstory_id}
                        checked={filters.inventory_ids.includes(
                          inventory?.invenstory_id
                        )}
                        onCheckedChange={() =>
                          handleInventoryChange(inventory?.invenstory_id)
                        }
                      />
                      <Label
                        htmlFor={inventory?.invenstory_id}
                        className="text-sm cursor-pointer"
                      >
                        {inventory?.name}
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
                  <Label htmlFor="on-sale" className="text-sm cursor-pointer">
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
  );
}
//Component cho phần bộ lọc sản phẩm trên desktop
