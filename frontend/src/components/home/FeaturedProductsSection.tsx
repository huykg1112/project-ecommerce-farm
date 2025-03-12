import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeaturedProductsSectionProps {
  products: any[];
}

export default function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
            Sản Phẩm Nổi Bật
          </h2>
          <Link href="/products">
            <Button variant="link" className="text-primary">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
//Component cho phần sản phẩm nổi bật.
