"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { RevenueCards } from "@/components/(dashboard)/revenue/revenue-cards";
import { RevenueCharts } from "@/components/(dashboard)/revenue/revenue-charts";
import { RevenueFiltersComponent } from "@/components/(dashboard)/revenue/revenue-filters";
import { RevenueTable } from "@/components/(dashboard)/revenue/revenue-table";
import { useRevenueStatistics } from "@/hooks/use-revenue-statistics";
import { RevenueFilters as RevenueFiltersType } from "@/lib_dashboard/types/revenue";

export default function RevenueStatisticsPage() {
  const {
    statistics,
    loading,
    filters,
    chartVisibility,
    updateFilters,
    toggleChartVisibility,
    refetch,
  } = useRevenueStatistics();

  const handleFiltersChange = (newFilters: Partial<RevenueFiltersType>) => {
    updateFilters(newFilters);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExportData = () => {
    if (!statistics) return;

    const exportData = {
      filters,
      statistics,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-statistics-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#44703d] flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Thống kê doanh thu
          </h1>
          <p className="text-gray-600 mt-2">
            Phân tích chi tiết doanh thu và hiệu suất kinh doanh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Calendar className="w-4 h-4 mr-1" />
            {filters.timeRange === "day" && "Theo ngày"}
            {filters.timeRange === "month" && "Theo tháng"}
            {filters.timeRange === "year" && "Theo năm"}
            {filters.timeRange === "custom" && "Tùy chỉnh"}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={loading || !statistics}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <Separator />

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Bộ lọc thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueFiltersComponent
            filters={filters}
            onFilterChange={handleFiltersChange}
            onResetFilters={() => {
              updateFilters({
                timeRange: "month",
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
              });
            }}
          />
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {statistics && <RevenueCards statistics={statistics} loading={loading} />}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Biểu đồ
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Chi tiết
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {statistics ? (
            <>
              {/* Quick Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Doanh thu theo thời gian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RevenueCharts
                      statistics={statistics}
                      chartVisibility={{
                        revenueByTime: true,
                        revenueByStatus: false,
                        revenueByPaymentMethod: false,
                        topProducts: false,
                        growthTrend: false,
                      }}
                      loading={loading}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Phân bố theo trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RevenueCharts
                      statistics={statistics}
                      chartVisibility={{
                        revenueByTime: false,
                        revenueByStatus: true,
                        revenueByPaymentMethod: false,
                        topProducts: false,
                        growthTrend: false,
                      }}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Summary Table */}
              <RevenueTable statistics={statistics} loading={loading} />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-pulse space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          {statistics ? (
            <RevenueCharts
              statistics={statistics}
              chartVisibility={chartVisibility}
              onToggleChart={(chart) => {
                toggleChartVisibility(chart);
              }}
              loading={loading}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {statistics ? (
            <RevenueTable statistics={statistics} loading={loading} />
          ) : (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-80">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <RefreshCw className="w-6 h-6 animate-spin text-[#44703d]" />
                <div>
                  <h3 className="font-semibold">Đang tải dữ liệu...</h3>
                  <p className="text-sm text-gray-600">
                    Vui lòng đợi trong giây lát
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
