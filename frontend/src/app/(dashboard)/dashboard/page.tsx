"use client";

import { ActivityFeed } from "@/components/(dashboard)/dashboard/activity-feed";
import { DashboardCharts } from "@/components/(dashboard)/dashboard/dashboard-charts";
import { DistributorContent } from "@/components/(dashboard)/dashboard/distributor-content";
import { QuickStats } from "@/components/(dashboard)/dashboard/quick-stats";
import { SummaryCards } from "@/components/(dashboard)/dashboard/summary-cards";
import { TimeRangeSelector } from "@/components/(dashboard)/dashboard/time-range-selector";
import { Button } from "@/components/ui/button";
import { VI_AGRICULTURAL } from "@/lib_dashboard/localization/vi";
import { generateMockDashboardData } from "@/lib_dashboard/services/admin-dashboard";
import {
  dashboardDataAtom,
  timeRangeAtom,
} from "@/lib_dashboard/store/dashboard";
import { useAtom } from "jotai";
import { Download, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

export default function DashboardPage() {
  // const [currentUser] = useAtom(currentUserAtom);
  // const [userRole] = useAtom(userRoleAtom);
  const [timeRange] = useAtom(timeRangeAtom);
  const [dashboardData, setDashboardData] = useAtom(dashboardDataAtom);
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
  console.log("currentUser", currentUser);
  console.log("user", user);

  // Generate dashboard data based on time range
  const mockData = useMemo(
    () => generateMockDashboardData(timeRange),
    [timeRange]
  );

  // Update dashboard data when time range changes
  useEffect(() => {
    setDashboardData(mockData);
  }, [mockData, setDashboardData]);

  // Handlers
  const handleRefresh = useCallback(() => {
    const newData = generateMockDashboardData(timeRange);
    setDashboardData(newData);
  }, [timeRange, setDashboardData]);

  const handleExport = useCallback(() => {
    console.log("Exporting dashboard data...");
    // Export logic here
  }, []);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "day":
        return "hôm nay";
      case "week":
        return "tuần này";
      case "month":
        return "tháng này";
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
            <Button
              onClick={handleExport}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        newUsers={dashboardData.newUsers}
        newDistributors={dashboardData.newDistributors}
        productsSold={dashboardData.productsSold}
        totalRevenue={dashboardData.totalRevenue}
        timeRange={timeRangeLabel}
        userRole={userRole}
      />

      {/* Role-based Content */}
      {userRole === "ADMIN" ? (
        <>
          {/* Charts Section */}
          <DashboardCharts
            revenueData={dashboardData.revenueData}
            userDistribution={dashboardData.userDistribution}
            timeRange={timeRange}
          />

          {/* Bottom Section - Activity Feed & Quick Stats */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityFeed activities={dashboardData.recentActivities} />
            </div>
            <div>
              <QuickStats stats={dashboardData.quickStats} />
            </div>
          </div>
        </>
      ) : (
        <DistributorContent dashboardData={dashboardData} />
      )}
    </div>
  );
}
