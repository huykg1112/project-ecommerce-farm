"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/features/cart-slice";
import { formatCurrency } from "@/lib/utils";
import { withAuth } from "@/lib/auth/with-auth";
import { products } from "@/data/products";
import type { RootState, AppDispatch } from "@/lib/cart/store";
import { showToast } from "@/lib/toast-provider";

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

  // Tính toán phí vận chuyển và tổng thanh toán
  const shippingFee = totalAmount > 300000 ? 0 : 30000;
  const finalTotal = totalAmount + shippingFee - discount;

  // Lấy sản phẩm đề xuất
  useEffect(() => {
    // Lấy ngẫu nhiên 4 sản phẩm từ danh sách sản phẩm
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setRecommendedProducts(shuffled.slice(0, 4));
  }, []);

  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));

    // Tìm sản phẩm để hiển thị thông báo
    const item = items.find((item) => item.id === id);
    if (item) {
      showToast.info(`Đã cập nhật số lượng ${item.name} thành ${newQuantity}`);
    }
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id: string) => {
    // Tìm sản phẩm để hiển thị thông báo
    const item = items.find((item) => item.id === id);

    dispatch(removeFromCart(id));

    if (item) {
      showToast.info(`Đã xóa ${item.name} khỏi giỏ hàng`);
    }
  };

  // Xử lý xóa tất cả sản phẩm
  const handleClearCart = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      dispatch(clearCart());
      showToast.info("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  // Xử lý áp dụng mã giảm giá
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);

    // Giả lập API call
    setTimeout(() => {
      // Giả sử mã WELCOME10 giảm 10% tổng giá trị đơn hàng
      if (couponCode.toUpperCase() === "WELCOME10") {
        const discountAmount = Math.round(totalAmount * 0.1);
        setDiscount(discountAmount);
        showToast.success(
          `Đã áp dụng mã giảm giá WELCOME10: -${formatCurrency(discountAmount)}`
        );
      } else {
        showToast.error("Mã giảm giá không hợp lệ");
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  // Xử lý tiến hành thanh toán
  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-40 h-40 mb-6">
            <Image src="/images/empty-cart.svg" alt="Giỏ hàng trống" fill />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng. Hãy tiếp
            tục mua sắm để tìm sản phẩm bạn yêu thích.
          </p>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>

        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-bold mt-2 text-primary">
                        {formatCurrency(product.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Giỏ hàng</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Sản phẩm ({totalItems})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa tất cả
                </Button>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            Đại lý: {item.sellerName}
                          </div>
                        </div>
                        <div className="font-bold mt-2 sm:mt-0">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>
                    {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              {/* Mã giảm giá */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    {isApplyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Thử mã "WELCOME10" để được giảm 10%
                </p>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary-dark gap-2"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="mt-4 text-xs text-gray-500">
                <p>* Miễn phí vận chuyển cho đơn hàng từ 300.000đ</p>
                <p>* Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm đề xuất */}
      {recommendedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    <p className="font-bold mt-2 text-primary">
                      {formatCurrency(product.price)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(CartPage);
