"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useCallback } from "react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSortChange,
  sortBy,
  sortOrder,
}: ProductPaginationProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages]
  );

  const handleItemsPerPageChange = useCallback(
    (value: string) => {
      onItemsPerPageChange(parseInt(value));
    },
    [onItemsPerPageChange]
  );

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortBy === field) {
        // Toggle sort order if same field
        onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
      } else {
        // Set new field with default desc order
        onSortChange(field, "desc");
      }
    },
    [sortBy, sortOrder, onSortChange]
  );

  const getSortIcon = useCallback(
    (field: string) => {
      if (sortBy !== field) {
        return <ArrowUpDown className="h-4 w-4" />;
      }
      return sortOrder === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      );
    },
    [sortBy, sortOrder]
  );

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sắp xếp theo:</span>
            <div className="flex space-x-1">
              <Button
                variant={sortBy === "created_at" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("created_at")}
                className={`text-xs ${
                  sortBy === "created_at"
                    ? "bg-[#90c577] hover:bg-[#74a65d]"
                    : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                }`}
              >
                Ngày tạo {getSortIcon("created_at")}
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("name")}
                className={`text-xs ${
                  sortBy === "name"
                    ? "bg-[#90c577] hover:bg-[#74a65d]"
                    : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                }`}
              >
                Tên {getSortIcon("name")}
              </Button>
              <Button
                variant={sortBy === "price" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("price")}
                className={`text-xs ${
                  sortBy === "price"
                    ? "bg-[#90c577] hover:bg-[#74a65d]"
                    : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                }`}
              >
                Giá {getSortIcon("price")}
              </Button>
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("rating")}
                className={`text-xs ${
                  sortBy === "rating"
                    ? "bg-[#90c577] hover:bg-[#74a65d]"
                    : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                }`}
              >
                Đánh giá {getSortIcon("rating")}
              </Button>
            </div>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">mục</span>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Hiển thị {startItem}-{endItem} trên {totalItems} sản phẩm
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={
                  currentPage === page
                    ? "bg-[#90c577] hover:bg-[#74a65d]"
                    : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                }
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
