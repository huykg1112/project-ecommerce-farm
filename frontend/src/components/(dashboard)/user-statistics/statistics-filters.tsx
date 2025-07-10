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
import type {
  TimeRange,
  UserRole,
  UserStatisticsFilters,
  UserStatus,
} from "@/lib_dashboard/store/user-statistics-store";
import { Calendar, RotateCcw } from "lucide-react";
import type React from "react";
import { memo, useCallback } from "react";

interface StatisticsFiltersProps {
  filters: UserStatisticsFilters;
  onFiltersChange: (filters: Partial<UserStatisticsFilters>) => void;
  onReset: () => void;
}

export const StatisticsFilters = memo<StatisticsFiltersProps>(
  ({ filters, onFiltersChange, onReset }) => {
    const handleTimeRangeChange = useCallback(
      (timeRange: TimeRange) => {
        // Xóa các trường không liên quan khi thay đổi timeRange
        const newFilters: Partial<UserStatisticsFilters> = { timeRange };
        if (timeRange !== "custom") {
          newFilters.startDate = undefined;
          newFilters.endDate = undefined;
        }
        if (timeRange === "year") {
          newFilters.selectedYear = new Date().getFullYear();
          newFilters.selectedMonth = undefined;
        }
        if (timeRange === "month") {
          newFilters.selectedYear = new Date().getFullYear();
        }
        onFiltersChange(newFilters);
      },
      [onFiltersChange]
    );

    const handleMonthChange = useCallback(
      (month: string) => {
        onFiltersChange({ selectedMonth: parseInt(month) });
      },
      [onFiltersChange]
    );

    const handleYearChange = useCallback(
      (year: string) => {
        onFiltersChange({ selectedYear: parseInt(year) });
      },
      [onFiltersChange]
    );

    const handleRoleChange = useCallback(
      (role: UserRole) => {
        onFiltersChange({ role });
      },
      [onFiltersChange]
    );

    const handleStatusChange = useCallback(
      (status: UserStatus) => {
        onFiltersChange({ status });
      },
      [onFiltersChange]
    );

    const handleStartDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = e.target.value ? new Date(e.target.value) : undefined;
        onFiltersChange({ startDate });
      },
      [onFiltersChange]
    );

    const handleEndDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const endDate = e.target.value ? new Date(e.target.value) : undefined;
        onFiltersChange({ endDate });
      },
      [onFiltersChange]
    );

    const formatDateForInput = (date?: Date) => {
      if (!date) return "";
      return date.toISOString().split("T")[0];
    };

    // Tạo danh sách năm (từ 2015 đến năm hiện tại)
    const years = Array.from(
      { length: new Date().getFullYear() - 2014 },
      (_, i) => new Date().getFullYear() - i
    );

    return (
      <Card className="card-agricultural">
        <CardHeader>
          <CardTitle className="text-[#44703d] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bộ lọc thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time Range */}
            <div className="space-y-2">
              <Label className="text-[#44703d]">Khoảng thời gian</Label>
              <Select
                value={filters.timeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#accc8b]">
                  <SelectItem value="month">Theo tháng</SelectItem>
                  <SelectItem value="year">Theo năm</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Month Selector (hiển thị khi timeRange = "month") */}
            {filters.timeRange === "month" && (
              <div className="space-y-2">
                <Label className="text-[#44703d]">Chọn tháng</Label>
                <Select
                  value={filters.selectedMonth?.toString() || ""}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                    <SelectValue placeholder="Chọn tháng" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#accc8b]">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Tháng {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Year Selector (hiển thị khi timeRange = "month" hoặc "year") */}
            {(filters.timeRange === "month" ||
              filters.timeRange === "year") && (
              <div className="space-y-2">
                <Label className="text-[#44703d]">Chọn năm</Label>
                <Select
                  value={filters.selectedYear?.toString() || ""}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#accc8b]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Role Filter */}
            <div className="space-y-2">
              <Label className="text-[#44703d]">Vai trò</Label>
              <Select value={filters.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#accc8b]">
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="Client">Khách hàng</SelectItem>
                  <SelectItem value="Distributor">Đại lý</SelectItem>
                  <SelectItem value="Admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-[#44703d]">Trạng thái</Label>
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#accc8b]">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Đã khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="space-y-2">
              <Label className="text-[#44703d]">Thao tác</Label>
              <Button
                variant="outline"
                onClick={onReset}
                className="w-full border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {filters.timeRange === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#accc8b]/30">
              <div className="space-y-2">
                <Label className="text-[#44703d]">Từ ngày</Label>
                <Input
                  type="date"
                  value={formatDateForInput(filters.startDate)}
                  onChange={handleStartDateChange}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#44703d]">Đến ngày</Label>
                <Input
                  type="date"
                  value={formatDateForInput(filters.endDate)}
                  onChange={handleEndDateChange}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

StatisticsFilters.displayName = "StatisticsFilters";
