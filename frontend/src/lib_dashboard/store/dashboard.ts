import { atom } from "jotai"

export type TimeRange = "day" | "week" | "month"

export const timeRangeAtom = atom<TimeRange>("month")
export const dashboardDataAtom = atom<{
  newUsers: number
  newDistributors: number
  productsSold: number
  totalRevenue: number
  revenueData: Array<{ period: string; revenue: number }>
  userDistribution: Array<{ name: string; value: number; fill: string }>
  recentActivities: Array<{
    id: string
    type: "user" | "distributor" | "product" | "order"
    message: string
    timestamp: Date
    user?: string
  }>
  quickStats: {
    activeUsers: number
    activeDistributors: number
    totalProducts: number
    pendingOrders: number
  }
}>({
  newUsers: 0,
  newDistributors: 0,
  productsSold: 0,
  totalRevenue: 0,
  revenueData: [],
  userDistribution: [],
  recentActivities: [],
  quickStats: {
    activeUsers: 0,
    activeDistributors: 0,
    totalProducts: 0,
    pendingOrders: 0,
  },
})
