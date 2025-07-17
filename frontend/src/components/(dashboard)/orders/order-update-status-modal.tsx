"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Order, OrderStatus, OrderStatusEnum, OrderStatusLabels } from "@/lib_dashboard/types/order";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

interface OrderUpdateStatusModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (statusId: string, notes?: string) => Promise<void>;
  loading: boolean;
  orderStatuses?: OrderStatus[];
}

export function OrderUpdateStatusModal({
  order,
  open,
  onClose,
  onSubmit,
  loading,
  orderStatuses = [],
}: OrderUpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleClose = useCallback(() => {
    setSelectedStatus("");
    setNotes("");
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!selectedStatus) return;

    try {
      await onSubmit(selectedStatus, notes || undefined);
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  }, [selectedStatus, notes, onSubmit, handleClose]);

  // Get available statuses based on current order status
  const getAvailableStatuses = useCallback(() => {
    if (!order) return [];

    const currentStatus = order.status.status_name;
    const allStatuses = Object.values(OrderStatusEnum);
    
    // Define allowed transitions
    const allowedTransitions: Record<string, OrderStatusEnum[]> = {
      [OrderStatusEnum.PENDING]: [
        OrderStatusEnum.CONFIRMED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.CONFIRMED]: [
        OrderStatusEnum.SHIPPING,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.SHIPPING]: [
        OrderStatusEnum.DELIVERED,
        OrderStatusEnum.FAILED,
      ],
      [OrderStatusEnum.DELIVERED]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.RETURNED,
      ],
      [OrderStatusEnum.FAILED]: [
        OrderStatusEnum.SHIPPING,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.RETURNED]: [
        OrderStatusEnum.REFUNDED,
      ],
    };

    return allowedTransitions[currentStatus as OrderStatusEnum] || [];
  }, [order]);

  if (!order) return null;

  const availableStatuses = getAvailableStatuses();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#44703d]">
            Cập nhật trạng thái đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Đơn hàng: {order.order_code}
            </Label>
            <div className="mt-1 text-sm text-gray-500">
              Trạng thái hiện tại: {OrderStatusLabels[order.status.status_name as OrderStatusEnum]}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái mới</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => {
                  // Find the status ID from orderStatuses
                  const statusObj = orderStatuses.find(s => s.status_name === status);
                  return (
                    <SelectItem key={status} value={statusObj?.status_id || status}>
                      {OrderStatusLabels[status]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú cho việc cập nhật trạng thái..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedStatus || loading}
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật trạng thái"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}