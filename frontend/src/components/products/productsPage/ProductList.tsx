import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ProductListProps } from "@/interfaces";
import Image from "next/image";

export default function ProductList({
  sortedProducts,
  clearAllFilters,
}: ProductListProps) {
  return sortedProducts.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <Image
        src="/images/empty-results.svg"
        alt="Không tìm thấy sản phẩm"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
      <p className="text-gray-500 mb-4">
        Không có sản phẩm nào phù hợp với bộ lọc của bạn.
      </p>
      <Button onClick={clearAllFilters}>Xóa tất cả bộ lọc</Button>
    </div>
  );
}
