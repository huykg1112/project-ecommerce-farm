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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DashboardData,
  TimeRange,
} from "@/lib_dashboard/services/dashboard-service";
import {
  ExportOptions,
  exportService,
} from "@/lib_dashboard/services/export-service";
import { ChevronDown, Download, FileText, Table } from "lucide-react";
import { useState } from "react";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: DashboardData;
  timeRange: TimeRange;
}

export function ExportReportModal({
  isOpen,
  onClose,
  dashboardData,
  timeRange,
}: ExportReportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    includeCharts: true,
    includeWarnings: true,
    includeActivities: true,
  });

  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(true);
    try {
      const options = { ...exportOptions, format };

      if (format === "pdf") {
        await exportService.exportDashboardToPDF(
          dashboardData,
          timeRange,
          options
        );
      } else {
        await exportService.exportDashboardToExcel(
          dashboardData,
          timeRange,
          options
        );
      }

      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWarehouseAlertsExport = async () => {
    if (dashboardData.warnings.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      await exportService.exportWarehouseAlertsToPDF(dashboardData.warnings);
      onClose();
    } catch (error) {
      console.error("Warehouse alerts export error:", error);
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
            Xuất báo cáo
          </DialogTitle>
          <DialogDescription>
            Chọn định dạng và nội dung báo cáo bạn muốn xuất
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Tùy chọn nội dung</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-charts" className="text-sm">
                  Bao gồm biểu đồ
                </Label>
                <Switch
                  id="include-charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeCharts: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-warnings" className="text-sm">
                  Bao gồm cảnh báo kho
                </Label>
                <Switch
                  id="include-warnings"
                  checked={exportOptions.includeWarnings}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeWarnings: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-activities" className="text-sm">
                  Bao gồm hoạt động gần đây
                </Label>
                <Switch
                  id="include-activities"
                  checked={exportOptions.includeActivities}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeActivities: checked,
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
                onClick={() => handleExport("pdf")}
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
                onClick={() => handleExport("excel")}
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

            {/* Warehouse Alerts Export */}
            {dashboardData.warnings.length > 0 && (
              <>
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">
                    Báo cáo chuyên biệt
                  </h4>
                  <Button
                    onClick={handleWarehouseAlertsExport}
                    disabled={isExporting}
                    className="w-full flex items-center gap-2 h-10"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4" />
                    Báo cáo cảnh báo kho (PDF)
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ExportDropdownProps {
  dashboardData: DashboardData;
  timeRange: TimeRange;
}

export function ExportDropdown({
  dashboardData,
  timeRange,
}: ExportDropdownProps) {
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async (format: "pdf" | "excel") => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format,
        includeCharts: true,
        includeWarnings: true,
        includeActivities: true,
      };

      if (format === "pdf") {
        await exportService.exportDashboardToPDF(
          dashboardData,
          timeRange,
          options
        );
      } else {
        await exportService.exportDashboardToExcel(
          dashboardData,
          timeRange,
          options
        );
      }
    } catch (error) {
      console.error("Quick export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isExporting}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Xuất báo cáo
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleQuickExport("pdf")}
            disabled={isExporting}
            className="cursor-pointer"
          >
            <FileText className="h-4 w-4 mr-2" />
            Xuất PDF nhanh
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleQuickExport("excel")}
            disabled={isExporting}
            className="cursor-pointer"
          >
            <Table className="h-4 w-4 mr-2" />
            Xuất Excel nhanh
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowModal(true)}
            disabled={isExporting}
            className="cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Tùy chọn nâng cao...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dashboardData={dashboardData}
        timeRange={timeRange}
      />
    </>
  );
}
