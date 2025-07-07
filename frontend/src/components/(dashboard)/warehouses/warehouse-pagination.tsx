"use client"

import { memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface WarehousePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export const WarehousePagination = memo<WarehousePaginationProps>(
  ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
    const handleItemsPerPageChange = useCallback(
      (value: string) => {
        onItemsPerPageChange(Number.parseInt(value))
      },
      [onItemsPerPageChange],
    )

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-[#accc8b]/30">
        <div className="flex items-center gap-2 text-sm text-[#74a65d]">
          <span>Hiển thị</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20 h-8 border-[#90c577] focus:border-[#74a65d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#accc8b]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>
            kho hàng ({startItem}-{endItem} trong tổng số {totalItems})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className={
                    currentPage === pageNumber
                      ? "bg-[#90c577] hover:bg-[#74a65d] text-white"
                      : "border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
                  }
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  },
)

WarehousePagination.displayName = "WarehousePagination"
