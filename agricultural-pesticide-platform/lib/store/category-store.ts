import { atom } from "jotai"
import type { Category } from "@/types/entities"

export interface CategoryFilters {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface CategoryFormData {
  category_id?: string
  category_name: string
  description: string
  category_img?: string
  is_active: boolean
}

// Filter state
export const categoryFiltersAtom = atom<CategoryFilters>({
  search: "",
  status: "",
  page: 1,
  limit: 10,
})

// Categories data state
export const categoriesDataAtom = atom<Category[]>([])

// Loading state
export const categoriesLoadingAtom = atom<boolean>(false)

// Pagination state
export const categoriesPaginationAtom = atom({
  total: 0,
  totalPages: 0,
})

// Form state for add/edit category
export const categoryFormDataAtom = atom<CategoryFormData>({
  category_name: "",
  description: "",
  category_img: "",
  is_active: true,
})

// Modal states
export const addCategoryModalAtom = atom<boolean>(false)
export const editCategoryModalAtom = atom<boolean>(false)
export const deleteCategoryModalAtom = atom<boolean>(false)
export const selectedCategoryIdAtom = atom<string>("")

// Reset form data
export const resetCategoryFormAtom = atom(null, (get, set) => {
  set(categoryFormDataAtom, {
    category_name: "",
    description: "",
    category_img: "",
    is_active: true,
  })
})
