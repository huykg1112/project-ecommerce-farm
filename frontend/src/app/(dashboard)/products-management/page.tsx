"use client";

import { ProductFormModal } from "@/components/(dashboard)/products/product-form-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { formatCurrency } from "@/lib/utils";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { productFiltersAtom } from "@/lib_dashboard/store/product-store-management";
import { Product } from "@/lib_dashboard/types/product";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

const formatCurrencyInput = (value: number | undefined) => {
  return value !== undefined ? formatCurrency(value) : "";
};

export default function ProductsPage() {
  //dùng store của jotai
  const [filteredProducts, setFilteredProducts] = useAtom(productFiltersAtom);
  const { categories } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [productFilters, setProductFilters] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProductsAdmin = await productServiceManagement.getProducts();
      setProducts(allProductsAdmin.data);
    };

    fetchProducts();
  }, []);

  // tính toán cho card stats
  const totalProducts = products?.length || 0;
  const activeProducts = useMemo(() => {
    if (!products) return 0;
    return products.filter((product) => product.is_active).length;
  }, [products]);
  const inactiveProducts = useMemo(() => {
    if (!products) return 0;
    return products.filter((product) => !product.is_active).length;
  }, [products]);
  const avgPrice = useMemo(() => {
    if (!products) return 0;
    return totalProducts > 0
      ? products.reduce((sum, p) => sum + p.unit_product_price, 0) /
          totalProducts
      : 0;
  }, [products, totalProducts]);

  // tính toán cho filter

  console.log("Products:", products);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted-foreground">
            Quản lý tất cả sản phẩm trên marketplace
          </p>
        </div>
        {/* <Button onClick={() => console.log("Open Add Modal")}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button> */}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Không hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrencyInput(avgPrice)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Tìm kiếm và lọc sản phẩm theo các tiêu chí khác nhau
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductFilters
            onFilterChange={(filters) => updateProductFilters(filters)}
            onResetFilters={resetProductFilters}
          />
        </CardContent>
      </Card> */}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết của từng sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <ProductTable products={myProducts} loading={myProductsLoading} /> */}
        </CardContent>
      </Card>

      {/* Pagination */}
      {/* <ProductPagination
        onPageChange={changePage}
        onLimitChange={changeLimit}
        onSortChange={sortProducts}
      /> */}

      {/* Modals */}
      <ProductFormModal />
    </div>
  );
}
