import { showToast } from "@/lib/toast-provider";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BatchProduct } from "../types/batch-product";
import { formatCurrency } from "../utils/formatters";
import { DashboardData, TimeRange } from "./dashboard-service";

// Extend jsPDF interface for autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportOptions {
  format: "pdf" | "excel";
  includeCharts?: boolean;
  includeWarnings?: boolean;
  includeActivities?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

class ExportService {
  // Export dashboard report to PDF
  async exportDashboardToPDF(
    dashboardData: DashboardData,
    timeRange: TimeRange,
    options: Partial<ExportOptions> = {}
  ) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(68, 112, 61); // Agricultural green
      doc.text("BÁO CÁO DASHBOARD NÔNG NGHIỆP", pageWidth / 2, yPosition, {
        align: "center",
      });

      yPosition += 15;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Thời gian: ${this.getTimeRangeLabel(timeRange)}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 10;
      doc.text(
        `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 20;

      // Summary Statistics
      doc.setFontSize(16);
      doc.setTextColor(68, 112, 61);
      doc.text("THỐNG KÊ TỔNG QUAN", 20, yPosition);
      yPosition += 15;

      const summaryData = [
        ["Tổng người dùng", dashboardData.stats.totalUsers.toLocaleString()],
        [
          "Người dùng mới",
          dashboardData.stats.newUsersThisMonth.toLocaleString(),
        ],
        [
          "Tổng nhà phân phối",
          dashboardData.stats.totalDistributors.toLocaleString(),
        ],
        [
          "Nhà phân phối mới",
          dashboardData.stats.newDistributorsThisMonth.toLocaleString(),
        ],
        ["Tổng đơn hàng", dashboardData.stats.totalOrders.toLocaleString()],
        ["Doanh thu", formatCurrency(dashboardData.stats.totalRevenue)],
      ];

      doc.autoTable({
        startY: yPosition,
        head: [["Chỉ số", "Giá trị"]],
        body: summaryData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 60, halign: "right" },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Warehouse Warnings
      if (
        options.includeWarnings !== false &&
        dashboardData.warnings.length > 0
      ) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(68, 112, 61);
        doc.text("CẢNH BÁO KHO HÀNG", 20, yPosition);
        yPosition += 15;

        const warningData = dashboardData.warnings.map((warning) => [
          warning.title,
          warning.description,
          warning.severity === "high"
            ? "Cao"
            : warning.severity === "medium"
            ? "Trung bình"
            : "Thấp",
          warning.count.toString(),
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Loại cảnh báo", "Mô tả", "Mức độ", "Số lượng"]],
          body: warningData,
          theme: "striped",
          headStyles: { fillColor: [68, 112, 61] },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 80 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30, halign: "right" },
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }

      // Revenue Data
      if (dashboardData.revenueData.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(68, 112, 61);
        doc.text("DỮ LIỆU DOANH THU", 20, yPosition);
        yPosition += 15;

        const revenueTableData = dashboardData.revenueData.map((item) => [
          item.period,
          formatCurrency(item.revenue * 1000000), // Convert back from millions
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Thời kỳ", "Doanh thu"]],
          body: revenueTableData,
          theme: "striped",
          headStyles: { fillColor: [68, 112, 61] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 80, halign: "right" },
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }

      // User Distribution
      if (dashboardData.userDistribution.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(68, 112, 61);
        doc.text("PHÂN BỐ NGƯỜI DÙNG", 20, yPosition);
        yPosition += 15;

        const userDistributionData = dashboardData.userDistribution.map(
          (item) => [
            item.name,
            item.value.toString(),
            `${(
              (item.value /
                dashboardData.userDistribution.reduce(
                  (sum, u) => sum + u.value,
                  0
                )) *
              100
            ).toFixed(1)}%`,
          ]
        );

        doc.autoTable({
          startY: yPosition,
          head: [["Loại người dùng", "Số lượng", "Tỷ lệ"]],
          body: userDistributionData,
          theme: "striped",
          headStyles: { fillColor: [68, 112, 61] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 40, halign: "right" },
            2: { cellWidth: 40, halign: "right" },
          },
        });
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Trang ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
        doc.text("Hệ thống quản lý nông nghiệp - FARME", 20, pageHeight - 10);
      }

      // Save PDF
      const fileName = `dashboard-report-${timeRange}-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo PDF thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo PDF");
      throw error;
    }
  }

  // Export dashboard report to Excel
  async exportDashboardToExcel(
    dashboardData: DashboardData,
    timeRange: TimeRange,
    options: Partial<ExportOptions> = {}
  ) {
    try {
      const workbook = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ["BÁO CÁO DASHBOARD NÔNG NGHIỆP"],
        [`Thời gian: ${this.getTimeRangeLabel(timeRange)}`],
        [
          `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}`,
        ],
        [],
        ["THỐNG KÊ TỔNG QUAN"],
        ["Chỉ số", "Giá trị"],
        ["Tổng người dùng", dashboardData.stats.totalUsers],
        ["Người dùng mới", dashboardData.stats.newUsersThisMonth],
        ["Tổng nhà phân phối", dashboardData.stats.totalDistributors],
        ["Nhà phân phối mới", dashboardData.stats.newDistributorsThisMonth],
        ["Tổng đơn hàng", dashboardData.stats.totalOrders],
        ["Doanh thu", dashboardData.stats.totalRevenue],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

      // Style the header
      summarySheet["A1"] = { v: "BÁO CÁO DASHBOARD NÔNG NGHIỆP", t: "s" };
      summarySheet["A5"] = { v: "THỐNG KÊ TỔNG QUAN", t: "s" };

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");

      // Revenue Data Sheet
      if (dashboardData.revenueData.length > 0) {
        const revenueData = [
          ["DỮ LIỆU DOANH THU"],
          [],
          ["Thời kỳ", "Doanh thu (VNĐ)"],
          ...dashboardData.revenueData.map((item) => [
            item.period,
            item.revenue * 1000000, // Convert back from millions
          ]),
        ];

        const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(workbook, revenueSheet, "Doanh thu");
      }

      // User Distribution Sheet
      if (dashboardData.userDistribution.length > 0) {
        const totalUsers = dashboardData.userDistribution.reduce(
          (sum, u) => sum + u.value,
          0
        );
        const userDistributionData = [
          ["PHÂN BỐ NGƯỜI DÙNG"],
          [],
          ["Loại người dùng", "Số lượng", "Tỷ lệ (%)"],
          ...dashboardData.userDistribution.map((item) => [
            item.name,
            item.value,
            parseFloat(((item.value / totalUsers) * 100).toFixed(1)),
          ]),
        ];

        const userSheet = XLSX.utils.aoa_to_sheet(userDistributionData);
        XLSX.utils.book_append_sheet(workbook, userSheet, "Phân bố người dùng");
      }

      // Warnings Sheet
      if (
        options.includeWarnings !== false &&
        dashboardData.warnings.length > 0
      ) {
        const warningsData = [
          ["CẢNH BÁO KHO HÀNG"],
          [],
          ["Loại cảnh báo", "Mô tả", "Mức độ", "Số lượng"],
          ...dashboardData.warnings.map((warning) => [
            warning.title,
            warning.description,
            warning.severity === "high"
              ? "Cao"
              : warning.severity === "medium"
              ? "Trung bình"
              : "Thấp",
            warning.count,
          ]),
        ];

        const warningsSheet = XLSX.utils.aoa_to_sheet(warningsData);
        XLSX.utils.book_append_sheet(workbook, warningsSheet, "Cảnh báo kho");

        // Add detailed warnings data
        dashboardData.warnings.forEach((warning, index) => {
          if (warning.items.length > 0) {
            const itemsData = [
              [`CHI TIẾT: ${warning.title.toUpperCase()}`],
              [],
              [
                "Mã lô",
                "Tên sản phẩm",
                "Số lượng",
                "Ngưỡng tối thiểu",
                "Ngày hết hạn",
                "Giá bán",
              ],
              ...warning.items.map((item: BatchProduct) => [
                item.batch_number,
                item.product.product_name,
                item.quantity,
                item.low_stock_threshold,
                format(new Date(item.expiry_date), "dd/MM/yyyy"),
                item.unit_product_price,
              ]),
            ];

            const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
            XLSX.utils.book_append_sheet(
              workbook,
              itemsSheet,
              `Chi tiết ${index + 1}`
            );
          }
        });
      }

      // Activities Sheet
      if (
        options.includeActivities !== false &&
        dashboardData.recentActivities.length > 0
      ) {
        const activitiesData = [
          ["HOẠT ĐỘNG GÂN ĐÂY"],
          [],
          ["Thời gian", "Tiêu đề", "Mô tả", "Loại"],
          ...dashboardData.recentActivities.map((activity) => [
            format(new Date(activity.timestamp), "dd/MM/yyyy HH:mm", {
              locale: vi,
            }),
            activity.title,
            activity.description,
            activity.type,
          ]),
        ];

        const activitiesSheet = XLSX.utils.aoa_to_sheet(activitiesData);
        XLSX.utils.book_append_sheet(workbook, activitiesSheet, "Hoạt động");
      }

      // Save Excel file
      const fileName = `dashboard-report-${timeRange}-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel");
      throw error;
    }
  }

  // Export warehouse alerts to PDF
  async exportWarehouseAlertsToPDF(warnings: any[]) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text("BÁO CÁO CẢNH BÁO KHO HÀNG", pageWidth / 2, yPosition, {
        align: "center",
      });

      yPosition += 15;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 20;

      for (const warning of warnings) {
        if (warning.items.length > 0) {
          // Warning title
          doc.setFontSize(14);
          doc.setTextColor(68, 112, 61);
          doc.text(warning.title.toUpperCase(), 20, yPosition);
          yPosition += 15;

          // Items table
          const itemsData = warning.items.map((item: BatchProduct) => [
            item.batch_number,
            item.product.product_name,
            item.quantity.toString(),
            item.low_stock_threshold.toString(),
            format(new Date(item.expiry_date), "dd/MM/yyyy"),
            formatCurrency(item.unit_product_price),
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [["Mã lô", "Sản phẩm", "SL", "Ngưỡng", "Hết hạn", "Giá"]],
            body: itemsData,
            theme: "striped",
            headStyles: { fillColor: [68, 112, 61] },
            styles: { fontSize: 8, cellPadding: 3 },
            columnStyles: {
              0: { cellWidth: 25 },
              1: { cellWidth: 60 },
              2: { cellWidth: 20, halign: "right" },
              3: { cellWidth: 20, halign: "right" },
              4: { cellWidth: 25 },
              5: { cellWidth: 30, halign: "right" },
            },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 15;

          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
        }
      }

      const fileName = `warehouse-alerts-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo cảnh báo kho thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting warehouse alerts PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo cảnh báo kho");
      throw error;
    }
  }

  private getTimeRangeLabel(timeRange: TimeRange): string {
    switch (timeRange) {
      case "day":
        return "Hôm nay";
      case "week":
        return "Tuần này";
      case "month":
        return "Tháng này";
      case "year":
        return "Năm này";
      default:
        return "Tháng này";
    }
  }
}

export const exportService = new ExportService();
