"use client";

import type React from "react";

import AddressMapPicker, {
  type AddressData,
} from "@/components/map/address-map-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/interfaces";
import { withAuth } from "@/lib/auth/with-auth";
import type { CartItem } from "@/lib/features/cart-slice";
import { removeFromCart } from "@/lib/features/cart-slice";
import type { AppDispatch, RootState } from "@/lib/features/store";
import { userService } from "@/lib/services/user-service";
import { showToast } from "@/lib/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import { PaymentMethod } from "@/lib_dashboard/types/order";
import {
  ChevronLeft,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
        const addressDefaul = data.addresses.find((addr) => addr.is_default);
        const address = addressDefaul?.address_detail;
        const lat =
          addressDefaul?.latitude && !isNaN(Number(addressDefaul.latitude))
            ? Number(addressDefaul.latitude)
            : 0;
        const lng =
          addressDefaul?.longitude && !isNaN(Number(addressDefaul.longitude))
            ? Number(addressDefaul.longitude)
            : 0;
        setFormData({
          fullName: data.full_name || "",
          phone: data.phone_number || "",
          email: data.email || "",
          address: address || "",
          lat: lat,
          lng: lng,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Load payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await orderServiceManagement.getPaymentMethods();
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setPaymentMethod(methods[0]);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Load checkout data from localStorage
  useEffect(() => {
    const savedCheckoutData = localStorage.getItem("checkoutData");
    if (savedCheckoutData) {
      const data = JSON.parse(savedCheckoutData);
      setCheckoutData(data);
      setSelectedItems(data.selectedItems);
    } else {
      // Fallback to old method
      const selectedIds = JSON.parse(
        localStorage.getItem("selectedCartItems") || "[]"
      ) as string[];
      const filteredItems = items.filter((item) =>
        selectedIds.includes(item.id)
      );
      setSelectedItems(filteredItems);

      if (filteredItems.length === 0 && items.length > 0) {
        router.push("/cart");
      }
    }
  }, [items, router]);

  // Calculate totals using checkout data or fallback to cart calculation
  const totalAmount = checkoutData
    ? checkoutData.selectedTotal
    : selectedItems.reduce((total, item) => {
        const originalPrice = item.price;
        const discountValue = item.promotion?.discount_value || 0;
        const finalPrice = originalPrice - discountValue;
        return total + finalPrice * item.quantity;
      }, 0);

  const shippingFee = checkoutData
    ? checkoutData.shippingFee
    : totalAmount > 300000
    ? 0
    : 30000;
  const voucherDiscount = checkoutData ? checkoutData.voucherDiscount : 0;
  const finalTotal = checkoutData
    ? checkoutData.finalTotal
    : totalAmount + shippingFee;

  // Xử lý thay đổi form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi địa chỉ từ bản đồ
  const handleAddressChange = (address: AddressData) => {
    setFormData((prev) => ({
      ...prev,
      address: address.fullAddress,
      lat: address.latitude,
      lng: address.longitude,
    }));
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    // Kiểm tra thông tin bắt buộc
    if (!formData.fullName || !formData.phone || !formData.address) {
      showToast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    if (!checkoutData) {
      showToast.error(
        "Không tìm thấy thông tin đơn hàng. Vui lòng quay lại giỏ hàng."
      );
      router.push("/cart");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create orders for each distributor
      const orderPromises = checkoutData.ordersByDistributor.map(
        async (distributorOrder: any) => {
          const orderData = {
            distributor_id: distributorOrder.distributor_id,
            payment_method_id: paymentMethod?.payment_method_id || "",
            voucher_id: checkoutData.selectedVoucher?.voucher_id,
            total_amount:
              distributorOrder.subtotal +
              checkoutData.shippingFee /
                checkoutData.ordersByDistributor.length, // Split shipping fee
            notes: `Đơn hàng từ ${distributorOrder.distributor_name}`,
            shipping_address: formData.address,
            estimated_delivery_date: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(), // 3 days from now
            order_details: distributorOrder.order_details,
          };

          return orderServiceManagement.createOrder(orderData);
        }
      );

      // Wait for all orders to be created
      const createdOrders = await Promise.all(orderPromises);

      // Handle successful order creation
      showToast.success(`Đã tạo thành công ${createdOrders.length} đơn hàng`);

      // Clean up localStorage
      localStorage.removeItem("selectedCartItems");
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("selectedVoucher");

      // Remove items from cart
      selectedItems.forEach((item) => {
        dispatch(removeFromCart(item.id));
      });

      if (paymentMethod?.method_name == "COD") {
        // Redirect to success page with first order ID
        const firstOrderId = createdOrders[0]?.data?.order_id;
        router.push(
          `/checkout/success?orderId=${firstOrderId}&totalOrders=${createdOrders.length}`
        );
      } else {
        // Round the amount to ensure no decimal places
        const roundedAmount = Math.round(finalTotal);

        const paymentUrl = await orderServiceManagement.createVNPayParams({
          amount: roundedAmount, // Amount in VND (already rounded)
          orderId: createdOrders[0]?.data?.order_id || "",
          orderInfo: `Đơn hàng từ ${createdOrders[0]?.data?.distributor?.full_name}`,
          bankCode: "NCB", // Default bank code
        });

        console.log("Payment URL:", paymentUrl);

        // Redirect to VNPay payment URL
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          showToast.error(
            "Không thể tạo liên kết thanh toán. Vui lòng thử lại."
          );
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setIsSubmitting(false);
      showToast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const handleChangePaymentMethod = useCallback(
    (value: string) => {
      const selectedMethod = paymentMethods.find(
        (method) => method.payment_method_id === value
      );
      setPaymentMethod(selectedMethod);
    },
    [paymentMethods]
  );

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
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-primary">
          Giỏ hàng
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Thanh toán</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin thanh toán */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin giao hàng */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Thông tin người nhận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="0912345678"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="example@example.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Địa chỉ giao hàng với bản đồ */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddressMapPicker
                onAddressChange={handleAddressChange}
                initialAddress={{
                  fullAddress: formData.address || "",
                  latitude: formData.lat || 0,
                  longitude: formData.lng || 0,
                }}
              />
            </CardContent>
          </Card>

          {/* Phương thức vận chuyển */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Phương thức vận chuyển
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">
                    Giao hàng tiêu chuẩn (2-3 ngày)
                  </Label>
                  <span className="ml-auto font-medium">
                    {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Nhận tại cửa hàng</Label>
                  <span className="ml-auto font-medium">
                    {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                  </span>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-500 mt-2">
                * Miễn phí vận chuyển cho đơn hàng từ 300.000đ
              </p>
            </CardContent>
          </Card>

          {/* Phương thức thanh toán */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod?.payment_method_id || ""}
                onValueChange={handleChangePaymentMethod}
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.payment_method_id}
                    className="flex items-center space-x-2 mb-3"
                  >
                    <RadioGroupItem
                      value={method.payment_method_id}
                      id={method.payment_method_id}
                    />
                    <Label htmlFor={method.payment_method_id}>
                      {method.method_name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Danh sách sản phẩm */}
                <div className="space-y-3">
                  {selectedItems.map((item) => {
                    const originalPrice = item.price;
                    const discountValue = item.promotion?.discount_value || 0;
                    const finalPrice = originalPrice - discountValue;

                    return (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-1">
                            x{item.quantity}
                          </span>
                          {item.batch?.product_types?.type_name && (
                            <div className="text-xs text-gray-400">
                              {item.batch.product_types.type_name}
                            </div>
                          )}
                          {discountValue > 0 && (
                            <div className="text-xs text-red-500">
                              Giảm {formatCurrency(discountValue)}/sp
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {discountValue > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatCurrency(originalPrice * item.quantity)}
                            </div>
                          )}
                          <span>
                            {formatCurrency(finalPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Tổng tiền */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>
                      {shippingFee > 0
                        ? formatCurrency(shippingFee)
                        : "Miễn phí"}
                    </span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá voucher</span>
                      <span>-{formatCurrency(voucherDiscount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Tổng thanh toán */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>

                {checkoutData &&
                  checkoutData.ordersByDistributor.length > 1 && (
                    <div className="text-xs text-gray-500 mt-2">
                      * Đơn hàng sẽ được tách thành{" "}
                      {checkoutData.ordersByDistributor.length} đơn theo từng
                      nhà phân phối
                    </div>
                  )}

                <Button
                  className="w-full bg-primary hover:bg-primary-dark"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/cart">
                <ChevronLeft className="h-4 w-4" />
                Quay lại giỏ hàng
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(CheckoutPage);
