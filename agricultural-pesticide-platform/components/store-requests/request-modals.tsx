"use client"

import { memo, useCallback, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, FileText, Calendar, User } from "lucide-react"
import type { StoreOwnerRequest } from "@/types/entities"
import { formatDate } from "@/lib/utils/date"

interface RequestModalsProps {
  // View modal
  viewModalOpen: boolean
  selectedRequest: StoreOwnerRequest | null

  // Approve modal
  approveModalOpen: boolean
  onApprove: () => Promise<boolean>

  // Reject modal
  rejectModalOpen: boolean
  rejectionReason: string
  onRejectReasonChange: (reason: string) => void
  onReject: () => Promise<boolean>

  // Common
  onCloseModals: () => void
}

export const RequestModals = memo<RequestModalsProps>(
  ({
    viewModalOpen,
    selectedRequest,
    approveModalOpen,
    onApprove,
    rejectModalOpen,
    rejectionReason,
    onRejectReasonChange,
    onReject,
    onCloseModals,
  }) => {
    const [approveLoading, setApproveLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)

    const handleApprove = useCallback(async () => {
      setApproveLoading(true)
      const success = await onApprove()
      if (success) {
        onCloseModals()
      }
      setApproveLoading(false)
    }, [onApprove, onCloseModals])

    const handleReject = useCallback(async () => {
      setRejectLoading(true)
      const success = await onReject()
      if (success) {
        onCloseModals()
      }
      setRejectLoading(false)
    }, [onReject, onCloseModals])

    const getStatusBadge = useCallback((request: StoreOwnerRequest) => {
      if (!request.approved_date) {
        return { label: "Chờ duyệt", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" }
      } else if (request.request_status) {
        return { label: "Đã phê duyệt", variant: "default" as const, className: "bg-[#90c577] hover:bg-[#74a65d]" }
      } else {
        return { label: "Đã từ chối", variant: "destructive" as const }
      }
    }, [])

    return (
      <>
        {/* View Details Modal */}
        <Dialog open={viewModalOpen} onOpenChange={onCloseModals}>
          <DialogContent className="sm:max-w-2xl bg-white border-[#accc8b]">
            <DialogHeader>
              <DialogTitle className="text-[#44703d]">Chi tiết yêu cầu đăng ký đại lý</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={getStatusBadge(selectedRequest).variant}
                    className={getStatusBadge(selectedRequest).className}
                  >
                    {getStatusBadge(selectedRequest).label}
                  </Badge>
                  <div className="text-sm text-[#74a65d]">
                    Ngày đăng ký: {formatDate(new Date(selectedRequest.request_date))}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#44703d] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin người đăng ký
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-[#accc8b]/10 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedRequest.user.avatar || "/placeholder.svg"}
                        alt={selectedRequest.user.full_name}
                      />
                      <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                        {selectedRequest.user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-[#44703d]">{selectedRequest.user.full_name}</div>
                      <div className="text-sm text-[#74a65d]">{selectedRequest.user.email}</div>
                      <div className="text-sm text-[#74a65d]">{selectedRequest.user.phone_number}</div>
                      {selectedRequest.user.cccd && (
                        <div className="text-sm text-[#74a65d]">CCCD: {selectedRequest.user.cccd}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Store Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#44703d] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Thông tin cửa hàng
                  </h3>
                  <div className="space-y-3 p-4 bg-[#accc8b]/10 rounded-lg">
                    <div>
                      <span className="font-medium text-[#44703d]">Tên cửa hàng:</span>
                      <span className="ml-2 text-[#74a65d]">{selectedRequest.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#44703d]">Giấy phép kinh doanh:</span>
                      <span className="ml-2 text-[#74a65d]">{selectedRequest.business_license}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#44703d] flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Địa chỉ kho:
                      </span>
                      <span className="ml-2 text-[#74a65d]">{selectedRequest.invenstory_address}</span>
                    </div>
                    {selectedRequest.invenstory_img && (
                      <div>
                        <span className="font-medium text-[#44703d]">Hình ảnh kho:</span>
                        <div className="mt-2">
                          <img
                            src={selectedRequest.invenstory_img || "/placeholder.svg"}
                            alt="Hình ảnh kho"
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-[#accc8b]/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.approved_date && (
                  <div className="p-4 bg-[#accc8b]/10 rounded-lg">
                    <div className="flex items-center gap-2 text-[#44703d]">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        Ngày xử lý: {formatDate(new Date(selectedRequest.approved_date))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={onCloseModals}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
                variant="outline"
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Modal */}
        <AlertDialog open={approveModalOpen} onOpenChange={onCloseModals}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">Xác nhận phê duyệt</AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn phê duyệt yêu cầu đăng ký đại lý này? Người dùng sẽ được chuyển thành vai trò Đại
                lý và c�� thể bán hàng trên hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={approveLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                disabled={approveLoading}
                className="bg-[#90c577] hover:bg-[#74a65d] text-white"
              >
                {approveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Phê duyệt
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Modal */}
        <AlertDialog open={rejectModalOpen} onOpenChange={onCloseModals}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">Từ chối yêu cầu</AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Vui lòng nhập lý do từ chối yêu cầu đăng ký đại lý này.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <Label htmlFor="rejection-reason" className="text-[#44703d]">
                Lý do từ chối *
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => onRejectReasonChange(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="border-[#90c577] focus:border-[#74a65d]"
                rows={4}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={rejectLoading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                disabled={rejectLoading || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {rejectLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Từ chối
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  },
)

RequestModals.displayName = "RequestModals"
