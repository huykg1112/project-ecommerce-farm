"use client";

import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import type { Order } from "@/lib_dashboard/types/order";
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
  Truck,
  User,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
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

        if (typeof params.id !== "string") {
          router.push("/orders");
          return;
        }

        const orderData = await orderServiceManagement.getOrderById(params.id);
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
            Chi tiết đơn hàng #{order.order_code}
          </h1>
          <p className="text-gray-500">
            Đặt ngày {formatDate(order?.created_at.toString())}
          </p>
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
                <OrderStatusBadge status={order.status.status_name as any} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Trạng thái:</strong> {order.status.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Ngày cập nhật:</strong>{" "}
                  {formatDate(order.updated_at.toString())}
                </p>
                {order.notes && (
                  <p className="text-sm text-gray-600">
                    <strong>Ghi chú:</strong> {order.notes}
                  </p>
                )}
              </div>
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
                {order.order_details.map((detail) => (
                  <div
                    key={detail.order_detail_id}
                    className="flex gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={
                          detail.batch_product.product.images?.[0]?.image_url ||
                          "/placeholder.svg"
                        }
                        alt={detail.batch_product.product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium hover:text-primary">
                        {detail.batch_product.product.product_name}
                      </div>
                      <p className="text-sm text-gray-500">
                        Đại lý: {order.distributor?.invenstory?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Lô: {detail.batch_product.batch_number}
                      </p>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm">
                          {formatCurrency(Number(detail.unit_price))} x{" "}
                          {detail.quantity}
                        </p>
                        <p className="font-medium">
                          {formatCurrency(Number(detail.subtotal))}
                        </p>
                      </div>
                      {detail.notes && (
                        <p className="text-xs text-gray-400 mt-1">
                          Ghi chú: {detail.notes}
                        </p>
                      )}
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
                  <span className="text-gray-500">Tổng tiền sản phẩm</span>
                  <span>
                    {formatCurrency(
                      order.order_details.reduce(
                        (sum, detail) => sum + Number(detail.subtotal),
                        0
                      )
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(
                      order.total_amount ||
                        order.order_details.reduce(
                          (sum, detail) => sum + Number(detail.subtotal),
                          0
                        )
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Phương thức thanh toán</p>
                    <p className="text-gray-500">
                      {order.payment_method.method_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.payment_method.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Ngày đặt hàng</p>
                    <p className="text-gray-500">
                      {formatDate(order.created_at.toString())}
                    </p>
                  </div>
                </div>
                {order.estimated_delivery_date && (
                  <div className="flex items-start gap-2">
                    <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Ngày giao hàng dự kiến</p>
                      <p className="text-gray-500">
                        {formatDate(order.estimated_delivery_date.toString())}
                      </p>
                    </div>
                  </div>
                )}
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
                    <p className="font-medium">Người đặt hàng</p>
                    <p className="text-gray-500">
                      {order.user?.full_name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Nhà phân phối</p>
                    <p className="text-gray-500">
                      {order.distributor?.invenstory?.name || "N/A"}
                    </p>
                  </div>
                </div>
                {order.shipping_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Địa chỉ giao hàng</p>
                      <p className="text-gray-500">{order.shipping_address}</p>
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Ghi chú</p>
                      <p className="text-gray-500">{order.notes}</p>
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
