import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { FeaturedProductsSectionProps } from "@/interfaces";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function FeaturedProductsSection({
  products,
  loading,
}: FeaturedProductsSectionProps) {
  // console.log("Featured Products:", products);
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
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-40">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.product_id}
                  className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 max-w-[360px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
//Component cho phần sản phẩm nổi bật.
