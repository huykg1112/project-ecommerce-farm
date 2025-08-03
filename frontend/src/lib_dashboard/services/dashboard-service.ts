import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  isSameMonth,
  isSameYear,
  isThisWeek,
  isToday,
  parseISO,
} from "date-fns";
import { BatchProduct } from "../types/batch-product";
import { StoreOwnerRequest } from "../types/store_owner_request";
import { User } from "../types/user";
import { axiosInstance } from "./axios-instance";
import { batchProductService } from "./batch-product-service";
import { orderServiceManagement } from "./order-service-management";
import { userServiceManagement } from "./user-service-management";

export type TimeRange = "day" | "week" | "month" | "year";

// Dashboard statistics interfaces
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDistributors: number;
  activeDistributors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newDistributorsThisMonth: number;
}

export interface RecentActivity {
  id: string;
  type: "user_registration" | "distributor_request" | "order" | "product";
  title: string;
  description: string;
  timestamp: Date;
  user?: User;
  status?: string;
}

export interface WarningAlert {
  id: string;
  type: "expiring_soon" | "low_stock";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  count: number;
  items: BatchProduct[];
}

export interface RevenueChartData {
  period: string;
  revenue: number;
}

export interface UserDistributionData {
  name: string;
  value: number;
  fill: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  warnings: WarningAlert[];
  revenueData: RevenueChartData[];
  userDistribution: UserDistributionData[];
}

export const dashboardService = {
  // Get dashboard statistics - calculated from real data with time filtering
  async getDashboardStats(
    timeRange: TimeRange = "month"
  ): Promise<DashboardStats> {
    try {
      // Helper function to safely get numeric value
      const getNumericValue = (value: any): number => {
        const num = Number(value);
        return isNaN(num) || !isFinite(num) ? 0 : num;
      };

      // Helper function to filter by time range
      const filterByTimeRange = (items: any[], timeRange: TimeRange) => {
        const now = new Date();
        return items.filter((item: any) => {
          if (!item.created_at) return false;
          const itemDate = parseISO(item.created_at.toString());

          switch (timeRange) {
            case "day":
              return isToday(itemDate);
            case "week":
              return isThisWeek(itemDate);
            case "month":
              return isSameMonth(itemDate, now) && isSameYear(itemDate, now);
            case "year":
              return isSameYear(itemDate, now);
            default:
              return true;
          }
        });
      };

      // Fetch all required data
      const [users, orders] = await Promise.all([
        userServiceManagement.getUsers(),
        orderServiceManagement.getAllOrders(),
      ]);

      const now = new Date();

      // Filter data by time range for new registrations and orders
      const filteredUsers = filterByTimeRange(users, timeRange);
      const filteredOrders = filterByTimeRange(orders, timeRange);

      // Calculate user statistics (total counts are always all-time)
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.is_active).length;

      const distributors = users.filter(
        (u: any) => u.role.role_name === "Distributor"
      );
      const totalDistributors = distributors.length;
      const activeDistributors = distributors.filter(
        (u: any) => u.is_active
      ).length;

      // Calculate new users in selected time range
      const newUsersThisMonth = filteredUsers.length;

      // Calculate new distributors in selected time range
      const newDistributorsThisMonth = filteredUsers.filter(
        (u: any) => u.role.role_name === "Distributor"
      ).length;

      // Calculate order and revenue statistics from filtered orders in time range
      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + getNumericValue(order.total_amount),
        0
      );

      // Calculate total products from all order details (not time filtered for products count)
      const productIds = new Set<string>();
      orders.forEach((order) => {
        if (order.order_details) {
          order.order_details.forEach((detail) => {
            if (detail.batch_product?.product?.product_id) {
              productIds.add(detail.batch_product.product.product_id);
            }
          });
        }
      });
      const totalProducts = productIds.size;

      return {
        totalUsers,
        activeUsers,
        totalDistributors,
        activeDistributors,
        totalProducts,
        totalOrders,
        totalRevenue,
        newUsersThisMonth,
        newDistributorsThisMonth,
      };
    } catch (error) {
      let msg = "Lỗi khi tính toán thống kê dashboard";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      console.error(msg, error);
      // Return default values instead of throwing to prevent dashboard crash
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalDistributors: 0,
        activeDistributors: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        newUsersThisMonth: 0,
        newDistributorsThisMonth: 0,
      };
    }
  },

  // Get recent users (for activity feed)
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    try {
      const response = await axiosInstance.get("/user/findAll", {
        params: { limit, sort: "created_at", order: "DESC" },
      });
      return response.data.slice(0, limit);
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách người dùng mới";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      console.error(msg, error);
      return [];
    }
  },

  // Get recent store owner requests (for activity feed)
  async getRecentStoreOwnerRequests(
    limit: number = 10
  ): Promise<StoreOwnerRequest[]> {
    try {
      const response = await axiosInstance.get("/store-owner-request", {
        params: { limit, sort: "created_at", order: "DESC" },
      });
      return response.data.slice(0, limit);
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách yêu cầu đại lý mới";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      console.error(msg, error);
      return [];
    }
  },

  // Get complete dashboard data
  async getDashboardData(
    timeRange: TimeRange = "month"
  ): Promise<DashboardData> {
    try {
      const [
        stats,
        recentUsers,
        recentRequests,
        expiringSoonBatches,
        lowStockBatches,
      ] = await Promise.allSettled([
        this.getDashboardStats(timeRange),
        this.getRecentUsers(10),
        this.getRecentStoreOwnerRequests(10),
        batchProductService.getExpiringSoonBatches(),
        batchProductService.getLowStockBatches(),
      ]);

      // Get orders for chart calculations
      const orders = await orderServiceManagement.getAllOrders();
      const users = await userServiceManagement.getUsers();

      // Helper function to safely get numeric value
      const getNumericValue = (value: any): number => {
        const num = Number(value);
        return isNaN(num) || !isFinite(num) ? 0 : num;
      };

      // Helper function to generate revenue chart data
      const generateRevenueChartData = (
        orders: any[],
        timeRange: TimeRange
      ): RevenueChartData[] => {
        const now = new Date();
        const result: RevenueChartData[] = [];

        if (timeRange === "day") {
          // 10 periods within today (every 2.4 hours)
          const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const hoursPerPeriod = 24 / 10; // 2.4 hours per period

          for (let i = 0; i < 10; i++) {
            const periodStart = new Date(
              startOfToday.getTime() + i * hoursPerPeriod * 60 * 60 * 1000
            );
            const periodEnd = new Date(
              startOfToday.getTime() + (i + 1) * hoursPerPeriod * 60 * 60 * 1000
            );

            const periodOrders = orders.filter((order) => {
              const orderDate = parseISO(order.created_at.toString());
              return orderDate >= periodStart && orderDate < periodEnd;
            });

            const revenue =
              periodOrders.reduce(
                (sum, order) => sum + getNumericValue(order.total_amount),
                0
              ) / 1000000; // Convert to millions

            result.push({
              period: `${periodStart.getHours()}:00`,
              revenue: isNaN(revenue) ? 0 : revenue,
            });
          }
        } else if (timeRange === "week") {
          // 10 periods within this week (every 16.8 hours ≈ 0.7 days)
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
          startOfWeek.setHours(0, 0, 0, 0);
          const hoursPerPeriod = (7 * 24) / 10; // 16.8 hours per period

          for (let i = 0; i < 10; i++) {
            const periodStart = new Date(
              startOfWeek.getTime() + i * hoursPerPeriod * 60 * 60 * 1000
            );
            const periodEnd = new Date(
              startOfWeek.getTime() + (i + 1) * hoursPerPeriod * 60 * 60 * 1000
            );

            const periodOrders = orders.filter((order) => {
              const orderDate = parseISO(order.created_at.toString());
              return orderDate >= periodStart && orderDate < periodEnd;
            });

            const revenue =
              periodOrders.reduce(
                (sum, order) => sum + getNumericValue(order.total_amount),
                0
              ) / 1000000;

            result.push({
              period: `${periodStart.getDate()}/${periodStart.getMonth() + 1}`,
              revenue: isNaN(revenue) ? 0 : revenue,
            });
          }
        } else if (timeRange === "month") {
          // 10 periods within this month
          const year = now.getFullYear();
          const month = now.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysPerPeriod = daysInMonth / 10;

          for (let i = 0; i < 10; i++) {
            const periodStart = new Date(
              year,
              month,
              Math.floor(1 + i * daysPerPeriod)
            );
            const periodEnd = new Date(
              year,
              month,
              Math.floor(1 + (i + 1) * daysPerPeriod)
            );

            const periodOrders = orders.filter((order) => {
              const orderDate = parseISO(order.created_at.toString());
              return orderDate >= periodStart && orderDate < periodEnd;
            });

            const revenue =
              periodOrders.reduce(
                (sum, order) => sum + getNumericValue(order.total_amount),
                0
              ) / 1000000;

            result.push({
              period: `${periodStart.getDate()}-${periodEnd.getDate()}`,
              revenue: isNaN(revenue) ? 0 : revenue,
            });
          }
        } else if (timeRange === "year") {
          // 10 periods within this year (roughly every 1.2 months)
          const year = now.getFullYear();
          const monthsPerPeriod = 12 / 10; // 1.2 months per period

          for (let i = 0; i < 10; i++) {
            const startMonth = Math.floor(i * monthsPerPeriod);
            const endMonth = Math.min(
              11,
              Math.floor((i + 1) * monthsPerPeriod) - 1
            );

            const periodStart = new Date(year, startMonth, 1);
            const periodEnd = new Date(year, endMonth + 1, 0); // Last day of end month

            const periodOrders = orders.filter((order) => {
              const orderDate = parseISO(order.created_at.toString());
              return orderDate >= periodStart && orderDate <= periodEnd;
            });

            const revenue =
              periodOrders.reduce(
                (sum, order) => sum + getNumericValue(order.total_amount),
                0
              ) / 1000000;

            const monthNames = [
              "T1",
              "T2",
              "T3",
              "T4",
              "T5",
              "T6",
              "T7",
              "T8",
              "T9",
              "T10",
              "T11",
              "T12",
            ];
            const periodLabel =
              startMonth === endMonth
                ? monthNames[startMonth]
                : `${monthNames[startMonth]}-${monthNames[endMonth]}`;

            result.push({
              period: periodLabel,
              revenue: isNaN(revenue) ? 0 : revenue,
            });
          }
        }

        return result;
      };

      // Helper function to generate user distribution data
      const generateUserDistributionData = (
        users: any[],
        timeRange: TimeRange
      ): UserDistributionData[] => {
        // Filter users by timeRange for registration statistics
        const now = new Date();
        const filteredUsers = users.filter((user: any) => {
          if (!user.created_at) return false;
          const userDate = parseISO(user.created_at.toString());

          switch (timeRange) {
            case "day":
              return isToday(userDate);
            case "week":
              return isThisWeek(userDate);
            case "month":
              return isSameMonth(userDate, now) && isSameYear(userDate, now);
            case "year":
              return isSameYear(userDate, now);
            default:
              return true;
          }
        });

        const clients = filteredUsers.filter(
          (u: any) => u.role.role_name === "Client"
        ).length;
        const distributors = filteredUsers.filter(
          (u: any) => u.role.role_name === "Distributor"
        ).length;
        const admins = filteredUsers.filter(
          (u: any) => u.role.role_name === "ADMIN"
        ).length;

        return [
          {
            name: "Khách hàng",
            value: clients,
            fill: "#8884d8",
          },
          {
            name: "Nhà phân phối",
            value: distributors,
            fill: "#82ca9d",
          },
          {
            name: "Quản trị viên",
            value: admins,
            fill: "#ffc658",
          },
        ].filter((item) => item.value > 0); // Only include roles that have users
      };

      // Generate chart data
      const revenueData = generateRevenueChartData(orders, timeRange);
      const userDistribution = generateUserDistributionData(users, timeRange);

      // Process recent activities
      const recentActivities: RecentActivity[] = [];

      // Add recent user registrations
      if (recentUsers.status === "fulfilled") {
        recentUsers.value.forEach((user) => {
          recentActivities.push({
            id: `user-${user.user_id}`,
            type: "user_registration",
            title: "Người dùng mới đăng ký",
            description: `${user.full_name} đã đăng ký tài khoản`,
            timestamp: new Date(user.created_at),
            user: user,
            status: user.is_active ? "active" : "inactive",
          });
        });
      }

      // Add recent distributor requests
      if (recentRequests.status === "fulfilled") {
        recentRequests.value.forEach((request) => {
          recentActivities.push({
            id: `request-${request.store_owner_request_id}`,
            type: "distributor_request",
            title: "Yêu cầu đăng ký đại lý",
            description: `${request.user.full_name} gửi yêu cầu trở thành đại lý`,
            timestamp: request.created_at
              ? new Date(request.created_at)
              : new Date(),
            user: request.user as any, // Type conversion for compatibility
            status: request.request_status || "pending",
          });
        });
      }

      // Sort activities by timestamp (newest first)
      recentActivities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      // Process warnings
      const warnings: WarningAlert[] = [];

      // Add expiring soon warning
      if (
        expiringSoonBatches.status === "fulfilled" &&
        expiringSoonBatches.value.length > 0
      ) {
        warnings.push({
          id: "expiring-soon",
          type: "expiring_soon",
          title: "Sản phẩm sắp hết hạn",
          description: `${expiringSoonBatches.value.length} lô sản phẩm sắp hết hạn`,
          severity: "high",
          count: expiringSoonBatches.value.length,
          items: expiringSoonBatches.value,
        });
      }

      // Add low stock warning
      if (
        lowStockBatches.status === "fulfilled" &&
        lowStockBatches.value.length > 0
      ) {
        warnings.push({
          id: "low-stock",
          type: "low_stock",
          title: "Sản phẩm gần hết trong kho",
          description: `${lowStockBatches.value.length} lô sản phẩm gần hết trong kho`,
          severity: "medium",
          count: lowStockBatches.value.length,
          items: lowStockBatches.value,
        });
      }

      return {
        stats:
          stats.status === "fulfilled"
            ? stats.value
            : {
                totalUsers: 0,
                activeUsers: 0,
                totalDistributors: 0,
                activeDistributors: 0,
                totalProducts: 0,
                totalOrders: 0,
                totalRevenue: 0,
                newUsersThisMonth: 0,
                newDistributorsThisMonth: 0,
              },
        recentActivities: recentActivities.slice(0, 20), // Limit to 20 most recent
        warnings,
        revenueData,
        userDistribution,
      };
    } catch (error) {
      let msg = "Lỗi khi lấy dữ liệu dashboard";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
