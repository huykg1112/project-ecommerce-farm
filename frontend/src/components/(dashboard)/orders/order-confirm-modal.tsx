"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import {
  Order,
  OrderStatusEnum,
  OrderStatusLabels,
} from "@/lib_dashboard/types/order";
import { AlertTriangle, Package, User } from "lucide-react";
import { useState } from "react";

interface OrderConfirmModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (order: Order, notes?: string) => void;
  loading?: boolean;
}

export function OrderConfirmModal({
  order,
  open,
  onClose,
  onConfirm,
  loading = false,
}: OrderConfirmModalProps) {
  const [notes, setNotes] = useState("");

  if (!order) return null;

  const handleConfirm = () => {
    onConfirm(order, notes.trim() || undefined);
    setNotes("");
    onClose();
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [OrderStatusEnum.PENDING]: {
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
      },
      [OrderStatusEnum.CONFIRMED]: {
        color: "bg-blue-100 text-blue-800",
        icon: "✅",
      },
      [OrderStatusEnum.SHIPPING]: {
        color: "bg-purple-100 text-purple-800",
        icon: "🚚",
      },
      [OrderStatusEnum.DELIVERED]: {
        color: "bg-green-100 text-green-800",
        icon: "📦",
      },
      [OrderStatusEnum.CANCELLED]: {
        color: "bg-red-100 text-red-800",
        icon: "❌",
      },
      [OrderStatusEnum.RETURNED]: {
        color: "bg-orange-100 text-orange-800",
        icon: "↩️",
      },
      [OrderStatusEnum.FAILED]: {
        color: "bg-red-100 text-red-800",
        icon: "⚠️",
      },
      [OrderStatusEnum.REFUNDED]: {
        color: "bg-gray-100 text-gray-800",
        icon: "💰",
      },
      [OrderStatusEnum.COMPLETED]: {
        color: "bg-emerald-100 text-emerald-800",
        icon: "🎉",
      },
    };

    const config =
      statusConfig[status as OrderStatusEnum] ||
      statusConfig[OrderStatusEnum.PENDING];

    return (
      <Badge className={`${config.color} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {OrderStatusLabels[status as OrderStatusEnum] || status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Xác nhận đơn hàng
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xác nhận đơn hàng này? Hành động này sẽ thay
            đổi trạng thái đơn hàng thành "Đã xác nhận".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thông tin đơn hàng
              </h4>
              {getStatusBadge(order.status.status_name)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Mã đơn hàng:</Label>
                <p className="font-mono font-medium text-[#44703d]">
                  {order.order_code}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Tổng tiền:</Label>
                <p className="font-semibold text-[#44703d]">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Phương thức thanh toán:</Label>
                <p className="font-medium">
                  {order.payment_method.method_name}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Ngày đặt:</Label>
                <p>
                  {new Date(order.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông tin khách hàng
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Họ tên:</Label>
                <p className="font-medium">{order.user.full_name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email:</Label>
                <p>{order.user.email}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Địa chỉ giao hàng:</Label>
                <p>{order.shipping_address}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú xác nhận (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú cho việc xác nhận đơn hàng..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Lưu ý:</strong> Sau khi xác nhận, đơn hàng sẽ được
                  chuyển sang trạng thái "Đã xác nhận" và có thể bắt đầu quá
                  trình chuẩn bị và giao hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
