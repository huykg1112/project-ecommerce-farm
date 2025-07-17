"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BatchProductFilters } from "@/lib_dashboard/types/batch-product";
import { Filter, RotateCcw } from "lucide-react";
import { useCallback } from "react";

interface BatchProductFiltersProps {
  filters: BatchProductFilters;
  onUpdateFilters: (filters: Partial<BatchProductFilters>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export function BatchProductFilters({
  filters,
  onUpdateFilters,
  onResetFilters,
  loading = false,
}: BatchProductFiltersProps) {
  const handleInputChange = useCallback(
    (field: keyof BatchProductFilters, value: any) => {
      onUpdateFilters({ [field]: value, page: 1 });
    },
    [onUpdateFilters]
  );

  const handleDateChange = useCallback(
    (field: "from_date" | "to_date", value: string) => {
      onUpdateFilters({ [field]: value, page: 1 });
    },
    [onUpdateFilters]
  );

  const isFiltered = 
    filters.search ||
    filters.is_active !== undefined ||
    filters.low_stock ||
    filters.expiring_soon_days ||
    filters.from_date ||
    filters.to_date ||
    filters.batch_number;

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <Input
            id="search"
            placeholder="Tên sản phẩm, số lô..."
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Batch Number */}
        <div className="space-y-2">
          <Label htmlFor="batch_number">Số lô</Label>
          <Input
            id="batch_number"
            placeholder="Nhập số lô..."
            value={filters.batch_number || ""}
            onChange={(e) => handleInputChange("batch_number", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            value={
              filters.is_active === undefined
                ? "all"
                : filters.is_active
                ? "active"
                : "inactive"
            }
            onValueChange={(value) =>
              handleInputChange(
                "is_active",
                value === "all" ? undefined : value === "active"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expiring Soon Days */}
        <div className="space-y-2">
          <Label htmlFor="expiring_soon">Sắp hết hạn (ngày)</Label>
          <Select
            value={filters.expiring_soon_days?.toString() || ""}
            onValueChange={(value) =>
              handleInputChange(
                "expiring_soon_days",
                value ? parseInt(value) : undefined
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn số ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              <SelectItem value="7">7 ngày</SelectItem>
              <SelectItem value="15">15 ngày</SelectItem>
              <SelectItem value="30">30 ngày</SelectItem>
              <SelectItem value="60">60 ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Low Stock Filter */}
        <div className="space-y-2">
          <Label htmlFor="low_stock">Sắp hết hàng</Label>
          <Select
            value={filters.low_stock ? "true" : "false"}
            onValueChange={(value) =>
              handleInputChange("low_stock", value === "true")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Tất cả</SelectItem>
              <SelectItem value="true">Chỉ sắp hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* From Date */}
        <div className="space-y-2">
          <Label htmlFor="from_date">Từ ngày hết hạn</Label>
          <Input
            id="from_date"
            type="date"
            value={filters.from_date || ""}
            onChange={(e) => handleDateChange("from_date", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <Label htmlFor="to_date">Đến ngày hết hạn</Label>
          <Input
            id="to_date"
            type="date"
            value={filters.to_date || ""}
            onChange={(e) => handleDateChange("to_date", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort_by">Sắp xếp theo</Label>
          <Select
            value={filters.sort_by || "created_at"}
            onValueChange={(value) => handleInputChange("sort_by", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cách sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Ngày tạo</SelectItem>
              <SelectItem value="batch_number">Số lô</SelectItem>
              <SelectItem value="quantity">Số lượng</SelectItem>
              <SelectItem value="expiry_date">Ngày hết hạn</SelectItem>
              <SelectItem value="manufactured_date">Ngày sản xuất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {isFiltered ? "Đang áp dụng bộ lọc" : "Không có bộ lọc nào"}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Thứ tự:</span>
          <Select
            value={filters.sort_order || "desc"}
            onValueChange={(value: "asc" | "desc") =>
              handleInputChange("sort_order", value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Giảm dần</SelectItem>
              <SelectItem value="asc">Tăng dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}