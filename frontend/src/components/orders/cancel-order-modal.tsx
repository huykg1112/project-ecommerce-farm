"use client";

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
import { showToast } from "@/lib/toast-provider";
import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import type { Order } from "@/lib_dashboard/types/order";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface CancelOrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Helper function to check if order can be cancelled
export const canCancelOrder = (orderStatus: string): boolean => {
  const nonCancellableStatuses = ["DELIVERED", "COMPLETED", "CANCELLED"];
  return !nonCancellableStatuses.includes(orderStatus);
};

export function CancelOrderModal({
  order,
  open,
  onClose,
  onSuccess,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleCancel = async () => {
    if (!order) return;

    if (!reason.trim()) {
      showToast.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    if (reason.trim().length < 10) {
      showToast.error("Lý do hủy phải có ít nhất 10 ký tự");
      return;
    }

    setLoading(true);
    try {
      await orderServiceManagement.cancelOrder(order.order_id);

      showToast.success(`Đã hủy đơn hàng ${order.order_code} thành công!`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
      showToast.error("Không thể hủy đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hủy đơn hàng
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng{" "}
            <span className="font-semibold">#{order.order_code}</span>? Hành
            động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Lý do hủy đơn hàng <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do hủy đơn hàng (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">{reason.length}/200 ký tự</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Đơn hàng sẽ được hủy ngay lập tức</li>
                  <li>Bạn có thể đặt lại đơn hàng mới nếu cần</li>
                  <li>
                    Nếu đã thanh toán, số tiền sẽ được hoàn lại theo quy định
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Không hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || !reason.trim() || reason.trim().length < 10}
            className="flex-1"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
            )}
            {loading ? "Đang hủy..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
