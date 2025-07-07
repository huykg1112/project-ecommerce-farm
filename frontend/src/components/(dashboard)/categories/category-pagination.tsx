"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { memo, useMemo } from "react";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const CategoryPagination = memo<CategoryPaginationProps>(
  ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
  }) => {
    const startItem = useMemo(() => {
      return (currentPage - 1) * itemsPerPage + 1;
    }, [currentPage, itemsPerPage]);

    const endItem = useMemo(() => {
      return Math.min(currentPage * itemsPerPage, totalItems);
    }, [currentPage, itemsPerPage, totalItems]);

    const visiblePages = useMemo(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#accc8b]/10 rounded-lg border border-[#accc8b]/30">
        <div className="flex items-center gap-2 text-sm text-[#44703d]">
          <span>Hiển thị</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-8 border-[#90c577] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#accc8b]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>trong tổng số {totalItems} kết quả</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#44703d] mr-4">
            {startItem}-{endItem} của {totalItems}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {visiblePages.map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={typeof page !== "number"}
                className={`h-8 min-w-8 px-2 ${
                  page === currentPage
                    ? "bg-[#74a65d] hover:bg-[#90c577] text-white"
                    : "border-[#90c577] hover:bg-[#accc8b]/20"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

CategoryPagination.displayName = "CategoryPagination";
