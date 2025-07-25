"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevenueStatistics } from "@/lib_dashboard/types/revenue";
import { BarChart3, Calendar, Package, Wallet } from "lucide-react";
import { useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface RevenueTableProps {
  statistics: RevenueStatistics;
  loading?: boolean;
}

export function RevenueTable({ statistics, loading }: RevenueTableProps) {
  // Define columns for revenue by time table
  const revenueByTimeColumns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: "Kỳ",
        selector: (row) => row.period,
        sortable: true,
        width: "150px",
        cell: (row) => (
          <div className="font-medium text-[#44703d]">{row.period}</div>
        ),
      },
      {
        name: "Thời gian",
        selector: (row) => row.label,
        sortable: true,
        cell: (row) => <div className="text-sm text-gray-600">{row.label}</div>,
      },
      {
        name: "Doanh thu (triệu đồng)",
        selector: (row) => row.revenue,
        sortable: true,
        right: true,
        cell: (row) => (
          <div className="font-semibold text-green-600">
            {isNaN(row.revenue) || !isFinite(row.revenue)
              ? "0.00"
              : row.revenue.toFixed(2)}
          </div>
        ),
      },
      {
        name: "Số đơn hàng",
        selector: (row) => row.orders,
        sortable: true,
        center: true,
        cell: (row) => (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {row.orders}
          </Badge>
        ),
      },
      {
        name: "TB/đơn (triệu)",
        selector: (row) => row.averageOrder,
        sortable: true,
        right: true,
        cell: (row) => (
          <div className="text-gray-700">
            {isNaN(row.averageOrder) || !isFinite(row.averageOrder)
              ? "0.00"
              : row.averageOrder.toFixed(2)}
          </div>
        ),
      },
    ],
    []
  );

  // Define columns for top products table
  const topProductsColumns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: "STT",
        selector: (row, index) => (index ?? 0) + 1,
        width: "60px",
        center: true,
        cell: (row, index) => (
          <div className="font-medium text-gray-500">#{(index ?? 0) + 1}</div>
        ),
      },
      {
        name: "Tên sản phẩm",
        selector: (row) => row.productName,
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-[#44703d] truncate max-w-xs">
            {row.productName}
          </div>
        ),
      },
      {
        name: "Doanh thu (triệu đồng)",
        selector: (row) => row.revenue,
        sortable: true,
        right: true,
        cell: (row) => (
          <div className="font-semibold text-green-600">
            {isNaN(row.revenue) || !isFinite(row.revenue)
              ? "0.00"
              : row.revenue.toFixed(2)}
          </div>
        ),
      },
      {
        name: "Số lượng bán",
        selector: (row) => row.quantity,
        sortable: true,
        center: true,
        cell: (row) => (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {row.quantity.toLocaleString()}
          </Badge>
        ),
      },
      {
        name: "Số đơn hàng",
        selector: (row) => row.orders,
        sortable: true,
        center: true,
        cell: (row) => (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {row.orders}
          </Badge>
        ),
      },
    ],
    []
  );

  // Custom styles for data tables
  const customStyles = useMemo(
    () => ({
      header: {
        style: {
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          minHeight: "56px",
        },
      },
      headRow: {
        style: {
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          fontSize: "14px",
          fontWeight: "600",
          color: "#44703d",
        },
      },
      headCells: {
        style: {
          paddingLeft: "12px",
          paddingRight: "12px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#44703d",
        },
      },
      cells: {
        style: {
          paddingLeft: "12px",
          paddingRight: "12px",
          fontSize: "13px",
          color: "#374151",
        },
      },
      rows: {
        style: {
          minHeight: "48px",
          borderBottom: "1px solid #f3f4f6",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
        },
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Time Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Doanh thu theo thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={revenueByTimeColumns}
              data={statistics.revenueByTime}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu doanh thu
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Revenue by Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Doanh thu theo trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                  <TableHead className="text-center">Đơn hàng</TableHead>
                  <TableHead className="text-right">Tỷ lệ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.revenueByStatus.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {isNaN(item.revenue) || !isFinite(item.revenue)
                        ? "0.00"
                        : item.revenue.toFixed(2)}{" "}
                      triệu
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.orders}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isNaN(item.percentage) || !isFinite(item.percentage)
                        ? "0.0"
                        : item.percentage.toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              Doanh thu theo thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phương thức</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                  <TableHead className="text-center">Đơn hàng</TableHead>
                  <TableHead className="text-right">Tỷ lệ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.revenueByPaymentMethod.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.method === "COD" && "💵"}
                        {item.method === "VNPAY" && "💳"}
                        {item.method}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {isNaN(item.revenue) || !isFinite(item.revenue)
                        ? "0.00"
                        : item.revenue.toFixed(2)}{" "}
                      triệu
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.orders}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isNaN(item.percentage) || !isFinite(item.percentage)
                        ? "0.0"
                        : item.percentage.toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Tóm tắt nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">
                  Tổng doanh thu
                </span>
                <span className="font-bold text-green-600">
                  {isNaN(statistics.totalRevenue) ||
                  !isFinite(statistics.totalRevenue)
                    ? "0.00"
                    : statistics.totalRevenue.toFixed(2)}{" "}
                  triệu đồng
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">Tổng đơn hàng</span>
                <span className="font-bold text-blue-600">
                  {statistics.totalOrders.toLocaleString()} đơn
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">
                  Giá trị TB/đơn
                </span>
                <span className="font-bold text-purple-600">
                  {isNaN(statistics.averageOrderValue) ||
                  !isFinite(statistics.averageOrderValue)
                    ? "0.00"
                    : statistics.averageOrderValue.toFixed(2)}{" "}
                  triệu đồng
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-orange-800">
                  Tỷ lệ chuyển đổi
                </span>
                <span className="font-bold text-orange-600">
                  {isNaN(statistics.conversionRate) ||
                  !isFinite(statistics.conversionRate)
                    ? "0.0"
                    : statistics.conversionRate.toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Top sản phẩm bán chạy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={topProductsColumns}
            data={statistics.topProducts}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            highlightOnHover
            responsive
            noDataComponent={
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu sản phẩm
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
