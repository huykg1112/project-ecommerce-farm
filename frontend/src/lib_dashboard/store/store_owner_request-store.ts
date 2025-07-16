import { atom } from "jotai";
import { StoreOwnerRequest } from "../types/store_owner_request";

export interface StoreOwnerRequestFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Filter state
export const storeOwnerRequestFiltersAtom = atom<StoreOwnerRequestFilters>({
  search: "",
  status: "",
  page: 1,
  limit: 10,
});

// Store owner requests data state
export const storeOwnerRequestsDataAtom = atom<StoreOwnerRequest[]>([]);

// Loading state
export const storeOwnerRequestsLoadingAtom = atom<boolean>(false);

// Pagination state
export const storeOwnerRequestsPaginationAtom = atom({
  total: 0,
  totalPages: 0,
});

// Selected store owner requests for batch actions
export const selectedStoreOwnerRequestsAtom = atom<string[]>([]);

// Derived state for select all checkbox
export const isAllSelectedAtom = atom((get) => {
  const storeOwnerRequests = get(storeOwnerRequestsDataAtom);
  const selectedStoreOwnerRequests = get(selectedStoreOwnerRequestsAtom);
  return (
    storeOwnerRequests.length > 0 &&
    selectedStoreOwnerRequests.length === storeOwnerRequests.length
  );
});

// Derived state for indeterminate checkbox
export const isIndeterminateAtom = atom((get) => {
  const storeOwnerRequests = get(storeOwnerRequestsDataAtom);
  const selectedStoreOwnerRequests = get(selectedStoreOwnerRequestsAtom);
  return (
    selectedStoreOwnerRequests.length > 0 &&
    selectedStoreOwnerRequests.length < storeOwnerRequests.length
  );
});

// Form state for add/edit store owner request
export const storeOwnerRequestFormDataAtom = atom<StoreOwnerRequest>({
  store_owner_request_id: "",
  user_id: "",
  request_date: null,
  request_status: "",
  approved_date: null,
  name: "",
  business_license: "",
  invenstory_address: "",
  invenstory_lat: null,
  invenstory_lng: null,
  invenstory_img: null,
  is_deleted: false,
  created_at: null,
});

// Modal states
export const addStoreOwnerRequestModalAtom = atom<boolean>(false);
export const editStoreOwnerRequestModalAtom = atom<boolean>(false);
export const deleteStoreOwnerRequestModalAtom = atom<boolean>(false);
export const selectedStoreOwnerRequestIdAtom = atom<string>("");

// Reset form data
export const resetStoreOwnerRequestFormAtom = atom(null, (get, set) => {
  set(storeOwnerRequestFormDataAtom, {
    store_owner_request_id: "",
    user_id: "",
    request_date: null,
    request_status: "",
    approved_date: null,
    name: "",
    business_license: "",
    invenstory_address: "",
    invenstory_lat: null,
    invenstory_lng: null,
    invenstory_img: null,
    is_deleted: false,
    created_at: null,
  } as StoreOwnerRequest);
});
