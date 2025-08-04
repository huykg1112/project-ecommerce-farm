"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  onExportPDF: () => Promise<void>;
  onExportExcel: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  buttonText?: string;
}

export function ExportButton({
  onExportPDF,
  onExportExcel,
  loading = false,
  disabled = false,
  buttonText = "Xuất báo cáo",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await onExportPDF();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await onExportExcel();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || loading || isExporting}
          className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleExportPDF}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          Xuất PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportExcel}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <Table className="h-4 w-4 mr-2 text-green-600" />
          Xuất Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
