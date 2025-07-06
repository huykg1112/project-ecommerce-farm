"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Lock, Unlock, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils/formatters"
import { formatDate } from "@/lib/utils/date"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/types/entities"

export function ProductTable() {
  const {
    products,
    loading,
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    openEditModal,
    openLockModal,
    deleteProduct,
  } = useProducts()

  const [sortField, setSortField] = useState<keyof Product>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      clearSelection()
    } else {
      selectAllProducts()
    }
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await deleteProduct(productId)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"} className="font-medium">
        {isActive ? "Hoạt động" : "Đã khóa"}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Nhà phân phối</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả"
              />
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("product_name")}>
              Sản phẩm
            </TableHead>
            <TableHead>Nhà phân phối</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("unit_product_price")}>
              Giá
            </TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("created_at")}>
              Ngày tạo
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Không có sản phẩm nào.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.product_id)}
                    onCheckedChange={() => toggleProductSelection(product.product_id)}
                    aria-label={`Chọn ${product.product_name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage
                        src={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                        alt={product.product_name}
                      />
                      <AvatarFallback className="rounded-lg">{product.product_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.product_name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{product.distributor.full_name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map((category) => (
                      <Badge key={category.category_id} variant="outline" className="text-xs">
                        {category.category_name}
                      </Badge>
                    ))}
                    {product.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatCurrency(product.unit_product_price)}</div>
                </TableCell>
                <TableCell>{getStatusBadge(product.is_active)}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{formatDate(product.created_at)}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openLockModal(product)}>
                        {product.is_active ? (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Khóa sản phẩm
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Mở khóa
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(product.product_id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
