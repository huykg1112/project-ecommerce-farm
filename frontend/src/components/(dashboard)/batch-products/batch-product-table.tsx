"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  Edit,
  Package,
  Trash2,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo } from "react";

interface BatchProductTableProps {
  batchProducts: BatchProduct[];
  selectedIds: Set<string>;
  loading?: boolean;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: () => void;
  onEdit: (batchProduct: BatchProduct) => void;
  onDelete: (batchProduct: BatchProduct) => void;
  onSort: (column: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function BatchProductTable({
  batchProducts,
  selectedIds,
  loading = false,
  onToggleSelection,
  onToggleAllSelection,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}: BatchProductTableProps) {
  // Check if all items are selected
  const isAllSelected = useMemo(() => {
    return batchProducts.length > 0 && selectedIds.size === batchProducts.length;
  }, [batchProducts.length, selectedIds.size]);

  // Check if some items are selected
  const isSomeSelected = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < batchProducts.length;
  }, [batchProducts.length, selectedIds.size]);

  // Get status badge color and text
  const getStatusBadge = useCallback((batchProduct: BatchProduct) => {
    const now = new Date();
    const expiryDate = new Date(batchProduct.expiry_date);
    const isExpired = expiryDate < now;
    const isExpiringSoon = expiryDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000;
    const isLowStock = batchProduct.quantity <= batchProduct.low_stock_threshold;

    if (!batchProduct.is_active) {
      return <Badge variant="secondary">Không hoạt động</Badge>;
    }

    if (isExpired) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }

    if (isExpiringSoon) {
      return <Badge variant="destructive">Sắp hết hạn</Badge>;
    }

    if (isLowStock) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Sắp hết hàng</Badge>;
    }

    return <Badge variant="default" className="bg-green-100 text-green-800">Bình thường</Badge>;
  }, []);

  // Get warning icons
  const getWarningIcons = useCallback((batchProduct: BatchProduct) => {
    const now = new Date();
    const expiryDate = new Date(batchProduct.expiry_date);
    const isExpired = expiryDate < now;
    const isExpiringSoon = expiryDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000;
    const isLowStock = batchProduct.quantity <= batchProduct.low_stock_threshold;

    const icons = [];

    if (isExpired || isExpiringSoon) {
      icons.push(
        <TooltipProvider key="expiry">
          <Tooltip>
            <TooltipTrigger>
              <Calendar className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExpired ? "Đã hết hạn" : "Sắp hết hạn"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (isLowStock) {
      icons.push(
        <TooltipProvider key="stock">
          <Tooltip>
            <TooltipTrigger>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Sắp hết hàng (≤ {batchProduct.low_stock_threshold})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return icons;
  }, []);

  // Sort handler
  const handleSort = useCallback(
    (column: string) => {
      onSort(column);
    },
    [onSort]
  );

  // Get sort icon
  const getSortIcon = useCallback(
    (column: string) => {
      if (sortBy !== column) return null;
      return sortOrder === "asc" ? "↑" : "↓";
    },
    [sortBy, sortOrder]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (batchProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lô sản phẩm</h3>
          <p className="text-gray-500">Chưa có lô sản phẩm nào được tạo hoặc không có kết quả phù hợp với bộ lọc.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleAllSelection}
                aria-label="Chọn tất cả"
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
              />
            </TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("batch_number")}
            >
              Số lô {getSortIcon("batch_number")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("quantity")}
            >
              Số lượng {getSortIcon("quantity")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("manufactured_date")}
            >
              Ngày sản xuất {getSortIcon("manufactured_date")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("expiry_date")}
            >
              Ngày hết hạn {getSortIcon("expiry_date")}
            </TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Cảnh báo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batchProducts.map((batchProduct) => (
            <TableRow
              key={batchProduct.batch_id}
              className={`hover:bg-gray-50 ${
                selectedIds.has(batchProduct.batch_id) ? "bg-blue-50" : ""
              }`}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(batchProduct.batch_id)}
                  onCheckedChange={() => onToggleSelection(batchProduct.batch_id)}
                  aria-label={`Chọn lô ${batchProduct.batch_number}`}
                />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {batchProduct.product.images?.[0] ? (
                      <Image
                        src={batchProduct.product.images[0].image_url}
                        alt={batchProduct.product.product_name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {batchProduct.product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(batchProduct.product.unit_product_price)}
                    </p>
                    {/* Product Types */}
                    {batchProduct.product_types && batchProduct.product_types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {batchProduct.product_types.map((type) => (
                          <span
                            key={type.product_type_id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {type.type_name}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Promotions */}
                    {batchProduct.promotions && batchProduct.promotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {batchProduct.promotions.map((promotion) => (
                          <span
                            key={promotion.promotion_id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800"
                          >
                            -{promotion.discount_percentage}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                  {batchProduct.batch_number}
                </code>
              </TableCell>

              <TableCell>
                <div className="text-sm">
                  <span className={`font-medium ${
                    batchProduct.quantity <= batchProduct.low_stock_threshold
                      ? "text-yellow-600"
                      : "text-gray-900"
                  }`}>
                    {batchProduct.quantity.toLocaleString()}
                  </span>
                  <div className="text-xs text-gray-500">
                    Ngưỡng: {batchProduct.low_stock_threshold}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-sm text-gray-900">
                {formatDate(batchProduct.manufactured_date)}
              </TableCell>

              <TableCell className="text-sm">
                <span className={`${
                  new Date(batchProduct.expiry_date) < new Date()
                    ? "text-red-600 font-medium"
                    : new Date(batchProduct.expiry_date).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000
                    ? "text-yellow-600 font-medium"
                    : "text-gray-900"
                }`}>
                  {formatDate(batchProduct.expiry_date)}
                </span>
              </TableCell>

              <TableCell>
                {getStatusBadge(batchProduct)}
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  {getWarningIcons(batchProduct)}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(batchProduct)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(batchProduct)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}