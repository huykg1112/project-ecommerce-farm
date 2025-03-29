"use client";

import { CartHeader } from "@/components/cart/CartHeader";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { RecommendedProducts } from "@/components/cart/RecommendedProducts";
import { SellerSection } from "@/components/cart/SellerSection";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { withAuth } from "@/lib/auth/with-auth";
import type { AppDispatch, RootState } from "@/lib/cart/store";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/features/cart-slice";
import { showToast } from "@/lib/toast-provider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CartPage() {
  const { items, totalItems, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<
    typeof products
  >([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedSellers, setExpandedSellers] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setRecommendedProducts(shuffled.slice(0, 8));
  }, []);

  const itemsBySeller = items.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = { sellerName: item.sellerName, items: [] };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: any[] }>);

  const calculateSelectedTotal = () =>
    items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);

  const selectedTotal = calculateSelectedTotal();
  const shippingFee =
    selectedTotal > 300000 ? 0 : selectedTotal > 0 ? 30000 : 0;
  const finalTotal = selectedTotal + shippingFee - discount;
  const selectedItemsCount = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((count, item) => count + item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    const item = items.find((item) => item.id === id);
    if (item)
      showToast.info(`Đã cập nhật số lượng ${item.name} thành ${newQuantity}`);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    dispatch(removeFromCart(id));
    if (item) showToast.info(`Đã xóa ${item.name} khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      dispatch(clearCart());
      showToast.info("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setTimeout(() => {
      if (couponCode.toUpperCase() === "WELCOME10") {
        const discountAmount = Math.round(totalAmount * 0.1);
        setDiscount(discountAmount);
        showToast.success(
          `Đã áp dụng mã giảm giá WELCOME10: -${discountAmount}`
        );
      } else {
        showToast.error("Mã giảm giá không hợp lệ");
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectSellerItems = (sellerId: string, isSelected: boolean) => {
    const sellerItemIds = itemsBySeller[sellerId].items.map((item) => item.id);
    if (isSelected) {
      setSelectedItems((prev) => {
        const newSelected = [...prev];
        sellerItemIds.forEach((id) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    } else {
      setSelectedItems((prev) =>
        prev.filter((id) => !sellerItemIds.includes(id))
      );
    }
  };

  const isSellerSelected = (sellerId: string) =>
    itemsBySeller[sellerId].items.every((item) =>
      selectedItems.includes(item.id)
    );

  const isSellerPartiallySelected = (sellerId: string) =>
    itemsBySeller[sellerId].items.some((item) =>
      selectedItems.includes(item.id)
    ) &&
    !itemsBySeller[sellerId].items.every((item) =>
      selectedItems.includes(item.id)
    );

  const toggleSellerExpanded = (sellerId: string) => {
    setExpandedSellers((prev) =>
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const selectAllItems = () => setSelectedItems(items.map((item) => item.id));
  const deselectAllItems = () => setSelectedItems([]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <>
        <EmptyCart />
        {recommendedProducts.length > 0 && (
          <RecommendedProducts products={recommendedProducts} />
        )}
      </>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Giỏ hàng</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <CartHeader
              totalItems={totalItems}
              selectedItemsLength={selectedItems.length}
              itemsLength={items.length}
              onSelectAll={(checked) =>
                checked ? selectAllItems() : deselectAllItems()
              }
              onClearCart={handleClearCart}
            />
            <div className="space-y-6 px-6 pb-6">
              {Object.entries(itemsBySeller).map(
                ([sellerId, { sellerName, items: sellerItems }]) => (
                  <SellerSection
                    key={sellerId}
                    sellerId={sellerId}
                    sellerName={sellerName}
                    items={sellerItems}
                    selectedItems={selectedItems}
                    expandedSellers={expandedSellers}
                    onSelectSellerItems={handleSelectSellerItems}
                    onToggleSellerExpanded={toggleSellerExpanded}
                    onSelectItem={handleSelectItem}
                    onQuantityChange={handleQuantityChange}
                    onRemoveItem={handleRemoveItem}
                    isSellerSelected={isSellerSelected}
                    isSellerPartiallySelected={isSellerPartiallySelected}
                  />
                )
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                <ChevronLeft className="h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>
        <OrderSummary
          selectedItemsCount={selectedItemsCount}
          selectedTotal={selectedTotal}
          shippingFee={shippingFee}
          discount={discount}
          finalTotal={finalTotal}
          couponCode={couponCode}
          isApplyingCoupon={isApplyingCoupon}
          onCouponCodeChange={setCouponCode}
          onApplyCoupon={handleApplyCoupon}
          onCheckout={handleCheckout}
        />
      </div>
      {recommendedProducts.length > 0 && (
        <RecommendedProducts products={recommendedProducts} />
      )}
    </div>
  );
}

export default withAuth(CartPage);
