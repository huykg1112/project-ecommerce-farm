"use client";

import { ExportButton } from "@/components/(dashboard)/common/export-button";
import { StatisticsCharts } from "@/components/(dashboard)/user-statistics/statistics-charts";
import { StatisticsFilters } from "@/components/(dashboard)/user-statistics/statistics-filters";
import { SummaryStatistics } from "@/components/(dashboard)/user-statistics/summary-statistics";
import { UserDataTable } from "@/components/(dashboard)/user-statistics/user-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUserStatistics } from "@/hooks/use-user-statistics";
import { exportService } from "@/lib_dashboard/services/export-service";
import { BarChart3, RefreshCw } from "lucide-react";
import { useCallback, useMemo } from "react";

export default function UserStatisticsPage() {
  const { toast } = useToast();

  const {
    filters,
    chartVisibility,
    statisticsData,
    loading,
    updateFilters,
    resetFilters,
    toggleRoleVisibility,
    fetchStatistics,
  } = useUserStatistics();

  const handleExport = () => {
    toast({
      title: "Thông báo",
      description: "Tính năng xuất báo cáo đang được phát triển",
    });
  };

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    await exportService.exportUserStatisticsToPDF(
      statisticsData,
      statisticsData.filteredUsers
    );
  }, [statisticsData]);

  const handleExportExcel = useCallback(async () => {
    await exportService.exportUserStatisticsToExcel(
      statisticsData,
      statisticsData.filteredUsers
    );
  }, [statisticsData]);

  const handleRefresh = () => {
    fetchStatistics();
    toast({
      title: "Thành công",
      description: "Đã làm mới dữ liệu thống kê",
    });
  };

  const timeRangeLabel = useMemo(() => {
    switch (filters.timeRange) {
      case "month":
        return "12 tháng gần đây";
      case "year":
        return "5 năm gần đây";
      case "custom":
        return "khoảng thời gian tùy chỉnh";
      default:
        return "tất cả thời gian";
    }
  }, [filters.timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            📊 Thống kê người dùng
          </h1>
          <p className="text-[#74a65d] mt-1">
            Phân tích chi tiết về người dùng trên nền tảng - {timeRangeLabel}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <ExportButton
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            loading={loading}
            buttonText="Xuất báo cáo thống kê"
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <SummaryStatistics
        totalUsers={statisticsData.totalUsers}
        activeUsers={statisticsData.activeUsers}
        inactiveUsers={statisticsData.inactiveUsers}
        newUsersThisMonth={statisticsData.newUsersThisMonth}
        newUsersThisYear={statisticsData.newUsersThisYear}
        filteredUsersCount={statisticsData.filteredUsers.length}
      />

      {/* Filters */}
      <StatisticsFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Charts */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="card-agricultural">
              <CardHeader>
                <div className="h-6 bg-[#accc8b]/20 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-[#accc8b]/10 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <StatisticsCharts
          registrationTrends={statisticsData.registrationTrends}
          roleDistribution={statisticsData.roleDistribution}
          chartVisibility={chartVisibility}
          onToggleVisibility={toggleRoleVisibility}
          timeRange={filters.timeRange}
        />
      )}

      {/* User Data Table */}
      <Card className="card-agricultural">
        <CardHeader>
          <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Danh sách người dùng chi tiết
          </CardTitle>
          <p className="text-sm text-[#74a65d]">
            Hiển thị {statisticsData.filteredUsers.length} người dùng theo bộ
            lọc đã chọn
          </p>
        </CardHeader>
        <CardContent>
          <UserDataTable
            users={statisticsData.filteredUsers}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
