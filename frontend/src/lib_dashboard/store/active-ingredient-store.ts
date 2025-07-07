// frontend/src/lib_dashboard/store/active-ingredient-store.ts

import { ActiveIngredient, Pagination } from "@/types/entities";
import { atom } from "jotai";

export interface ActiveIngredientFilters {
  search?: string;
  status?: string;
  hazard_level?: string;
  page?: number;
  limit?: number;
}
export interface ActiveIngredientFormData {
  ingredient_id?: string;
  ingredient_name: string;
  description: string;
  hazard_level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  chemical_formula?: string;
  cas_number?: string;
  is_active: boolean;
}

export const activeIngredientsFiltersAtom = atom<ActiveIngredientFilters>({
  search: "",
  status: "",
  hazard_level: "",
  page: 1,
  limit: 10,
});

export const activeIngredientsDataAtom = atom<ActiveIngredient[]>([]);

export const activeIngredientsLoadingAtom = atom<boolean>(false);

export const activeIngredientsPaginationAtom = atom<Pagination>({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
});

export const activeIngredientsFormDataAtom = atom<ActiveIngredientFormData>({
  ingredient_name: "",
  description: "",
  hazard_level: "LOW",
  chemical_formula: "",
  cas_number: "",
  is_active: true,
});

export const addActiveIngredientModalAtom = atom<boolean>(false);
export const editActiveIngredientModalAtom = atom<boolean>(false);
export const deleteActiveIngredientModalAtom = atom<boolean>(false);
export const selectedActiveIngredientIdAtom = atom<string>("");

export const resetActiveIngredientFormAtom = atom(null, (get, set) => {
  set(activeIngredientsFormDataAtom, {
    ingredient_name: "",
    description: "",
    hazard_level: "LOW",
    chemical_formula: "",
    cas_number: "",
    is_active: true,
  });
});
