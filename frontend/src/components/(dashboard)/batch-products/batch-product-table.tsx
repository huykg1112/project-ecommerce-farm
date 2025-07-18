"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { formatDate } from "@/lib_dashboard/utils/date";
import { Edit, MoreHorizontal, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface BatchProductTableProps {
  batchProducts: BatchProduct[];
  selectedIds: string[];
  loading?: boolean;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: () => void;
  onEdit: (batchProduct: BatchProduct) => void;
  onDelete: (batchProduct: BatchProduct) => void;
}

export const BatchProductTable = memo<BatchProductTableProps>(
  ({
    batchProducts,
    selectedIds,
    loading = false,
    onToggleSelection,
    onToggleAllSelection,
    onEdit,
    onDelete,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Check if all items are selected
    const isAllSelected = useMemo(() => {
      return (
        batchProducts.length > 0 && selectedIds.length === batchProducts.length
      );
    }, [batchProducts.length, selectedIds.length]);

    // Get status badge color and text
    const getStatusBadge = useCallback((batchProduct: BatchProduct) => {
      const now = new Date();
      const expiryDate = new Date(batchProduct.expiry_date);
      const isExpired = expiryDate < now;
      const isExpiringSoon =
        expiryDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000;
      const isLowStock =
        batchProduct.quantity <= batchProduct.low_stock_threshold;

      if (!batchProduct.is_active) {
        return {
          label: "Không hoạt động",
          variant: "secondary" as const,
        };
      }

      if (isExpired) {
        return {
          label: "Hết hạn",
          variant: "destructive" as const,
        };
      }

      if (isExpiringSoon) {
        return {
          label: "Sắp hết hạn",
          variant: "destructive" as const,
        };
      }

      if (isLowStock) {
        return {
          label: "Sắp hết hàng",
          variant: "outline" as const,
          className: "border-yellow-500 text-yellow-700",
        };
      }

      return {
        label: "Bình thường",
        variant: "default" as const,
        className: "bg-[#90c577] text-[#44703d]",
      };
    }, []);

    // Format date with color based on expiry
    const formatExpiryDate = useCallback((date: string) => {
      const now = new Date();
      const expiryDate = new Date(date);
      const isExpiringSoon =
        expiryDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000;
      return (
        <span
          className={
            isExpiringSoon ? "text-red-600 font-medium" : "text-[#44703d]"
          }
        >
          {formatDate(new Date(date))}
        </span>
      );
    }, []);

    // Format quantity with color based on threshold
    const formatQuantity = useCallback(
      (quantity: number, threshold: number) => {
        return (
          <span
            className={
              quantity <= threshold
                ? "text-red-600 font-medium"
                : "text-[#44703d]"
            }
          >
            {quantity.toLocaleString()}
          </span>
        );
      },
      []
    );

    console.log("data", batchProducts);
    // Define columns
    const columns: TableColumn<BatchProduct>[] = [
      {
        name: (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onToggleAllSelection}
            aria-label="Chọn tất cả"
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        width: "48px",
        cell: (row: BatchProduct) => (
          <Checkbox
            checked={selectedIds.includes(row.batch_id)}
            onCheckedChange={() => onToggleSelection(row.batch_id)}
            aria-label={`Chọn lô ${row.batch_number}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Sản phẩm",
        selector: (row: BatchProduct) => row.product.product_name,
        sortable: true,
        cell: (row: BatchProduct) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {row.product.images?.[0].image_url ? (
                <Image
                  src={row.product.images[0].image_url}
                  alt={row.product.product_name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-[#accc8b]/20 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#44703d]" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-[#44703d]">
                {row.product.product_name}
              </p>
              {row.promotions && row.promotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {row.promotions.map((promotion) => (
                    <Badge
                      key={promotion.promotion_id}
                      variant="outline"
                      className="text-[#74a65d] border-[#74a65d]"
                    >
                      -{promotion.discount_value}%
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        name: "Số lô",
        selector: (row: BatchProduct) => row.batch_number,
        sortable: true,
        cell: (row: BatchProduct) => (
          <code className="px-2 py-1 bg-[#accc8b]/20 rounded text-sm font-mono text-[#44703d]">
            {row.batch_number}
          </code>
        ),
      },
      {
        name: "Số lượng",
        selector: (row: BatchProduct) => row.quantity,
        sortable: true,
        cell: (row: BatchProduct) => (
          <div className="text-sm">
            {formatQuantity(row.quantity, row.low_stock_threshold)}
          </div>
        ),
      },
      {
        name: "Giá",
        selector: (row: BatchProduct) => row.unit_product_price,
        cell: (row: BatchProduct) => (
          <div className="text-[#44703d]">
            {formatCurrency(row.unit_product_price)}
          </div>
        ),
      },
      {
        name: "Ngày hết hạn",
        selector: (row: BatchProduct) => row.expiry_date.toString(),
        sortable: true,
        cell: (row: BatchProduct) => (
          <div>{formatExpiryDate(row.expiry_date.toString())}</div>
        ),
      },
      {
        name: "Trạng thái",
        selector: (row: BatchProduct) => row.is_active,
        cell: (row: BatchProduct) => {
          const { label, variant, className } = getStatusBadge(row);
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        width: "80px",
        cell: (row: BatchProduct) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-[#90c577]/20"
              >
                <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border-[#accc8b]"
            >
              <DropdownMenuItem
                onClick={() => onEdit(row)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa lô
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    // Expandable row component
    const ExpandableRowComponent = ({ data }: { data: BatchProduct }) => (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#44703d]">Loại sản phẩm:</span>
            <span className="ml-2 text-[#74a65d]">
              {data.product_types?.type_name || "Chưa cập nhật"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-[#44703d]">
              Số lượng cảnh báo:
            </span>
            <span className="ml-2 text-[#74a65d]">
              {data.low_stock_threshold}
            </span>
          </div>
          <div>
            <span className="font-semibold text-[#44703d]">Ngày sản xuất:</span>
            <span className="ml-2 text-[#74a65d]">
              {formatDate(data.manufactured_date)}
            </span>
          </div>
          <div>
            <span className="font-semibold text-[#44703d]">Kho:</span>
            <span className="ml-2 text-[#74a65d]">Chưa có thông tin kho</span>
          </div>
          <div className="flex items-center ">
            <span className="font-semibold text-[#44703d]">
              Tỷ lệ giảm giá:
            </span>
            <div className="ml-2 mt-1">
              {data.promotions && data.promotions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {data.promotions.map((promotion) => (
                    <Badge
                      key={promotion.promotion_id}
                      variant="outline"
                      className="text-[#74a65d] border-[#74a65d]"
                    >
                      -{promotion.discount_value}%
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-[#74a65d]">Không có khuyến mãi</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-[#accc8b]/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <DataTable
          columns={columns}
          data={batchProducts}
          customStyles={customStyles}
          pagination
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
          expandableRows
          expandableRowsComponent={ExpandableRowComponent}
          noDataComponent={
            <div className="text-[#44703d] py-4">
              Không có dữ liệu để hiển thị
            </div>
          }
          paginationComponentOptions={{
            rowsPerPageText: "Hiển thị",
            rangeSeparatorText: "trong tổng số",
            noRowsPerPage: false,
          }}
        />
      </div>
    );
  }
);

BatchProductTable.displayName = "BatchProductTable";
