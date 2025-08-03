"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { useCallback, useState } from "react";

interface ProductFiltersProps {
  search: string;
  category_ids: string[];
  status: string;
  price_min?: number;
  price_max?: number;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category_ids: string[]) => void;
  onStatusChange: (status: string) => void;
  onPriceRangeChange: (priceRange: { min?: number; max?: number }) => void;
  onReset: () => void;
}

export function ProductFilters({
  search,
  category_ids,
  status,
  price_min,
  price_max,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onPriceRangeChange,
  onReset,
}: ProductFiltersProps) {
  const { categories, loading: categoriesLoading } = useCategories();

  // Local state for price inputs to handle intermediate values
  const [localPriceMin, setLocalPriceMin] = useState<string>(
    price_min?.toString() || ""
  );
  const [localPriceMax, setLocalPriceMax] = useState<string>(
    price_max?.toString() || ""
  );

  // Category selection handlers
  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      const updatedCategories = category_ids.includes(categoryId)
        ? category_ids.filter((id) => id !== categoryId)
        : [...category_ids, categoryId];
      onCategoryChange(updatedCategories);
    },
    [category_ids, onCategoryChange]
  );

  const handleClearCategory = useCallback(
    (categoryId: string) => {
      const updatedCategories = category_ids.filter((id) => id !== categoryId);
      onCategoryChange(updatedCategories);
    },
    [category_ids, onCategoryChange]
  );

  const handleClearAllCategories = useCallback(() => {
    onCategoryChange([]);
  }, [onCategoryChange]);

  // Get selected category names for display
  const getSelectedCategoryNames = useCallback(() => {
    return (
      categories
        ?.filter((cat) => category_ids.includes(cat.id))
        .map((cat) => cat.name) || []
    );
  }, [categories, category_ids]);

  // Handle price range changes with debouncing
  const handlePriceChange = useCallback(() => {
    const min = localPriceMin ? parseFloat(localPriceMin) : undefined;
    const max = localPriceMax ? parseFloat(localPriceMax) : undefined;

    if (min !== price_min || max !== price_max) {
      onPriceRangeChange({ min, max });
    }
  }, [localPriceMin, localPriceMax, price_min, price_max, onPriceRangeChange]);

  const handlePriceMinChange = useCallback((value: string) => {
    setLocalPriceMin(value);
  }, []);

  const handlePriceMaxChange = useCallback((value: string) => {
    setLocalPriceMax(value);
  }, []);

  const handlePriceBlur = useCallback(() => {
    handlePriceChange();
  }, [handlePriceChange]);

  const handlePriceKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handlePriceChange();
      }
    },
    [handlePriceChange]
  );

  const handleReset = useCallback(() => {
    setLocalPriceMin("");
    setLocalPriceMax("");
    onReset();
  }, [onReset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#44703d]">🔍 Bộ lọc sản phẩm</CardTitle>
        <CardDescription>
          Tìm kiếm và lọc sản phẩm theo các tiêu chí khác nhau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              type="text"
              placeholder="Tìm theo tên sản phẩm, mô tả, nhà sản xuất..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Multi-Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="categories">Danh mục</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  id="categories"
                >
                  {category_ids.length === 0 ? (
                    "Chọn danh mục"
                  ) : (
                    <span className="truncate">
                      {category_ids.length === 1
                        ? getSelectedCategoryNames()[0]
                        : `${category_ids.length} danh mục được chọn`}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chọn danh mục</span>
                    {category_ids.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAllCategories}
                        className="h-auto p-1 text-xs"
                      >
                        Xóa tất cả
                      </Button>
                    )}
                  </div>
                  {category_ids.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getSelectedCategoryNames().map((categoryName, index) => (
                        <Badge
                          key={category_ids[index]}
                          variant="secondary"
                          className="text-xs"
                        >
                          {categoryName}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() =>
                              handleClearCategory(category_ids[index])
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {!categoriesLoading &&
                    categories?.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <Checkbox
                          checked={category_ids.includes(category.id)}
                          onChange={() => {}} // Handled by onClick above
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label htmlFor="price-min">Giá từ (VND)</Label>
            <Input
              id="price-min"
              type="number"
              placeholder="0"
              value={localPriceMin}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyPress={handlePriceKeyPress}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-max">Giá đến (VND)</Label>
            <Input
              id="price-max"
              type="number"
              placeholder="∞"
              value={localPriceMax}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyPress={handlePriceKeyPress}
              min="0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
