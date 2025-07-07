"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib_dashboard/utils/formatters";
import { memo, useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartsProps {
  revenueData: Array<{ period: string; revenue: number }>;
  userDistribution: Array<{ name: string; value: number; fill: string }>;
  timeRange: string;
}

export const DashboardCharts = memo<DashboardChartsProps>(
  ({ revenueData, userDistribution, timeRange }) => {
    const chartTitle = useMemo(() => {
      return timeRange === "day"
        ? "Xu hướng doanh thu theo giờ"
        : timeRange === "week"
        ? "Xu hướng doanh thu theo ngày"
        : "Xu hướng doanh thu theo tháng";
    }, [timeRange]);

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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
              📈 {chartTitle}
            </CardTitle>
            <p className="text-sm text-agricultural-secondary">
              Theo dõi xu hướng doanh thu trong khoảng thời gian đã chọn
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-primary-light/50"
                />
                <XAxis
                  dataKey="period"
                  className="text-agricultural-secondary"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                />
                <YAxis
                  className="text-agricultural-secondary"
                  fontSize={12}
                  tick={{ fill: "#74a65d" }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Doanh thu",
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#599146"
                  strokeWidth={3}
                  dot={{ fill: "#599146", strokeWidth: 2, r: 5 }}
                  activeDot={{
                    r: 7,
                    stroke: "#599146",
                    strokeWidth: 2,
                    fill: "#90c577",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution Chart */}
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
              👥 Phân bố vai trò người dùng
            </CardTitle>
            <p className="text-sm text-agricultural-secondary">
              Tỷ lệ phân bố giữa nông dân và nhà phân phối
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={100}
                  fill="#599146"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Tỷ lệ"]}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
);

DashboardCharts.displayName = "DashboardCharts";
