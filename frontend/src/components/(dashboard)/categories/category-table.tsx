"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/lib_dashboard/types/category";
import {
  Edit,
  ImageIcon,
  Lock,
  MoreHorizontal,
  Trash2,
  Unlock,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { memo, useCallback, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  loading?: boolean;
}

export const CategoryTable = memo<CategoryTableProps>(
  ({
    categories,
    selectedCategories,
    onSelectCategory,
    onSelectAll,
    onToggleStatus,
    onEditCategory,
    onDeleteCategory,
    loading = false,
  }) => {
    const isAllSelected = useMemo(() => {
      return (
        categories.length > 0 && selectedCategories.length === categories.length
      );
    }, [categories.length, selectedCategories.length]);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã bị khóa", variant: "destructive" as const };
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
        cell: (row: Category) => (
          <Checkbox
            checked={selectedCategories.includes(row.id)}
            onCheckedChange={() => onSelectCategory(row.id)}
            aria-label={`Chọn ${row.name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Hình ảnh",
        selector: (row: Category) => row.image,
        cell: (row: Category) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#accc8b]/10 flex items-center justify-center">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-[#90c577]" />
            )}
          </div>
        ),
      },
      {
        name: "Tên danh mục",
        selector: (row: Category) => row.name,
        sortable: true,
        cell: (row: Category) => (
          <div className="font-semibold text-[#44703d]">{row.name}</div>
        ),
        allowOverflow: true,
      },
      {
        name: "Mô tả",
        selector: (row: Category) => row.description,
        cell: (row: Category) => (
          <div className="text-[#74a65d] max-w-md">{row.description}</div>
        ),
      },
      {
        name: "Trạng thái",
        selector: (row: Category) => row.isActive,
        sortable: true,
        cell: (row: Category) => {
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
        selector: (row: Category) => row.isActive,
        cell: (row: Category) => (
          <Switch
            checked={row.isActive}
            onCheckedChange={() => onToggleStatus(row.id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
      },
      {
        width: "80px",
        cell: (row: Category) => (
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
                onClick={() => onEditCategory(row.id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(row.id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                {row.isActive ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Khóa danh mục
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Mở khóa danh mục
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteCategory(row.id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa danh mục
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
          columns={columns as TableColumn<Category>[]}
          data={categories}
          customStyles={customStyles}
          noDataComponent={
            <div className="text-[#44703d] py-4">
              Không có dữ liệu để hiển thị
            </div>
          }
        />
      </div>
    );
  }
);

CategoryTable.displayName = "CategoryTable";
