"use client";

import { UserFilters } from "@/components/(dashboard)/users/user-filters";
import { UserFormModal } from "@/components/(dashboard)/users/user-form-modal";
import { UserPagination } from "@/components/(dashboard)/users/user-pagination";
import { UserTable } from "@/components/(dashboard)/users/user-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useUserForm, useUsers } from "@/hooks/use-users";
import { showToast } from "@/lib/toast-provider";
import { selectedUserIdAtom } from "@/lib_dashboard/store/user-store";
import { useAtom } from "jotai";
import { Download, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

export default function UsersPage() {
  const {
    users, // Đã lọc và phân trang
    allUsers,
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
  } = useUsers();

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
  } = useUserForm();
  // Filter handlers

  const [userId] = useAtom(selectedUserIdAtom);

  const selectedUser = useMemo(
    () => allUsers.find((user) => user.user_id === userId),
    [allUsers, userId]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 });
    },
    [updateFilters]
  );

  const handleRoleChange = useCallback(
    (role: string) => {
      updateFilters({ role: role === "all" ? "" : role, page: 1 });
    },
    [updateFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      updateFilters({ status: status === "all" ? "" : status, page: 1 });
    },
    [updateFilters]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const handleItemsPerPageChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 });
    },
    [updateFilters]
  );

  // Action handlers
  const handleViewDetails = useCallback((userId: string) => {
    showToast.info("Tính năng xem chi tiết đang được phát triển");
  }, []);

  const handleEditUser = useCallback(
    (userId: string) => {
      console.log("userId", userId);
      openEditModal(userId);
    },
    [openEditModal]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      openDeleteModal(userId);
    },
    [openDeleteModal]
  );

  const handleExport = useCallback(() => {
    showToast.info("Tính năng xuất dữ liệu đang được phát triển");
  }, []);

  // Form handlers
  const handleCreateUser = useCallback(async () => {
    const success = await createUser();
    if (success) {
      await fetchUsers();
    }
    closeModals();
    return success;
  }, [createUser, fetchUsers]);

  const handleUpdateUser = useCallback(async () => {
    const success = await updateUser();
    if (success) {
      await fetchUsers();
    }
    closeModals();
    return success;
  }, [updateUser, fetchUsers]);

  const handleDeleteUserConfirm = useCallback(async () => {
    const success = await deleteUser();
    if (success) {
      await fetchUsers();
    }
    closeModals();
    return success;
  }, [deleteUser, fetchUsers]);

  // Batch action handlers
  const handleBatchActivate = useCallback(async () => {
    await batchToggleStatus(true);
  }, [batchToggleStatus]);

  const handleBatchDeactivate = useCallback(async () => {
    await batchToggleStatus(false);
  }, [batchToggleStatus]);

  const handleBatchDelete = useCallback(async () => {
    await batchDeleteUsers();
  }, [batchDeleteUsers]);

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((user) => user.is_active).length;
    const inactiveUsers = allUsers.filter((user) => !user.is_active).length;

    return { totalUsers, activeUsers, inactiveUsers };
  }, [allUsers, pagination.total]);

  // Get selected user name for delete modal
  const selectedUserName = useMemo(() => {
    const user = allUsers.find((u) => u.user_id === selectedUserId);
    return user?.full_name;
  }, [allUsers, selectedUserId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            👥 Quản lý người dùng
          </h1>
          <p className="text-[#74a65d] mt-1">
            Quản lý thông tin và trạng thái tài khoản người dùng trong hệ thống
          </p>
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
          <Button
            onClick={openAddModal}
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        stats={{
          total: stats.totalUsers,
          active: stats.activeUsers,
          inactive: stats.inactiveUsers,
        }}
        title="người dùng"
      />

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
        title="người dùng"
      />

      {/* Users Table */}
      <UserTable
        users={users} // Đã lọc và phân trang
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

      <DeleteModal
        open={deleteModalOpen}
        handleConfirm={handleDeleteUserConfirm}
        setOpen={closeModals}
        title="Xoá người dùng"
        nameDelete={selectedUserName}
      />
    </div>
  );
}
