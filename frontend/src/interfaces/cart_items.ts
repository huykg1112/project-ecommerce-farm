import { Product } from "./products";

export interface CartItem {
  id: string;
  quantity: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product[];
}
export interface AddToCartAnimationProps {
  productImage: string;
  productName: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onAnimationComplete: () => void;
}

export interface CartAnimationContextType {
  startAnimation: (
    productImage: string,
    productName: string,
    sourcePosition: { x: number; y: number }
  ) => void;
  isAnimating: boolean;
}
