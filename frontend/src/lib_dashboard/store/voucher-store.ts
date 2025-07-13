import { Voucher } from "@/types/entities";
import { atom } from "jotai";

export interface VoucherFilters {
  search?: string;
  status?: string;
  promotion_id?: string;
  page?: number;
  limit?: number;
}

export interface VoucherFormData {
  voucher_id?: string;
  voucher_code: string;
  promotion_id: string;
  min_order_value?: number;
  max_discount_value?: number;
  usage_limit?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  distributor_id: string;
}

// Filter state
export const voucherFiltersAtom = atom<VoucherFilters>({
  search: "",
  status: "",
  promotion_id: "",
  page: 1,
  limit: 10,
});

// Vouchers data state
export const vouchersDataAtom = atom<Voucher[]>([]);

// Loading state
export const vouchersLoadingAtom = atom<boolean>(false);

// Pagination state
export const vouchersPaginationAtom = atom({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
});

// Selected vouchers for batch actions
export const selectedVouchersAtom = atom<string[]>([]);

// Form state for add/edit voucher
export const voucherFormDataAtom = atom<VoucherFormData>({
  voucher_code: "",
  promotion_id: "",
  min_order_value: 0,
  max_discount_value: 0,
  usage_limit: 1,
  start_date: "",
  end_date: "",
  is_active: true,
  distributor_id: "",
});

// Modal states
export const addVoucherModalAtom = atom<boolean>(false);
export const editVoucherModalAtom = atom<boolean>(false);
export const deleteVoucherModalAtom = atom<boolean>(false);
export const selectedVoucherIdAtom = atom<string>("");

// Reset form data
export const resetVoucherFormAtom = atom(null, (get, set) => {
  set(voucherFormDataAtom, {
    voucher_code: "",
    promotion_id: "",
    min_order_value: 0,
    max_discount_value: 0,
    usage_limit: 1,
    start_date: "",
    end_date: "",
    is_active: true,
    distributor_id: "",
  });
});
