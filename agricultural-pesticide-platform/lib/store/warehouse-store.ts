import { atom } from "jotai"
import type { Invenstory, User } from "@/types/entities"

export interface WarehouseFilters {
  search?: string
  status?: string
  distributor?: string
  page?: number
  limit?: number
}

export interface WarehouseFormData {
  invenstory_id?: string
  distributor_id: string
  name: string
  business_license: string
  invenstory_address: string
  invenstory_lat?: number
  invenstory_lng?: number
  invenstory_img?: string
  is_locked?: boolean
}

// Filter state
export const warehouseFiltersAtom = atom<WarehouseFilters>({
  search: "",
  status: "",
  distributor: "",
  page: 1,
  limit: 10,
})

// Warehouses data state
export const warehousesDataAtom = atom<Invenstory[]>([])

// Distributors data state
export const distributorsDataAtom = atom<User[]>([])

// Loading state
export const warehousesLoadingAtom = atom<boolean>(false)

// Pagination state
export const warehousesPaginationAtom = atom({
  total: 0,
  totalPages: 0,
})

// Form state for add/edit warehouse
export const warehouseFormDataAtom = atom<WarehouseFormData>({
  distributor_id: "",
  name: "",
  business_license: "",
  invenstory_address: "",
  invenstory_lat: undefined,
  invenstory_lng: undefined,
  invenstory_img: "",
  is_locked: false,
})

// Modal states
export const addWarehouseModalAtom = atom<boolean>(false)
export const editWarehouseModalAtom = atom<boolean>(false)
export const deleteWarehouseModalAtom = atom<boolean>(false)
export const selectedWarehouseIdAtom = atom<string>("")

// Reset form data
export const resetWarehouseFormAtom = atom(null, (get, set) => {
  set(warehouseFormDataAtom, {
    distributor_id: "",
    name: "",
    business_license: "",
    invenstory_address: "",
    invenstory_lat: undefined,
    invenstory_lng: undefined,
    invenstory_img: "",
    is_locked: false,
  })
})
