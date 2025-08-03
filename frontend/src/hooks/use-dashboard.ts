import {
  DashboardData,
  dashboardService,
  TimeRange,
} from "@/lib_dashboard/services/dashboard-service";
import { useCallback, useEffect, useState } from "react";

export interface UseDashboardReturn {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: (timeRange?: TimeRange) => void;
}

export function useDashboard(
  timeRange: TimeRange = "month"
): UseDashboardReturn {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(
    async (currentTimeRange: TimeRange = timeRange) => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getDashboardData(currentTimeRange);
        setDashboardData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải dữ liệu dashboard"
        );
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [timeRange]
  );

  const refetch = useCallback(
    (newTimeRange?: TimeRange) => {
      fetchDashboardData(newTimeRange || timeRange);
    },
    [fetchDashboardData, timeRange]
  );

  useEffect(() => {
    fetchDashboardData(timeRange);
  }, [fetchDashboardData, timeRange]);

  return {
    dashboardData,
    loading,
    error,
    refetch,
  };
}
