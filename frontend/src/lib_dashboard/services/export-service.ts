import { showToast } from "@/lib/toast-provider";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

      autoTable(doc, {
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

        autoTable(doc, {
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

        autoTable(doc, {
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

        autoTable(doc, {
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

          autoTable(doc, {
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

  // Export Agency Requests to PDF
  async exportAgencyRequestsToPDF(requests: any[]) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text("BÁO CÁO YÊU CẦU ĐẠI LÝ", pageWidth / 2, yPosition, {
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

      // Statistics
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(
        (req) => !req.approved_date
      ).length;
      const approvedRequests = requests.filter(
        (req) => req.request_status
      ).length;
      const rejectedRequests = requests.filter(
        (req) => !req.request_status
      ).length;

      const statsData = [
        ["Tổng số yêu cầu", totalRequests.toString()],
        ["Chờ duyệt", pendingRequests.toString()],
        ["Đã phê duyệt", approvedRequests.toString()],
        ["Đã từ chối", rejectedRequests.toString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [["Thống kê", "Số lượng"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Requests table
      doc.setFontSize(14);
      doc.setTextColor(68, 112, 61);
      doc.text("CHI TIẾT YÊU CẦU", 20, yPosition);
      yPosition += 10;

      const requestsData = requests.map((request) => [
        request.id?.toString() || "",
        request.name || "",
        request.phone || "",
        request.email || "",
        request.request_status ? "Đã duyệt" : "Chờ duyệt",
        request.approved_date
          ? format(new Date(request.approved_date), "dd/MM/yyyy")
          : "",
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["ID", "Tên", "SĐT", "Email", "Trạng thái", "Ngày duyệt"]],
        body: requestsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      const fileName = `agency-requests-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo yêu cầu đại lý thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting agency requests PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo yêu cầu đại lý");
      throw error;
    }
  }

  // Export Agency Requests to Excel
  async exportAgencyRequestsToExcel(requests: any[]) {
    try {
      const workbook = XLSX.utils.book_new();

      // Statistics sheet
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(
        (req) => !req.approved_date
      ).length;
      const approvedRequests = requests.filter(
        (req) => req.request_status
      ).length;
      const rejectedRequests = requests.filter(
        (req) => !req.request_status
      ).length;

      const statsData = [
        ["Thống kê yêu cầu đại lý"],
        [""],
        ["Thống kê", "Số lượng"],
        ["Tổng số yêu cầu", totalRequests],
        ["Chờ duyệt", pendingRequests],
        ["Đã phê duyệt", approvedRequests],
        ["Đã từ chối", rejectedRequests],
      ];

      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Thống kê");

      // Requests details sheet
      const requestsData = [
        [
          "ID",
          "Tên",
          "Số điện thoại",
          "Email",
          "Trạng thái",
          "Ngày duyệt",
          "Ghi chú",
        ],
        ...requests.map((request) => [
          request.id || "",
          request.name || "",
          request.phone || "",
          request.email || "",
          request.request_status ? "Đã duyệt" : "Chờ duyệt",
          request.approved_date
            ? format(new Date(request.approved_date), "dd/MM/yyyy")
            : "",
          request.notes || "",
        ]),
      ];

      const requestsSheet = XLSX.utils.aoa_to_sheet(requestsData);
      XLSX.utils.book_append_sheet(workbook, requestsSheet, "Chi tiết yêu cầu");

      const fileName = `agency-requests-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel yêu cầu đại lý thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting agency requests Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel yêu cầu đại lý");
      throw error;
    }
  }

  // Export Orders to PDF
  async exportOrdersToPDF(orders: any[]) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text("BÁO CÁO QUẢN LÝ ĐỢN HÀNG", pageWidth / 2, yPosition, {
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

      // Statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );
      const statusCounts = orders.reduce((acc: any, order) => {
        const status = order.status?.status_name || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statsData = [
        ["Tổng đơn hàng", totalOrders.toString()],
        ["Tổng doanh thu", formatCurrency(totalRevenue)],
        ...Object.entries(statusCounts).map(([status, count]) => [
          status,
          (count as number).toString(),
        ]),
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [["Thống kê", "Giá trị"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Orders table
      doc.setFontSize(14);
      doc.setTextColor(68, 112, 61);
      doc.text("CHI TIẾT ĐƠN HÀNG", 20, yPosition);
      yPosition += 10;

      const ordersData = orders.map((order) => [
        order.order_code || "",
        order.user?.name || "",
        formatCurrency(order.total_amount || 0),
        order.status?.status_name || "",
        order.payment_method?.method_name || "",
        format(new Date(order.created_at), "dd/MM/yyyy"),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [
          [
            "Mã đơn",
            "Khách hàng",
            "Tổng tiền",
            "Trạng thái",
            "Thanh toán",
            "Ngày tạo",
          ],
        ],
        body: ordersData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 8, cellPadding: 3 },
      });

      const fileName = `orders-report-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo đơn hàng thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting orders PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo đơn hàng");
      throw error;
    }
  }

  // Export Orders to Excel
  async exportOrdersToExcel(orders: any[]) {
    try {
      const workbook = XLSX.utils.book_new();

      // Statistics sheet
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );
      const statusCounts = orders.reduce((acc: any, order) => {
        const status = order.status?.status_name || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statsData = [
        ["Báo cáo quản lý đơn hàng"],
        [""],
        ["Thống kê", "Giá trị"],
        ["Tổng đơn hàng", totalOrders],
        ["Tổng doanh thu", totalRevenue],
        [""],
        ["Trạng thái đơn hàng", "Số lượng"],
        ...Object.entries(statusCounts).map(([status, count]) => [
          status,
          count as number,
        ]),
      ];

      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Thống kê");

      // Orders details sheet
      const ordersData = [
        [
          "Mã đơn hàng",
          "ID đơn hàng",
          "Khách hàng",
          "Email",
          "SĐT",
          "Tổng tiền",
          "Trạng thái",
          "Phương thức thanh toán",
          "Ngày tạo",
          "Địa chỉ giao hàng",
        ],
        ...orders.map((order) => [
          order.order_code || "",
          order.order_id || "",
          order.user?.name || "",
          order.user?.email || "",
          order.user?.phone || "",
          order.total_amount || 0,
          order.status?.status_name || "",
          order.payment_method?.method_name || "",
          format(new Date(order.created_at), "dd/MM/yyyy HH:mm"),
          order.shipping_address || "",
        ]),
      ];

      const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(workbook, ordersSheet, "Chi tiết đơn hàng");

      const fileName = `orders-report-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel đơn hàng thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting orders Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel đơn hàng");
      throw error;
    }
  }

  // Export Products to PDF
  async exportProductsToPDF(products: any[]) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text("BÁO CÁO QUẢN LÝ SẢN PHẨM", pageWidth / 2, yPosition, {
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

      // Statistics
      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.is_active).length;
      const inactiveProducts = products.filter((p) => !p.is_active).length;
      const avgPrice =
        products.reduce((sum, p) => sum + (p.unit_product_price || 0), 0) /
        totalProducts;

      const statsData = [
        ["Tổng sản phẩm", totalProducts.toString()],
        ["Sản phẩm hoạt động", activeProducts.toString()],
        ["Sản phẩm ngừng hoạt động", inactiveProducts.toString()],
        ["Giá trung bình", formatCurrency(avgPrice || 0)],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [["Thống kê", "Giá trị"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Products table
      doc.setFontSize(14);
      doc.setTextColor(68, 112, 61);
      doc.text("CHI TIẾT SẢN PHẨM", 20, yPosition);
      yPosition += 10;

      const productsData = products.map((product) => [
        product.product_id || "",
        product.product_name || "",
        formatCurrency(product.unit_product_price || 0),
        product.is_active ? "Hoạt động" : "Ngừng",
        product.manufacturer?.manufacturer_name || "",
        format(new Date(product.created_at || new Date()), "dd/MM/yyyy"),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [
          [
            "ID",
            "Tên sản phẩm",
            "Giá",
            "Trạng thái",
            "Nhà sản xuất",
            "Ngày tạo",
          ],
        ],
        body: productsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 8, cellPadding: 3 },
      });

      const fileName = `products-report-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo sản phẩm thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting products PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo sản phẩm");
      throw error;
    }
  }

  // Export Products to Excel
  async exportProductsToExcel(products: any[]) {
    try {
      const workbook = XLSX.utils.book_new();

      // Statistics sheet
      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.is_active).length;
      const inactiveProducts = products.filter((p) => !p.is_active).length;
      const avgPrice =
        products.reduce((sum, p) => sum + (p.unit_product_price || 0), 0) /
        totalProducts;

      const statsData = [
        ["Báo cáo quản lý sản phẩm"],
        [""],
        ["Thống kê", "Giá trị"],
        ["Tổng sản phẩm", totalProducts],
        ["Sản phẩm hoạt động", activeProducts],
        ["Sản phẩm ngừng hoạt động", inactiveProducts],
        ["Giá trung bình", avgPrice || 0],
      ];

      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Thống kê");

      // Products details sheet
      const productsData = [
        [
          "ID sản phẩm",
          "Tên sản phẩm",
          "Mô tả",
          "Giá bán",
          "Trạng thái",
          "Nhà sản xuất",
          "Danh mục",
          "Ngày tạo",
          "Hướng dẫn sử dụng",
        ],
        ...products.map((product) => [
          product.product_id || "",
          product.product_name || "",
          product.description || "",
          product.unit_product_price || 0,
          product.is_active ? "Hoạt động" : "Ngừng hoạt động",
          product.manufacturer?.manufacturer_name || "",
          product.categories?.map((c: any) => c.category_name).join(", ") || "",
          format(new Date(product.created_at || new Date()), "dd/MM/yyyy"),
          product.usage_instructions || "",
        ]),
      ];

      const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(
        workbook,
        productsSheet,
        "Chi tiết sản phẩm"
      );

      const fileName = `products-report-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel sản phẩm thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting products Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel sản phẩm");
      throw error;
    }
  }

  // Export User Statistics to PDF
  async exportUserStatisticsToPDF(usersData: any, filteredUsers: any[]) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text("BÁO CÁO THỐNG KÊ NGƯỜI DÙNG", pageWidth / 2, yPosition, {
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

      // Statistics
      const statsData = [
        ["Tổng người dùng", usersData.totalUsers?.toString() || "0"],
        ["Người dùng hoạt động", usersData.activeUsers?.toString() || "0"],
        [
          "Người dùng không hoạt động",
          usersData.inactiveUsers?.toString() || "0",
        ],
        [
          "Người dùng mới tháng này",
          usersData.newUsersThisMonth?.toString() || "0",
        ],
        [
          "Người dùng mới năm này",
          usersData.newUsersThisYear?.toString() || "0",
        ],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [["Thống kê", "Giá trị"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Role distribution
      if (usersData.roleDistribution && usersData.roleDistribution.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(68, 112, 61);
        doc.text("PHÂN BỔ THEO VAI TRÒ", 20, yPosition);
        yPosition += 10;

        const roleData = usersData.roleDistribution.map((role: any) => [
          role.role_name || "",
          role.count?.toString() || "0",
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [["Vai trò", "Số lượng"]],
          body: roleData,
          theme: "striped",
          headStyles: { fillColor: [68, 112, 61] },
          styles: { fontSize: 10, cellPadding: 5 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }

      // Users table (first 50 users)
      if (filteredUsers.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(68, 112, 61);
        doc.text(
          `CHI TIẾT NGƯỜI DÙNG (${Math.min(
            filteredUsers.length,
            50
          )} đầu tiên)`,
          20,
          yPosition
        );
        yPosition += 10;

        const usersData = filteredUsers
          .slice(0, 50)
          .map((user) => [
            user.user_id || "",
            user.full_name || user.name || "",
            user.email || "",
            user.role?.role_name || "",
            user.is_active ? "Hoạt động" : "Không",
            format(new Date(user.created_at || new Date()), "dd/MM/yyyy"),
          ]);

        autoTable(doc, {
          startY: yPosition,
          head: [["ID", "Tên", "Email", "Vai trò", "Trạng thái", "Ngày tạo"]],
          body: usersData,
          theme: "striped",
          headStyles: { fillColor: [68, 112, 61] },
          styles: { fontSize: 8, cellPadding: 3 },
        });
      }

      const fileName = `user-statistics-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo thống kê người dùng thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting user statistics PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo thống kê người dùng");
      throw error;
    }
  }

  // Export User Statistics to Excel
  async exportUserStatisticsToExcel(usersData: any, filteredUsers: any[]) {
    try {
      const workbook = XLSX.utils.book_new();

      // Statistics sheet
      const statsData = [
        ["Báo cáo thống kê người dùng"],
        [""],
        ["Thống kê tổng quan", "Giá trị"],
        ["Tổng người dùng", usersData.totalUsers || 0],
        ["Người dùng hoạt động", usersData.activeUsers || 0],
        ["Người dùng không hoạt động", usersData.inactiveUsers || 0],
        ["Người dùng mới tháng này", usersData.newUsersThisMonth || 0],
        ["Người dùng mới năm này", usersData.newUsersThisYear || 0],
      ];

      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Thống kê tổng quan");

      // Role distribution sheet
      if (usersData.roleDistribution && usersData.roleDistribution.length > 0) {
        const roleData = [
          ["Phân bổ theo vai trò"],
          [""],
          ["Vai trò", "Số lượng"],
          ...usersData.roleDistribution.map((role: any) => [
            role.role_name || "",
            role.count || 0,
          ]),
        ];

        const roleSheet = XLSX.utils.aoa_to_sheet(roleData);
        XLSX.utils.book_append_sheet(workbook, roleSheet, "Phân bổ vai trò");
      }

      // Users details sheet
      const usersDetailsData = [
        [
          "ID người dùng",
          "Tên đầy đủ",
          "Email",
          "Số điện thoại",
          "Vai trò",
          "Trạng thái",
          "Ngày tạo",
          "Lần đăng nhập cuối",
        ],
        ...filteredUsers.map((user) => [
          user.user_id || "",
          user.full_name || user.name || "",
          user.email || "",
          user.phone || "",
          user.role?.role_name || "",
          user.is_active ? "Hoạt động" : "Không hoạt động",
          format(new Date(user.created_at || new Date()), "dd/MM/yyyy"),
          user.last_login
            ? format(new Date(user.last_login), "dd/MM/yyyy HH:mm")
            : "",
        ]),
      ];

      const usersSheet = XLSX.utils.aoa_to_sheet(usersDetailsData);
      XLSX.utils.book_append_sheet(workbook, usersSheet, "Chi tiết người dùng");

      const fileName = `user-statistics-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel thống kê người dùng thành công!");
      return fileName;
    } catch (error) {
      console.error("Error exporting user statistics Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel thống kê người dùng");
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
