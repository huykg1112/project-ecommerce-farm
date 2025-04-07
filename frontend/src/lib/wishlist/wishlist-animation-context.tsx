"use client";

import React, { createContext, useContext, useState } from "react";

interface WishlistAnimationContextType {
  startAnimation: (
    productImage: string,
    productName: string,
    sourcePosition: { x: number; y: number }
  ) => void;
  isAnimating: boolean;
}

const WishlistAnimationContext = createContext<
  WishlistAnimationContextType | undefined
>(undefined);

export function WishlistAnimationProvider({
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

  // Find the position of the wishlist button in the header
  const findWishlistButtonPosition = () => {
    const wishlistButton = document.querySelector(
      '[data-wishlist-button="true"]'
    );
    if (!wishlistButton) {
      return { x: window.innerWidth - 120, y: 40 }; // Fallback position
    }

    const rect = wishlistButton.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - 8, // Center
      y: rect.top + rect.height / 2 - 8,
    };
  };

  const startAnimation = (
    productImage: string,
    productName: string,
    sourcePosition: { x: number; y: number }
  ) => {
    const targetPosition = findWishlistButtonPosition();

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

  // Dynamically import AddToWishlistAnimation to avoid SSR issues
  const [AddToWishlistAnimation, setAddToWishlistAnimation] =
    useState<React.ComponentType<any> | null>(null);

  // Only import component on client side
  React.useEffect(() => {
    import("@/components/wishlist/add-to-wishlist-animation").then((mod) => {
      setAddToWishlistAnimation(() => mod.default);
    });
  }, []);

  return (
    <WishlistAnimationContext.Provider value={{ startAnimation, isAnimating }}>
      {children}

      {isAnimating && animationProps && AddToWishlistAnimation && (
        <AddToWishlistAnimation
          {...animationProps}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </WishlistAnimationContext.Provider>
  );
}

export function useWishlistAnimation() {
  const context = useContext(WishlistAnimationContext);
  if (context === undefined) {
    throw new Error(
      "useWishlistAnimation must be used within a WishlistAnimationProvider"
    );
  }
  return context;
}
