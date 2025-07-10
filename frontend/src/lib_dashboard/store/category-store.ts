import { atom } from "jotai";
import { Category } from "../types/category";

export interface CategoryFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CategoryFormData {
  id?: string; // Sẽ map từ backend 'id'
  name: string; // Sẽ map từ backend 'name'
  description: string;
  image?: string; // Sẽ map từ backend 'image'
  isActive: boolean; // Sẽ map từ backend 'isActive'
}

// Filter state
export const categoryFiltersAtom = atom<CategoryFilters>({
  search: "",
  status: "",
  page: 1,
  limit: 10,
});

// Categories data state
export const categoriesDataAtom = atom<Category[]>([]);

// Loading state
export const categoriesLoadingAtom = atom<boolean>(false);

// Pagination state
export const categoriesPaginationAtom = atom({
  total: 0,
  totalPages: 0,
});

// Selected categories for batch actions
export const selectedCategoriesAtom = atom<string[]>([]);

// Derived state for select all checkbox
export const isAllSelectedAtom = atom((get) => {
  const categories = get(categoriesDataAtom);
  const selectedCategories = get(selectedCategoriesAtom);
  return (
    categories.length > 0 && selectedCategories.length === categories.length
  );
});

// Derived state for indeterminate checkbox
export const isIndeterminateAtom = atom((get) => {
  const categories = get(categoriesDataAtom);
  const selectedCategories = get(selectedCategoriesAtom);
  return (
    selectedCategories.length > 0 &&
    selectedCategories.length < categories.length
  );
});

// Form state for add/edit category
export const categoryFormDataAtom = atom<CategoryFormData>({
  name: "",
  description: "",
  image: "",
  isActive: true,
});

// Modal states
export const addCategoryModalAtom = atom<boolean>(false);
export const editCategoryModalAtom = atom<boolean>(false);
export const deleteCategoryModalAtom = atom<boolean>(false);
export const selectedCategoryIdAtom = atom<string>("");

// Reset form data
export const resetCategoryFormAtom = atom(null, (get, set) => {
  set(categoryFormDataAtom, {
    name: "",
    description: "",
    image: "",
    isActive: true,
  });
});
