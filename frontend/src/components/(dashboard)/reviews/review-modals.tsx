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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Review } from "@/interfaces";
import { formatDate } from "@/lib_dashboard/utils/date";
import { Calendar, Loader2, MessageSquare, Star, User } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

interface ReviewModalsProps {
  // View modal
  viewModalOpen: boolean;
  selectedReviewId: string | null;
  reviews: Review[];

  // Delete modal
  deleteModalOpen: boolean;
  onDelete: () => Promise<void>;

  // Common
  onCloseModals: () => void;
}

export const ReviewModals = memo<ReviewModalsProps>(
  ({
    viewModalOpen,
    selectedReviewId,
    deleteModalOpen,
    onDelete,
    onCloseModals,
    reviews,
  }) => {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
      if (selectedReviewId) {
        const review = reviews.find(
          (rev) => rev.review_id === selectedReviewId
        );
        setSelectedReview(review || null);
      }
    }, [selectedReviewId, reviews]);

    const handleDelete = useCallback(async () => {
      setDeleteLoading(true);
      await onDelete();
      onCloseModals();
      setDeleteLoading(false);
    }, [onDelete, onCloseModals]);

    const getStatusBadge = useCallback((review: Review) => {
      if (review.is_deleted) {
        return {
          label: "Đã xóa",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800",
        };
      } else if (review.parent_review) {
        return {
          label: "Phản hồi",
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800",
        };
      } else {
        return {
          label: "Đánh giá",
          variant: "default" as const,
          className: "bg-[#90c577] hover:bg-[#74a65d] text-white",
        };
      }
    }, []);

    const renderStars = useCallback((rating: number) => {
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-lg font-semibold text-[#74a65d] ml-2">
            {rating}/5
          </span>
        </div>
      );
    }, []);

    return (
      <>
        {/* View Details Modal */}
        <Dialog open={viewModalOpen} onOpenChange={onCloseModals}>
          <DialogContent className="sm:max-w-2xl bg-white border-[#accc8b]">
            <DialogHeader>
              <DialogTitle className="text-[#44703d]">
                Chi tiết đánh giá
              </DialogTitle>
            </DialogHeader>

            {selectedReview && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={getStatusBadge(selectedReview).variant}
                    className={getStatusBadge(selectedReview).className}
                  >
                    {getStatusBadge(selectedReview).label}
                  </Badge>
                  <div className="text-sm text-[#74a65d]">
                    Ngày tạo: {formatDate(new Date(selectedReview.created_at))}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#44703d] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin người đánh giá
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-[#accc8b]/10 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedReview.user?.avatar || "/placeholder.svg"}
                        alt={selectedReview.user?.full_name || "User"}
                      />
                      <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                        {(selectedReview.user?.full_name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-[#44703d]">
                        {selectedReview.user?.full_name || "Ẩn danh"}
                      </div>
                      <div className="text-sm text-[#74a65d]">
                        {selectedReview.user?.email || "Email không có"}
                      </div>
                      <div className="text-sm text-[#74a65d]">
                        {selectedReview.user?.phone_number || "SĐT không có"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#44703d] flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Thông tin sản phẩm
                  </h3>
                  <div className="p-4 bg-[#accc8b]/10 rounded-lg">
                    <div className="font-medium text-[#44703d]">
                      {selectedReview.product?.name || "Sản phẩm đã xóa"}
                    </div>
                    <div className="text-sm text-[#74a65d]">
                      ID: {selectedReview.product?.id || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {selectedReview.rating && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#44703d]">Đánh giá</h3>
                    <div className="p-4 bg-[#accc8b]/10 rounded-lg">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                )}

                {/* Comment */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#44703d] flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {selectedReview.parent_review
                      ? "Nội dung phản hồi"
                      : "Nội dung đánh giá"}
                  </h3>
                  <div className="p-4 bg-[#accc8b]/10 rounded-lg">
                    <p className="text-[#44703d] whitespace-pre-wrap">
                      {selectedReview.comment || "Không có nội dung"}
                    </p>
                  </div>
                </div>

                {/* Parent Review (if this is a response) */}
                {selectedReview.parent_review && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#44703d]">
                      Đánh giá gốc được phản hồi
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#90c577]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-[#44703d]">
                          {selectedReview.parent_review.user?.full_name ||
                            "Ẩn danh"}
                        </span>
                        {selectedReview.parent_review.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({
                              length: selectedReview.parent_review.rating,
                            }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-500 fill-yellow-500"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-[#44703d] text-sm">
                        {selectedReview.parent_review.comment}
                      </p>
                      <div className="text-xs text-[#74a65d] mt-2">
                        {formatDate(
                          new Date(selectedReview.parent_review.created_at)
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Distributor Response (if any) */}
                {selectedReview.distributor && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#44703d]">
                      Thông tin người phản hồi (Đại lý)
                    </h3>
                    <div className="p-4 bg-[#accc8b]/10 rounded-lg">
                      <div className="font-medium text-[#44703d]">
                        {selectedReview.distributor.full_name}
                      </div>
                      <div className="text-sm text-[#74a65d]">
                        {selectedReview.distributor.email}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#accc8b]/30">
                  <div>
                    <div className="text-sm font-medium text-[#44703d]">
                      Ngày tạo
                    </div>
                    <div className="text-sm text-[#74a65d]">
                      {formatDate(new Date(selectedReview.created_at))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#44703d]">
                      Cập nhật lần cuối
                    </div>
                    <div className="text-sm text-[#74a65d]">
                      {formatDate(new Date(selectedReview.updated_at))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteModalOpen} onOpenChange={onCloseModals}>
          <AlertDialogContent className="bg-white border-[#accc8b]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#44703d]">
                Xác nhận xóa đánh giá
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#74a65d]">
                Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này
                không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={onCloseModals}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xóa đánh giá
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);

ReviewModals.displayName = "ReviewModals";
