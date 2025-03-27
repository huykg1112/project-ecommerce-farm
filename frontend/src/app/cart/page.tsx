"use client";

import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";
import { withAuth } from "@/lib/auth/with-auth";
import type { AppDispatch, RootState } from "@/lib/cart/store";
import {
  CartItem,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/features/cart-slice";
import { showToast } from "@/lib/toast-provider";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react";
import Image from "next/image";
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

  // State cho việc chọn sản phẩm
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedSellers, setExpandedSellers] = useState<string[]>([]);

  // Lấy sản phẩm đề xuất
  useEffect(() => {
    // Lấy ngẫu nhiên 8 sản phẩm từ danh sách sản phẩm
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setRecommendedProducts(shuffled.slice(0, 8));
  }, []);

  // Nhóm sản phẩm theo đại lý
  const itemsBySeller = items.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerName: item.sellerName,
        items: [],
      };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: CartItem[] }>);

  // Tính toán tổng tiền dựa trên các sản phẩm được chọn
  const calculateSelectedTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const selectedTotal = calculateSelectedTotal();

  // Tính phí vận chuyển và tổng thanh toán dựa trên sản phẩm được chọn
  const shippingFee =
    selectedTotal > 300000 ? 0 : selectedTotal > 0 ? 30000 : 0;
  const finalTotal = selectedTotal + shippingFee - discount;

  // Số lượng sản phẩm được chọn
  const selectedItemsCount = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((count, item) => count + item.quantity, 0);

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

  // Xử lý chọn/bỏ chọn một sản phẩm
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Xử lý chọn/bỏ chọn tất cả sản phẩm của một đại lý
  const handleSelectSellerItems = (sellerId: string, isSelected: boolean) => {
    const sellerItemIds = itemsBySeller[sellerId].items.map((item) => item.id);

    if (isSelected) {
      // Thêm tất cả sản phẩm của đại lý vào danh sách đã chọn
      setSelectedItems((prev) => {
        const newSelected = [...prev];
        sellerItemIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    } else {
      // Loại bỏ tất cả sản phẩm của đại lý khỏi danh sách đã chọn
      setSelectedItems((prev) =>
        prev.filter((id) => !sellerItemIds.includes(id))
      );
    }
  };

  // Kiểm tra xem tất cả sản phẩm của một đại lý có được chọn không
  const isSellerSelected = (sellerId: string) => {
    const sellerItemIds = itemsBySeller[sellerId].items.map((item) => item.id);
    return sellerItemIds.every((id) => selectedItems.includes(id));
  };

  // Kiểm tra xem có ít nhất một sản phẩm của đại lý được chọn không
  const isSellerPartiallySelected = (sellerId: string) => {
    const sellerItemIds = itemsBySeller[sellerId].items.map((item) => item.id);
    return (
      sellerItemIds.some((id) => selectedItems.includes(id)) &&
      !sellerItemIds.every((id) => selectedItems.includes(id))
    );
  };

  // Xử lý mở rộng/thu gọn danh sách sản phẩm của đại lý
  const toggleSellerExpanded = (sellerId: string) => {
    setExpandedSellers((prev) =>
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  // Chọn tất cả sản phẩm
  const selectAllItems = () => {
    setSelectedItems(items.map((item) => item.id));
  };

  // Bỏ chọn tất cả sản phẩm
  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Xử lý tiến hành thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Lưu danh sách sản phẩm được chọn vào localStorage để sử dụng ở trang thanh toán
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
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
                <ProductCard product={product} />
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
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedItems.length === items.length && items.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        selectAllItems();
                      } else {
                        deselectAllItems();
                      }
                    }}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-lg font-semibold cursor-pointer"
                  >
                    Chọn tất cả ({totalItems} sản phẩm)
                  </label>
                </div>
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

              {/* Danh sách sản phẩm theo đại lý */}
              <div className="space-y-6">
                {Object.entries(itemsBySeller).map(
                  ([sellerId, { sellerName, items: sellerItems }]) => (
                    <div
                      key={sellerId}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Header của đại lý */}
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`seller-${sellerId}`}
                            checked={isSellerSelected(sellerId)}
                            indeterminate={isSellerPartiallySelected(sellerId)}
                            onCheckedChange={(checked) =>
                              handleSelectSellerItems(sellerId, !!checked)
                            }
                          />
                          <label
                            htmlFor={`seller-${sellerId}`}
                            className="font-medium flex items-center cursor-pointer"
                          >
                            <Store className="h-4 w-4 mr-2 text-primary" />
                            {sellerName}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8"
                          onClick={() => toggleSellerExpanded(sellerId)}
                        >
                          {expandedSellers.includes(sellerId) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Danh sách sản phẩm của đại lý */}
                      {expandedSellers.includes(sellerId) && (
                        <div className="divide-y">
                          {sellerItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-4 flex flex-col sm:flex-row gap-4"
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  id={`item-${item.id}`}
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() =>
                                    handleSelectItem(item.id)
                                  }
                                  className="mt-1"
                                />
                                <div className="relative w-20 h-20 flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>
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
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1
                                        )
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
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
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
                      )}
                    </div>
                  )
                )}
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
                  <span className="text-gray-600">Sản phẩm đã chọn</span>
                  <span>{selectedItemsCount} sản phẩm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatCurrency(selectedTotal)}</span>
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
                disabled={selectedItems.length === 0}
              >
                Tiến hành thanh toán
                <ArrowRight className="h-4 w-4" />
              </Button>

              {selectedItems.length === 0 && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Vui lòng chọn ít nhất một sản phẩm để thanh toán
                </p>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p>* Miễn phí vận chuyển cho đơn hàng từ 300.000đ</p>
                <p>* Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
          </div>
        )} */}
      {/* Sản phẩm đề xuất */}
      {recommendedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Có thể bạn sẽ thích</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {recommendedProducts.map((product) => (
              <div className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 max-w-[360px] ">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(CartPage);
// export default CartPage;
