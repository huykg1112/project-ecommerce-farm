import { userAPI } from "@/lib/mock/server"
import type {
  UserStatisticsFilters,
  UserStatisticsData,
  RegistrationData,
  RoleDistribution,
} from "@/lib/store/user-statistics-store"
import type { User } from "@/types/entities"

export class UserStatisticsService {
  static async getUserStatistics(filters: UserStatisticsFilters): Promise<UserStatisticsData> {
    try {
      // Get all users for statistics calculation
      const allUsersResponse = await userAPI.getUsers({ limit: 1000 })
      const allUsers = allUsersResponse.data

      // Filter users based on criteria
      let filteredUsers = [...allUsers]

      // Apply role filter
      if (filters.role !== "all") {
        filteredUsers = filteredUsers.filter((user) => user.role.role_name === filters.role)
      }

      // Apply status filter
      if (filters.status !== "all") {
        const isActive = filters.status === "active"
        filteredUsers = filteredUsers.filter((user) => user.is_active === isActive)
      }

      // Apply date range filter
      if (filters.startDate && filters.endDate) {
        filteredUsers = filteredUsers.filter((user) => {
          const userDate = new Date(user.created_at)
          return userDate >= filters.startDate! && userDate <= filters.endDate!
        })
      }

      // Generate registration trends data
      const registrationTrends = this.generateRegistrationTrends(allUsers, filters)

      // Generate role distribution data
      const roleDistribution = this.generateRoleDistribution(allUsers)

      // Calculate summary statistics
      const totalUsers = allUsers.length
      const activeUsers = allUsers.filter((user) => user.is_active).length
      const inactiveUsers = totalUsers - activeUsers

      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const newUsersThisMonth = allUsers.filter((user) => {
        const userDate = new Date(user.created_at)
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear
      }).length

      const newUsersThisYear = allUsers.filter((user) => {
        const userDate = new Date(user.created_at)
        return userDate.getFullYear() === currentYear
      }).length

      return {
        registrationTrends,
        roleDistribution,
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsersThisMonth,
        newUsersThisYear,
        filteredUsers,
      }
    } catch (error) {
      throw new Error("Không thể tải thống kê người dùng")
    }
  }

  private static generateRegistrationTrends(users: User[], filters: UserStatisticsFilters): RegistrationData[] {
    const trends: RegistrationData[] = []
    const currentDate = new Date()

    if (filters.timeRange === "month") {
      // Generate data for last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const monthName = date.toLocaleDateString("vi-VN", { month: "short", year: "numeric" })

        const monthUsers = users.filter((user) => {
          const userDate = new Date(user.created_at)
          return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear()
        })

        const customers = monthUsers.filter((user) => user.role.role_name === "CUSTOMER").length
        const distributors = monthUsers.filter((user) => user.role.role_name === "DISTRIBUTOR").length

        trends.push({
          period: monthName,
          customers,
          distributors,
          total: customers + distributors,
        })
      }
    } else if (filters.timeRange === "year") {
      // Generate data for last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = currentDate.getFullYear() - i

        const yearUsers = users.filter((user) => {
          const userDate = new Date(user.created_at)
          return userDate.getFullYear() === year
        })

        const customers = yearUsers.filter((user) => user.role.role_name === "CUSTOMER").length
        const distributors = yearUsers.filter((user) => user.role.role_name === "DISTRIBUTOR").length

        trends.push({
          period: year.toString(),
          customers,
          distributors,
          total: customers + distributors,
        })
      }
    } else if (filters.timeRange === "custom" && filters.startDate && filters.endDate) {
      // Generate monthly data for custom range
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)

      const current = new Date(start.getFullYear(), start.getMonth(), 1)

      while (current <= end) {
        const monthName = current.toLocaleDateString("vi-VN", { month: "short", year: "numeric" })

        const monthUsers = users.filter((user) => {
          const userDate = new Date(user.created_at)
          return userDate.getMonth() === current.getMonth() && userDate.getFullYear() === current.getFullYear()
        })

        const customers = monthUsers.filter((user) => user.role.role_name === "CUSTOMER").length
        const distributors = monthUsers.filter((user) => user.role.role_name === "DISTRIBUTOR").length

        trends.push({
          period: monthName,
          customers,
          distributors,
          total: customers + distributors,
        })

        current.setMonth(current.getMonth() + 1)
      }
    }

    return trends
  }

  private static generateRoleDistribution(users: User[]): RoleDistribution[] {
    const customers = users.filter((user) => user.role.role_name === "CUSTOMER").length
    const distributors = users.filter((user) => user.role.role_name === "DISTRIBUTOR").length
    const admins = users.filter((user) => user.role.role_name === "ADMIN").length
    const total = users.length

    return [
      {
        name: "Khách hàng",
        value: customers,
        percentage: total > 0 ? (customers / total) * 100 : 0,
        fill: "#90c577",
      },
      {
        name: "Đại lý",
        value: distributors,
        percentage: total > 0 ? (distributors / total) * 100 : 0,
        fill: "#74a65d",
      },
      {
        name: "Quản trị viên",
        value: admins,
        percentage: total > 0 ? (admins / total) * 100 : 0,
        fill: "#599146",
      },
    ].filter((item) => item.value > 0)
  }
}
