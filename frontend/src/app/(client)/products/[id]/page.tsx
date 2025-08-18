"use client";

import ProductActions from "@/components/product_detail/ProductActions";
import ProductFeatures from "@/components/product_detail/ProductFeatures";
import ProductImages from "@/components/product_detail/ProductImages";
import ProductInfo from "@/components/product_detail/ProductInfo";
import ProductTabs from "@/components/product_detail/ProductTabs";
import RelatedProducts from "@/components/products/related-products";
import { useAuthAction } from "@/lib/auth/use-auth-action";
import { useCartAnimation } from "@/lib/cart/cart-animation-context";
import { addToCart } from "@/lib/features/cart-slice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "@/lib/features/wishlist-slice";
import { showToast } from "@/lib/toast-provider";
import { getCookie } from "@/lib/utils";
import { useWishlistAnimation } from "@/lib/wishlist/wishlist-animation-context";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { Product } from "@/lib_dashboard/types/product";
import { Promotion } from "@/lib_dashboard/types/promotion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const getMaxDiscountForBatch = (
  batch: BatchProduct
): Promotion | null => {
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

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const dispatch = useDispatch();
  const { startAnimation: startWishlistAnimation } = useWishlistAnimation();
  const { requireAuth } = useAuthAction();
  const productRef = useRef<HTMLDivElement>(null);
  const { startAnimation } = useCartAnimation();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [selectedBatch, setSelectedBatch] = useState<BatchProduct | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check if product is in wishlist
  const isInWishlist = useSelector(
    selectIsInWishlist(product?.product_id || "")
  );

  // Fetch product data from API
  useEffect(() => {
    setLoading(true);
    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
    const fetchProduct = async () => {
      try {
        const productId = Array.isArray(id) ? id[0] : id;
        const productData =
          await productServiceManagement.getProductByIdForUser(productId);
        console.log("Fetched Product:", productData);
        setProduct(productData);

        // Set default batch if available
        if (
          productData &&
          productData.batches &&
          productData.batches.length > 0
        ) {
          setSelectedBatch(productData.batches[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  console.log("Product:", product);

  // Memoized product images (max 5 images)
  const productImages = useMemo(() => {
    if (!product?.images) return ["/placeholder.svg"];
    return product.images.slice(0, 5).map((img) => img.image_url);
  }, [product?.images]);

  // tìm và thống kê tất cả review vào có review.rating thì mới tính
  const reviewStats = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    // Chỉ lấy những review có rating (không phải response của distributor)
    const reviewsWithRating = product.reviews.filter(
      (review) =>
        review.rating !== null &&
        review.rating !== undefined &&
        !review.parent_review_id
    );

    if (reviewsWithRating.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviewsWithRating.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );

    return {
      averageRating: totalRating / reviewsWithRating.length,
      totalReviews: reviewsWithRating.length,
    };
  }, [product?.reviews]);

  // Handle quantity changes with useCallback
  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  // Memoized different product types from batches
  const differentProductTypes = useMemo(() => {
    if (!product?.batches || product.batches.length === 0) return [];

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
  }, [product?.batches, selectedBatch]);

  // Memoized promotion and price calculations
  const maxPromotion = useMemo(
    () => (selectedBatch ? getMaxDiscountForBatch(selectedBatch) : null),
    [selectedBatch]
  );

  const discountedPrice = useMemo(() => {
    if (selectedBatch) {
      return valueWithDiscount(selectedBatch, maxPromotion);
    }
    // Fallback to product base price if no batch
    return product?.unit_product_price || 0;
  }, [selectedBatch, maxPromotion, product?.unit_product_price]);

  // Handle add to cart with useCallback
  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (!product) return;

      requireAuth(() => {
        dispatch(
          addToCart({
            id: product.product_id + "/" + selectedBatch?.batch_id || "",
            productId: product.product_id,
            name: product.product_name,
            price: discountedPrice,
            valueDiscount: maxPromotion?.discount_value || 0,
            quantity: 1,
            image: product.images[0]?.image_url || "",
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
            product.images[0]?.image_url || "",
            product.product_name,
            sourcePosition
          );
        }

        showToast.success(`Đã thêm ${product.product_name} vào giỏ hàng!`);
      });
    },
    [
      product,
      discountedPrice,
      maxPromotion,
      selectedBatch,
      dispatch,
      requireAuth,
      startAnimation,
    ]
  );

  // Handle wishlist toggle with useCallback
  const toggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (!product) return;

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
              product.images[0]?.image_url || "",
              product.product_name,
              sourcePosition
            );
          }

          showToast.success(
            `Đã thêm ${product.product_name} vào danh sách yêu thích!`
          );
        }
      });
    },
    [
      product,
      isInWishlist,
      discountedPrice,
      maxPromotion,
      dispatch,
      requireAuth,
      startWishlistAnimation,
    ]
  );

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Không tìm thấy sản phẩm</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(
            product.categories[0]?.name || ""
          )}`}
          className="hover:text-primary"
        >
          {product.categories[0]?.name || "Sản phẩm"}
        </Link>
        <span className="mx-2">/</span>
        <span className="cursor-pointer">{product.product_name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div ref={productRef}>
          <ProductImages
            productImages={productImages}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            productName={product.product_name}
            discount={maxPromotion?.discount_value}
          />
        </div>
        <div>
          <ProductInfo
            name={product.product_name}
            rating={reviewStats.averageRating}
            ratingCount={reviewStats.totalReviews}
            price={discountedPrice}
            originalPrice={
              selectedBatch?.unit_product_price || product.unit_product_price
            }
            discount={maxPromotion?.discount_value}
            seller={{
              id: product.distributor?.user_id || "",
              name: product.distributor?.invenstory?.name || "N/A",
            }}
            selectedBatch={selectedBatch}
            differentProductTypes={differentProductTypes}
            setSelectedBatch={setSelectedBatch}
            categories={product.categories}
            manufacturer={product.manufacturer}
            totalSaled={product.total_saled}
          />
          <ProductActions
            quantity={quantity}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            handleAddToCart={handleAddToCart}
            toggleWishlist={toggleWishlist}
            isWishlisted={isInWishlist}
          />
          <ProductFeatures />
        </div>
      </div>
      <ProductTabs product={product} reviewStats={reviewStats} />
      <RelatedProducts
        category={product.categories[0]?.name || ""}
        currentProductId={product.product_id}
      />
    </div>
  );
}
