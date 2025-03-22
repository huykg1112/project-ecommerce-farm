import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { SeasonalProductsSectionProps } from "@/interfaces";
import Link from "next/link";

export default function SeasonalProductsSection({
  products,
}: SeasonalProductsSectionProps) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
            Sản Phẩm Theo Mùa
          </h2>
          <Link href="/seasonal">
            <Button variant="link" className="text-primary">
              Xem tất cả
            </Button>
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {products.map((product) => (
            <div className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 max-w-[360px] max-w-[360px] ">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
//Component cho phần sản phẩm theo mùa.
