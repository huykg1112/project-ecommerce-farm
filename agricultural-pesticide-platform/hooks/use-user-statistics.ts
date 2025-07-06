"use client"

import { useCallback, useEffect } from "react"
import { useAtom } from "jotai"
import {
  userStatisticsFiltersAtom,
  chartVisibilityAtom,
  userStatisticsDataAtom,
  userStatisticsLoadingAtom,
} from "@/lib/store/user-statistics-store"
import { UserStatisticsService } from "@/lib/services/user-statistics-service"
import { useToast } from "@/hooks/use-toast"
import type { UserStatisticsFilters, ChartVisibility } from "@/lib/store/user-statistics-store"

export const useUserStatistics = () => {
  const { toast } = useToast()

  const [filters, setFilters] = useAtom(userStatisticsFiltersAtom)
  const [chartVisibility, setChartVisibility] = useAtom(chartVisibilityAtom)
  const [statisticsData, setStatisticsData] = useAtom(userStatisticsDataAtom)
  const [loading, setLoading] = useAtom(userStatisticsLoadingAtom)

  // Fetch statistics data
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      const data = await UserStatisticsService.getUserStatistics(filters)
      setStatisticsData(data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải thống kê người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, setStatisticsData, setLoading, toast])

  // Auto-fetch when filters change
  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  // Filter operations
  const updateFilters = useCallback(
    (newFilters: Partial<UserStatisticsFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    [setFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      timeRange: "year",
      role: "all",
      status: "all",
    })
  }, [setFilters])

  // Chart visibility operations
  const updateChartVisibility = useCallback(
    (newVisibility: Partial<ChartVisibility>) => {
      setChartVisibility((prev) => ({ ...prev, ...newVisibility }))
    },
    [setChartVisibility],
  )

  const toggleRoleVisibility = useCallback(
    (role: keyof ChartVisibility) => {
      setChartVisibility((prev) => ({ ...prev, [role]: !prev[role] }))
    },
    [setChartVisibility],
  )

  return {
    // Data
    filters,
    chartVisibility,
    statisticsData,
    loading,

    // Operations
    updateFilters,
    resetFilters,
    updateChartVisibility,
    toggleRoleVisibility,
    fetchStatistics,
  }
}
