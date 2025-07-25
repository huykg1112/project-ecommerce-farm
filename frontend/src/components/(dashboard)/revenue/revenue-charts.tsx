"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartVisibility,
  RevenueStatistics,
} from "@/lib_dashboard/types/revenue";
import {
  BarChart3,
  Eye,
  EyeOff,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartsProps {
  statistics: RevenueStatistics;
  chartVisibility: ChartVisibility;
  onToggleChart?: (chart: keyof ChartVisibility) => void;
  onVisibilityChange?: (visibility: ChartVisibility) => void;
  loading?: boolean;
}

export function RevenueCharts({
  statistics,
  chartVisibility,
  onToggleChart,
  loading,
}: RevenueChartsProps) {
  if (loading) {
    return (
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
    );
  }

  // Custom tooltip for revenue charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {isNaN(entry.value) || !isFinite(entry.value)
                ? "0.00"
                : entry.value.toFixed(2)}{" "}
              triệu đồng
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {data.status || data.method}
          </p>
          <p style={{ color: payload[0].color }}>
            Doanh thu:{" "}
            {isNaN(data.revenue) || !isFinite(data.revenue)
              ? "0.00"
              : data.revenue.toFixed(2)}{" "}
            triệu đồng
          </p>
          <p className="text-gray-600">
            Tỷ lệ:{" "}
            {isNaN(data.percentage) || !isFinite(data.percentage)
              ? "0.0"
              : data.percentage.toFixed(1)}
            %
          </p>
          <p className="text-gray-600">Đơn hàng: {data.orders}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Visibility Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Hiển thị biểu đồ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(chartVisibility).map(([key, visible]) => (
              <Button
                key={key}
                variant={visible ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleChart?.(key as keyof ChartVisibility)}
                className="text-xs"
              >
                {visible ? (
                  <Eye className="w-3 h-3 mr-1" />
                ) : (
                  <EyeOff className="w-3 h-3 mr-1" />
                )}
                {key === "revenueByTime" && "Doanh thu theo thời gian"}
                {key === "revenueByStatus" && "Doanh thu theo trạng thái"}
                {key === "revenueByPaymentMethod" &&
                  "Doanh thu theo thanh toán"}
                {key === "topProducts" && "Top sản phẩm"}
                {key === "growthTrend" && "Xu hướng tăng trưởng"}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className=" flex flex-col  gap-6">
        {/* Revenue by Time */}
        {chartVisibility.revenueByTime && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Doanh thu theo thời gian (triệu đồng)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.revenueByTime}>
                  <XAxis
                    dataKey="period"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    name="Doanh thu"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Revenue by Status - Pie Chart */}
        {chartVisibility.revenueByStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-green-600" />
                Doanh thu theo trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics.revenueByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) =>
                      `${status} (${percentage.toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {statistics.revenueByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Revenue by Payment Method */}
        {chartVisibility.revenueByPaymentMethod && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Doanh thu theo phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statistics.revenueByPaymentMethod}
                  layout="horizontal"
                >
                  <XAxis type="number" />
                  <YAxis dataKey="method" type="category" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill="#8b5cf6"
                    name="Doanh thu"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Products */}
        {chartVisibility.topProducts && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Top 10 sản phẩm bán chạy (triệu đồng)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.topProducts}>
                  <XAxis
                    dataKey="productName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p style={{ color: payload[0].color }}>
                              Doanh thu: {data.revenue.toFixed(2)} triệu đồng
                            </p>
                            <p className="text-gray-600">
                              Số lượng: {data.quantity}
                            </p>
                            <p className="text-gray-600">
                              Đơn hàng: {data.orders}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#f97316"
                    name="Doanh thu"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Growth Trend */}
        {chartVisibility.growthTrend && statistics.revenueGrowth.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Xu hướng tăng trưởng doanh thu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.revenueGrowth}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Hiện tại"
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke="#6b7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Kỳ trước"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.revenueByTime.length}
              </div>
              <div className="text-sm text-blue-800">Kỳ thống kê</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {statistics.revenueByStatus.length}
              </div>
              <div className="text-sm text-green-800">Trạng thái đơn hàng</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.revenueByPaymentMethod.length}
              </div>
              <div className="text-sm text-purple-800">
                Phương thức thanh toán
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.topProducts.length}
              </div>
              <div className="text-sm text-orange-800">Sản phẩm bán chạy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
