import {
  getOrderStatusColor,
  getOrderStatusText,
  type Order,
} from "@/data/orders";

interface OrderStatusBadgeProps {
  status: Order["status"];
  className?: string;
}

export function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const statusText = getOrderStatusText(status);
  const statusColor = getOrderStatusColor(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
    >
      {statusText}
    </span>
  );
}
