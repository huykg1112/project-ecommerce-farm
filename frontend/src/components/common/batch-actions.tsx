"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Trash2, XCircle } from "lucide-react";

interface BatchActionsProps {
  selectedCount: number;
  onBatchActivate: () => void;
  onBatchDeactivate: () => void;
  onBatchDelete: () => void;
  loading: boolean;
  title: string;
}

export function BatchActions({
  selectedCount,
  onBatchActivate,
  onBatchDeactivate,
  onBatchDelete,
  loading,
  title,
}: BatchActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="border-[#90c577]">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#44703d] font-medium">
            Đã chọn {selectedCount} {title}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchActivate}
              disabled={loading}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Kích hoạt
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchDeactivate}
              disabled={loading}
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Tạm dừng
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchDelete}
              disabled={loading}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
