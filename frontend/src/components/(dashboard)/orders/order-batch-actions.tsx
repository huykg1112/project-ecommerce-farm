"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, X, XCircle } from "lucide-react";
import { useCallback } from "react";

interface OrderBatchActionsProps {
  selectedCount: number;
  onBatchConfirm: () => void;
  onBatchCancel: () => void;
  onBatchUpdateStatus: () => void;
  onClearSelection: () => void;
  loading: boolean;
}

export function OrderBatchActions({
  selectedCount,
  onBatchConfirm,
  onBatchCancel,
  onBatchUpdateStatus,
  onClearSelection,
  loading,
}: OrderBatchActionsProps) {
  const handleBatchConfirm = useCallback(() => {
    onBatchConfirm();
  }, [onBatchConfirm]);

  const handleBatchCancel = useCallback(() => {
    onBatchCancel();
  }, [onBatchCancel]);

  const handleBatchUpdateStatus = useCallback(() => {
    onBatchUpdateStatus();
  }, [onBatchUpdateStatus]);

  const handleClearSelection = useCallback(() => {
    onClearSelection();
  }, [onClearSelection]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="border-[#90c577] bg-[#f0f9ff]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-[#44703d]">
              Đã chọn {selectedCount} đơn hàng
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Bỏ chọn
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchConfirm}
              disabled={loading}
              className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              Xác nhận hàng loạt
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchCancel}
              disabled={loading}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              Hủy hàng loạt
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchUpdateStatus}
              disabled={loading}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              Cập nhật trạng thái
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}