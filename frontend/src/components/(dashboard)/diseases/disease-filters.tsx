"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { memo, useCallback } from "react";

interface DiseaseFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export const DiseaseFilters = memo<DiseaseFiltersProps>(
  ({ search, status, onSearchChange, onStatusChange, onReset }) => {
    const handleReset = useCallback(() => {
      onReset();
    }, [onReset]);

    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#accc8b]/10 rounded-lg border border-[#accc8b]/30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#74a65d]" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mô tả bệnh..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-[#90c577] focus:border-[#74a65d] bg-white"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48 border-[#90c577] focus:border-[#74a65d] bg-white">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#accc8b]">
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Đã tắt</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleReset}
          className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
      </div>
    );
  }
);

DiseaseFilters.displayName = "DiseaseFilters";
