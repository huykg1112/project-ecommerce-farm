import ProductCard from "@/components/products/product-card";
import { RelatedProductsProps } from "@/interfaces";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { Product } from "@/lib_dashboard/types/product";
import { useEffect, useState } from "react";

export default function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!category) return;

      setLoading(true);
      try {
        // In a real implementation, you would have an API endpoint to get products by category
        // For now, we'll use the existing method and filter client-side
        const allProducts = await productServiceManagement.getProductsForUser();

        const filtered = allProducts
          .filter(
            (p: Product) =>
              p.categories.some((cat) => cat.name === category) &&
              p.product_id !== currentProductId
          )
          .slice(0, 4);

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <p className="text-gray-500">Không có sản phẩm liên quan nào.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}
