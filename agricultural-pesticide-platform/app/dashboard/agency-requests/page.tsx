"use client"

import { useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestFilters } from "@/components/store-requests/request-filters"
import { RequestTable } from "@/components/store-requests/request-table"
import { RequestPagination } from "@/components/store-requests/request-pagination"
import { RequestModals } from "@/components/store-requests/request-modals"
import { Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { useStoreRequests, useStoreRequestActions } from "@/hooks/use-store-requests"

export default function AgencyRequestsPage() {
  const { requests, loading, pagination, filters, fetchRequests, updateFilters, resetFilters } = useStoreRequests()

  const {
    selectedRequestId,
    approveModalOpen,
    rejectModalOpen,
    viewModalOpen,
    rejectionReason,
    openApproveModal,
    openRejectModal,
    openViewModal,
    closeModals,
    setRejectionReason,
    approveRequest,
    rejectRequest,
  } = useStoreRequestActions()

  // Filter handlers
  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 })
    },
    [updateFilters],
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({ status: status === "all" ? "" : status, page: 1 })
    },
    [updateFilters],
  )

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
    },
    [updateFilters],
  )

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 })
    },
    [updateFilters],
  )

  // Action handlers with refresh
  const handleApprove = useCallback(async () => {
    const success = await approveRequest()
    if (success) {
      await fetchRequests()
    }
    return success
  }, [approveRequest, fetchRequests])

  const handleReject = useCallback(async () => {
    const success = await rejectRequest()
    if (success) {
      await fetchRequests()
    }
    return success
  }, [rejectRequest, fetchRequests])

  // Statistics
  const stats = useMemo(() => {
    const totalRequests = pagination.total
    const pendingRequests = requests.filter((req) => !req.approved_date).length
    const approvedRequests = requests.filter((req) => req.request_status && req.approved_date).length
    const rejectedRequests = requests.filter((req) => !req.request_status && req.approved_date).length

    return { totalRequests, pendingRequests, approvedRequests, rejectedRequests }
  }, [requests, pagination.total])

  // Get selected request for modals
  const selectedRequest = useMemo(() => {
    return requests.find((req) => req.store_owner_request_id === selectedRequestId) || null
  }, [requests, selectedRequestId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">🏪 Duyệt yêu cầu đại lý</h1>
          <p className="text-[#74a65d] mt-1">Xem xét và phê duyệt các yêu cầu đăng ký trở thành đại lý bán hàng</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Tổng số yêu cầu</CardTitle>
            <FileText className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.totalRequests}</div>
            <p className="text-xs text-[#74a65d]">Tất cả yêu cầu đăng ký</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Chờ duyệt</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.pendingRequests}</div>
            <p className="text-xs text-[#74a65d]">Cần xem xét và phê duyệt</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đã phê duyệt</CardTitle>
            <CheckCircle className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.approvedRequests}</div>
            <p className="text-xs text-[#74a65d]">Đã chuyển thành đại lý</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đã từ chối</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.rejectedRequests}</div>
            <p className="text-xs text-[#74a65d]">Không đủ điều kiện</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <RequestFilters
        search={filters.search || ""}
        status={filters.status || "all"}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onReset={resetFilters}
      />

      {/* Requests Table */}
      <RequestTable
        requests={requests}
        onViewDetails={openViewModal}
        onApprove={openApproveModal}
        onReject={openRejectModal}
        loading={loading}
      />

      {/* Pagination */}
      <RequestPagination
        currentPage={filters.page || 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit || 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      <RequestModals
        viewModalOpen={viewModalOpen}
        selectedRequest={selectedRequest}
        approveModalOpen={approveModalOpen}
        onApprove={handleApprove}
        rejectModalOpen={rejectModalOpen}
        rejectionReason={rejectionReason}
        onRejectReasonChange={setRejectionReason}
        onReject={handleReject}
        onCloseModals={closeModals}
      />
    </div>
  )
}
