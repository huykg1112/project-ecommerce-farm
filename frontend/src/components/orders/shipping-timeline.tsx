import type { ShippingUpdate } from "@/data/orders";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

interface ShippingTimelineProps {
  updates: ShippingUpdate[];
}

export function ShippingTimeline({ updates }: ShippingTimelineProps) {
  // Sort updates by date (newest first for display, but we'll reverse in the UI)
  const sortedUpdates = [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reverse();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "order_placed":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "order_confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "order_processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "order_shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "order_out_for_delivery":
        return <Truck className="h-5 w-5 text-primary" />;
      case "order_delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "order_cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

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

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedUpdates.map((update, idx) => (
          <li key={idx}>
            <div className="relative pb-8">
              {idx !== sortedUpdates.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                    {getStatusIcon(update.status)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {update.description}
                    </p>
                    {update.location && (
                      <p className="text-sm text-gray-500">{update.location}</p>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {formatDate(update.date)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
