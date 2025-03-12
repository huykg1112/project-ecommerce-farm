import CategoryCard from "@/components/products/category-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategoriesSectionProps {
  categories: any[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
            Danh Mục Sản Phẩm
          </h2>
          <Link href="/categories">
            <Button variant="link" className="text-primary">
              Xem tất cả danh mục
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
//Component cho phần danh mục sản phẩm.
