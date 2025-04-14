"use client";

import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/auth/with-auth";
import type { CartItem } from "@/lib/features/cart-slice";
import { removeFromCart } from "@/lib/features/cart-slice";
import type { AppDispatch, RootState } from "@/lib/features/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "@/components/checkout/Breadcrumb";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import ShippingInfo from "@/components/checkout/ShippingInfo";
import ShippingMethod from "@/components/checkout/ShippingMethod";
import Link from "next/link";
import OrderSummary from "@/components/checkout/OrderSummaryCheckout";

function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

  // Lấy danh sách sản phẩm được chọn từ localStorage
  useEffect(() => {
    const selectedIds = JSON.parse(
      localStorage.getItem("selectedCartItems") || "[]"
    ) as string[];
    const filteredItems = items.filter((item) => selectedIds.includes(item.id));
    setSelectedItems(filteredItems);
  }, [items, router]);

  // Tính toán tổng tiền
  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Tính phí vận chuyển và tổng thanh toán
  const shippingFee = totalAmount > 300000 ? 0 : 30000;
  const finalTotal = totalAmount + shippingFee;

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Lưu danh sách sản phẩm đã xóa để xử lý sau khi chuyển hướng
      const itemsToRemove = [...selectedItems];

      // Chuyển hướng đến trang xác nhận đơn hàng trước
      router.push("/checkout/success");

      // Xóa danh sách sản phẩm đã chọn khỏi localStorage
      // Đặt trong setTimeout để đảm bảo chuyển hướng đã hoàn tất
      setTimeout(() => {
        localStorage.removeItem("selectedCartItems");

        // Xóa các sản phẩm đã chọn khỏi giỏ hàng
        itemsToRemove.forEach((item) => {
          dispatch(removeFromCart(item.id));
        });
      }, 500);
    } catch (error) {
      console.error("Error during checkout:", error);
      setIsSubmitting(false);
    }
  };

  // Nếu không có sản phẩm nào được chọn, chuyển hướng về trang giỏ hàng
  if (selectedItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="mb-4">Bạn chưa chọn sản phẩm nào để thanh toán.</p>
        <Button asChild>
          <Link href="/cart">Quay lại giỏ hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumb />
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ShippingInfo />
          <ShippingMethod shippingFee={shippingFee} />
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary
            selectedItems={selectedItems}
            totalAmount={totalAmount}
            shippingFee={shippingFee}
            finalTotal={finalTotal}
            isSubmitting={isSubmitting}
            handlePlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(CheckoutPage);
