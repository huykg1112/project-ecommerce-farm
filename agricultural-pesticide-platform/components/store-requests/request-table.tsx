"use client"

import { memo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, CheckCircle, XCircle, MapPin } from "lucide-react"
import type { StoreOwnerRequest } from "@/types/entities"
import { formatDate } from "@/lib/utils/date"

interface RequestTableProps {
  requests: StoreOwnerRequest[]
  onViewDetails: (requestId: string) => void
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
  loading?: boolean
}

export const RequestTable = memo<RequestTableProps>(
  ({ requests, onViewDetails, onApprove, onReject, loading = false }) => {
    const getStatusBadge = useCallback((request: StoreOwnerRequest) => {
      if (!request.approved_date) {
        return { label: "Chờ duyệt", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" }
      } else if (request.request_status) {
        return { label: "Đã phê duyệt", variant: "default" as const, className: "bg-[#90c577] hover:bg-[#74a65d]" }
      } else {
        return { label: "Đã từ chối", variant: "destructive" as const }
      }
    }, [])

    const isPending = useCallback((request: StoreOwnerRequest) => {
      return !request.approved_date
    }, [])

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#accc8b]/10 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
              <TableHead className="text-[#44703d] font-semibold">Thông tin người đăng ký</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Thông tin cửa hàng</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Ngày đăng ký</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Trạng thái</TableHead>
              <TableHead className="text-[#44703d] font-semibold w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.store_owner_request_id} className="hover:bg-[#accc8b]/10 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.full_name} />
                      <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                        {request.user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-[#44703d]">{request.user.full_name}</div>
                      <div className="text-sm text-[#74a65d]">{request.user.email}</div>
                      <div className="text-sm text-[#74a65d]">{request.user.phone_number}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-[#44703d]">{request.name}</div>
                    <div className="text-sm text-[#74a65d] flex items-center gap-1">
                      <span>GP: {request.business_license}</span>
                    </div>
                    <div className="text-sm text-[#74a65d] flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-xs">{request.invenstory_address}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#44703d]">{formatDate(new Date(request.request_date))}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(request).variant} className={getStatusBadge(request).className}>
                    {getStatusBadge(request).label}
                  </Badge>
                  {request.approved_date && (
                    <div className="text-xs text-[#74a65d] mt-1">{formatDate(new Date(request.approved_date))}</div>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#90c577]/20">
                        <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#accc8b]">
                      <DropdownMenuItem
                        onClick={() => onViewDetails(request.store_owner_request_id)}
                        className="hover:bg-[#accc8b]/20 text-[#44703d]"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {isPending(request) && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onApprove(request.store_owner_request_id)}
                            className="hover:bg-green-50 text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Phê duyệt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onReject(request.store_owner_request_id)}
                            className="hover:bg-red-50 text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Từ chối
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
)

RequestTable.displayName = "RequestTable"
