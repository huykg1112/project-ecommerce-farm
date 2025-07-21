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
  selectedBatch?: any;
  differentProductTypes?: any[];
  setSelectedBatch?: (batch: any) => void;
  categories?: any[];
  manufacturer?: any;
  totalSaled?: number;
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
  product?: any;
  reviewStats?: { averageRating: number; totalReviews: number };
}
