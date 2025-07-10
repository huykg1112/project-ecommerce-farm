"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2, Lock, Trash2, Unlock } from "lucide-react";
import { memo, useCallback, useState } from "react";

interface BatchActionsProps {
  selectedCount: number;
  onBatchActivate: () => Promise<void>;
  onBatchDeactivate: () => Promise<void>;
  onBatchDelete: () => Promise<void>;
  loading?: boolean;
  title?: string;
}

export const BatchActions = memo<BatchActionsProps>(
  ({
    selectedCount,
    onBatchActivate,
    onBatchDeactivate,
    onBatchDelete,
    loading = false,
    title,
  }) => {
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const handleActivate = useCallback(async () => {
      setActionLoading(true);
      await onBatchActivate();
      setActionLoading(false);
      setShowActivateDialog(false);
    }, [onBatchActivate]);

    const handleDeactivate = useCallback(async () => {
      setActionLoading(true);
      await onBatchDeactivate();
      setActionLoading(false);
      setShowDeactivateDialog(false);
    }, [onBatchDeactivate]);

    const handleDelete = useCallback(async () => {
      setActionLoading(true);
      await onBatchDelete();
      setActionLoading(false);
      setShowDeleteDialog(false);
    }, [onBatchDelete]);

    if (selectedCount === 0) return null;

    return (
      <>
        <div className="flex items-center gap-2 p-4 bg-[#90c577]/10 rounded-lg border border-[#90c577]/30">
          <span className="text-sm font-medium text-[#44703d]">
            Đã chọn {selectedCount} {title}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || actionLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
              >
                Thao tác hàng loạt
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-[#accc8b]">
              <DropdownMenuItem
                onClick={() => setShowActivateDialog(true)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Mở khóa {title}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeactivateDialog(true)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Lock className="mr-2 h-4 w-4" />
                Khóa {title}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa {title}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Activate Dialog */}
        <AlertDialog
          open={showActivateDialog}
          onOpenChange={setShowActivateDialog}
        >
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">
                Xác nhận mở khóa {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn mở khóa {selectedCount} {title} đã chọn?
                {title} sẽ có thể được sử dụng trở lại.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={actionLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleActivate}
                disabled={actionLoading}
                className="bg-[#90c577] hover:bg-[#74a65d] text-white"
              >
                {actionLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Mở khóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Deactivate Dialog */}
        <AlertDialog
          open={showDeactivateDialog}
          onOpenChange={setShowDeactivateDialog}
        >
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">
                Xác nhận khóa {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn khóa {selectedCount} {title} đã chọn?
                {title} sẽ không thể được sử dụng.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={actionLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeactivate}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Khóa {title}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">
                Xác nhận xóa {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn xóa {selectedCount} {title} đã chọn? Hành
                động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu
                liên quan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={actionLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xóa {title}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);

BatchActions.displayName = "BatchActions";
