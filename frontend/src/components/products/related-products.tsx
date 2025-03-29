import ProductCard from "@/components/products/product-card";
import { products } from "@/data/products";
import { RelatedProductsProps } from "@/interfaces";

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
// component này nhận vào 2 props là category và currentProductId, sau đó lọc ra các sản phẩm có category giống với category của sản phẩm hiện tại và id khác với id của sản phẩm hiện tại, cuối cùng hiển thị 4 sản phẩm liên quan đó ra
// component này sẽ được sử dụng trong trang chi tiết sản phẩm để hiển thị các sản phẩm liên quang
