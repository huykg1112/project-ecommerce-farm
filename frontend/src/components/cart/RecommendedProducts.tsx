import ProductCard from "@/components/products/product-card";

interface RecommendedProductsProps {
  products: typeof import("@/data/products").products;
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  return (
    <>
      {/* {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
          </div>
        )} */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 max-w-[360px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
