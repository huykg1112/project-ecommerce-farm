"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withAuth } from "@/lib/auth/with-auth";
import { formatCurrency } from "@/lib/utils";
import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import { Order, OrderStatusLabels } from "@/lib_dashboard/types/order";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function OrderSuccessPage() {
  const searchParams = useSearchParams();

  // Handle both COD and VNPay parameters
  const orderId = searchParams.get("orderId"); // For COD payments
  const vnpTxnRef = searchParams.get("vnp_TxnRef"); // For VNPay payments
  const vnpResponseCode = searchParams.get("vnp_ResponseCode"); // VNPay response code
  const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus"); // VNPay transaction status
  const totalOrders = searchParams.get("totalOrders");

  // Determine the actual order ID to fetch
  const actualOrderId = orderId || vnpTxnRef;

  // Check if VNPay payment was successful
  const isVNPayPayment = !!vnpTxnRef;
  const isVNPaySuccess =
    vnpResponseCode === "00" && vnpTransactionStatus === "00";
  const paymentFailed = isVNPayPayment && !isVNPaySuccess;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchOrder = async () => {
      if (!actualOrderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderServiceManagement.getOrderById(
          actualOrderId
        );
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Không thể tải thông tin đơn hàng");
      }
    };

    fetchOrder();
    setLoading(false);
  }, [actualOrderId]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Không thể tải thông tin đơn hàng
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          {error || "Đã xảy ra lỗi khi tải thông tin đơn hàng"}
        </p>
        <Button asChild variant="outline">
          <Link href="/orders">Xem danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  // Handle VNPay payment failure
  if (paymentFailed && !loading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Thanh toán thất bại!
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Thanh toán VNPay của bạn không thành công. Đơn hàng vẫn được tạo và
            bạn có thể thanh toán lại sau.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-bold">{order.order_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã phản hồi VNPay</p>
                    <p className="font-bold text-red-600">{vnpResponseCode}</p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-800">
                      Trạng thái thanh toán: Thất bại
                    </span>
                  </div>
                  <p className="text-red-700 mt-2 text-sm">
                    Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh
                    toán khác.
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Trạng thái đơn hàng
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    {OrderStatusLabels[
                      order.status.status_name as keyof typeof OrderStatusLabels
                    ] || order.status.status_name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary-dark gap-2">
              <Link href={`/orders/${order.order_id}`}>
                <Package className="h-4 w-4 mr-2" />
                Xem chi tiết đơn hàng
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

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          {isVNPayPayment
            ? "Thanh toán VNPay thành công!"
            : "Đặt hàng thành công!"}
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          {isVNPayPayment
            ? "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và đang được xử lý."
            : "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý."}
          {totalOrders && parseInt(totalOrders) > 1 && (
            <span className="block mt-2 text-sm text-blue-600">
              Tổng cộng {totalOrders} đơn hàng đã được tạo từ các nhà phân phối
              khác nhau.
            </span>
          )}
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-bold">{order.order_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-bold">
                    {new Date(order.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {isVNPayPayment && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      Thanh toán VNPay thành công
                    </span>
                  </div>
                  <p className="text-green-700 mt-1 text-sm">
                    Mã giao dịch: {vnpTxnRef}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Trạng thái đơn hàng
                </p>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">
                    {OrderStatusLabels[
                      order.status.status_name as keyof typeof OrderStatusLabels
                    ] || order.status.status_name}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Thông tin người nhận</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{order.user.full_name}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{order.user.phone_number}</span>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{order.user.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Thông tin nhà phân phối</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <span>{order.distributor.full_name}</span>
                  </div>
                  {order.distributor.phone_number && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <span>{order.distributor.phone_number}</span>
                    </div>
                  )}
                  {order.distributor.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <span>{order.distributor.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {order.shipping_address && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-3">Địa chỉ giao hàng</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p>{order.shipping_address}</p>
                      {order.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          Ghi chú: {order.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{order.payment_method.method_name}</span>
                  {isVNPayPayment && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Đã thanh toán
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Chi tiết đơn hàng</h3>
                <div className="space-y-3">
                  {order.order_details.map((detail) => (
                    <div
                      key={detail.order_detail_id}
                      className="flex justify-between"
                    >
                      <div>
                        <span className="font-medium">
                          {detail.batch_product.product.product_name}
                        </span>
                        <span className="text-gray-500 ml-1">
                          x{detail.quantity}
                        </span>
                        {detail.batch_product.product_types && (
                          <div className="text-xs text-gray-400">
                            {detail.batch_product.product_types.type_name}
                          </div>
                        )}
                        {detail.notes && (
                          <div className="text-xs text-gray-500">
                            Ghi chú: {detail.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {formatCurrency(detail.unit_price)}/sp
                        </div>
                        <span className="font-medium">
                          {formatCurrency(detail.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Thông tin giao hàng
                </p>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.estimated_delivery_date
                      ? `Dự kiến giao hàng: ${new Date(
                          order.estimated_delivery_date
                        ).toLocaleDateString("vi-VN")}`
                      : "Dự kiến giao hàng trong 2-3 ngày làm việc"}
                  </p>
                  {isVNPayPayment && (
                    <p className="text-sm text-green-600">
                      Thanh toán đã được xác nhận. Đơn hàng sẽ được xử lý nhanh
                      hơn.
                    </p>
                  )}
                </div>
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
