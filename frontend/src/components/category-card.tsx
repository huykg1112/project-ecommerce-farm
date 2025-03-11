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
      <Card className="overflow-hidden border-none shadow-md category-card">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 relative mb-3">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-medium text-sm md:text-base">{category.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {category.productCount} sản phẩm
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
