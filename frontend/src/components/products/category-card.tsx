import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib_dashboard/types/category";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // console.log("CategoryCard", category);
  const countProducts = useMemo(() => {
    if (!category.products) return 0;
    if (category.products.length === 0) return 0;
    const activeProducts = category.products.filter(
      (product) => product.is_active && !product.is_deleted
    );
    return activeProducts.length;
  }, [category.products]);
  return (
    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
      <Card className="overflow-hidden border-none shadow-md rounded-lg category-card relative h-40">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300 category-card-bg"
        />
        <CardContent className="relative flex flex-col items-center justify-center h-full text-center p-4 z-10">
          <h3 className="font-semibold text-base md:text-lg transition-all duration-300 category-card-title">
            {category.name}
          </h3>
          <p className="font-medium text-sm transition-all duration-300 category-card-count">
            {countProducts} sản phẩm
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
