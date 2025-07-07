"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { categoryFiltersAtom } from "@/lib_dashboard/store/category-store";
import { useAtomValue, useSetAtom } from "jotai";

export function CategoryFilters() {
  const filters = useAtomValue(categoryFiltersAtom);
  const setFilters = useSetAtom(categoryFiltersAtom);
  const fetchList = useCategories().fetchList;

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
    </div>
  );
}
