"use client";

import { ReviewFilters } from "@/components/(dashboard)/reviews/review-filters";
import { ReviewModals } from "@/components/(dashboard)/reviews/review-modals";
import { ReviewTable } from "@/components/(dashboard)/reviews/review-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from "@/interfaces";
import { reviewsService } from "@/lib_dashboard/services/reviews-service";

import { Eye, MessageSquare, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const initFilters = {
  search: "",
  rating: "all",
  status: "all",
};

export default function ReviewsManagementPage() {
  const [filters, setFilters] = useState(initFilters);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewsService.getAllReviews();
      setReviews(response);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [setReviews, setLoading]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleRatingChange = (rating: string) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((review) => {
        const searchTerm = filters.search.toLowerCase();
        return (
          review.comment?.toLowerCase().includes(searchTerm) ||
          review.user?.full_name?.toLowerCase().includes(searchTerm) ||
          review.product?.name?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Rating filter
    if (filters.rating !== "all") {
      const targetRating = parseInt(filters.rating);
      filtered = filtered.filter((review) => review.rating === targetRating);
    }

    // Status filter
    if (filters.status !== "all") {
      switch (filters.status) {
        case "active":
          filtered = filtered.filter((review) => !review.is_deleted);
          break;
        case "deleted":
          filtered = filtered.filter((review) => review.is_deleted);
          break;
        case "has_response":
          filtered = filtered.filter(
            (review) => review.distributor_response_review
          );
          break;
        case "no_response":
          filtered = filtered.filter(
            (review) =>
              !review.distributor_response_review && !review.parent_review
          );
          break;
      }
    }

    return filtered;
  }, [reviews, filters]);

  const openViewModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setViewModalOpen(true);
  };

  const openDeleteModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedReviewId("");
  };

  const handleDelete = useCallback(async () => {
    try {
      await reviewsService.deleteReview({ review_id: selectedReviewId });
      fetchReviews();
      closeModals();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }, [selectedReviewId, fetchReviews, closeModals]);

  const resetFilters = () => {
    setFilters(initFilters);
  };

  const stats = useMemo(() => {
    const activeReviews = reviews.filter((review) => !review.is_deleted);
    const deletedReviews = reviews.filter((review) => review.is_deleted);
    const reviewsWithRating = reviews.filter(
      (review) => review.rating && !review.parent_review
    );
    const responseReviews = reviews.filter((review) => review.parent_review);

    const averageRating =
      reviewsWithRating.length > 0
        ? reviewsWithRating.reduce(
            (sum, review) => sum + (review.rating || 0),
            0
          ) / reviewsWithRating.length
        : 0;

    return {
      totalReviews: reviews.length,
      activeReviews: activeReviews.length,
      deletedReviews: deletedReviews.length,
      averageRating: averageRating.toFixed(1),
      totalResponses: responseReviews.length,
    };
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            ⭐ Quản lý đánh giá
          </h1>
          <p className="text-[#74a65d] mt-1">
            Xem xét và quản lý các đánh giá sản phẩm từ khách hàng
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng số đánh giá
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalReviews}
            </div>
            <p className="text-xs text-[#74a65d]">Tất cả đánh giá</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đang hoạt động
            </CardTitle>
            <Eye className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.activeReviews}
            </div>
            <p className="text-xs text-[#74a65d]">Đánh giá hiển thị</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã xóa
            </CardTitle>
            <Trash2 className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.deletedReviews}
            </div>
            <p className="text-xs text-[#74a65d]">Đánh giá đã xóa</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đánh giá trung bình
            </CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.averageRating}⭐
            </div>
            <p className="text-xs text-[#74a65d]">Điểm trung bình</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Phản hồi
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalResponses}
            </div>
            <p className="text-xs text-[#74a65d]">Phản hồi từ đại lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ReviewFilters
        search={filters.search || ""}
        rating={filters.rating || "all"}
        status={filters.status || "all"}
        onSearchChange={handleSearchChange}
        onRatingChange={handleRatingChange}
        onStatusChange={handleStatusChange}
        onReset={resetFilters}
      />

      {/* Reviews Table */}
      <ReviewTable
        reviews={filteredReviews}
        onViewDetails={openViewModal}
        onDelete={openDeleteModal}
        loading={loading}
      />

      {/* Modals */}
      <ReviewModals
        viewModalOpen={viewModalOpen}
        selectedReviewId={selectedReviewId}
        reviews={filteredReviews}
        deleteModalOpen={deleteModalOpen}
        onDelete={handleDelete}
        onCloseModals={closeModals}
      />
    </div>
  );
}
