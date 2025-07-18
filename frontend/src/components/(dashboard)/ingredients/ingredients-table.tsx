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
import type { ActiveIngredient } from "@/types/entities";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface IngredientsTableProps {
  ingredients: ActiveIngredient[];
  selectedIngredients: string[];
  onSelectIngredient: (ingredientId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (ingredientId: string) => void;
  onEditIngredient: (ingredientId: string) => void;
  onDeleteIngredient: (ingredientId: string) => void;
  loading?: boolean;
}

export const IngredientsTable = memo<IngredientsTableProps>(
  ({
    ingredients,
    selectedIngredients,
    onSelectIngredient,
    onSelectAll,
    onToggleStatus,
    onEditIngredient,
    onDeleteIngredient,
    loading = false,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const isAllSelected = useMemo(() => {
      return (
        ingredients.length > 0 &&
        selectedIngredients.length === ingredients.length
      );
    }, [ingredients.length, selectedIngredients.length]);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã tắt", variant: "destructive" as const };
    }, []);

    const getHazardLevelBadge = useCallback((hazardLevel: string) => {
      const config = {
        LOW: { label: "Thấp", className: "bg-green-100 text-green-800" },
        MEDIUM: {
          label: "Trung bình",
          className: "bg-yellow-100 text-yellow-800",
        },
        HIGH: { label: "Cao", className: "bg-orange-100 text-orange-800" },
        VERY_HIGH: { label: "Rất cao", className: "bg-red-100 text-red-800" },
      };
      return config[hazardLevel as keyof typeof config] || config.LOW;
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
        cell: (row: ActiveIngredient) => (
          <Checkbox
            checked={selectedIngredients.includes(row.ingredient_id)}
            onCheckedChange={() => onSelectIngredient(row.ingredient_id)}
            aria-label={`Chọn ${row.ingredient_name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Tên hoạt chất",
        selector: (row: ActiveIngredient) => row.ingredient_name,
        sortable: true,
        cell: (row: ActiveIngredient) => (
          <div className="font-semibold text-[#44703d]">
            {row.ingredient_name}
          </div>
        ),
        allowOverflow: true,
      },
      {
        name: "Mô tả",
        selector: (row: ActiveIngredient) => row.description,
        cell: (row: ActiveIngredient) => (
          <div className="text-[#74a65d] max-w-md">
            <p className="line-clamp-2">{row.description}</p>
          </div>
        ),
      },
      {
        name: "Mức độ nguy hiểm",
        selector: (row: ActiveIngredient) => row.hazard_level,
        sortable: true,
        cell: (row: ActiveIngredient) => {
          const { label, className } = getHazardLevelBadge(row.hazard_level);
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${className}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        name: "Trạng thái",
        selector: (row: ActiveIngredient) => row.is_active,
        sortable: true,
        cell: (row: ActiveIngredient) => {
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
        selector: (row: ActiveIngredient) => row.is_active,
        cell: (row: ActiveIngredient) => (
          <Switch
            checked={row.is_active}
            onCheckedChange={() => onToggleStatus(row.ingredient_id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
      },
      {
        width: "80px",
        cell: (row: ActiveIngredient) => (
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
                onClick={() => onEditIngredient(row.ingredient_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteIngredient(row.ingredient_id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa hoạt chất
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
          columns={columns as TableColumn<ActiveIngredient>[]}
          data={ingredients}
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

IngredientsTable.displayName = "IngredientsTable";
