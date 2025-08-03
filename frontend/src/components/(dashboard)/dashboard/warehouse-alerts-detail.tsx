"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { formatCurrency } from "@/lib_dashboard/utils/formatters";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, Package } from "lucide-react";

interface WarehouseAlertsDetailProps {
  isOpen: boolean;
  onClose: () => void;
  alertType: "expiring_soon" | "low_stock";
  items: BatchProduct[];
  title: string;
}

export function WarehouseAlertsDetail({
  isOpen,
  onClose,
  alertType,
  items,
  title,
}: WarehouseAlertsDetailProps) {
  const getIcon = () => {
    switch (alertType) {
      case "expiring_soon":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "low_stock":
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (item: BatchProduct) => {
    if (alertType === "expiring_soon") {
      const daysToExpiry = Math.ceil(
        (new Date(item.expiry_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysToExpiry <= 3) {
        return (
          <Badge variant="destructive" className="text-xs">
            {daysToExpiry} ngày
          </Badge>
        );
      } else if (daysToExpiry <= 7) {
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-orange-100 text-orange-800"
          >
            {daysToExpiry} ngày
          </Badge>
        );
      }
    } else if (alertType === "low_stock") {
      const stockPercentage = Math.round(
        (item.quantity / item.low_stock_threshold) * 100
      );
      if (stockPercentage <= 50) {
        return (
          <Badge variant="destructive" className="text-xs">
            {stockPercentage}%
          </Badge>
        );
      } else {
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-100 text-yellow-800"
          >
            {stockPercentage}%
          </Badge>
        );
      }
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-agricultural-primary">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>
            {alertType === "expiring_soon"
              ? "Danh sách các lô sản phẩm sắp hết hạn sử dụng"
              : "Danh sách các lô sản phẩm có số lượng thấp trong kho"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Không có sản phẩm nào cần cảnh báo</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Mã lô</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Ngưỡng tối thiểu</TableHead>
                  {alertType === "expiring_soon" ? (
                    <TableHead>Ngày hết hạn</TableHead>
                  ) : (
                    <TableHead>Tỷ lệ tồn kho</TableHead>
                  )}
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Giá bán</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.batch_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.product.product_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.product_types?.type_name || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {item.batch_number}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        sản phẩm
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {item.low_stock_threshold}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        sản phẩm
                      </span>
                    </TableCell>
                    <TableCell>
                      {alertType === "expiring_soon" ? (
                        <div className="text-sm">
                          {format(new Date(item.expiry_date), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </div>
                      ) : (
                        <div className="text-sm">
                          {Math.round(
                            (item.quantity / item.low_stock_threshold) * 100
                          )}
                          %
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(item.unit_product_price)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
