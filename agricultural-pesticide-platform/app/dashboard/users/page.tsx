"use client"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/users/user-table"
import { UserFilters } from "@/components/users/user-filters"
import { UserPagination } from "@/components/users/user-pagination"
import { BatchActions } from "@/components/users/batch-actions"
import { UserFormModal } from "@/components/users/user-form-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"
import { Plus, Users, UserCheck, UserX, Download } from "lucide-react"
import { useUsers, useUserForm } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { toast } = useToast()

  const {
    users,
    loading,
    pagination,
    filters,
    selectedUsers,
    fetchUsers,
    updateFilters,
    resetFilters,
    toggleUserSelection,
    toggleSelectAll,
    toggleUserStatus,
    batchToggleStatus,
    batchDeleteUsers,
  } = useUsers()

  const {
    formData,
    updateFormData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUserId,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    createUser,
    updateUser,
    deleteUser,
  } = useUserForm()

  // Filter handlers
  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 })
    },
    [updateFilters],
  )

  const handleRoleChange = useCallback(
    (role: string) => {
      updateFilters({ role: role === "all" ? "" : role, page: 1 })
    },
    [updateFilters],
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({ status: status === "all" ? "" : status, page: 1 })
    },
    [updateFilters],
  )

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
    },
    [updateFilters],
  )

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 })
    },
    [updateFilters],
  )

  // Action handlers
  const handleViewDetails = useCallback(
    (userId: string) => {
      toast({
        title: "Thông báo",
        description: "Tính năng xem chi tiết đang được phát triển",
      })
    },
    [toast],
  )

  const handleEditUser = useCallback(
    (userId: string) => {
      openEditModal(userId)
    },
    [openEditModal],
  )

  const handleDeleteUser = useCallback(
    (userId: string) => {
      openDeleteModal(userId)
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
  const handleCreateUser = useCallback(async () => {
    const success = await createUser()
    if (success) {
      await fetchUsers()
    }
    return success
  }, [createUser, fetchUsers])

  const handleUpdateUser = useCallback(async () => {
    const success = await updateUser()
    if (success) {
      await fetchUsers()
    }
    return success
  }, [updateUser, fetchUsers])

  const handleDeleteUserConfirm = useCallback(async () => {
    const success = await deleteUser()
    if (success) {
      await fetchUsers()
    }
    return success
  }, [deleteUser, fetchUsers])

  // Batch action handlers
  const handleBatchActivate = useCallback(async () => {
    await batchToggleStatus(true)
  }, [batchToggleStatus])

  const handleBatchDeactivate = useCallback(async () => {
    await batchToggleStatus(false)
  }, [batchToggleStatus])

  const handleBatchDelete = useCallback(async () => {
    await batchDeleteUsers()
  }, [batchDeleteUsers])

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = pagination.total
    const activeUsers = users.filter((user) => user.is_active).length
    const inactiveUsers = users.filter((user) => !user.is_active).length

    return { totalUsers, activeUsers, inactiveUsers }
  }, [users, pagination.total])

  // Get selected user name for delete modal
  const selectedUserName = useMemo(() => {
    const user = users.find((u) => u.user_id === selectedUserId)
    return user?.full_name
  }, [users, selectedUserId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">👥 Quản lý người dùng</h1>
          <p className="text-[#74a65d] mt-1">Quản lý thông tin và trạng thái tài khoản người dùng trong hệ thống</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button onClick={openAddModal} className="bg-[#90c577] hover:bg-[#74a65d] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Tổng số người dùng</CardTitle>
            <Users className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.totalUsers}</div>
            <p className="text-xs text-[#74a65d]">Tất cả người dùng trong hệ thống</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đang hoạt động</CardTitle>
            <UserCheck className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.activeUsers}</div>
            <p className="text-xs text-[#74a65d]">Tài khoản có thể đăng nhập</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">Đã bị khóa</CardTitle>
            <UserX className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">{stats.inactiveUsers}</div>
            <p className="text-xs text-[#74a65d]">Tài khoản bị tạm khóa</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <UserFilters
        search={filters.search || ""}
        role={filters.role || "all"}
        status={filters.status || "all"}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onReset={resetFilters}
      />

      {/* Batch Actions */}
      <BatchActions
        selectedCount={selectedUsers.length}
        onBatchActivate={handleBatchActivate}
        onBatchDeactivate={handleBatchDeactivate}
        onBatchDelete={handleBatchDelete}
        loading={loading}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        onSelectUser={toggleUserSelection}
        onSelectAll={toggleSelectAll}
        onToggleStatus={toggleUserStatus}
        onViewDetails={handleViewDetails}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        loading={loading}
      />

      {/* Pagination */}
      <UserPagination
        currentPage={filters.page || 1}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={filters.limit || 10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      <UserFormModal
        open={addModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateUser}
        formData={formData}
        onUpdateFormData={updateFormData}
        title="Thêm người dùng mới"
        submitText="Tạo người dùng"
      />

      <UserFormModal
        open={editModalOpen}
        onClose={closeModals}
        onSubmit={handleUpdateUser}
        formData={formData}
        onUpdateFormData={updateFormData}
        title="Chỉnh sửa thông tin người dùng"
        submitText="Cập nhật"
        isEdit
      />

      <DeleteUserModal
        open={deleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteUserConfirm}
        userName={selectedUserName}
      />
    </div>
  )
}
