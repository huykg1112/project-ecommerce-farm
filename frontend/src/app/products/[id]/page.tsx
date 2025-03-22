"use client";

import ProductActions from "@/components/product_detail/ProductActions";
import ProductFeatures from "@/components/product_detail/ProductFeatures";
import ProductImages from "@/components/product_detail/ProductImages";
import ProductInfo from "@/components/product_detail/ProductInfo";
import ProductTabs from "@/components/product_detail/ProductTabs";
import RelatedProducts from "@/components/products/related-products";
import { products } from "@/data/products";
import { useAuthAction } from "@/lib/auth/use-auth-action";
import { useCartAnimation } from "@/lib/cart/cart-animation-context";
import { addToCart } from "@/lib/features/cart-slice";
import { showToast } from "@/lib/toast-provider";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();
  const { requireAuth } = useAuthAction();
  const productRef = useRef<HTMLDivElement>(null);
  const { startAnimation } = useCartAnimation();

  const product = products.find((p) => p.id === id) || products[0];
  const productImages = product.images;

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0],
          sellerId: product.seller.id,
          sellerName: product.seller.name,
        })
      );
      if (productRef.current) {
        const rect = productRef.current.getBoundingClientRect();
        const sourcePosition = {
          x: rect.left + rect.width / 2 - 32,
          y: rect.top + rect.height / 2 - 32,
        };
        startAnimation(product.images[0], product.name, sourcePosition);
      }
      showToast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      setIsWishlisted(!isWishlisted);
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="cursor-pointer">{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div ref={productRef}>
          <ProductImages
            productImages={productImages}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            productName={product.name}
            discount={product.discount}
          />
        </div>
        <div>
          <ProductInfo
            name={product.name}
            rating={product.rating}
            ratingCount={product.ratingCount}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            seller={product.seller}
          />
          <ProductActions
            quantity={quantity}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            handleAddToCart={handleAddToCart}
            toggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
          />
          <ProductFeatures />
        </div>
      </div>
      <ProductTabs
        name={product.name}
        rating={product.rating}
        ratingCount={product.ratingCount}
      />
      <RelatedProducts
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}
