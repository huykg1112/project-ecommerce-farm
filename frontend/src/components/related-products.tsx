import ProductCard from "@/components/product-card";
import { products } from "@/data/products";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const relatedProducts = products
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
