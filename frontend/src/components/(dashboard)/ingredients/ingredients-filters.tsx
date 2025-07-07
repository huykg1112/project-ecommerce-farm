"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIngredient } from "@/hooks/use-ingredient";

export function IngredientsFilters() {
  const { filters, setFilters, fetchList } = useIngredient();

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <Input
        placeholder="Tìm theo tên danh mục..."
        className="max-w-sm"
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        onBlur={fetchList}
      />

      <Select
        value={filters.status}
        onValueChange={(value) => {
          setFilters((f) => ({ ...f, status: value }));
          fetchList();
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Đang hoạt động</SelectItem>
          <SelectItem value="inactive">Đã tắt</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.hazard_level}
        onValueChange={(value) => {
          setFilters((f) => ({ ...f, hazard_level: value }));
          fetchList();
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Mức độ nguy hiểm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="LOW">Thấp</SelectItem>
          <SelectItem value="MEDIUM">Trung bình</SelectItem>
          <SelectItem value="HIGH">Cao</SelectItem>
          <SelectItem value="VERY_HIGH">Rất cao</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
