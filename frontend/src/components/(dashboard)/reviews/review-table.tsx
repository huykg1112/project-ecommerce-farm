"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Review } from "@/interfaces";
import { formatDate } from "@/lib_dashboard/utils/date";
import { Eye, MessageSquare, MoreHorizontal, Star, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface ReviewTableProps {
  reviews: Review[];
  onViewDetails: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
  loading?: boolean;
}

export const ReviewTable = memo<ReviewTableProps>(
  ({ reviews, onViewDetails, onDelete, loading = false }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);

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
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-[#74a65d] ml-1">({rating}/5)</span>
        </div>
      );
    }, []);

    const columns: TableColumn<Review>[] = useMemo(
      () => [
        {
          name: "Thông tin người dùng",
          cell: (row) => (
            <div className="flex items-center gap-3 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={row.user?.avatar || "/placeholder.svg"}
                  alt={row.user?.full_name || "User"}
                />
                <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                  {(row.user?.full_name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-[#44703d]">
                  {row.user?.full_name || "Ẩn danh"}
                </div>
                <div className="text-sm text-[#74a65d]">{row.user?.email}</div>
              </div>
            </div>
          ),
          width: "300px",
        },
        {
          name: "Sản phẩm",
          cell: (row) => (
            <div className="py-4">
              <div className="font-semibold text-[#44703d]">
                {row.product?.name || "Sản phẩm đã xóa"}
              </div>
              <div className="text-sm text-[#74a65d]">
                ID: {row.product?.id || "N/A"}
              </div>
            </div>
          ),
          width: "200px",
        },
        {
          name: "Đánh giá",
          cell: (row) => (
            <div className="py-4">
              {row.rating && renderStars(row.rating)}
              {row.parent_review && (
                <div className="flex items-center gap-1 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Phản hồi</span>
                </div>
              )}
            </div>
          ),
          width: "150px",
        },
        {
          name: "Nội dung",
          cell: (row) => (
            <div className="py-4 max-w-xs">
              <p className="text-[#44703d] text-sm line-clamp-3">
                {row.comment || "Không có nội dung"}
              </p>
            </div>
          ),
          width: "300px",
        },
        {
          name: "Ngày tạo",
          cell: (row) => (
            <div className="text-[#44703d] py-4">
              {formatDate(new Date(row.created_at))}
            </div>
          ),
          minWidth: "120px",
        },
        {
          name: "Trạng thái",
          cell: (row) => (
            <div className="py-4">
              <Badge
                variant={getStatusBadge(row).variant}
                className={getStatusBadge(row).className}
              >
                {getStatusBadge(row).label}
              </Badge>
            </div>
          ),
          minWidth: "100px",
        },
        {
          name: "Thao tác",
          cell: (row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-[#90c577]/20"
                >
                  <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border-[#accc8b]"
              >
                <DropdownMenuItem
                  onClick={() => onViewDetails(row.review_id)}
                  className="hover:bg-[#accc8b]/20 text-[#44703d]"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                {!row.is_deleted && (
                  <DropdownMenuItem
                    onClick={() => onDelete(row.review_id)}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa đánh giá
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          width: "100px",
        },
      ],
      [getStatusBadge, renderStars, onViewDetails, onDelete]
    );

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-[#accc8b]/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={reviews}
          customStyles={customStyles}
          progressPending={loading}
          highlightOnHover
          pointerOnHover
          responsive
          fixedHeader
          fixedHeaderScrollHeight="600px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
          noDataComponent={
            <div className="text-[#44703d] py-4">
              Không có dữ liệu để hiển thị
            </div>
          }
          paginationComponentOptions={{
            rowsPerPageText: "Hiển thị",
            rangeSeparatorText: "trong tổng số",
            noRowsPerPage: false,
          }}
        />
      </div>
    );
  }
);

ReviewTable.displayName = "ReviewTable";
