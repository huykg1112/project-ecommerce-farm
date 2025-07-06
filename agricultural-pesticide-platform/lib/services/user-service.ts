import { userAPI, type UserFilters, type CreateUserRequest, type UpdateUserRequest } from "@/lib/mock/server"
import type { User } from "@/types/entities"

export class UserService {
  static async getUsers(filters: UserFilters) {
    try {
      return await userAPI.getUsers(filters)
    } catch (error) {
      throw new Error("Không thể tải danh sách người dùng")
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      return await userAPI.getUserById(userId)
    } catch (error) {
      throw new Error("Không thể tải thông tin người dùng")
    }
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Always create users as CUSTOMER role
      const userDataWithCustomerRole = {
        ...userData,
        role_name: "CUSTOMER" as const,
      }
      return await userAPI.createUser(userDataWithCustomerRole)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể tạo người dùng mới")
    }
  }

  static async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      return await userAPI.updateUser(userData)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể cập nhật thông tin người dùng")
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      return await userAPI.deleteUser(userId)
    } catch (error) {
      throw new Error("Không thể xóa người dùng")
    }
  }

  static async toggleUserStatus(userId: string): Promise<User> {
    try {
      return await userAPI.toggleUserStatus(userId)
    } catch (error) {
      throw new Error("Không thể cập nhật trạng thái người dùng")
    }
  }

  static async batchToggleStatus(userIds: string[], status: boolean): Promise<User[]> {
    try {
      return await userAPI.batchToggleStatus(userIds, status)
    } catch (error) {
      throw new Error("Không thể cập nhật trạng thái hàng loạt")
    }
  }

  static async batchDeleteUsers(userIds: string[]): Promise<boolean> {
    try {
      return await userAPI.batchDeleteUsers(userIds)
    } catch (error) {
      throw new Error("Không thể xóa người dùng hàng loạt")
    }
  }
}
