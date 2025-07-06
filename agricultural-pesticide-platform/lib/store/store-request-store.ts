import { atom } from "jotai"
import type { StoreOwnerRequest } from "@/types/entities"
import type { StoreRequestFilters } from "@/lib/mock/server"

// Filter state
export const storeRequestFiltersAtom = atom<StoreRequestFilters>({
  search: "",
  status: "",
  page: 1,
  limit: 10,
})

// Store requests data state
export const storeRequestsDataAtom = atom<StoreOwnerRequest[]>([])

// Loading state
export const storeRequestsLoadingAtom = atom<boolean>(false)

// Pagination state
export const storeRequestsPaginationAtom = atom({
  total: 0,
  totalPages: 0,
})

// Selected request for actions
export const selectedRequestIdAtom = atom<string>("")

// Modal states
export const approveRequestModalAtom = atom<boolean>(false)
export const rejectRequestModalAtom = atom<boolean>(false)
export const viewRequestModalAtom = atom<boolean>(false)

// Rejection reason
export const rejectionReasonAtom = atom<string>("")

// Reset rejection reason
export const resetRejectionReasonAtom = atom(null, (get, set) => {
  set(rejectionReasonAtom, "")
})
