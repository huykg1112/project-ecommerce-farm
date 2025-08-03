"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib_dashboard/types/product";
import {
  Edit,
  Eye,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo } from "react";

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  loading: boolean;
}

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onToggleStatus,
  onViewDetails,
  onEditProduct,
  onDeleteProduct,
  loading,
}: ProductTableProps) {
  // Check if all products are selected
  const isAllSelected = useMemo(() => {
    return products.length > 0 && selectedProducts.length === products.length;
  }, [products.length, selectedProducts.length]);

  // Check if selection is indeterminate
  const isIndeterminate = useMemo(() => {
    return (
      selectedProducts.length > 0 && selectedProducts.length < products.length
    );
  }, [products.length, selectedProducts.length]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      onSelectAll(checked);
    },
    [onSelectAll]
  );

  const handleSelectProduct = useCallback(
    (productId: string) => {
      onSelectProduct(productId);
    },
    [onSelectProduct]
  );

  const getStatusBadge = useCallback((isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`${
          isActive
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }`}
      >
        {isActive ? "Hoạt động" : "Tạm dừng"}
      </Badge>
    );
  }, []);

  const getImageCount = useCallback((product: Product) => {
    return product.images?.length || 0;
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#44703d]">
            📦 Danh sách sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#44703d]">
            📦 Danh sách sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Không có sản phẩm nào được tìm thấy</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#44703d] flex items-center justify-between">
          📦 Danh sách sản phẩm
          <span className="text-sm font-normal text-gray-500">
            {products.length} sản phẩm
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          isIndeterminate;
                    }}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-20">Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-12">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.product_id}
                  className={`${
                    selectedProducts.includes(product.product_id)
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.product_id)}
                      onCheckedChange={() =>
                        handleSelectProduct(product.product_id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Image
                        src={
                          product.images?.[0]?.image_url || "/placeholder.svg"
                        }
                        alt={product.product_name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement;
                        //   target.src = "/placeholder.svg";
                        // }}
                      />
                      {getImageCount(product) > 1 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-2 -right-2 text-xs px-1"
                        >
                          +{getImageCount(product) - 1}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {product.product_name}
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {product.description.substring(0, 100)}
                          {product.description.length > 100 && "..."}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(product.unit_product_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.categories?.slice(0, 2).map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                      {product.categories?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.is_active)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {(() => {
                        // Calculate rating from reviews instead of using avg_rating
                        if (!product.reviews || product.reviews.length === 0) {
                          return (
                            <span className="text-sm text-gray-400">
                              Chưa có đánh giá
                            </span>
                          );
                        }

                        const reviewsWithRating = product.reviews.filter(
                          (review) => review.rating != null
                        );
                        if (reviewsWithRating.length === 0) {
                          return (
                            <span className="text-sm text-gray-400">
                              Chưa có đánh giá
                            </span>
                          );
                        }

                        const totalRating = reviewsWithRating.reduce(
                          (sum, review) => sum + (review.rating || 0),
                          0
                        );
                        const averageRating =
                          totalRating / reviewsWithRating.length;

                        return (
                          <>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium">
                                {averageRating.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {reviewsWithRating.length} đánh giá
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(product.product_id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditProduct(product.product_id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(product.product_id)}
                        >
                          {product.is_active ? (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-2" />
                              Tạm dừng
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 mr-2" />
                              Kích hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteProduct(product.product_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
