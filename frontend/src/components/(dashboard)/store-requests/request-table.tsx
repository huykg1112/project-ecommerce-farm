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
import { StoreOwnerRequest } from "@/lib_dashboard/types/store_owner_request";
import { formatDate } from "@/lib_dashboard/utils/date";
import {
  CheckCircle,
  Eye,
  MapPin,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface RequestTableProps {
  requests: StoreOwnerRequest[];
  onViewDetails: (requestId: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
}

export const RequestTable = memo<RequestTableProps>(
  ({ requests, onViewDetails, onApprove, onReject, loading = false }) => {
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const getStatusBadge = useCallback((request: StoreOwnerRequest) => {
      if (!request.approved_date) {
        return {
          label: "Chờ duyệt",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      } else if (request.request_status) {
        return {
          label: "Đã phê duyệt",
          variant: "default" as const,
          className: "bg-[#90c577] hover:bg-[#74a65d]",
        };
      } else {
        return { label: "Đã từ chối", variant: "destructive" as const };
      }
    }, []);

    const isPending = useCallback((request: StoreOwnerRequest) => {
      return !request.approved_date;
    }, []);

    const columns: TableColumn<StoreOwnerRequest>[] = useMemo(
      () => [
        {
          name: "Thông tin người đăng ký",
          cell: (row) => (
            <div className="flex items-center gap-3 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={row.user.avatar || "/placeholder.svg"}
                  alt={row.user.full_name}
                />
                <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                  {(row.user?.full_name || "FramE")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-[#44703d]">
                  {row.user.full_name}
                </div>
                <div className="text-sm text-[#74a65d]">{row.user.email}</div>
                <div className="text-sm text-[#74a65d]">
                  {row.user.phone_number}
                </div>
              </div>
            </div>
          ),
          width: "350px",
        },
        {
          name: "Thông tin cửa hàng",
          cell: (row) => (
            <div className="py-4">
              <div className="font-semibold text-[#44703d]">{row.name}</div>
              <div className="text-sm text-[#74a65d] flex items-center gap-1">
                <span>GP: {row.business_license}</span>
              </div>
              <div className="text-sm text-[#74a65d] flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-xs">
                  {row.invenstory_address}
                </span>
              </div>
            </div>
          ),
          width: "450px",
        },
        {
          name: "Ngày đăng ký",
          cell: (row) => (
            <div className="text-[#44703d] py-4">
              {formatDate(new Date(row?.request_date || ""))}
            </div>
          ),
          minWidth: "150px",
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
              {row.approved_date && (
                <div className="text-xs text-[#74a65d] mt-1">
                  {formatDate(new Date(row.approved_date))}
                </div>
              )}
            </div>
          ),
          minWidth: "150px",
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
                  onClick={() =>
                    onViewDetails(row?.store_owner_request_id || "")
                  }
                  className="hover:bg-[#accc8b]/20 text-[#44703d]"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                {isPending(row) && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        onApprove(row?.store_owner_request_id || "")
                      }
                      className="hover:bg-green-50 text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Phê duyệt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onReject(row?.store_owner_request_id || "")
                      }
                      className="hover:bg-red-50 text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Từ chối
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          width: "150px",
        },
      ],
      [getStatusBadge, isPending, onViewDetails, onApprove, onReject]
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
          data={requests}
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

RequestTable.displayName = "RequestTable";
