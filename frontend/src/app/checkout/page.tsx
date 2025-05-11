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
import { withAuth } from "@/lib/auth/with-auth";
import type { CartItem } from "@/lib/features/cart-slice";
import { removeFromCart } from "@/lib/features/cart-slice";
import type { AppDispatch, RootState } from "@/lib/features/store";
import { userService } from "@/lib/services/user-service";
import { formatCurrency } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
  });
  const [addressData, setAddressData] = useState<AddressData>({
    fullAddress: "",
    latitude: 0,
    longitude: 0,
  });

  // Nếu người dùng bằng API thì không cần nhập lại thông tin
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Lấy danh sách sản phẩm được chọn từ localStorage
  useEffect(() => {
    const selectedIds = JSON.parse(
      localStorage.getItem("selectedCartItems") || "[]"
    ) as string[];
    const filteredItems = items.filter((item) => selectedIds.includes(item.id));
    setSelectedItems(filteredItems);

    // Nếu không có sản phẩm nào được chọn, chuyển hướng về trang giỏ hàng
    if (filteredItems.length === 0 && items.length > 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Tính toán tổng tiền
  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Tính phí vận chuyển và tổng thanh toán
  const shippingFee = totalAmount > 300000 ? 0 : 30000;
  const finalTotal = totalAmount + shippingFee;

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
    setAddressData(address);
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    // Kiểm tra thông tin bắt buộc
    if (!formData.fullName || !formData.phone || !addressData.fullAddress) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    try {
      setIsSubmitting(true);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: selectedItems,
        customer: {
          ...formData,
        },
        shipping: {
          address: addressData,
          fee: shippingFee,
        },
        payment: {
          method: paymentMethod,
          total: finalTotal,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Lưu đơn hàng vào localStorage để demo
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const orderId = `ORD${Date.now()}`;
      const newOrder = {
        id: orderId,
        ...orderData,
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Lưu danh sách sản phẩm đã xóa để xử lý sau khi chuyển hướng
      const itemsToRemove = [...selectedItems];

      // Chuyển hướng đến trang xác nhận đơn hàng trước
      router.push(`/checkout/success?orderId=${orderId}`);

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
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
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
              <AddressMapPicker onAddressChange={handleAddressChange} />
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
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Chuyển khoản ngân hàng</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="momo" id="momo" />
                  <Label htmlFor="momo">Ví điện tử MoMo</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "bank" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                  <p className="font-medium mb-2">Thông tin chuyển khoản:</p>
                  <p>Ngân hàng: Vietcombank</p>
                  <p>Số tài khoản: 1234567890</p>
                  <p>Chủ tài khoản: CÔNG TY NÔNG SẢN VIỆT NAM</p>
                  <p>Nội dung: [Họ tên] thanh toán đơn hàng</p>
                </div>
              )}
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
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-1">
                          x{item.quantity}
                        </span>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
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
                </div>

                <Separator />

                {/* Tổng thanh toán */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>

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
