"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, X, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductFilters } from "@/lib_dashboard/types/product";
import { useProductQueryCommon } from "@/hooks/use-product-common";
import { Card } from "@/components/ui/card";

interface ProductFilterProps {
  onFiltersChange?: (filters: ProductFilters) => void;
  defaultFilters?: Partial<ProductFilters>;
  showActiveFilters?: boolean;
  className?: string;
}

interface LocalFilters {
  search: string;
  category_id: string;
  manufacturer_id: string;
  distributor_id: string;
  status: "all" | "active" | "inactive";
}

export const ProductFilter = ({
  onFiltersChange,
  defaultFilters,
  showActiveFilters = true,
  className,
}: ProductFilterProps) => {
  // === HOOKS ===
  const { filters, updateProductFilters, resetProductFilters } =
    useProductQueryCommon();

  // === LOCAL STATE ===
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    search: defaultFilters?.search || "",
    category_id: defaultFilters?.category_id || "",
    manufacturer_id: defaultFilters?.manufacturer_id || "",
    distributor_id: defaultFilters?.distributor_id || "",
    status: (defaultFilters?.status as LocalFilters["status"]) || "all",
  });

  // === MOCK DATA (Replace with actual API calls) ===
  const [categories, setCategories] = useState([
    { id: "1", name: "Thuốc trừ sâu" },
    { id: "2", name: "Phân bón" },
    { id: "3", name: "Thuốc diệt cỏ" },
    { id: "4", name: "Thuốc trừ nấm" },
  ]);

  const [manufacturers, setManufacturers] = useState([
    { id: "1", name: "Công ty TNHH ABC" },
    { id: "2", name: "Công ty XYZ" },
    { id: "3", name: "Nhà sản xuất DEF" },
  ]);

  const [distributors, setDistributors] = useState([
    { id: "1", name: "Nhà phân phối An Giang" },
    { id: "2", name: "Nhà phân phối Cần Thơ" },
    { id: "3", name: "Nhà phân phối Đồng Tháp" },
  ]);

  // === HANDLERS ===
  const handleFilterChange = (key: keyof LocalFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    const appliedFilters: ProductFilters = {
      ...filters,
      search: localFilters.search || undefined,
      category_id: localFilters.category_id || undefined,
      manufacturer_id: localFilters.manufacturer_id || undefined,
      distributor_id: localFilters.distributor_id || undefined,
      status: localFilters.status !== "all" ? localFilters.status : undefined,
      page: 1, // Reset to first page when applying filters
    };

    updateProductFilters(appliedFilters);
    onFiltersChange?.(appliedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: LocalFilters = {
      search: "",
      category_id: "",
      manufacturer_id: "",
      distributor_id: "",
      status: "all",
    };

    setLocalFilters(resetFilters);
    resetProductFilters();
    onFiltersChange?.({
      search: undefined,
      category_id: undefined,
      manufacturer_id: undefined,
      distributor_id: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
  };

  const handleRemoveFilter = (key: keyof LocalFilters) => {
    const newFilters = { ...localFilters };
    if (key === "status") {
      newFilters[key] = "all";
    } else {
      newFilters[key] = "";
    }
    setLocalFilters(newFilters);

    // Auto apply when removing individual filter
    const appliedFilters: ProductFilters = {
      ...filters,
      [key]: undefined,
    };
    updateProductFilters(appliedFilters);
    onFiltersChange?.(appliedFilters);
  };

  // === COMPUTED VALUES ===
  const activeFiltersCount = [
    localFilters.search,
    localFilters.category_id,
    localFilters.manufacturer_id,
    localFilters.distributor_id,
    localFilters.status !== "all" ? localFilters.status : null,
  ].filter(Boolean).length;

  const getActiveFilters = () => {
    const active = [];

    if (localFilters.search) {
      active.push({
        key: "search" as keyof LocalFilters,
        label: "Tìm kiếm",
        value: localFilters.search,
      });
    }

    if (localFilters.category_id) {
      const category = categories.find(
        (c) => c.id === localFilters.category_id
      );
      active.push({
        key: "category_id" as keyof LocalFilters,
        label: "Danh mục",
        value: category?.name || localFilters.category_id,
      });
    }

    if (localFilters.manufacturer_id) {
      const manufacturer = manufacturers.find(
        (m) => m.id === localFilters.manufacturer_id
      );
      active.push({
        key: "manufacturer_id" as keyof LocalFilters,
        label: "Nhà sản xuất",
        value: manufacturer?.name || localFilters.manufacturer_id,
      });
    }

    if (localFilters.distributor_id) {
      const distributor = distributors.find(
        (d) => d.id === localFilters.distributor_id
      );
      active.push({
        key: "distributor_id" as keyof LocalFilters,
        label: "Nhà phân phối",
        value: distributor?.name || localFilters.distributor_id,
      });
    }

    if (localFilters.status !== "all") {
      active.push({
        key: "status" as keyof LocalFilters,
        label: "Trạng thái",
        value: localFilters.status === "active" ? "Đang hoạt động" : "Tạm dừng",
      });
    }

    return active;
  };

  // === EFFECTS ===
  useEffect(() => {
    // Sync local filters with global filters when they change externally
    setLocalFilters({
      search: filters.search || "",
      category_id: filters.category_id || "",
      manufacturer_id: filters.manufacturer_id || "",
      distributor_id: filters.distributor_id || "",
      status: (filters.status as LocalFilters["status"]) || "all",
    });
  }, [filters]);

  return (
      
  );


};

// === EXPORT DEFAULT ===
export default ProductFilter;
