"use client";

import { showToast } from "@/lib/toast-provider";
import { userServiceManagement } from "@/lib_dashboard/services/user-service-management";
import {
  addUserModalAtom,
  allUsersDataAtom,
  deleteUserModalAtom,
  editUserModalAtom,
  resetUserFormAtom,
  selectedUserIdAtom,
  selectedUsersAtom,
  userFiltersAtom,
  userFormDataAtom,
  usersLoadingAtom,
} from "@/lib_dashboard/store/user-store";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useUsers = () => {
  const [filters, setFilters] = useAtom(userFiltersAtom);
  const [selectedUsers, setSelectedUsers] = useAtom(selectedUsersAtom);
  const [allUsers, setAllUsers] = useAtom(allUsersDataAtom);
  const [loading, setLoading] = useAtom(usersLoadingAtom);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userServiceManagement.getUsers();
      setAllUsers(response.items || response); // tùy API trả về
    } catch (error) {
      showToast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [setAllUsers, setLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on filters
  const filteredUsers = allUsers.filter((u) => {
    // Search
    const searchLower = filters.search?.toLowerCase() || "";
    const matchesSearch =
      !searchLower ||
      u.username?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.full_name?.toLowerCase().includes(searchLower) ||
      u.phone_number?.toLowerCase().includes(searchLower);
    // Role
    const matchesRole = !filters.role || u.role.role_name === filters.role;
    // Status
    const matchesStatus =
      !filters.status ||
      (filters.status === "active" && u.is_active) ||
      (filters.status === "inactive" && !u.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const start = (filters.page - 1) * filters.limit;
  const end = start + filters.limit;
  const paginatedUsers = filteredUsers.slice(start, end);

  // Filter operations (chỉ update state, không gọi API)
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setSelectedUsers([]);
    },

    [setFilters, setSelectedUsers]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      role: "",
      status: "",
      page: 1,
      limit: filters.limit,
    });
    setSelectedUsers([]);
  }, [setFilters, setSelectedUsers, filters.limit]);

  // Selection operations
  const toggleUserSelection = useCallback(
    (userId: string) => {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    },
    [setSelectedUsers]
  );

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedUsers(
        checked ? paginatedUsers.map((user) => user.user_id) : []
      );
    },
    [setSelectedUsers, paginatedUsers]
  );

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, [setSelectedUsers]);

  // Status operations
  const toggleUserStatus = useCallback(
    async (userId: string) => {
      try {
        await userServiceManagement.updateUserStatus(userId);
        await fetchUsers();
        showToast.success("Cập nhật trạng thái người dùng thành công");
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái");
      }
    },
    [fetchUsers]
  );

  const batchToggleStatus = useCallback(
    async (status: boolean) => {
      try {
        // Gọi API từng user (nếu BE không có batch)
        await Promise.all(
          selectedUsers.map((id) => userServiceManagement.updateUserStatus(id))
        );
        showToast.success("Cập nhật trạng thái người dùng thành công");
        await fetchUsers();
        clearSelection();
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái hàng loạt");
      }
    },
    [selectedUsers, fetchUsers, clearSelection]
  );

  const batchDeleteUsers = useCallback(async () => {
    try {
      await Promise.all(
        selectedUsers.map((id) => userServiceManagement.deleteUser(id))
      );
      showToast.success("Xóa người dùng thành công");
      clearSelection();
      await fetchUsers();
    } catch (error) {
      showToast.error("Không thể xóa người dùng hàng loạt");
    }
  }, [selectedUsers, fetchUsers, clearSelection]);

  return {
    // Data
    users: paginatedUsers, // trả về users đã lọc và phân trang
    allUsers,
    loading,
    pagination: {
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / filters.limit),
      page: filters.page,
      limit: filters.limit,
    },
    filters,
    selectedUsers,

    // Operations
    fetchUsers,
    updateFilters,
    resetFilters,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    toggleUserStatus,
    batchToggleStatus,
    batchDeleteUsers,
  };
};

export const useUserForm = () => {
  const [formData, setFormData] = useAtom(userFormDataAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addUserModalAtom);
  const [editModalOpen, setEditModalOpen] = useAtom(editUserModalAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteUserModalAtom);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);
  const [, resetForm] = useAtom(resetUserFormAtom);

  const updateFormData = useCallback(
    (data: Partial<typeof formData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [setFormData]
  );

  const openAddModal = useCallback(() => {
    resetForm();
    setAddModalOpen(true);
  }, [resetForm, setAddModalOpen]);

  const openEditModal = useCallback(
    async (userId: string) => {
      try {
        console.log("userId", userId);
        const user = await userServiceManagement.getUserById(userId);
        if (user) {
          setFormData({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            role_name: user.role.role_name,
            cccd: user.cccd || "",
            is_active: user.is_active,
          });
          setEditModalOpen(true);
          // console.log("formData", formData);
        }
      } catch (error) {
        showToast.error("Không thể tải thông tin người dùng");
      }
    },
    [setFormData, setEditModalOpen]
  );

  const openDeleteModal = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);
      setDeleteModalOpen(true);
    },
    [setSelectedUserId, setDeleteModalOpen]
  );

  const closeModals = useCallback(() => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUserId("");
    resetForm();
  }, [
    setAddModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setSelectedUserId,
    resetForm,
  ]);

  const createUser = useCallback(async () => {
    try {
      const response = await userServiceManagement.createUser({
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        cccd: formData.cccd,
        password: formData.password || "",
      });
      showToast.success("Tạo người dùng thành công");
      closeModals();
      return true;
    } catch (error) {
      return false;
    }
  }, [formData, closeModals]);

  const updateUser = useCallback(async () => {
    if (!formData.user_id) return false;
    console.log("Updating user with data:", formData);

    try {
      await userServiceManagement.updateUser(formData.user_id, {
        user_id: formData.user_id,
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        role_name: formData.role_name,
        cccd: formData.cccd,
        is_active: formData.is_active,
      });

      showToast.success("Cập nhật thông tin người dùng thành công");

      closeModals();
      return true;
    } catch (error) {
      return false;
    }
  }, [formData, closeModals]);

  const deleteUser = useCallback(async () => {
    if (!selectedUserId) return false;

    try {
      await userServiceManagement.deleteUser(selectedUserId);

      showToast.success("Xóa người dùng thành công");

      closeModals();
      return true;
    } catch (error) {
      return false;
    }
  }, [selectedUserId, closeModals]);

  return {
    // Form data
    formData,
    updateFormData,

    // Modal states
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUserId,

    // Modal operations
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,

    // CRUD operations
    createUser,
    updateUser,
    deleteUser,
  };
};
