"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevenueFilters } from "@/lib_dashboard/types/revenue";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { useCallback } from "react";

interface RevenueFiltersComponentProps {
  filters: RevenueFilters;
  onFilterChange: (filters: Partial<RevenueFilters>) => void;
  onResetFilters: () => void;
  orderStatuses?: Array<{ status_id: string; status_name: string }>;
  paymentMethods?: Array<{ method_id: string; method_name: string }>;
}

export function RevenueFiltersComponent({
  filters,
  onFilterChange,
  onResetFilters,
  orderStatuses = [],
  paymentMethods = [],
}: RevenueFiltersComponentProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleTimeRangeChange = useCallback(
    (timeRange: string) => {
      const newFilters: Partial<RevenueFilters> = {
        timeRange: timeRange as any,
      };

      if (timeRange === "year") {
        newFilters.year = currentYear;
      } else if (timeRange === "month") {
        newFilters.year = currentYear;
        newFilters.month = currentMonth;
      } else if (timeRange === "custom" || timeRange === "day") {
        // Set default date range for last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        newFilters.dateFrom = thirtyDaysAgo.toISOString().split("T")[0];
        newFilters.dateTo = today.toISOString().split("T")[0];
      }

      onFilterChange(newFilters);
    },
    [currentYear, currentMonth, onFilterChange]
  );

  const getTimeRangeLabel = () => {
    switch (filters.timeRange) {
      case "day":
        return "Theo khoảng ngày (12 cột)";
      case "month":
        return "Theo tháng (10 cột)";
      case "year":
        return "Theo năm (12 tháng)";
      case "custom":
        return "Tùy chọn thời gian";
      default:
        return "Chọn khung thời gian";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#44703d]">
          <Filter className="w-5 h-5" />
          Bộ lọc thống kê doanh thu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Range Filter */}
          <div className="space-y-2">
            <Label htmlFor="timeRange">Khung thời gian</Label>
            <Select
              value={filters.timeRange}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={getTimeRangeLabel()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">
                  📅 Theo khoảng ngày (12 cột)
                </SelectItem>
                <SelectItem value="month">📊 Theo tháng (10 cột)</SelectItem>
                <SelectItem value="year">📈 Theo năm (12 tháng)</SelectItem>
                <SelectItem value="custom">🔧 Tùy chọn thời gian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter for year/month views */}
          {(filters.timeRange === "year" || filters.timeRange === "month") && (
            <div className="space-y-2">
              <Label htmlFor="year">Năm</Label>
              <Select
                value={filters.year?.toString()}
                onValueChange={(value) =>
                  onFilterChange({ year: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Month Filter for month view */}
          {filters.timeRange === "month" && (
            <div className="space-y-2">
              <Label htmlFor="month">Tháng</Label>
              <Select
                value={filters.month?.toString()}
                onValueChange={(value) =>
                  onFilterChange({ month: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Tháng {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range for custom/day views */}
          {(filters.timeRange === "custom" || filters.timeRange === "day") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Từ ngày</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) =>
                      onFilterChange({ dateFrom: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Đến ngày</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) => onFilterChange({ dateTo: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Second row filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái đơn hàng</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) =>
                onFilterChange({ status: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả trạng thái</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.status_id} value={status.status_name}>
                    {status.status_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Select
              value={filters.paymentMethod || ""}
              onValueChange={(value) =>
                onFilterChange({ paymentMethod: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả phương thức</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.method_id} value={method.method_name}>
                    {method.method_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại bộ lọc
            </Button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Thống kê hiện tại:</strong> {getTimeRangeLabel()}
            {filters.year && ` - Năm ${filters.year}`}
            {filters.month && ` - Tháng ${filters.month}`}
            {filters.dateFrom &&
              filters.dateTo &&
              ` - Từ ${filters.dateFrom} đến ${filters.dateTo}`}
            {filters.status && ` - Trạng thái: ${filters.status}`}
            {filters.paymentMethod && ` - Thanh toán: ${filters.paymentMethod}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
