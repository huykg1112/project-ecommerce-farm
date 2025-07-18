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
import { Switch } from "@/components/ui/switch";
import { Promotion } from "@/lib_dashboard/types/promotion";
import { Edit, Gift, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface PromotionTableProps {
  promotions: Promotion[];
  selectedPromotions: string[];
  onSelectPromotion: (promotionId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (promotionId: string) => void;
  onEditPromotion: (promotionId: string) => void;
  onDeletePromotion: (promotionId: string) => void;
  loading?: boolean;
}

export const PromotionTable = memo<PromotionTableProps>(
  ({
    promotions,
    selectedPromotions,
    onSelectPromotion,
    onSelectAll,
    onToggleStatus,
    onEditPromotion,
    onDeletePromotion,
    loading = false,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const isAllSelected = useMemo(() => {
      return (
        promotions.length > 0 && selectedPromotions.length === promotions.length
      );
    }, [promotions.length, selectedPromotions.length]);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã tắt", variant: "destructive" as const };
    }, []);

    const formatDate = useCallback((date: Date | string) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("vi-VN");
    }, []);

    const formatCurrency = useCallback((amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }, []);

    const columns = [
      {
        name: (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Chọn tất cả"
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        width: "48px",
        cell: (row: Promotion) => (
          <Checkbox
            checked={selectedPromotions.includes(row.promotion_id)}
            onCheckedChange={() => onSelectPromotion(row.promotion_id)}
            aria-label={`Chọn ${row.promotion_name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Mã khuyến mãi",
        selector: (row: Promotion) => row.promotion_name,
        sortable: true,
        cell: (row: Promotion) => (
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#74a65d]" />
            <span className="font-semibold text-[#44703d]">
              {row.promotion_name}
            </span>
          </div>
        ),
        allowOverflow: true,
      },

      {
        name: "Tỷ lệ giảm giá",
        selector: (row: Promotion) => row.discount_value || 0,
        sortable: true,
        cell: (row: Promotion) => (
          <div className="text-[#44703d]">
            {row.discount_value ? `${row.discount_value}%` : "N/A"}
          </div>
        ),
      },
      {
        name: "Mô tả",
        selector: (row: Promotion) => row.description,
        sortable: true,
        cell: (row: Promotion) => (
          <div className="text-[#44703d]">
            {row.description || "Không có mô tả"}
          </div>
        ),
        with: "300px",
      },
      {
        name: "Hạn sử dụng",
        selector: (row: Promotion) => row.end_date || "",
        sortable: true,
        cell: (row: Promotion) => (
          <div className="text-[#44703d]">
            {formatDate(row?.start_date || new Date())}-
            {formatDate(row?.end_date || new Date())}
          </div>
        ),
      },
      {
        name: "Trạng thái",
        selector: (row: Promotion) => row.is_active,
        sortable: true,
        cell: (row: Promotion) => {
          const { label, variant, className } = getStatusBadge(
            row?.is_active || false
          );
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        name: "Kích hoạt",
        selector: (row: Promotion) => row.is_active,
        cell: (row: Promotion) => (
          <Switch
            checked={row.is_active}
            onCheckedChange={() => onToggleStatus(row.promotion_id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
      },
      {
        width: "80px",
        cell: (row: Promotion) => (
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
                onClick={() => onEditPromotion(row.promotion_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeletePromotion(row.promotion_id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa khuyến mãi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

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
          columns={columns as TableColumn<Promotion>[]}
          data={promotions}
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          responsive
          fixedHeader
          fixedHeaderScrollHeight="600px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
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

PromotionTable.displayName = "PromotionTable";
