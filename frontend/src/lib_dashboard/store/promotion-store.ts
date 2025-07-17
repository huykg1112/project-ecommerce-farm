import { atom } from "jotai";
import { Promotion } from "../types/promotion";

export interface PromotionFilters {
  search?: string;
  status?: string;
  promotion_id?: string;
  page?: number;
  limit?: number;
}

export interface PromotionFormData {
  promotion_name?: string | null;
  description?: string | null;
  discount_value?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean | null;
  distributor_id?: string | null;
  batch_product_ids?: string[] | [];
}

// Filter state
export const promotionFiltersAtom = atom<PromotionFilters>({
  search: "",
  status: "",
  promotion_id: "",
  page: 1,
  limit: 10,
});

// Promotions data state
export const promotionsDataAtom = atom<Promotion[]>([]);

// Loading state
export const promotionsLoadingAtom = atom<boolean>(false);

// Pagination state
export const promotionsPaginationAtom = atom({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
});

// Selected promotions for batch actions
export const selectedPromotionsAtom = atom<string[]>([]);

// Form state for add/edit promotion
export const promotionFormDataAtom = atom<PromotionFormData>({
  promotion_name: "",
  description: "",
  discount_value: 0,
  start_date: null,
  end_date: null,
  is_active: true,
  distributor_id: "",
  batch_product_ids: [],
});

// Modal states
export const addPromotionModalAtom = atom<boolean>(false);
export const editPromotionModalAtom = atom<boolean>(false);
export const deletePromotionModalAtom = atom<boolean>(false);
export const selectedPromotionIdAtom = atom<string>("");

// Reset form data
export const resetPromotionFormAtom = atom(null, (get, set) => {
  set(promotionFormDataAtom, {
    promotion_name: "",
    description: "",
    discount_value: 0,
    start_date: null,
    end_date: null,
    is_active: true,
    distributor_id: "",
    batch_product_ids: [],
  });
});
