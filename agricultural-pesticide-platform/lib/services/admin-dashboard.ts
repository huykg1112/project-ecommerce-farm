import type { TimeRange } from "@/lib/store/dashboard"

export const generateMockDashboardData = (timeRange: TimeRange) => {
  const baseMultiplier = timeRange === "day" ? 1 : timeRange === "week" ? 7 : 30

  // Generate revenue data based on time range
  const revenueData = Array.from({ length: timeRange === "day" ? 24 : timeRange === "week" ? 7 : 12 }, (_, i) => {
    const period = timeRange === "day" ? `${i}:00` : timeRange === "week" ? `Ngày ${i + 1}` : `Tháng ${i + 1}`

    return {
      period,
      revenue: Math.floor(Math.random() * 50000000) + 20000000,
    }
  })

  const userDistribution = [
    { name: "Nông dân", value: 68, fill: "#599146" },
    { name: "Nhà phân phối", value: 32, fill: "#90c577" },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "user" as const,
      message: "Nông dân Nguyễn Văn An đã đăng ký tài khoản",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: "Nguyễn Văn An",
    },
    {
      id: "2",
      type: "distributor" as const,
      message: "Nhà phân phối Green Valley được phê duyệt",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: "Green Valley",
    },
    {
      id: "3",
      type: "product" as const,
      message: "Sản phẩm RoundUp Max được cập nhật giá",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      user: "Admin",
    },
    {
      id: "4",
      type: "order" as const,
      message: "Đơn hàng #DH2024001 đã được xác nhận",
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      user: "Trần Thị Bình",
    },
    {
      id: "5",
      type: "user" as const,
      message: "Nông dân Lê Văn Cường đã đăng ký tài khoản",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      user: "Lê Văn Cường",
    },
  ]

  return {
    newUsers: Math.floor(Math.random() * 50 * baseMultiplier) + 20,
    newDistributors: Math.floor(Math.random() * 10 * baseMultiplier) + 5,
    productsSold: Math.floor(Math.random() * 200 * baseMultiplier) + 100,
    totalRevenue: Math.floor(Math.random() * 100000000 * baseMultiplier) + 50000000,
    revenueData,
    userDistribution,
    recentActivities,
    quickStats: {
      activeUsers: 1247,
      activeDistributors: 156,
      totalProducts: 2847,
      pendingOrders: 23,
    },
  }
}
