"use client";

import { getOrderById, type Order } from "@/data/orders";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { withAuth } from "@/lib/auth/with-auth";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { ShippingTimeline } from "@/components/orders/shipping-timeline";
import dynamic from "next/dynamic";

const PrintInvoice = dynamic(
  () =>
    import("@/components/orders/print-invoice").then((mod) => mod.PrintInvoice),
  {
    ssr: false,
  }
);

function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (typeof params.id !== "string") {
          router.push("/orders");
          return;
        }

        const orderData = getOrderById(params.id);
        if (!orderData) {
          router.push("/orders");
          return;
        }

        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, router]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // If loading
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If order not found
  if (!order) {
    return (
      <div className="container py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <h2 className="text-xl font-semibold mb-4">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-500 mb-6">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Link>
          </Button>
        </div>
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
        <Link href="/orders" className="hover:text-primary">
          Lịch sử mua hàng
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Chi tiết đơn hàng</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Chi tiết đơn hàng #{order.orderNumber}
          </h1>
          <p className="text-gray-500">Đặt ngày {formatDate(order.date)}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <PrintInvoice order={order} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details and items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Trạng thái đơn hàng</span>
                <OrderStatusBadge status={order.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingUpdates && order.shippingUpdates.length > 0 ? (
                <ShippingTimeline updates={order.shippingUpdates} />
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có cập nhật vận chuyển
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Sản phẩm đã đặt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Đại lý: {item.sellerName}
                      </p>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                        <p className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary and shipping info */}
        <div className="space-y-6">
          {/* Order summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span>
                    {formatCurrency(order.totalAmount - order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Phương thức thanh toán</p>
                    <p className="text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Phương thức vận chuyển</p>
                    <p className="text-gray-500">{order.shippingMethod}</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-start gap-2">
                    <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Mã vận đơn</p>
                      <p className="text-gray-500">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Ngày đặt hàng</p>
                    <p className="text-gray-500">{formatDate(order.date)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Thông tin giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Người nhận</p>
                    <p className="text-gray-500">
                      {order.shippingAddress.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Số điện thoại</p>
                    <p className="text-gray-500">
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Địa chỉ giao hàng</p>
                    <p className="text-gray-500">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.ward},{" "}
                      {order.shippingAddress.district},{" "}
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
                {order.note && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Ghi chú</p>
                      <p className="text-gray-500">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OrderDetailPage);
