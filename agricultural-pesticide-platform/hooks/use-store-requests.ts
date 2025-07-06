"use client"

import { useCallback, useEffect } from "react"
import { useAtom } from "jotai"
import {
  storeRequestFiltersAtom,
  storeRequestsDataAtom,
  storeRequestsLoadingAtom,
  storeRequestsPaginationAtom,
  selectedRequestIdAtom,
  approveRequestModalAtom,
  rejectRequestModalAtom,
  viewRequestModalAtom,
  rejectionReasonAtom,
  resetRejectionReasonAtom,
} from "@/lib/store/store-request-store"
import { StoreRequestService } from "@/lib/services/store-request-service"
import { useToast } from "@/hooks/use-toast"

export const useStoreRequests = () => {
  const { toast } = useToast()

  const [filters, setFilters] = useAtom(storeRequestFiltersAtom)
  const [requests, setRequests] = useAtom(storeRequestsDataAtom)
  const [loading, setLoading] = useAtom(storeRequestsLoadingAtom)
  const [pagination, setPagination] = useAtom(storeRequestsPaginationAtom)

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const response = await StoreRequestService.getStoreRequests(filters)
      setRequests(response.data)
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách yêu cầu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, setRequests, setPagination, setLoading, toast])

  // Auto-fetch when filters change
  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Filter operations
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    [setFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      page: 1,
      limit: filters.limit,
    })
  }, [setFilters, filters.limit])

  return {
    // Data
    requests,
    loading,
    pagination,
    filters,

    // Operations
    fetchRequests,
    updateFilters,
    resetFilters,
  }
}

export const useStoreRequestActions = () => {
  const { toast } = useToast()

  const [selectedRequestId, setSelectedRequestId] = useAtom(selectedRequestIdAtom)
  const [approveModalOpen, setApproveModalOpen] = useAtom(approveRequestModalAtom)
  const [rejectModalOpen, setRejectModalOpen] = useAtom(rejectRequestModalAtom)
  const [viewModalOpen, setViewModalOpen] = useAtom(viewRequestModalAtom)
  const [rejectionReason, setRejectionReason] = useAtom(rejectionReasonAtom)
  const [, resetRejectionReason] = useAtom(resetRejectionReasonAtom)

  const openApproveModal = useCallback(
    (requestId: string) => {
      setSelectedRequestId(requestId)
      setApproveModalOpen(true)
    },
    [setSelectedRequestId, setApproveModalOpen],
  )

  const openRejectModal = useCallback(
    (requestId: string) => {
      setSelectedRequestId(requestId)
      setRejectModalOpen(true)
    },
    [setSelectedRequestId, setRejectModalOpen],
  )

  const openViewModal = useCallback(
    (requestId: string) => {
      setSelectedRequestId(requestId)
      setViewModalOpen(true)
    },
    [setSelectedRequestId, setViewModalOpen],
  )

  const closeModals = useCallback(() => {
    setApproveModalOpen(false)
    setRejectModalOpen(false)
    setViewModalOpen(false)
    setSelectedRequestId("")
    resetRejectionReason()
  }, [setApproveModalOpen, setRejectModalOpen, setViewModalOpen, setSelectedRequestId, resetRejectionReason])

  const approveRequest = useCallback(async () => {
    if (!selectedRequestId) return false

    try {
      await StoreRequestService.approveRequest(selectedRequestId)
      toast({
        title: "Thành công",
        description: "Đã phê duyệt yêu cầu đăng ký đại lý",
      })
      closeModals()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể phê duyệt yêu cầu",
        variant: "destructive",
      })
      return false
    }
  }, [selectedRequestId, toast, closeModals])

  const rejectRequest = useCallback(async () => {
    if (!selectedRequestId || !rejectionReason.trim()) return false

    try {
      await StoreRequestService.rejectRequest(selectedRequestId, rejectionReason)
      toast({
        title: "Thành công",
        description: "Đã từ chối yêu cầu đăng ký đại lý",
      })
      closeModals()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể từ chối yêu cầu",
        variant: "destructive",
      })
      return false
    }
  }, [selectedRequestId, rejectionReason, toast, closeModals])

  return {
    // Modal states
    selectedRequestId,
    approveModalOpen,
    rejectModalOpen,
    viewModalOpen,
    rejectionReason,

    // Modal operations
    openApproveModal,
    openRejectModal,
    openViewModal,
    closeModals,
    setRejectionReason,

    // Actions
    approveRequest,
    rejectRequest,
  }
}
