import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckSquare, Pause, Play, Trash2 } from "lucide-react";

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
  if (selectedCount === 0) return null;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                Đã chọn {selectedCount} {title}
              </span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {selectedCount}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchActivate}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <Play className="w-4 h-4" />
              <span>Kích hoạt</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBatchDeactivate}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <Pause className="w-4 h-4" />
              <span>Tạm dừng</span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="destructive"
              size="sm"
              onClick={onBatchDelete}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
