"use client"

import { useCallback, useEffect } from "react"
import { useAtom } from "jotai"
import {
  userFiltersAtom,
  selectedUsersAtom,
  usersDataAtom,
  usersLoadingAtom,
  usersPaginationAtom,
  userFormDataAtom,
  addUserModalAtom,
  editUserModalAtom,
  deleteUserModalAtom,
  selectedUserIdAtom,
  resetUserFormAtom,
} from "@/lib/store/user-store"
import { UserService } from "@/lib/services/user-service"
import { useToast } from "@/hooks/use-toast"

export const useUsers = () => {
  const { toast } = useToast()

  const [filters, setFilters] = useAtom(userFiltersAtom)
  const [selectedUsers, setSelectedUsers] = useAtom(selectedUsersAtom)
  const [users, setUsers] = useAtom(usersDataAtom)
  const [loading, setLoading] = useAtom(usersLoadingAtom)
  const [pagination, setPagination] = useAtom(usersPaginationAtom)

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await UserService.getUsers(filters)
      setUsers(response.data)
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, setUsers, setPagination, setLoading, toast])

  // Auto-fetch when filters change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filter operations
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
      setSelectedUsers([])
    },
    [setFilters, setSelectedUsers],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      role: "",
      status: "",
      page: 1,
      limit: filters.limit,
    })
    setSelectedUsers([])
  }, [setFilters, setSelectedUsers, filters.limit])

  // Selection operations
  const toggleUserSelection = useCallback(
    (userId: string) => {
      setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    },
    [setSelectedUsers],
  )

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedUsers(checked ? users.map((user) => user.user_id) : [])
    },
    [setSelectedUsers, users],
  )

  const clearSelection = useCallback(() => {
    setSelectedUsers([])
  }, [setSelectedUsers])

  // Status operations
  const toggleUserStatus = useCallback(
    async (userId: string) => {
      try {
        await UserService.toggleUserStatus(userId)
        await fetchUsers()
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái người dùng",
        })
      } catch (error) {
        toast({
          title: "Lỗi",
          description: error instanceof Error ? error.message : "Không thể cập nhật trạng thái",
          variant: "destructive",
        })
      }
    },
    [fetchUsers, toast],
  )

  const batchToggleStatus = useCallback(
    async (status: boolean) => {
      try {
        await UserService.batchToggleStatus(selectedUsers, status)
        await fetchUsers()
        clearSelection()
        toast({
          title: "Thành công",
          description: `Đã ${status ? "mở khóa" : "khóa"} ${selectedUsers.length} tài khoản`,
        })
      } catch (error) {
        toast({
          title: "Lỗi",
          description: error instanceof Error ? error.message : "Không thể cập nhật trạng thái hàng loạt",
          variant: "destructive",
        })
      }
    },
    [selectedUsers, fetchUsers, clearSelection, toast],
  )

  const batchDeleteUsers = useCallback(async () => {
    try {
      await UserService.batchDeleteUsers(selectedUsers)
      await fetchUsers()
      clearSelection()
      toast({
        title: "Thành công",
        description: `Đã xóa ${selectedUsers.length} người dùng`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa người dùng hàng loạt",
        variant: "destructive",
      })
    }
  }, [selectedUsers, fetchUsers, clearSelection, toast])

  return {
    // Data
    users,
    loading,
    pagination,
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
  }
}

export const useUserForm = () => {
  const { toast } = useToast()

  const [formData, setFormData] = useAtom(userFormDataAtom)
  const [addModalOpen, setAddModalOpen] = useAtom(addUserModalAtom)
  const [editModalOpen, setEditModalOpen] = useAtom(editUserModalAtom)
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteUserModalAtom)
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom)
  const [, resetForm] = useAtom(resetUserFormAtom)

  const updateFormData = useCallback(
    (data: Partial<typeof formData>) => {
      setFormData((prev) => ({ ...prev, ...data }))
    },
    [setFormData],
  )

  const openAddModal = useCallback(() => {
    resetForm()
    setAddModalOpen(true)
  }, [resetForm, setAddModalOpen])

  const openEditModal = useCallback(
    async (userId: string) => {
      try {
        const user = await UserService.getUserById(userId)
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
          })
          setEditModalOpen(true)
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng",
          variant: "destructive",
        })
      }
    },
    [setFormData, setEditModalOpen, toast],
  )

  const openDeleteModal = useCallback(
    (userId: string) => {
      setSelectedUserId(userId)
      setDeleteModalOpen(true)
    },
    [setSelectedUserId, setDeleteModalOpen],
  )

  const closeModals = useCallback(() => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedUserId("")
    resetForm()
  }, [setAddModalOpen, setEditModalOpen, setDeleteModalOpen, setSelectedUserId, resetForm])

  const createUser = useCallback(async () => {
    try {
      await UserService.createUser({
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        role_name: "CUSTOMER", // Always create as customer
        cccd: formData.cccd,
        password: formData.password || "",
      })

      toast({
        title: "Thành công",
        description: "Đã tạo người dùng mới",
      })

      closeModals()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo người dùng",
        variant: "destructive",
      })
      return false
    }
  }, [formData, toast, closeModals])

  const updateUser = useCallback(async () => {
    if (!formData.user_id) return false

    try {
      await UserService.updateUser({
        user_id: formData.user_id,
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        role_name: formData.role_name,
        cccd: formData.cccd,
        is_active: formData.is_active,
      })

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin người dùng",
      })

      closeModals()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật người dùng",
        variant: "destructive",
      })
      return false
    }
  }, [formData, toast, closeModals])

  const deleteUser = useCallback(async () => {
    if (!selectedUserId) return false

    try {
      await UserService.deleteUser(selectedUserId)

      toast({
        title: "Thành công",
        description: "Đã xóa người dùng",
      })

      closeModals()
      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa người dùng",
        variant: "destructive",
      })
      return false
    }
  }, [selectedUserId, toast, closeModals])

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
  }
}
