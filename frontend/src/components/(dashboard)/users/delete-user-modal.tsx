"use client"

import { memo, useCallback, useState } from "react"
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
import { Loader2 } from "lucide-react"

interface DeleteUserModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean>
  userName?: string
}

export const DeleteUserModal = memo<DeleteUserModalProps>(({ open, onClose, onConfirm, userName }) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    const success = await onConfirm()
    if (success) {
      onClose()
    }
    setLoading(false)
  }, [onConfirm, onClose])

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border-[#accc8b]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#44703d]">Xác nhận xóa người dùng</AlertDialogTitle>
          <AlertDialogDescription className="text-[#74a65d]">
            Bạn có chắc chắn muốn xóa người dùng{userName ? ` "${userName}"` : ""} này không? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa người dùng
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

DeleteUserModal.displayName = "DeleteUserModal"
