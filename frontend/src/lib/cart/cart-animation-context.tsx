"use client";

import React, { createContext, useContext, useState } from "react";

interface CartAnimationContextType {
  startAnimation: (
    productImage: string,
    productName: string,
    sourcePosition: { x: number; y: number }
  ) => void;
  isAnimating: boolean;
}

const CartAnimationContext = createContext<
  CartAnimationContextType | undefined
>(undefined);

export function CartAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProps, setAnimationProps] = useState<{
    productImage: string;
    productName: string;
    sourcePosition: { x: number; y: number };
    targetPosition: { x: number; y: number };
  } | null>(null);

  // Tìm vị trí của giỏ hàng trên header
  const findCartButtonPosition = () => {
    const cartButton = document.querySelector(".cart-button-header");
    if (!cartButton) {
      return { x: window.innerWidth - 80, y: 40 }; // Fallback position
    }

    const rect = cartButton.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - 25, // Căn giữa
      y: rect.top + rect.height / 2 - 25,
    };
  };

  const startAnimation = (
    productImage: string,
    productName: string,
    sourcePosition: { x: number; y: number }
  ) => {
    const targetPosition = findCartButtonPosition();

    setAnimationProps({
      productImage,
      productName,
      sourcePosition,
      targetPosition,
    });

    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setAnimationProps(null);
  };

  // Import động AddToCartAnimation để tránh lỗi SSR
  const [AddToCartAnimation, setAddToCartAnimation] =
    useState<React.ComponentType<any> | null>(null);

  // Chỉ import component khi ở client side
  React.useEffect(() => {
    import("@/components/cart/add-to-cart-animation").then((mod) => {
      setAddToCartAnimation(() => mod.default);
    });
  }, []);

  return (
    <CartAnimationContext.Provider value={{ startAnimation, isAnimating }}>
      {children}

      {isAnimating && animationProps && AddToCartAnimation && (
        <AddToCartAnimation
          {...animationProps}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </CartAnimationContext.Provider>
  );
}

export function useCartAnimation() {
  const context = useContext(CartAnimationContext);
  if (context === undefined) {
    throw new Error(
      "useCartAnimation must be used within a CartAnimationProvider"
    );
  }
  return context;
}
