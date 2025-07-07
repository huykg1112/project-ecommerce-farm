"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw } from "lucide-react"
import type { User } from "@/types/entities"

interface WarehouseFiltersProps {
  search: string
  status: string
  distributor: string
  distributors: User[]
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  onDistributorChange: (distributor: string) => void
  onReset: () => void
}

export const WarehouseFilters = memo<WarehouseFiltersProps>(
  ({ search, status, distributor, distributors, onSearchChange, onStatusChange, onDistributorChange, onReset }) => {
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value)
      },
      [onSearchChange],
    )

    return (
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-lg border border-[#accc8b]/30">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#74a65d] h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên kho, nhà phân phối, địa chỉ..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 border-[#90c577] focus:border-[#74a65d]"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-48 border-[#90c577] focus:border-[#74a65d]">
            <SelectValue placeholder="Trạng thái kho" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#accc8b]">
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={distributor} onValueChange={onDistributorChange}>
          <SelectTrigger className="w-full lg:w-48 border-[#90c577] focus:border-[#74a65d]">
            <SelectValue placeholder="Nhà phân phối" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#accc8b]">
            <SelectItem value="all">Tất cả nhà phân phối</SelectItem>
            {distributors.map((dist) => (
              <SelectItem key={dist.user_id} value={dist.user_id}>
                {dist.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onReset}
          className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
      </div>
    )
  },
)

WarehouseFilters.displayName = "WarehouseFilters"
