"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/lib/toast-provider";
import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { formatCurrency } from "@/lib_dashboard/utils/formatters";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronDown, Download, FileText, Table } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

// Extend jsPDF interface for autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface BatchProductExportOptions {
  includeExpired?: boolean;
  includeLowStock?: boolean;
  includeInactive?: boolean;
}

interface BatchProductExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchProducts: BatchProduct[];
  title?: string;
}

export function BatchProductExportModal({
  isOpen,
  onClose,
  batchProducts,
  title = "Danh sách lô sản phẩm",
}: BatchProductExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<BatchProductExportOptions>(
    {
      includeExpired: true,
      includeLowStock: true,
      includeInactive: false,
    }
  );

  const getFilteredData = () => {
    let filtered = [...batchProducts];

    if (!exportOptions.includeInactive) {
      filtered = filtered.filter((item) => item.is_active);
    }

    return filtered;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(68, 112, 61);
      doc.text(title.toUpperCase(), pageWidth / 2, yPosition, {
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

      yPosition += 10;
      doc.text(
        `Tổng số lô: ${getFilteredData().length}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 20;

      // Statistics
      const filteredData = getFilteredData();
      const activeBatches = filteredData.filter((b) => b.is_active).length;
      const expiringSoon = filteredData.filter((b) => {
        const expiry = new Date(b.expiry_date);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return expiry <= sevenDaysFromNow && b.is_active;
      }).length;
      const lowStock = filteredData.filter(
        (b) => b.quantity <= b.low_stock_threshold && b.is_active
      ).length;

      const statsData = [
        ["Tổng lô sản phẩm", filteredData.length.toString()],
        ["Lô đang hoạt động", activeBatches.toString()],
        ["Lô sắp hết hạn", expiringSoon.toString()],
        ["Lô sắp hết hàng", lowStock.toString()],
      ];

      doc.setFontSize(14);
      doc.setTextColor(68, 112, 61);
      doc.text("THỐNG KÊ TỔNG QUAN", 20, yPosition);
      yPosition += 10;

      autoTable(doc, {
        startY: yPosition,
        head: [["Chỉ số", "Giá trị"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40, halign: "right" },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }

      // Batch Products Table
      doc.setFontSize(14);
      doc.setTextColor(68, 112, 61);
      doc.text("CHI TIẾT LÔ SẢN PHẨM", 20, yPosition);
      yPosition += 10;

      const tableData = filteredData.map((item) => [
        item.batch_number,
        item.product.product_name.substring(0, 25) +
          (item.product.product_name.length > 25 ? "..." : ""),
        item.quantity.toString(),
        item.low_stock_threshold.toString(),
        format(new Date(item.expiry_date), "dd/MM/yy"),
        formatCurrency(item.unit_product_price),
        item.is_active ? "Hoạt động" : "Tạm dừng",
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [
          ["Mã lô", "Sản phẩm", "SL", "Ngưỡng", "Hết hạn", "Giá", "Trạng thái"],
        ],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [68, 112, 61] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 45 },
          2: { cellWidth: 15, halign: "right" },
          3: { cellWidth: 20, halign: "right" },
          4: { cellWidth: 20 },
          5: { cellWidth: 25, halign: "right" },
          6: { cellWidth: 20 },
        },
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Trang ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
        doc.text("Hệ thống quản lý kho - FARME", 20, pageHeight - 10);
      }

      const fileName = `batch-products-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.pdf`;
      doc.save(fileName);

      showToast.success("Xuất báo cáo PDF thành công!");
      onClose();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast.error("Lỗi khi xuất báo cáo PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      const filteredData = getFilteredData();

      // Summary Sheet
      const summaryData = [
        [title.toUpperCase()],
        [
          `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}`,
        ],
        [`Tổng số lô: ${filteredData.length}`],
        [],
        ["THỐNG KÊ TỔNG QUAN"],
        ["Chỉ số", "Giá trị"],
        ["Tổng lô sản phẩm", filteredData.length],
        ["Lô đang hoạt động", filteredData.filter((b) => b.is_active).length],
        [
          "Lô sắp hết hạn",
          filteredData.filter((b) => {
            const expiry = new Date(b.expiry_date);
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            return expiry <= sevenDaysFromNow && b.is_active;
          }).length,
        ],
        [
          "Lô sắp hết hàng",
          filteredData.filter(
            (b) => b.quantity <= b.low_stock_threshold && b.is_active
          ).length,
        ],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");

      // Detailed Data Sheet
      const detailData = [
        ["CHI TIẾT LÔ SẢN PHẨM"],
        [],
        [
          "Mã lô",
          "Tên sản phẩm",
          "Số lượng",
          "Ngưỡng tối thiểu",
          "Ngày sản xuất",
          "Ngày hết hạn",
          "Giá bán",
          "Trạng thái",
          "Loại sản phẩm",
          "Kho",
        ],
        ...filteredData.map((item) => [
          item.batch_number,
          item.product.product_name,
          item.quantity,
          item.low_stock_threshold,
          format(new Date(item.manufactured_date), "dd/MM/yyyy"),
          format(new Date(item.expiry_date), "dd/MM/yyyy"),
          item.unit_product_price,
          item.is_active ? "Hoạt động" : "Tạm dừng",
          item.product_types?.type_name || "N/A",
          item.invenstory?.warehouse_name || "N/A",
        ]),
      ];

      const detailSheet = XLSX.utils.aoa_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, "Chi tiết");

      // Expiring Soon Sheet
      const expiringSoon = filteredData.filter((b) => {
        const expiry = new Date(b.expiry_date);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return expiry <= sevenDaysFromNow && b.is_active;
      });

      if (expiringSoon.length > 0) {
        const expiringData = [
          ["LÔ SẢN PHẨM SẮP HẾT HẠN"],
          [],
          [
            "Mã lô",
            "Tên sản phẩm",
            "Số lượng",
            "Ngày hết hạn",
            "Số ngày còn lại",
          ],
          ...expiringSoon.map((item) => {
            const daysLeft = Math.ceil(
              (new Date(item.expiry_date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return [
              item.batch_number,
              item.product.product_name,
              item.quantity,
              format(new Date(item.expiry_date), "dd/MM/yyyy"),
              daysLeft,
            ];
          }),
        ];

        const expiringSheet = XLSX.utils.aoa_to_sheet(expiringData);
        XLSX.utils.book_append_sheet(workbook, expiringSheet, "Sắp hết hạn");
      }

      // Low Stock Sheet
      const lowStock = filteredData.filter(
        (b) => b.quantity <= b.low_stock_threshold && b.is_active
      );

      if (lowStock.length > 0) {
        const lowStockData = [
          ["LÔ SẢN PHẨM SẮP HẾT HÀNG"],
          [],
          [
            "Mã lô",
            "Tên sản phẩm",
            "Số lượng hiện tại",
            "Ngưỡng tối thiểu",
            "Tỷ lệ còn lại",
          ],
          ...lowStock.map((item) => [
            item.batch_number,
            item.product.product_name,
            item.quantity,
            item.low_stock_threshold,
            `${Math.round((item.quantity / item.low_stock_threshold) * 100)}%`,
          ]),
        ];

        const lowStockSheet = XLSX.utils.aoa_to_sheet(lowStockData);
        XLSX.utils.book_append_sheet(workbook, lowStockSheet, "Sắp hết hàng");
      }

      const fileName = `batch-products-${format(
        new Date(),
        "ddMMyyyy-HHmm"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showToast.success("Xuất báo cáo Excel thành công!");
      onClose();
    } catch (error) {
      console.error("Error exporting Excel:", error);
      showToast.error("Lỗi khi xuất báo cáo Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-agricultural-primary">
            <Download className="h-5 w-5" />
            Xuất báo cáo lô sản phẩm
          </DialogTitle>
          <DialogDescription>
            Chọn định dạng và tùy chọn cho báo cáo lô sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Tùy chọn nội dung</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-expired" className="text-sm">
                  Bao gồm lô sắp hết hạn
                </Label>
                <Switch
                  id="include-expired"
                  checked={exportOptions.includeExpired}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeExpired: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-low-stock" className="text-sm">
                  Bao gồm lô sắp hết hàng
                </Label>
                <Switch
                  id="include-low-stock"
                  checked={exportOptions.includeLowStock}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeLowStock: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-inactive" className="text-sm">
                  Bao gồm lô đã tạm dừng
                </Label>
                <Switch
                  id="include-inactive"
                  checked={exportOptions.includeInactive}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeInactive: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Định dạng xuất</h4>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={exportToPDF}
                disabled={isExporting}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                <FileText className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-gray-500">Báo cáo chi tiết</div>
                </div>
              </Button>

              <Button
                onClick={exportToExcel}
                disabled={isExporting}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                <Table className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Excel</div>
                  <div className="text-xs text-gray-500">Dữ liệu thô</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Số lô sẽ xuất:</strong> {getFilteredData().length} /{" "}
            {batchProducts.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BatchProductExportButtonProps {
  batchProducts: BatchProduct[];
  title?: string;
  variant?: "button" | "dropdown";
}

export function BatchProductExportButton({
  batchProducts,
  title,
  variant = "button",
}: BatchProductExportButtonProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === "dropdown") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất dữ liệu
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setShowModal(true)}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Tùy chọn xuất...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <BatchProductExportModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          batchProducts={batchProducts}
          title={title}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Xuất dữ liệu
      </Button>

      <BatchProductExportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        batchProducts={batchProducts}
        title={title}
      />
    </>
  );
}
