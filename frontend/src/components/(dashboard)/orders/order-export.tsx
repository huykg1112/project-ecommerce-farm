"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/lib_dashboard/types/order";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useCallback } from "react";

interface OrderExportProps {
  orders: Order[];
  loading?: boolean;
}

export function OrderExport({ orders, loading = false }: OrderExportProps) {
  const exportToCSV = useCallback(() => {
    const headers = [
      "Mã đơn hàng",
      "Khách hàng",
      "Email",
      "Trạng thái",
      "Phương thức thanh toán",
      "Tổng tiền",
      "Ngày đặt",
      "Địa chỉ giao hàng",
    ];

    const csvData = orders.map((order) => [
      order.order_code,
      order.user.full_name,
      order.user.email,
      order.status.status_name,
      order.payment_method.method_name,
      order.total_amount,
      new Date(order.created_at).toLocaleDateString("vi-VN"),
      order.shipping_address,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\\n");

    const blob = new Blob([`\\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `don-hang-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [orders]);

  const exportToJSON = useCallback(() => {
    const exportData = {
      export_date: new Date().toISOString(),
      total_orders: orders.length,
      total_amount: orders.reduce((sum, order) => sum + order.total_amount, 0),
      orders: orders.map((order) => ({
        order_code: order.order_code,
        customer: {
          name: order.user.full_name,
          email: order.user.email,
        },
        status: order.status.status_name,
        payment_method: order.payment_method.method_name,
        total_amount: order.total_amount,
        created_at: order.created_at,
        shipping_address: order.shipping_address,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `don-hang-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  }, [orders]);

  const exportSummary = useCallback(() => {
    const summary = {
      total_orders: orders.length,
      total_revenue: formatCurrency(
        orders.reduce((sum, order) => sum + order.total_amount, 0)
      ),
      by_status: orders.reduce((acc, order) => {
        const status = order.status.status_name;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_payment_method: orders.reduce((acc, order) => {
        const method = order.payment_method.method_name;
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      export_date: new Date().toLocaleDateString("vi-VN"),
    };

    const content = `BÁO CÁO TỔNG QUAN ĐƠN HÀNG
===============================

Ngày xuất báo cáo: ${summary.export_date}
Tổng số đơn hàng: ${summary.total_orders}
Tổng doanh thu: ${summary.total_revenue}

PHÂN BỔ THEO TRẠNG THÁI:
${Object.entries(summary.by_status)
  .map(([status, count]) => `- ${status}: ${count} đơn`)
  .join("\\n")}

PHÂN BỔ THEO PHƯƠNG THỨC THANH TOÁN:
${Object.entries(summary.by_payment_method)
  .map(([method, count]) => `- ${method}: ${count} đơn`)
  .join("\\n")}

CHI TIẾT ĐƠN HÀNG:
==================
${orders
  .map(
    (order) =>
      `${order.order_code} | ${order.user.full_name} | ${
        order.status.status_name
      } | ${formatCurrency(order.total_amount)}`
  )
  .join("\\n")}`;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-don-hang-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
  }, [orders]);

  if (orders.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <Download className="w-4 h-4 mr-2" />
          Xuất dữ liệu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Xuất JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportSummary} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Báo cáo tổng quan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
