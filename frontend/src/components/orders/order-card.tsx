import { Button } from "@/components/ui/button";
import type { Order } from "@/data/orders";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  // Format date
  const orderDate = new Date(order.date);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(orderDate);

  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-medium">Đơn hàng #{order.orderNumber}</span>
          </div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.price)} x {item.quantity}
                </p>
                <p className="text-xs text-gray-500">
                  Đại lý: {item.sellerName}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 italic">
              +{order.items.length - 2} sản phẩm khác
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div>
          <p className="text-sm text-gray-500">{totalItems} sản phẩm</p>
          <p className="font-medium">
            Tổng tiền: {formatCurrency(order.totalAmount)}
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href={`/orders/${order.id}`} className="flex items-center">
            Xem chi tiết
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
