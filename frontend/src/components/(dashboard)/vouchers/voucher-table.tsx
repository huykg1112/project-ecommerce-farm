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
import type { Voucher } from "@/types/entities";
import { Edit, Gift, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface VoucherTableProps {
  vouchers: Voucher[];
  selectedVouchers: string[];
  onSelectVoucher: (voucherId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (voucherId: string) => void;
  onEditVoucher: (voucherId: string) => void;
  onDeleteVoucher: (voucherId: string) => void;
  loading?: boolean;
}

export const VoucherTable = memo<VoucherTableProps>(
  ({
    vouchers,
    selectedVouchers,
    onSelectVoucher,
    onSelectAll,
    onToggleStatus,
    onEditVoucher,
    onDeleteVoucher,
    loading = false,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const isAllSelected = useMemo(() => {
      return vouchers.length > 0 && selectedVouchers.length === vouchers.length;
    }, [vouchers.length, selectedVouchers.length]);

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
        cell: (row: Voucher) => (
          <Checkbox
            checked={selectedVouchers.includes(row.voucher_id)}
            onCheckedChange={() => onSelectVoucher(row.voucher_id)}
            aria-label={`Chọn ${row.voucher_code}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Mã voucher",
        selector: (row: Voucher) => row.voucher_code,
        sortable: true,
        cell: (row: Voucher) => (
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#74a65d]" />
            <span className="font-semibold text-[#44703d]">
              {row.voucher_code}
            </span>
          </div>
        ),
        allowOverflow: true,
      },

      {
        name: "Giá trị tối thiểu",
        selector: (row: Voucher) => row.min_order_value || 0,
        sortable: true,
        cell: (row: Voucher) => (
          <div className="text-[#44703d]">
            {row.min_order_value ? formatCurrency(row.min_order_value) : "N/A"}
          </div>
        ),
      },
      {
        name: "Giá trị voucher",
        selector: (row: Voucher) => row.max_discount_value || 0,
        sortable: true,
        cell: (row: Voucher) => (
          <div className="text-[#44703d]">
            {row.max_discount_value
              ? formatCurrency(row.max_discount_value)
              : "N/A"}
          </div>
        ),
      },
      {
        name: "Sử dụng",
        selector: (row: Voucher) => row.used_count,
        sortable: true,
        cell: (row: Voucher) => (
          <div className="text-[#44703d]">
            {row.used_count}/{row.usage_limit || "∞"}
          </div>
        ),
      },
      {
        name: "Hạn sử dụng",
        selector: (row: Voucher) => row.end_date || "",
        sortable: true,
        cell: (row: Voucher) => (
          <div className="text-[#44703d]">
            {formatDate(row?.end_date || new Date())}
          </div>
        ),
      },
      {
        name: "Trạng thái",
        selector: (row: Voucher) => row.is_active,
        sortable: true,
        cell: (row: Voucher) => {
          const { label, variant, className } = getStatusBadge(row.is_active);
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        name: "Kích hoạt",
        selector: (row: Voucher) => row.is_active,
        cell: (row: Voucher) => (
          <Switch
            checked={row.is_active}
            onCheckedChange={() => onToggleStatus(row.voucher_id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
      },
      {
        width: "80px",
        cell: (row: Voucher) => (
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
                onClick={() => onEditVoucher(row.voucher_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteVoucher(row.voucher_id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa voucher
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
          columns={columns as TableColumn<Voucher>[]}
          data={vouchers}
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

VoucherTable.displayName = "VoucherTable";
