"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface AddToCartAnimationProps {
  productImage: string;
  productName: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onAnimationComplete: () => void;
}

export default function AddToCartAnimation({
  productImage,
  productName,
  sourcePosition,
  targetPosition,
  onAnimationComplete,
}: AddToCartAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationRef.current) return;

    // Đặt vị trí ban đầu
    animationRef.current.style.left = `${sourcePosition.x}px`;
    animationRef.current.style.top = `${sourcePosition.y}px`;

    // Kích hoạt animation
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.style.transform = "scale(0.5)";
        animationRef.current.style.left = `${targetPosition.x}px`;
        animationRef.current.style.top = `${targetPosition.y}px`;
        animationRef.current.style.opacity = "0.2";
      }
    }, 50);

    // Kết thúc animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [sourcePosition, targetPosition, onAnimationComplete]);

  // Sử dụng createPortal để render animation ở cấp cao nhất của DOM
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
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>
        </div>,
        document.body
      )
    : null;
}
