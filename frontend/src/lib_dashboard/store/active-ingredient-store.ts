// frontend/src/lib_dashboard/store/active-ingredient-store.ts

import { ActiveIngredient } from "@/types/entities";
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
  is_active: boolean;
}

// Filter state
export const activeIngredientsFiltersAtom = atom<ActiveIngredientFilters>({
  search: "",
  status: "",
  hazard_level: "",
  page: 1,
  limit: 10,
});

// ActiveIngredients data state
export const activeIngredientsDataAtom = atom<ActiveIngredient[]>([]);

// Loading state
export const activeIngredientsLoadingAtom = atom<boolean>(false);

// Pagination state
export const activeIngredientsPaginationAtom = atom({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
});

// Selected ingredients for batch actions
export const selectedActiveIngredientsAtom = atom<string[]>([]);

// Derived state for select all checkbox
export const isAllActiveIngredientsSelectedAtom = atom((get) => {
  const ingredients = get(activeIngredientsDataAtom);
  const selectedIngredients = get(selectedActiveIngredientsAtom);
  return (
    ingredients.length > 0 && selectedIngredients.length === ingredients.length
  );
});

// Derived state for indeterminate checkbox
export const isActiveIngredientsIndeterminateAtom = atom((get) => {
  const ingredients = get(activeIngredientsDataAtom);
  const selectedIngredients = get(selectedActiveIngredientsAtom);
  return (
    selectedIngredients.length > 0 &&
    selectedIngredients.length < ingredients.length
  );
});

// Form state for add/edit ingredient
export const activeIngredientsFormDataAtom = atom<ActiveIngredientFormData>({
  ingredient_name: "",
  description: "",
  hazard_level: "LOW",
  is_active: true,
});

// Modal states
export const addActiveIngredientModalAtom = atom<boolean>(false);
export const editActiveIngredientModalAtom = atom<boolean>(false);
export const deleteActiveIngredientModalAtom = atom<boolean>(false);
export const selectedActiveIngredientIdAtom = atom<string>("");

// Reset form data
export const resetActiveIngredientFormAtom = atom(null, (get, set) => {
  set(activeIngredientsFormDataAtom, {
    ingredient_name: "",
    description: "",
    hazard_level: "LOW",
    is_active: true,
  });
});
