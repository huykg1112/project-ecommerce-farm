"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withAuth } from "@/lib/auth/with-auth";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle,
  CreditCard,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get("orderId") ||
    `ORD${Math.floor(100000 + Math.random() * 900000)}`;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = orders.find((o: any) => o.id === orderId);

    if (foundOrder) {
      setOrder(foundOrder);
    }

    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được
          xử lý.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-bold">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-bold">
                    {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Trạng thái đơn hàng
                </p>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">Đã xác nhận</span>
                </div>
              </div>

              {order && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Thông tin người nhận</h3>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{order.customer.fullName}</span>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <span>{order.customer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Địa chỉ giao hàng</h3>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p>{order.shipping.address}</p>
                        {order.shipping.address.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            Ghi chú: {order.shipping.address.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        {order.payment.method === "cod" &&
                          "Thanh toán khi nhận hàng (COD)"}
                        {order.payment.method === "bank" &&
                          "Chuyển khoản ngân hàng"}
                        {order.payment.method === "momo" && "Ví điện tử MoMo"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Thông tin đơn hàng</h3>
                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-1">
                              x{item.quantity}
                            </span>
                          </div>
                          <span>
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tạm tính</span>
                          <span>
                            {formatCurrency(
                              order.payment.total - order.shipping.fee
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Phí vận chuyển</span>
                          <span>
                            {order.shipping.fee > 0
                              ? formatCurrency(order.shipping.fee)
                              : "Miễn phí"}
                          </span>
                        </div>
                        <div className="flex justify-between mt-3 font-bold">
                          <span>Tổng cộng</span>
                          <span className="text-primary">
                            {formatCurrency(order.payment.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Thông tin giao hàng
                </p>
                <p className="font-medium">
                  Dự kiến giao hàng trong 2-3 ngày làm việc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-primary hover:bg-primary-dark gap-2">
            <Link href="/orders">
              <Package className="h-4 w-4 mr-2" />
              Xem đơn hàng của tôi
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(OrderSuccessPage);
