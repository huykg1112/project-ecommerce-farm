"use client"

import { memo, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Lock, Unlock, ChevronDown, Trash2, Loader2 } from "lucide-react"

interface BatchActionsProps {
  selectedCount: number
  onBatchActivate: () => Promise<void>
  onBatchDeactivate: () => Promise<void>
  onBatchDelete: () => Promise<void>
  loading?: boolean
}

export const BatchActions = memo<BatchActionsProps>(
  ({ selectedCount, onBatchActivate, onBatchDeactivate, onBatchDelete, loading = false }) => {
    const [showActivateDialog, setShowActivateDialog] = useState(false)
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    const handleActivate = useCallback(async () => {
      setActionLoading(true)
      await onBatchActivate()
      setActionLoading(false)
      setShowActivateDialog(false)
    }, [onBatchActivate])

    const handleDeactivate = useCallback(async () => {
      setActionLoading(true)
      await onBatchDeactivate()
      setActionLoading(false)
      setShowDeactivateDialog(false)
    }, [onBatchDeactivate])

    const handleDelete = useCallback(async () => {
      setActionLoading(true)
      await onBatchDelete()
      setActionLoading(false)
      setShowDeleteDialog(false)
    }, [onBatchDelete])

    if (selectedCount === 0) return null

    return (
      <>
        <div className="flex items-center gap-2 p-4 bg-[#90c577]/10 rounded-lg border border-[#90c577]/30">
          <span className="text-sm font-medium text-[#44703d]">Đã chọn {selectedCount} người dùng</span>

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
                Mở khóa tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeactivateDialog(true)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Lock className="mr-2 h-4 w-4" />
                Khóa tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="hover:bg-red-50 text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Activate Dialog */}
        <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">Xác nhận mở khóa tài khoản</AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn mở khóa {selectedCount} tài khoản đã chọn? Người dùng sẽ có thể đăng nhập và sử
                dụng hệ thống trở lại.
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
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mở khóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Deactivate Dialog */}
        <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">Xác nhận khóa tài khoản</AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn khóa {selectedCount} tài khoản đã chọn? Người dùng sẽ không thể đăng nhập vào hệ
                thống.
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
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Khóa tài khoản
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">Xác nhận xóa người dùng</AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn xóa {selectedCount} người dùng đã chọn? Hành động này không thể hoàn tác và sẽ xóa
                vĩnh viễn tất cả dữ liệu liên quan.
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
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xóa người dùng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  },
)

BatchActions.displayName = "BatchActions"
