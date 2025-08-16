"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthAction } from "@/lib/auth/use-auth-action";
import { useCartAnimation } from "@/lib/cart/cart-animation-context";
import { addToCart } from "@/lib/features/cart-slice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "@/lib/features/wishlist-slice";
import { showToast } from "@/lib/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { useWishlistAnimation } from "@/lib/wishlist/wishlist-animation-context";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { Product } from "@/lib_dashboard/types/product";
import { Promotion } from "@/lib_dashboard/types/promotion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ProductCardProps {
  product: Product;
}

const getMaxDiscountForBatch = (batch: BatchProduct): Promotion | null => {
  if (!batch.promotions || batch.promotions.length === 0) return null;
  let maxDiscount = 0;
  let maxPromotion: Promotion | null = null;
  batch.promotions.forEach((promo) => {
    if (
      promo.is_active &&
      !promo.is_deleted &&
      promo?.discount_value &&
      promo?.discount_value > maxDiscount
    ) {
      maxDiscount = promo.discount_value;
      maxPromotion = promo;
    }
  });
  return maxPromotion;
};

const valueWithDiscount = (
  batch: BatchProduct,
  maxPromotion: Promotion | null
): number => {
  if (
    maxPromotion &&
    maxPromotion.discount_value &&
    maxPromotion.discount_value > 0
  ) {
    return (
      batch.unit_product_price -
      (batch.unit_product_price * maxPromotion.discount_value) / 100
    );
  }
  return batch.unit_product_price;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isInWishlist = useSelector(selectIsInWishlist(product.product_id));
  const dispatch = useDispatch();
  const { requireAuth } = useAuthAction();
  const { startAnimation } = useCartAnimation();
  const { startAnimation: startWishlistAnimation } = useWishlistAnimation();
  const productRef = useRef<HTMLDivElement>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchProduct | null>(null);
  const [totalRating, setTotalRating] = useState(0);

  // chỉ tính trung bình rating của review nào có rating
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce((sum, review) => {
      return review.rating ? sum + review.rating : sum;
    }, 0);
    const count = product.reviews.filter((review) => review.rating).length;
    setTotalRating(count);
    return count > 0 ? totalRating / count : 0;
  }, [product.reviews]);

  const differentProductTypes = useMemo(() => {
    if (!product.batches || product.batches.length === 0) return [];

    const uniqueTypes = new Map<string, BatchProduct>();

    product.batches.forEach((batch) => {
      if (
        !batch.is_active ||
        batch.is_deleted ||
        !batch.product_types ||
        !batch.product_types.is_active ||
        batch.product_types.is_deleted ||
        batch.quantity <= 0 ||
        batch.expiry_date <= new Date()
      ) {
        return;
      }

      const existing = uniqueTypes.get(batch.product_types.product_type_id);

      if (
        !existing ||
        (batch.expiry_date && batch.expiry_date < existing.expiry_date)
      ) {
        uniqueTypes.set(batch.product_types.product_type_id, batch);
      }
    });

    const batches = Array.from(uniqueTypes.values());
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0]);
    }
    return batches;
  }, [product.batches, selectedBatch]);

  const maxPromotion = useMemo(
    () => (selectedBatch ? getMaxDiscountForBatch(selectedBatch) : null),
    [selectedBatch]
  );

  const discountedPrice = useMemo(
    () => (selectedBatch ? valueWithDiscount(selectedBatch, maxPromotion) : 0),
    [selectedBatch, maxPromotion]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!selectedBatch) return;
    // console.log("Adding to cart:", {
    //   id: product.product_id + "/" + selectedBatch.batch_id || "",
    //   name: product.product_name,
    //   price: discountedPrice,
    //   valueDiscount: maxPromotion?.discount_value || 0,
    //   quantity: 1,
    //   image: product.images[0].image_url,
    //   sellerId:
    //     product.distributor?.user_id ||
    //     (Math.floor(Math.random() * 999) + 1).toString(),
    //   sellerName: product.distributor?.full_name || "N/A",
    //   promotion: maxPromotion,
    // });

    requireAuth(() => {
      dispatch(
        addToCart({
          id: product.product_id + "/" + selectedBatch.batch_id || "",
          productId: product.product_id,
          name: product.product_name,
          price: discountedPrice,
          valueDiscount: maxPromotion?.discount_value || 0,
          quantity: 1,
          image: product.images[0].image_url,
          sellerId:
            product.distributor?.user_id ||
            (Math.floor(Math.random() * 999) + 1).toString(),
          sellerName: product.distributor?.invenstory?.name || "N/A",
          promotion: maxPromotion,
          batch: selectedBatch,
        })
      );

      if (productRef.current) {
        const rect = productRef.current.getBoundingClientRect();
        const sourcePosition = {
          x: rect.left + rect.width / 2 - 32,
          y: rect.top + rect.height / 2 - 32,
        };

        startAnimation(
          product.images[0].image_url,
          product.product_name,
          sourcePosition
        );
      }

      showToast.success(`Đã thêm ${product.product_name} vào giỏ hàng!`);
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();

    requireAuth(() => {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.product_id));
        showToast.info(
          `Đã xóa ${product.product_name} khỏi danh sách yêu thích!`
        );
      } else {
        dispatch(
          addToWishlist({
            product: product,
          })
        );

        if (productRef.current) {
          const rect = productRef.current.getBoundingClientRect();
          const sourcePosition = {
            x: rect.left + rect.width / 2 - 32,
            y: rect.top + rect.height / 2 - 32,
          };

          startWishlistAnimation(
            product.images[0].image_url,
            product.product_name,
            sourcePosition
          );
        }

        showToast.success(
          `Đã thêm ${product.product_name} vào danh sách yêu thích!`
        );
      }
    });
  };

  return (
    <Card
      className="overflow-hidden product-card border-none shadow-md hover:shadow-lg transition-shadow"
      ref={productRef}
    >
      <div className="relative">
        <Link href={`/products/${product.product_id}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={product?.images?.[0].image_url || "/placeholder.svg"}
              alt={product.product_name}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform hover:scale-110"
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white rounded-full hover:bg-gray-100"
          onClick={toggleWishlist}
        >
          <Heart
            className={`h-5 w-5 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        {maxPromotion &&
          maxPromotion.discount_value &&
          maxPromotion.discount_value > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{maxPromotion.discount_value}%
            </Badge>
          )}
        {/* {Math.floor(Math.random() * 999) % 2 === 0 && (
          <Badge className="absolute bottom-2 left-2 bg-primary">Nổi bật</Badge>
        )} */}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">
            {product.categories && product.categories.length > 0
              ? product.categories[0]?.name
              : "Không có danh mục"}
          </div>
          {product.manufacturer?.logo && (
            <Image
              src={product.manufacturer.logo}
              alt={`${product.manufacturer.name} logo`}
              width={40}
              height={40}
              className="object-contain"
            />
          )}
        </div>
        <Link
          href={`/products/${product.product_id}`}
          className="hover:underline"
        >
          <h3 className="font-semibold text-lg line-clamp-2 h-12">
            {product.product_name}
          </h3>
        </Link>
        {/* số lượng đã bán */}
        {product.total_saled && (
          <div className="text-sm text-gray-500 mt-1">
            Số lượng đã bán: {product.total_saled}
          </div>
        )}
        <div className="flex items-center mt-2 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({totalRating || 0} đánh giá)
          </span>
        </div>
        <div className="flex items-center mt-2">
          <Link
            href={`/seller/${product.distributor?.user_id}`}
            className="text-sm text-primary hover:underline"
          >
            {product.distributor?.invenstory?.name || "Nhà cung cấp"}
          </Link>
        </div>
        {differentProductTypes.length > 0 && (
          <Select
            value={selectedBatch?.batch_id}
            onValueChange={(value) => {
              const batch = differentProductTypes.find(
                (b) => b.batch_id === value
              );
              setSelectedBatch(batch || null);
            }}
          >
            <SelectTrigger className="mt-2 bg-gray-50 border-gray-200">
              <SelectValue
                placeholder="Chọn loại sản phẩm"
                className="text-sm"
              />
            </SelectTrigger>
            <SelectContent>
              {differentProductTypes.map((batch) => (
                <SelectItem key={batch.batch_id} value={batch.batch_id}>
                  {batch.product_types?.type_name || "Không có tên"} (Còn{" "}
                  {batch.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col justify-start items-start">
          <span className="font-bold text-lg">
            {formatCurrency(discountedPrice || product.unit_product_price)}
          </span>
          {maxPromotion &&
            maxPromotion.discount_value &&
            maxPromotion.discount_value > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {formatCurrency(selectedBatch?.unit_product_price || 0)}
              </span>
            )}
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary-dark"
          disabled={!selectedBatch}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only md:inline-block">Thêm</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
