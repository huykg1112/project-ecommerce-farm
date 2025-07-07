"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActiveIngredient } from "@/types/entities";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useCallback } from "react";

interface IngredientsTableProps {
  ingredients: ActiveIngredient[];
  onToggleStatus: (ingredientId: string) => void;
  onEditIngredient: (ingredientId: string) => void;
  onDeleteIngredient: (ingredientId: string) => void;
  loading?: boolean;
}

export const IngredientsTable = memo<IngredientsTableProps>(
  ({
    ingredients,
    onToggleStatus,
    onEditIngredient,
    onDeleteIngredient,
    loading = false,
  }) => {
    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã tắt", variant: "secondary" as const };
    }, []);

    // Mock product count for demonstration
    const getProductCount = useCallback((ingredientId: string) => {
      // In a real app, this would come from the API
      const mockCounts: Record<string, number> = {
        ing_001: 15,
        ing_002: 23,
        ing_003: 18,
        ing_004: 12,
        ing_005: 8,
        ing_006: 5,
        ing_007: 0,
        ing_008: 7,
        ing_009: 0,
        ing_010: 3,
      };
      return mockCounts[ingredientId] || 0;
    }, []);

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
        <Table>
          <TableHeader>
            <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
              <TableHead className="text-[#44703d] font-semibold">
                Tên hoạt chất
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold">
                Công thức hóa học
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold">
                Số CAS
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold">
                Mô tả
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold">
                Mức độ nguy hiểm
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold">
                Kích hoạt
              </TableHead>
              <TableHead className="text-[#44703d] font-semibold w-20">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow
                key={ingredient.ingredient_id}
                className="hover:bg-[#accc8b]/10 transition-colors"
              >
                <TableCell>
                  <div className="font-semibold text-[#44703d]">
                    {ingredient.ingredient_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-[#74a65d] max-w-md">
                    <p className="line-clamp-2">
                      {ingredient.chemical_formula}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-[#74a65d] max-w-md">
                    <p className="line-clamp-2">{ingredient.cas_number}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-[#74a65d] max-w-md">
                    <p className="line-clamp-2">{ingredient.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={ingredient.is_active}
                    onCheckedChange={() =>
                      onToggleStatus(ingredient.ingredient_id)
                    }
                    className="data-[state=checked]:bg-[#74a65d]"
                  />
                </TableCell>
                <TableCell>
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
                        onClick={() =>
                          onEditIngredient(ingredient.ingredient_id)
                        }
                        className="hover:bg-[#accc8b]/20 text-[#44703d]"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onDeleteIngredient(ingredient.ingredient_id)
                        }
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa hoạt chất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

IngredientsTable.displayName = "IngredientsTable";
