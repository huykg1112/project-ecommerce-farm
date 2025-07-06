"use client"

import { memo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Package, ImageIcon } from "lucide-react"
import type { Category } from "@/types/entities"

interface CategoryTableProps {
  categories: Category[]
  onToggleStatus: (categoryId: string) => void
  onEditCategory: (categoryId: string) => void
  onDeleteCategory: (categoryId: string) => void
  loading?: boolean
}

export const CategoryTable = memo<CategoryTableProps>(
  ({ categories, onToggleStatus, onEditCategory, onDeleteCategory, loading = false }) => {
    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? { label: "Đang hoạt động", variant: "default" as const, className: "bg-[#90c577] hover:bg-[#74a65d]" }
        : { label: "Đã tắt", variant: "secondary" as const }
    }, [])

    // Mock product count for demonstration
    const getProductCount = useCallback((categoryId: string) => {
      // In a real app, this would come from the API
      const mockCounts: Record<string, number> = {
        cat_001: 15,
        cat_002: 23,
        cat_003: 18,
        cat_004: 12,
        cat_005: 8,
        cat_006: 5,
        cat_007: 0,
        cat_008: 7,
        cat_009: 0,
        cat_010: 3,
      }
      return mockCounts[categoryId] || 0
    }, [])

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#accc8b]/10 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
              <TableHead className="text-[#44703d] font-semibold">Hình ảnh</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Tên danh mục</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Mô tả</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Số sản phẩm</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Trạng thái</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Kích hoạt</TableHead>
              <TableHead className="text-[#44703d] font-semibold w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.category_id} className="hover:bg-[#accc8b]/10 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#accc8b]/10 flex items-center justify-center">
                    {category.category_img ? (
                      <img
                        src={category.category_img || "/placeholder.svg"}
                        alt={category.category_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-[#90c577]" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-[#44703d]">{category.category_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-[#74a65d] max-w-md">
                    <p className="line-clamp-2">{category.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#74a65d]" />
                    <span className="text-[#44703d] font-medium">{getProductCount(category.category_id)}</span>
                    <span className="text-[#74a65d] text-sm">sản phẩm</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadge(category.is_active).variant}
                    className={getStatusBadge(category.is_active).className}
                  >
                    {getStatusBadge(category.is_active).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={category.is_active}
                    onCheckedChange={() => onToggleStatus(category.category_id)}
                    className="data-[state=checked]:bg-[#74a65d]"
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#90c577]/20">
                        <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#accc8b]">
                      <DropdownMenuItem
                        onClick={() => onEditCategory(category.category_id)}
                        className="hover:bg-[#accc8b]/20 text-[#44703d]"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteCategory(category.category_id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa danh mục
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
)

CategoryTable.displayName = "CategoryTable"
