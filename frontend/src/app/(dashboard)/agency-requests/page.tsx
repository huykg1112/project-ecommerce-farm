"use client";

import { RequestFilters } from "@/components/(dashboard)/store-requests/request-filters";
import { RequestModals } from "@/components/(dashboard)/store-requests/request-modals";
import { RequestTable } from "@/components/(dashboard)/store-requests/request-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreOwnerRequests } from "@/lib_dashboard/services/store_owner_request";
import { StoreOwnerRequest } from "@/lib_dashboard/types/store_owner_request";

import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const initFilters = {
  search: "",
  status: "all",
};

export default function AgencyRequestsPage() {
  const [filters, setFilters] = useState(initFilters);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<StoreOwnerRequest[]>([]);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await StoreOwnerRequests.getStoreOwnerRequests();
      setRequest(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setRequest, setLoading]);
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const filteredRequests = useMemo(() => {
    let filtered = request;
    if (filters.search) {
      filtered = filtered.filter((req) => {
        if (req.name) {
          return req.name.toLowerCase().includes(filters.search.toLowerCase());
        }
        return false;
      });
    }
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (req) => req.request_status === filters.status
      );
    }
    return filtered;
  }, [request, filters]);

  const openViewModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setViewModalOpen(true);
  };
  const openApproveModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setApproveModalOpen(true);
  };
  const openRejectModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectModalOpen(true);
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setSelectedRequestId("");
    setRejectionReason("");
  };

  const handleApprove = useCallback(async () => {
    try {
      await StoreOwnerRequests.approveStoreOwnerRequest(
        selectedRequestId,
        true
      );
      fetchRequests();
      closeModals();
    } catch (error) {
      // Handle error
    }
  }, [selectedRequestId, fetchRequests, closeModals]);

  const handleReject = useCallback(async () => {
    try {
      await StoreOwnerRequests.approveStoreOwnerRequest(
        selectedRequestId,
        false
      );
      fetchRequests();
      closeModals();
    } catch (error) {
      // Handle error
    }
  }, [selectedRequestId, fetchRequests, closeModals]);

  const resetFilters = () => {
    setFilters(initFilters);
  };

  const handleDelete = async (requestId: string) => {};
  const stats = useMemo(() => {
    return {
      totalRequests: request.length,
      // chờ phê duyệt là request chưa có approved_date
      pendingRequests: request.filter((req) => !req.approved_date).length,
      approvedRequests: request.filter((req) => req.request_status).length,
      rejectedRequests: request.filter((req) => !req.request_status).length,
    };
  }, [request]);
  console.log("Agency Requests:", request);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            🏪 Duyệt yêu cầu đại lý
          </h1>
          <p className="text-[#74a65d] mt-1">
            Xem xét và phê duyệt các yêu cầu đăng ký trở thành đại lý bán hàng
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng số yêu cầu
            </CardTitle>
            <FileText className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalRequests}
            </div>
            <p className="text-xs text-[#74a65d]">Tất cả yêu cầu đăng ký</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Chờ duyệt
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.pendingRequests}
            </div>
            <p className="text-xs text-[#74a65d]">Cần xem xét và phê duyệt</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã phê duyệt
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.approvedRequests}
            </div>
            <p className="text-xs text-[#74a65d]">Đã chuyển thành đại lý</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã từ chối
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.rejectedRequests}
            </div>
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
        requests={filteredRequests}
        onViewDetails={openViewModal}
        onApprove={openApproveModal}
        onReject={openRejectModal}
        loading={loading}
      />

      {/* Pagination */}
      {/* <RequestPagination
        currentPage={filters.page || 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit || 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      /> */}

      {/* Modals */}
      <RequestModals
        viewModalOpen={viewModalOpen}
        selectedRequestId={selectedRequestId}
        requests={filteredRequests as StoreOwnerRequest[]}
        onClose={closeModals}
        approveModalOpen={approveModalOpen}
        onApprove={handleApprove}
        rejectModalOpen={rejectModalOpen}
        rejectionReason={rejectionReason}
        onRejectReasonChange={setRejectionReason}
        onReject={handleReject}
        onCloseModals={closeModals}
      />
    </div>
  );
}
