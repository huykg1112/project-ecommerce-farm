"use client"

import { memo, useCallback, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteWarehouseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean>
  warehouseName?: string
}

export const DeleteWarehouseModal = memo<DeleteWarehouseModalProps>(({ open, onClose, onConfirm, warehouseName }) => {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-[#accc8b]">
        <DialogHeader>
          <DialogTitle className="text-[#44703d] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Xác nhận xóa kho hàng
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-[#74a65d] mb-4">
            Bạn có chắc chắn muốn xóa kho hàng <span className="font-semibold text-[#44703d]">"{warehouseName}"</span>{" "}
            không?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">
              ⚠️ <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến kho hàng sẽ bị
              xóa vĩnh viễn.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            Hủy bỏ
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa kho hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

DeleteWarehouseModal.displayName = "DeleteWarehouseModal"
