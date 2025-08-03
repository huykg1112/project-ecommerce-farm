"use client";

import { ActivityFeed } from "@/components/(dashboard)/dashboard/activity-feed";
import { DashboardCharts } from "@/components/(dashboard)/dashboard/dashboard-charts";
import { DistributorContent } from "@/components/(dashboard)/dashboard/distributor-content";
import { ExportDropdown } from "@/components/(dashboard)/dashboard/export-report-modal";
import { QuickStats } from "@/components/(dashboard)/dashboard/quick-stats";
import { SummaryCards } from "@/components/(dashboard)/dashboard/summary-cards";
import { TimeRangeSelector } from "@/components/(dashboard)/dashboard/time-range-selector";
import { WarehouseAlertsSummary } from "@/components/(dashboard)/dashboard/warehouse-alerts-summary";
import { WarningAlerts } from "@/components/(dashboard)/dashboard/warning-alerts";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";
import { VI_AGRICULTURAL } from "@/lib_dashboard/localization/vi";
import { timeRangeAtom } from "@/lib_dashboard/store/dashboard";
import { useAtom } from "jotai";
import { RefreshCw } from "lucide-react";
import { useCallback, useMemo } from "react";

export default function DashboardPage() {
  // const [currentUser] = useAtom(currentUserAtom);
  // const [userRole] = useAtom(userRoleAtom);
  const [timeRange] = useAtom(timeRangeAtom);
  const userRole = "ADMIN";
  const user = {
    user_id: "1",
    username: "admin",
    email: "admin@farme.com",
    full_name: "System Administrator",
    phone_number: "+84123456789",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    role: {
      role_id: "1",
      role_name: "ADMIN",
      description: "System Administrator",
      is_active: true,
    },
  };
  const currentUser = user;

  // Use real dashboard data
  const { dashboardData, loading, error, refetch } = useDashboard(timeRange);
  const handleRefresh = useCallback(() => {
    refetch(timeRange);
  }, [refetch, timeRange]);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "day":
        return "hôm nay";
      case "week":
        return "tuần này";
      case "month":
        return "tháng này";
      case "year":
        return "năm nay";
      default:
        return "tháng này";
    }
  }, [timeRange]);

  const dashboardTitle = useMemo(() => {
    return userRole === "ADMIN"
      ? VI_AGRICULTURAL.dashboard.admin
      : VI_AGRICULTURAL.dashboard.distributor;
  }, [userRole]);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-agricultural-primary">
              🌾 {dashboardTitle}
            </h1>
            <p className="text-agricultural-secondary mt-1">
              {VI_AGRICULTURAL.platform.subtitle} - {timeRangeLabel}
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#accc8b]/20 rounded-lg" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 bg-[#accc8b]/20 rounded-lg" />
            <div className="h-64 bg-[#accc8b]/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-agricultural-primary">
              🌾 {dashboardTitle}
            </h1>
            <p className="text-agricultural-secondary mt-1">
              {VI_AGRICULTURAL.platform.subtitle} - {timeRangeLabel}
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Có lỗi khi tải dữ liệu: {error}</p>
          <Button onClick={handleRefresh}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-agricultural-primary">
            🌾 {dashboardTitle}
          </h1>
          <p className="text-agricultural-secondary mt-1">
            {VI_AGRICULTURAL.platform.subtitle} - {timeRangeLabel}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <TimeRangeSelector />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="btn-secondary bg-transparent flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </Button>
            <ExportDropdown
              dashboardData={dashboardData}
              timeRange={timeRange}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        newUsers={dashboardData.stats.newUsersThisMonth}
        newDistributors={dashboardData.stats.newDistributorsThisMonth}
        productsSold={dashboardData.stats.totalOrders}
        totalRevenue={dashboardData.stats.totalRevenue}
        timeRange={timeRangeLabel}
        userRole={userRole}
      />

      {/* Warning Alerts - Warehouse Monitoring */}
      <WarningAlerts warnings={dashboardData.warnings} loading={loading} />

      {/* Role-based Content */}
      {userRole === "ADMIN" ? (
        <>
          {/* Charts Section - Using real data filtered by time range */}
          <DashboardCharts
            revenueData={dashboardData.revenueData}
            userDistribution={dashboardData.userDistribution}
            timeRange={timeRange}
          />

          {/* Bottom Section - Activity Feed, Quick Stats & Warehouse Alerts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityFeed
                activities={dashboardData.recentActivities}
                loading={loading}
              />
            </div>
            <div className="space-y-6">
              <QuickStats
                stats={{
                  activeUsers: Math.floor(dashboardData.stats.totalUsers * 0.7), // Mock calculation
                  activeDistributors: Math.floor(
                    dashboardData.stats.totalDistributors * 0.8
                  ), // Mock calculation
                  totalProducts: dashboardData.stats.totalProducts,
                  pendingOrders: Math.floor(
                    dashboardData.stats.totalOrders * 0.1
                  ), // Mock calculation
                }}
              />
              <WarehouseAlertsSummary
                warnings={dashboardData.warnings}
                loading={loading}
              />
            </div>
          </div>
        </>
      ) : (
        <DistributorContent
          dashboardData={{
            // Convert DashboardData to mock format for DistributorContent
            newUsers: dashboardData.stats.newUsersThisMonth,
            newDistributors: dashboardData.stats.newDistributorsThisMonth,
            productsSold: dashboardData.stats.totalOrders,
            totalRevenue: dashboardData.stats.totalRevenue,
            recentActivities: dashboardData.recentActivities,
            revenueData: [],
            userDistribution: [],
            quickStats: {
              activeUsers: Math.floor(dashboardData.stats.totalUsers * 0.7),
              activeDistributors: Math.floor(
                dashboardData.stats.totalDistributors * 0.8
              ),
              totalProducts: dashboardData.stats.totalProducts,
              pendingOrders: Math.floor(dashboardData.stats.totalOrders * 0.1),
            },
          }}
        />
      )}
    </div>
  );
}
