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
import type { Manufacturer } from "@/lib_dashboard/types/manufacturer";
import { Edit, Factory, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

// Custom styles for DataTable
const customStyles = {
  header: {
    style: {
      backgroundColor: "#f8fdf6",
      borderBottom: "1px solid #accc8b",
      fontWeight: "600",
      color: "#44703d",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8fdf6",
      borderBottom: "1px solid #accc8b",
      minHeight: "48px",
    },
  },
  headCells: {
    style: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#44703d",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      color: "#44703d",
      "&:not(:last-of-type)": {
        borderBottom: "1px solid #f0f0f0",
      },
      "&:hover": {
        backgroundColor: "#f8fdf6",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  pagination: {
    style: {
      backgroundColor: "#f8fdf6",
      borderTop: "1px solid #accc8b",
    },
  },
};

interface ManufacturerTableProps {
  manufacturers: Manufacturer[];
  selectedManufacturers: string[];
  onSelectManufacturer: (manufacturerId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (manufacturerId: string) => void;
  onEditManufacturer: (manufacturerId: string) => void;
  onDeleteManufacturer: (manufacturerId: string) => void;
  loading?: boolean;
}

export const ManufacturerTable = memo<ManufacturerTableProps>(
  ({
    manufacturers,
    selectedManufacturers,
    onSelectManufacturer,
    onSelectAll,
    onToggleStatus,
    onEditManufacturer,
    onDeleteManufacturer,
    loading = false,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const isAllSelected = useMemo(() => {
      return (
        manufacturers.length > 0 &&
        selectedManufacturers.length === manufacturers.length
      );
    }, [manufacturers.length, selectedManufacturers.length]);

    const isIndeterminate = useMemo(() => {
      return (
        selectedManufacturers.length > 0 &&
        selectedManufacturers.length < manufacturers.length
      );
    }, [selectedManufacturers.length, manufacturers.length]);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d] text-white",
          }
        : {
            label: "Đã tắt",
            variant: "destructive" as const,
            className: "bg-red-500 hover:bg-red-600 text-white",
          };
    }, []);

    const formatDate = useCallback((date: Date | string | undefined) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }, []);

    const columns: TableColumn<Manufacturer>[] = [
      {
        name: (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Chọn tất cả"
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        width: "60px",
        cell: (row: Manufacturer) => (
          <Checkbox
            checked={selectedManufacturers.includes(row.id)}
            onCheckedChange={() => onSelectManufacturer(row.id)}
            aria-label={`Chọn ${row.name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        sortable: false,
        allowOverflow: true,
        button: true,
      },
      {
        name: "Tên nhà sản xuất",
        selector: (row: Manufacturer) => row.name,
        sortable: true,
        minWidth: "250px",
        cell: (row: Manufacturer) => (
          <div className="flex items-center gap-3">
            {row.logo ? (
              <img
                src={row.logo}
                alt={row.name}
                className="w-10 h-10 rounded-lg object-cover border border-[#accc8b]/30"
              />
            ) : (
              <div className="w-10 h-10 bg-[#accc8b]/20 rounded-lg flex items-center justify-center">
                <Factory className="h-5 w-5 text-[#74a65d]" />
              </div>
            )}
            <div>
              <div className="font-semibold text-[#44703d]">{row.name}</div>
              <div className="text-xs text-[#74a65d]">
                ID: {row.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        ),
        allowOverflow: true,
      },
      {
        name: "Mô tả",
        selector: (row: Manufacturer) => row.description || "",
        sortable: true,
        minWidth: "200px",
        cell: (row: Manufacturer) => (
          <div className="text-[#74a65d] max-w-xs">
            <div
              className="truncate"
              title={row.description || "Không có mô tả"}
            >
              {row.description || "Không có mô tả"}
            </div>
          </div>
        ),
        allowOverflow: true,
      },

      {
        name: "Trạng thái",
        selector: (row: Manufacturer) => row.isActive,
        sortable: true,
        width: "200px",
        cell: (row: Manufacturer) => {
          const { label, variant, className } = getStatusBadge(row.isActive);
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        name: "Kích hoạt",
        selector: (row: Manufacturer) => row.isActive,
        width: "100px",
        cell: (row: Manufacturer) => (
          <Switch
            checked={row.isActive}
            onCheckedChange={() => onToggleStatus(row.id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
      },
      {
        name: "Thao tác",
        width: "100px",
        cell: (row: Manufacturer) => (
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
                onClick={() => onEditManufacturer(row.id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d] cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteManufacturer(row.id)}
                className="hover:bg-red-50 text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa nhà sản xuất
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
          columns={columns}
          data={manufacturers}
          customStyles={customStyles}
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

ManufacturerTable.displayName = "ManufacturerTable";
