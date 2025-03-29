import { CartItem as CartItemType } from "@/lib/features/cart-slice";

export interface CartHeaderProps {
  totalItems: number;
  selectedItemsLength: number;
  itemsLength: number;
  onSelectAll: (checked: boolean) => void;
  onClearCart: () => void;
}
export interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export interface OrderSummaryProps {
  selectedItemsCount: number;
  selectedTotal: number;
  shippingFee: number;
  discount: number;
  finalTotal: number;
  couponCode: string;
  isApplyingCoupon: boolean;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
}

export interface SellerSectionProps {
  sellerId: string;
  sellerName: string;
  items: CartItemType[];
  selectedItems: string[];
  expandedSellers: string[];
  onSelectSellerItems: (sellerId: string, isSelected: boolean) => void;
  onToggleSellerExpanded: (sellerId: string) => void;
  onSelectItem: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  isSellerSelected: (sellerId: string) => boolean;
  isSellerPartiallySelected: (sellerId: string) => boolean;
}
