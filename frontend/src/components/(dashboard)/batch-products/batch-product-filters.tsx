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
import type { BatchProductFilters } from "@/lib_dashboard/types/batch-product";
import { Filter, RotateCcw } from "lucide-react";
import { useCallback } from "react";

interface BatchProductFiltersProps {
  filters: Partial<BatchProductFilters>;
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
      onUpdateFilters({ [field]: value });
    },
    [onUpdateFilters]
  );

  const handleDateChange = useCallback(
    (field: "from_date" | "to_date", value: string) => {
      onUpdateFilters({ [field]: value });
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
              <SelectItem value="0">Tất cả</SelectItem>
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

        {/* Stock Quantity Threshold */}
        <div className="space-y-2">
          <Label htmlFor="stock_quantity_threshold">Số lượng tồn kho</Label>
          <Select
            value={filters.stock_quantity_threshold?.toString() || "0"}
            onValueChange={(value) =>
              handleInputChange(
                "stock_quantity_threshold",
                value ? parseInt(value) : undefined
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn số lượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="999999">Tất cả</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="80">80</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {isFiltered ? "Đang áp dụng bộ lọc" : "Không có bộ lọc nào"}
        </div>
      </div>
    </div>
  );
}
