import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
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
            {category.productCount} sản phẩm
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
