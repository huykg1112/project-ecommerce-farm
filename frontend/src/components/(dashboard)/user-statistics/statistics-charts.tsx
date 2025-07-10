"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ChartVisibility,
  RegistrationData,
  RoleDistribution,
} from "@/lib_dashboard/store/user-statistics-store";
import { Eye, EyeOff, PieChartIcon, TrendingUp, Users } from "lucide-react";
import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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

interface StatisticsChartsProps {
  registrationTrends: RegistrationData[];
  roleDistribution: RoleDistribution[];
  chartVisibility: ChartVisibility;
  onToggleVisibility: (role: keyof ChartVisibility) => void;
  timeRange: string;
  selectedMonth?: number;
  selectedYear?: number;
  startDate?: Date;
  endDate?: Date;
}

export const StatisticsCharts = memo<StatisticsChartsProps>(
  ({
    registrationTrends,
    roleDistribution,
    chartVisibility,
    onToggleVisibility,
    timeRange,
    selectedMonth,
    selectedYear,
    startDate,
    endDate,
  }) => {
    const chartTitle = useMemo(() => {
      if (timeRange === "month" && selectedMonth && selectedYear) {
        return `Đăng ký người dùng tháng ${selectedMonth}/${selectedYear}`;
      } else if (timeRange === "year" && selectedYear) {
        return `Đăng ký người dùng năm ${selectedYear}`;
      } else if (timeRange === "custom" && startDate && endDate) {
        return `Đăng ký người dùng từ ${startDate.toLocaleDateString(
          "vi-VN"
        )} đến ${endDate.toLocaleDateString("vi-VN")}`;
      }
      return "Đăng ký người dùng";
    }, [timeRange, selectedMonth, selectedYear, startDate, endDate]);

    const filteredTrendsData = useMemo(() => {
      return registrationTrends.map((item) => ({
        ...item,
        customers: chartVisibility.customers ? item.customers : 0,
        distributors: chartVisibility.distributors ? item.distributors : 0,
      }));
    }, [registrationTrends, chartVisibility]);

    const tooltipStyle = useMemo(
      () => ({
        backgroundColor: "#f0fdf4",
        border: "1px solid #599146",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }),
      []
    );

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stacked Bar Chart */}
        <Card className="card-agricultural lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {chartTitle}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility("customers")}
                  className={`border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 ${
                    chartVisibility.customers
                      ? "bg-[#90c577]/20"
                      : "bg-transparent"
                  }`}
                >
                  {chartVisibility.customers ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="ml-1">Khách hàng</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility("distributors")}
                  className={`border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 ${
                    chartVisibility.distributors
                      ? "bg-[#74a65d]/20"
                      : "bg-transparent"
                  }`}
                >
                  {chartVisibility.distributors ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="ml-1">Đại lý</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-[#74a65d]">
              Số lượng người dùng đăng ký mới theo thời gian
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredTrendsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-[#accc8b]/50"
                />
                <XAxis
                  dataKey="period"
                  className="text-[#74a65d]"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                  angle={timeRange === "custom" ? -45 : 0}
                  textAnchor={timeRange === "custom" ? "end" : "middle"}
                />
                <YAxis
                  className="text-[#74a65d]"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                {chartVisibility.customers && (
                  <Bar
                    dataKey="customers"
                    stackId="a"
                    fill="#90c577"
                    name="Khách hàng"
                    radius={[0, 0, 0, 0]}
                  />
                )}
                {chartVisibility.distributors && (
                  <Bar
                    dataKey="distributors"
                    stackId="a"
                    fill="#74a65d"
                    name="Đại lý"
                    radius={
                      chartVisibility.customers ? [4, 4, 0, 0] : [4, 4, 4, 4]
                    }
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Phân bố vai trò
            </CardTitle>
            <p className="text-sm text-[#74a65d]">
              Tỷ lệ phân bố người dùng theo vai trò
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name}: ${percentage.toFixed(1)}%`
                  }
                  outerRadius={100}
                  fill="#599146"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} người dùng`,
                    name,
                  ]}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {roleDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-[#44703d]">{item.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[#44703d] border-[#90c577]"
                  >
                    {item.value} ({item.percentage.toFixed(1)}%)
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="card-agricultural lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Xu hướng đăng ký tài khoản
            </CardTitle>
            <p className="text-sm text-[#74a65d]">
              Biểu đồ đường thể hiện xu hướng đăng ký theo thời gian
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredTrendsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-[#accc8b]/50"
                />
                <XAxis
                  dataKey="period"
                  className="text-[#74a65d]"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                  angle={timeRange === "custom" ? -45 : 0}
                  textAnchor={timeRange === "custom" ? "end" : "middle"}
                />
                <YAxis
                  className="text-[#74a65d]"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#599146"
                  strokeWidth={3}
                  dot={{ fill: "#599146", strokeWidth: 2, r: 5 }}
                  activeDot={{
                    r: 7,
                    stroke: "#599146",
                    strokeWidth: 2,
                    fill: "#90c577",
                  }}
                  name="Tổng đăng ký"
                />
                {chartVisibility.customers && (
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#90c577"
                    strokeWidth={2}
                    dot={{ fill: "#90c577", strokeWidth: 2, r: 4 }}
                    name="Khách hàng"
                  />
                )}
                {chartVisibility.distributors && (
                  <Line
                    type="monotone"
                    dataKey="distributors"
                    stroke="#74a65d"
                    strokeWidth={2}
                    dot={{ fill: "#74a65d", strokeWidth: 2, r: 4 }}
                    name="Đại lý"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
);

StatisticsCharts.displayName = "StatisticsCharts";
