export interface ProductImagesProps {
  productImages: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
  productName: string;
  discount?: number;
}

export interface ProductInfoProps {
  name: string;
  rating: number;
  ratingCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  seller: { id: string; name: string };
}

export interface ProductActionsProps {
  quantity: number;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  handleAddToCart: (e: React.MouseEvent) => void;
  toggleWishlist: (e: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export interface ProductTabsProps {
  name: string;
  rating: number;
  ratingCount: number;
}
