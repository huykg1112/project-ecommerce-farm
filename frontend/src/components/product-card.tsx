"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addToCart } from "@/lib/features/cart-slice";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  ratingCount: number;
  seller: {
    id: string;
    name: string;
  };
  category: string;
  featured?: boolean;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        sellerId: product.seller.id,
        sellerName: product.seller.name,
      })
    );
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="overflow-hidden product-card border-none shadow-md">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform hover:scale-105"
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
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{product.discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute bottom-2 left-2 bg-primary">Nổi bật</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-2 h-12">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mt-2 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.ratingCount})
          </span>
        </div>
        <div className="flex items-center mt-2">
          <Link
            href={`/seller/${product.seller.id}`}
            className="text-sm text-primary hover:underline"
          >
            {product.seller.name}
          </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-lg">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm ml-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary-dark"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only md:inline-block">Thêm</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
