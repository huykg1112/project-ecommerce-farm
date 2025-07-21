"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/utils";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { Product } from "@/lib_dashboard/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../products/product-card";
import { Skeleton } from "../ui/skeleton";

export default function FeaturedProductsSection() {
  const userId = getCookie("user_id");

  const [loading, setLoading] = useState(true);

  // Fetch featured products
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchRecommendedProducts = async () => {
      const response =
        await productServiceManagement.getRecommendationsForUser();
      setRecommendedProducts(response.slice(0, 8));
    };

    fetchRecommendedProducts();
    setLoading(false);
  }, []);

  // console.log("Featured Products:", products);
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
            {userId ? "Sản Phẩm Nổi Bật" : "Sản Phẩm Đề Xuất"}
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
            : recommendedProducts.length > 0 &&
              recommendedProducts.map((product) => (
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
