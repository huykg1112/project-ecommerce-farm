import {
  OrderStatus,
  OrderStatusColors,
  OrderStatusLabels,
} from "@/lib_dashboard/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const statusText =
    OrderStatusLabels[status.status_name as keyof typeof OrderStatusLabels];
  const statusColor =
    OrderStatusColors[status.status_name as keyof typeof OrderStatusColors];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
    >
      {statusText}
    </span>
  );
}
