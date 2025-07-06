"use client"

import { useAtom } from "jotai"
import {
  categoryFiltersAtom,
  categoriesDataAtom,
  categoriesLoadingAtom,
  categoryFormDataAtom,
  addCategoryModalAtom,
  editCategoryModalAtom,
  deleteCategoryModalAtom,
  selectedCategoryIdAtom,
  resetCategoryFormAtom,
  type CategoryFormData,
} from "@/lib/store/category-store"
import { categoryService } from "@/lib/services/category-service"

export function useCategories() {
  const [filters, setFilters] = useAtom(categoryFiltersAtom)
  const [, setCategories] = useAtom(categoriesDataAtom)
  const [, setLoading] = useAtom(categoriesLoadingAtom)
  const [, resetForm] = useAtom(resetCategoryFormAtom)

  // modal atoms
  const [, setAddOpen] = useAtom(addCategoryModalAtom)
  const [, setEditOpen] = useAtom(editCategoryModalAtom)
  const [, setDeleteOpen] = useAtom(deleteCategoryModalAtom)
  const [, setSelectedId] = useAtom(selectedCategoryIdAtom)
  const [, setFormData] = useAtom(categoryFormDataAtom)

  async function fetchList() {
    setLoading(true)
    const list = await categoryService.list(filters)
    setCategories(list)
    setLoading(false)
  }

  async function addCategory(data: CategoryFormData) {
    await categoryService.create(data)
    await fetchList()
  }

  async function editCategory(id: string, data: CategoryFormData) {
    await categoryService.update(id, data)
    await fetchList()
  }

  async function deleteCategory(id: string) {
    await categoryService.remove(id)
    await fetchList()
  }

  async function toggleStatus(id: string) {
    await categoryService.toggle(id)
    await fetchList()
  }

  /* ----- helpers for opening / closing modals ----- */
  function openAddModal() {
    resetForm()
    setAddOpen(true)
  }

  function openEditModal(catId: string, catData: CategoryFormData) {
    setSelectedId(catId)
    setFormData(catData)
    setEditOpen(true)
  }

  function openDeleteModal(catId: string) {
    setSelectedId(catId)
    setDeleteOpen(true)
  }

  return {
    filters,
    setFilters,
    fetchList,
    addCategory,
    editCategory,
    deleteCategory,
    toggleStatus,
    openAddModal,
    openEditModal,
    openDeleteModal,
  }
}
