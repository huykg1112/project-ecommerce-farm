"use client"

import { useMemo } from "react"

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryTable } from "@/components/categories/category-table"
import { CategoryFilters } from "@/components/categories/category-filters"
import { CategoryPagination } from "@/components/categories/category-pagination"
import { CategoryFormModal } from "@/components/categories/category-form-modal"
import { DeleteCategoryModal } from "@/components/categories/delete-category-modal"
import { Plus, Package, Eye, EyeOff } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useToast } from "@/hooks/use-toast"
import { useAtomValue } from "jotai"
import {
  categoriesDataAtom,
  categoriesPaginationAtom,
  categoryFormDataAtom,
  addCategoryModalAtom,
  editCategoryModalAtom,
} from "@/lib/store/category-store"

export default function CategoriesPage() {
  const { toast } = useToast()

  const { fetchList, addCategory, editCategory, toggleStatus, openAddModal, openEditModal, openDeleteModal } =
    useCategories()

  const categories = useAtomValue(categoriesDataAtom)
  const pagination = useAtomValue(categoriesPaginationAtom)
  const formData = useAtomValue(categoryFormDataAtom)
  const addOpen = useAtomValue(addCategoryModalAtom)
  const editOpen = useAtomValue(editCategoryModalAtom)

  /* initial load */
  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter handlers
  const handleSearchChange = useCallback((search: string) => {
    // Update filters logic here if needed
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    // Update filters logic here if needed
  }, [])

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    // Update pagination logic here if needed
  }, [])

  const handleItemsPerPageChange = useCallback((limit: number) => {
    // Update pagination logic here if needed
  }, [])

  // Action handlers
  const handleEditCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find((c) => c.category_id === categoryId)
      if (cat)
        openEditModal(categoryId, {
          category_name: cat.category_name,
          description: cat.description,
          category_img: cat.category_img,
          is_active: cat.is_active,
        })
    },
    [categories, openEditModal],
  )

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      openDeleteModal(categoryId)
    },
    [openDeleteModal],
  )

  const handleExport = useCallback(() => {
    toast({
      title: "Thông báo",
      description: "Tính năng xuất dữ liệu đang được phát triển",
    })
  }, [toast])

  // Form handlers
  const handleCreateCategory = useCallback(async () => {
    await addCategory(formData)
    return true
  }, [addCategory, formData])

  const handleUpdateCategory = useCallback(async () => {
    if (!formData.category_id) return false
    await editCategory(formData.category_id, formData)
    return true
  }, [editCategory, formData])

  const handleDeleteCategoryConfirm = useCallback(async () => {
    // Delete category logic here if needed
    return true
  }, [])

  const handleToggleStatus = useCallback(
    async (categoryId: string) => {
      await toggleStatus(categoryId)
    },
    [toggleStatus],
  )

  // Statistics
  const stats = useMemo(() => {
    const totalCategories = pagination.total
    const activeCategories = categories.filter((category) => category.is_active).length
    const inactiveCategories = categories.filter((category) => !category.is_active).length

    return { totalCategories, activeCategories, inactiveCategories }
  }, [categories, pagination.total])

  // Get selected category name for delete modal
  const selectedCategoryName = useMemo(() => {
    // Logic to get selected category name here if needed
    return ""
  }, [])

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý danh mục</h1>
        <Button className="bg-[#90c577] hover:bg-[#74a65d] text-white" onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Tổng số danh mục</CardTitle>
            <Package className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.totalCategories}</div>
            <p className="text-xs text-[#74a65d]">Tất cả danh mục trong hệ thống</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đang hoạt động</CardTitle>
            <Eye className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.activeCategories}</div>
            <p className="text-xs text-[#74a65d]">Danh mục hiển thị công khai</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đã tắt</CardTitle>
            <EyeOff className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.inactiveCategories}</div>
            <p className="text-xs text-[#74a65d]">Danh mục tạm thời ẩn</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <CategoryFilters />

      {/* Table */}
      <CategoryTable
        categories={categories}
        onToggleStatus={handleToggleStatus}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && <CategoryPagination totalPages={pagination.totalPages} />}

      {/* Modals */}
      {/* Add */}
      <CategoryFormModal
        open={addOpen}
        title="Thêm danh mục mới"
        submitText="Tạo mới"
        onClose={() => openAddModal()}
        formData={formData}
        onUpdateFormData={() => {}}
        onSubmit={handleCreateCategory}
      />
      {/* Edit */}
      <CategoryFormModal
        open={editOpen}
        title="Chỉnh sửa danh mục"
        submitText="Lưu thay đổi"
        isEdit
        onClose={() => openEditModal("", formData)}
        formData={formData}
        onUpdateFormData={() => {}}
        onSubmit={handleUpdateCategory}
      />
      {/* Delete confirmation */}
      <DeleteCategoryModal />
    </section>
  )
}
