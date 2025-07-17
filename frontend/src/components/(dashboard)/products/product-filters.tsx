"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { Search, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

interface ProductFiltersProps {
  search: string;
  category_id: string;
  status: string;
  price_min?: number;
  price_max?: number;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category_id: string) => void;
  onStatusChange: (status: string) => void;
  onPriceRangeChange: (priceRange: { min?: number; max?: number }) => void;
  onReset: () => void;
}

export function ProductFilters({
  search,
  category_id,
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
  const [localPriceMin, setLocalPriceMin] = useState<string>(price_min?.toString() || "");
  const [localPriceMax, setLocalPriceMax] = useState<string>(price_max?.toString() || "");

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

  const handlePriceKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceChange();
    }
  }, [handlePriceChange]);

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
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <Select value={category_id} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {!categoriesLoading && categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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