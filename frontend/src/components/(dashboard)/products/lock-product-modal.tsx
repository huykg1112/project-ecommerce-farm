"use client"

import { useState } from "react"
import { Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from "@/hooks/use-products"

export function LockProductModal() {
  const { isLockModalOpen, lockingProduct, closeModals, toggleProductStatus } = useProducts()
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!lockingProduct) return

    // If product is active and we're locking it, require a reason
    if (lockingProduct.is_active && !reason.trim()) {
      return
    }

    try {
      setLoading(true)
      await toggleProductStatus(lockingProduct.product_id, reason)
      setReason("")
    } catch (error) {
      console.error("Failed to toggle product status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setReason("")
    closeModals()
  }

  if (!lockingProduct) return null

  const isLocking = lockingProduct.is_active

  return (
    <Dialog open={isLockModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLocking ? (
              <>
                <Lock className="h-5 w-5 text-destructive" />
                Khóa sản phẩm
              </>
            ) : (
              <>
                <Unlock className="h-5 w-5 text-green-600" />
                Mở khóa sản phẩm
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLocking ? (
              <>
                Bạn có chắc chắn muốn khóa sản phẩm <strong>{lockingProduct.product_name}</strong>? Vui lòng nhập lý do
                khóa sản phẩm.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn mở khóa sản phẩm <strong>{lockingProduct.product_name}</strong>? Sản phẩm sẽ được
                hiển thị trở lại trên marketplace.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLocking && (
          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do khóa sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do khóa sản phẩm..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            {!reason.trim() && <p className="text-sm text-muted-foreground">Lý do khóa sản phẩm là bắt buộc</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || (isLocking && !reason.trim())}
            variant={isLocking ? "destructive" : "default"}
          >
            {loading ? "Đang xử lý..." : isLocking ? "Khóa sản phẩm" : "Mở khóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
