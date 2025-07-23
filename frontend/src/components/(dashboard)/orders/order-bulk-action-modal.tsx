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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Order,
  OrderStatus,
  OrderStatusEnum,
  OrderStatusLabels,
} from "@/lib_dashboard/types/order";
import { AlertTriangle, Package2, Users } from "lucide-react";
import { useState } from "react";

interface OrderBulkActionModalProps {
  orders: Order[];
  open: boolean;
  onClose: () => void;
  onBulkUpdate: (orderIds: string[], statusId: string, notes?: string) => void;
  loading?: boolean;
  orderStatuses: OrderStatus[];
}

export function OrderBulkActionModal({
  orders,
  open,
  onClose,
  onBulkUpdate,
  loading = false,
  orderStatuses,
}: OrderBulkActionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");

  if (orders.length === 0) return null;

  const handleSubmit = () => {
    if (!selectedStatus) return;

    const orderIds = orders.map((order) => order.order_id);
    onBulkUpdate(orderIds, selectedStatus, notes.trim() || undefined);
    setSelectedStatus("");
    setNotes("");
    onClose();
  };

  const handleClose = () => {
    setSelectedStatus("");
    setNotes("");
    onClose();
  };

  // Get status distribution
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status.status_name;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total amount
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package2 className="w-5 h-5 text-blue-500" />
            Cập nhật hàng loạt ({orders.length} đơn hàng)
          </DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái cho nhiều đơn hàng cùng lúc. Vui lòng kiểm tra
            kỹ trước khi thực hiện.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Orders Summary */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tóm tắt đơn hàng được chọn
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-blue-700">Số lượng đơn hàng:</Label>
                <p className="font-medium text-blue-900">{orders.length}</p>
              </div>
              <div>
                <Label className="text-blue-700">Tổng giá trị:</Label>
                <p className="font-medium text-blue-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-blue-700">Phân bổ trạng thái:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Badge key={status} variant="outline" className="text-xs">
                    {OrderStatusLabels[status as OrderStatusEnum] || status}:{" "}
                    {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Order List Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Danh sách đơn hàng:
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between bg-white p-2 rounded text-sm"
                >
                  <div>
                    <span className="font-mono font-medium text-[#44703d]">
                      {order.order_code}
                    </span>
                    <span className="text-gray-500 ml-2">
                      - {order.user.full_name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {
                      OrderStatusLabels[
                        order.status.status_name as OrderStatusEnum
                      ]
                    }
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="bulkStatus">
              Trạng thái mới <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái mới cho tất cả đơn hàng..." />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.status_id} value={status.status_id}>
                    {OrderStatusLabels[status.status_name as OrderStatusEnum] ||
                      status.status_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="bulkNotes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="bulkNotes"
              placeholder="Nhập ghi chú cho việc cập nhật hàng loạt..."
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
                  <strong>Cảnh báo:</strong> Hành động này sẽ cập nhật trạng
                  thái cho tất cả {orders.length} đơn hàng được chọn. Vui lòng
                  kiểm tra kỹ trước khi thực hiện.
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
            onClick={handleSubmit}
            disabled={!selectedStatus || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? "Đang cập nhật..."
              : `Cập nhật ${orders.length} đơn hàng`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
