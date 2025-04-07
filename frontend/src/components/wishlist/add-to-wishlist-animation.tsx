"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Heart } from "lucide-react";

interface AddToWishlistAnimationProps {
  productImage: string;
  productName: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onAnimationComplete: () => void;
}

export default function AddToWishlistAnimation({
  productImage,
  productName,
  sourcePosition,
  targetPosition,
  onAnimationComplete,
}: AddToWishlistAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationRef.current) return;

    // Set initial position
    animationRef.current.style.left = `${sourcePosition.x}px`;
    animationRef.current.style.top = `${sourcePosition.y}px`;

    // Trigger animation
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.style.transform = "scale(0.5)";
        animationRef.current.style.left = `${targetPosition.x}px`;
        animationRef.current.style.top = `${targetPosition.y}px`;
        animationRef.current.style.opacity = "0.2";
      }
    }, 50);

    // End animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [sourcePosition, targetPosition, onAnimationComplete]);

  // Use createPortal to render animation at the highest DOM level
  return isAnimating && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={animationRef}
          className="fixed z-50 w-16 h-16 rounded-full shadow-md bg-white pointer-events-none transition-all duration-700 ease-in-out"
          style={{
            left: sourcePosition.x,
            top: sourcePosition.y,
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
