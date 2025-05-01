"use client";

import { RecommendedProducts } from "@/components/cart/RecommendedProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";
import { withAuth } from "@/lib/auth/with-auth";
import { useCartAnimation } from "@/lib/cart/cart-animation-context";
import { addToCart } from "@/lib/features/cart-slice";
import type { AppDispatch } from "@/lib/features/store";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "@/lib/features/wishlist-slice";
import { showToast } from "@/lib/provider/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function WishlistPage() {
  const wishlistItems = useSelector(selectWishlistItems);
  const { startAnimation } = useCartAnimation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const productRef = useRef<HTMLDivElement>(null);

  const [recommendedProducts, setRecommendedProducts] = useState(
    products
      .filter((p) => !wishlistItems.some((item) => item.id === p.id))
      .slice(0, 8)
  );

  const handleRemoveFromWishlist = (id: string, name: string) => {
    dispatch(removeFromWishlist(id));
    showToast.info(`Đã xóa ${name} khỏi danh sách yêu thích!`);
  };

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

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
      })
    );
    showToast.success(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

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

        {recommendedProducts.length > 0 && (
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
          <Card
            key={item.id}
            className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Link href={`/products/${item.id}`}>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white rounded-full hover:bg-gray-100 hover:text-red-500"
                onClick={() => handleRemoveFromWishlist(item.id, item.name)}
              >
                <X className="h-5 w-5" />
              </Button>
              {item.discount && item.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{item.discount}%
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">{item.category}</div>
              <Link href={`/products/${item.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg line-clamp-2 h-12">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center mt-2">
                <Link
                  href={`/seller/${item.sellerId}`}
                  className="text-sm text-primary hover:underline"
                >
                  {item.sellerName}
                </Link>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">
                  {formatCurrency(item.price)}
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Thêm vào giỏ
                </Button>
              </div>
            </CardContent>
          </Card>
          //     <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

// Protect page with HOC
export default withAuth(WishlistPage);
