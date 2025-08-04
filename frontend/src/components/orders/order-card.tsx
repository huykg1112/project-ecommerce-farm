import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib_dashboard/types/order";
import { ChevronRight, Package, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { canCancelOrder } from "./cancel-order-modal";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (order: Order) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  // Format date
  const orderDate = new Date(order.created_at);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(orderDate);

  // Calculate total items from order_details
  const totalItems = order.order_details.reduce(
    (sum, detail) => sum + detail.quantity,
    0
  );

  // Calculate total amount from order_details if not available
  const totalAmount =
    order.total_amount ||
    order.order_details.reduce(
      (sum, detail) => sum + Number(detail.subtotal),
      0
    );

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-medium">Đơn hàng #{order.order_code}</span>
          </div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {order.order_details.slice(0, 2).map((detail) => (
            <div key={detail.order_detail_id} className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
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
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {detail.batch_product.product.product_name}
                </h4>
                {detail.batch_product.product_types?.type_name && (
                  <p className="text-xs text-blue-600 font-medium">
                    {detail.batch_product.product_types.type_name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {formatCurrency(Number(detail.unit_price))} x{" "}
                  {detail.quantity}
                </p>
                <p className="text-xs text-gray-500">
                  Đại lý: {order.distributor?.invenstory?.name || "N/A"}
                </p>
              </div>
            </div>
          ))}

          {order.order_details.length > 2 && (
            <p className="text-sm text-gray-500 italic">
              +{order.order_details.length - 2} sản phẩm khác
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div>
          <p className="text-sm text-gray-500">{totalItems} sản phẩm</p>
          <p className="font-medium">
            Tổng tiền: {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex gap-4">
          {canCancelOrder(order.status.status_name) && onCancelOrder && (
            <Button
              variant="outline"
              onClick={() => onCancelOrder(order)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="ml-1 h-4 w-4" />
              Hủy đơn
            </Button>
          )}
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link
              href={`/orders/${order.order_id}`}
              className="flex items-center"
            >
              Xem chi tiết
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
