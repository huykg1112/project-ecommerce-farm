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
import { RotateCcw, Search } from "lucide-react";
import { memo } from "react";

interface PromotionFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export const PromotionFilters = memo<PromotionFiltersProps>(
  ({ search, status, onSearchChange, onStatusChange, onReset }) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-[#accc8b]/30 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-[#44703d] font-medium">
              Tìm kiếm
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#74a65d]" />
              <Input
                id="search"
                placeholder="Tìm kiếm theo tên khuyến mãi..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-[#90c577] focus:border-[#74a65d]"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="status" className="text-[#44703d] font-medium">
              Trạng thái
            </Label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="mt-1 border-[#90c577] focus:border-[#74a65d]">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

PromotionFilters.displayName = "PromotionFilters";
