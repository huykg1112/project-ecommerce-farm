"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderStatusLabels } from "@/lib_dashboard/types/order";
import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

export function OrderDetailModal({
  order,
  open,
  onClose,
  loading,
}: OrderDetailModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
      CONFIRMED: { color: "bg-blue-100 text-blue-800", icon: "✅" },
      SHIPPING: { color: "bg-purple-100 text-purple-800", icon: "🚚" },
      DELIVERED: { color: "bg-green-100 text-green-800", icon: "📦" },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: "❌" },
      RETURNED: { color: "bg-orange-100 text-orange-800", icon: "↩️" },
      FAILED: { color: "bg-red-100 text-red-800", icon: "⚠️" },
      REFUNDED: { color: "bg-gray-100 text-gray-800", icon: "💰" },
      COMPLETED: { color: "bg-emerald-100 text-emerald-800", icon: "🎉" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge className={`${config.color} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {OrderStatusLabels[status as keyof typeof OrderStatusLabels] || status}
      </Badge>
    );
  }, []);

  const getPaymentMethodBadge = useCallback((method: string) => {
    const methodConfig = {
      COD: { color: "bg-orange-100 text-orange-800", icon: "💵" },
      VNPAY: { color: "bg-blue-100 text-blue-800", icon: "💳" },
    };

    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.COD;

    return (
      <Badge variant="outline" className={`${config.color} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {method}
      </Badge>
    );
  }, []);

  const getPrimaryImage = useCallback((images: any[]) => {
    const primaryImage = images?.find((img) => img.is_primary);
    return primaryImage?.image_url || images?.[0]?.image_url || "/placeholder-product.png";
  }, []);

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#44703d]">
              Chi tiết đơn hàng {order.order_code}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Order Status & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-[#74a65d]" />
                  <div>
                    <div className="text-sm text-gray-500">Trạng thái đơn hàng</div>
                    <div className="mt-1">
                      {getStatusBadge(order.status.status_name)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-[#74a65d]" />
                  <div>
                    <div className="text-sm text-gray-500">Phương thức thanh toán</div>
                    <div className="mt-1">
                      {getPaymentMethodBadge(order.payment_method.method_name)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#74a65d]" />
                  <div>
                    <div className="text-sm text-gray-500">Ngày tạo đơn</div>
                    <div className="mt-1 font-medium">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>

                {order.estimated_delivery_date && (
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-[#74a65d]" />
                    <div>
                      <div className="text-sm text-gray-500">Ngày giao hàng dự kiến</div>
                      <div className="mt-1 font-medium">
                        {formatDate(order.estimated_delivery_date)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Tổng giá trị đơn hàng</div>
                  <div className="text-2xl font-bold text-[#44703d]">
                    {formatCurrency(order.total_amount)}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Customer & Distributor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#44703d] flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.user.full_name}</div>
                  <div className="text-sm text-gray-600">{order.user.email}</div>
                  {order.user.phone_number && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.user.phone_number}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#44703d] flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Nhà phân phối
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.distributor.full_name}</div>
                  <div className="text-sm text-gray-600">{order.distributor.email}</div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#44703d] flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Địa chỉ giao hàng
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm">{order.shipping_address}</div>
                  </div>
                </div>
              </>
            )}

            {/* Order Notes */}
            {order.notes && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#44703d]">
                    Ghi chú đơn hàng
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm">{order.notes}</div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#44703d]">
                Chi tiết sản phẩm ({order.order_details.length} sản phẩm)
              </h3>
              <div className="space-y-4">
                {order.order_details.map((detail) => (
                  <div
                    key={detail.order_detail_id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={getPrimaryImage(detail.batch_product.product.images)}
                          alt={detail.batch_product.product.product_name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-medium text-[#44703d]">
                              {detail.batch_product.product.product_name}
                            </h4>
                            <div className="text-sm text-gray-500">
                              Lô: {detail.batch_product.batch_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              HSD: {new Date(detail.batch_product.expiry_date).toLocaleDateString("vi-VN")}
                            </div>
                            {detail.notes && (
                              <div className="text-sm text-gray-600 italic">
                                Ghi chú: {detail.notes}
                              </div>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-500">
                              {detail.quantity} × {formatCurrency(detail.unit_price)}
                            </div>
                            <div className="font-semibold text-[#44703d]">
                              {formatCurrency(detail.subtotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#44703d]">
                Tổng kết đơn hàng
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tổng số sản phẩm:</span>
                    <span className="font-medium">{order.order_details.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng số lượng:</span>
                    <span className="font-medium">
                      {order.order_details.reduce((sum, detail) => sum + detail.quantity, 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold text-[#44703d]">
                    <span>Tổng giá trị:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}