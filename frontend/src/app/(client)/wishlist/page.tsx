"use client";

import { RecommendedProducts } from "@/components/cart/RecommendedProducts";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { withAuth } from "@/lib/auth/with-auth";
import { useCartAnimation } from "@/lib/cart/cart-animation-context";
import type { AppDispatch } from "@/lib/features/store";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "@/lib/features/wishlist-slice";
import { showToast } from "@/lib/toast-provider";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { Product } from "@/lib_dashboard/types/product";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function WishlistPage() {
  const wishlistItems = useSelector(selectWishlistItems);
  const { startAnimation } = useCartAnimation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);

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

  const handleClearWishlist = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?"
      )
    ) {
      dispatch(clearWishlist());
      showToast.info("Đã xóa tất cả sản phẩm khỏi danh sách yêu thích!");
    }
  };

  console.log("Wishlist Items:", wishlistItems);
  // If wishlist is empty
  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-40 h-40 mb-6">
            <Heart className="w-full h-full text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Danh sách yêu thích của bạn đang trống
          </h1>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá các
            sản phẩm và thêm vào danh sách yêu thích của bạn.
          </p>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Khám phá sản phẩm
            </Link>
          </Button>
        </div>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ))
          : recommendedProducts.length > 0 && (
              <RecommendedProducts products={recommendedProducts} />
            )}
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Danh sách yêu thích</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Danh sách yêu thích</h1>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleClearWishlist}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <ProductCard key={item.product.product_id} product={item.product} />
        ))}
      </div>
    </div>
  );
}

// Protect page with HOC
export default withAuth(WishlistPage);
