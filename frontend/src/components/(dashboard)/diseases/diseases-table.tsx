"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Edit, Lock, MoreHorizontal, Trash2, Unlock } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DiseaseTableData } from "@/lib_dashboard/types/disease";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface DiseaseTableProps {
  diseases: DiseaseTableData[];
  selectedDiseases: string[];
  onSelectDisease: (diseaseId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (diseaseId: string) => void;
  onEditDisease: (diseaseId: string) => void;
  onDeleteDisease: (diseaseId: string) => void;
  loading?: boolean;
}

export const DiseaseTable = memo<DiseaseTableProps>(
  ({
    diseases,
    selectedDiseases,
    onSelectDisease,
    onSelectAll,
    onToggleStatus,
    onEditDisease,
    onDeleteDisease,
    loading = false,
  }) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const isAllSelected = useMemo(() => {
      return diseases.length > 0 && selectedDiseases.length === diseases.length;
    }, [diseases.length, selectedDiseases.length]);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã bị khóa", variant: "destructive" as const };
    }, []);
    const columns = [
      {
        name: (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Chọn tất cả"
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        width: "48px",
        cell: (row: DiseaseTableData) => (
          <Checkbox
            checked={selectedDiseases.includes(row.disease_id)}
            onCheckedChange={() => onSelectDisease(row.disease_id)}
            aria-label={`Chọn ${row.disease_name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      {
        name: "Tên bệnh",
        selector: (row: DiseaseTableData) => row.disease_name,
        sortable: true,
        cell: (row: DiseaseTableData) => (
          <div className="font-semibold text-[#44703d]">{row.disease_name}</div>
        ),
        allowOverflow: true,
        width: "200px",
      },
      {
        name: "Mô tả",
        selector: (row: DiseaseTableData) => row.description,
        cell: (row: DiseaseTableData) => (
          <div className="text-[#74a65d]">{row.description}</div>
        ),
      },
      {
        name: "Trạng thái",
        selector: (row: DiseaseTableData) => row.is_active,
        sortable: true,
        cell: (row: DiseaseTableData) => {
          const { label, variant, className } = getStatusBadge(row.is_active);
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
        allowOverflow: true,
        width: "150px",
      },
      {
        name: "Kích hoạt",
        selector: (row: DiseaseTableData) => row.is_active,
        cell: (row: DiseaseTableData) => (
          <Switch
            checked={row.is_active}
            onCheckedChange={() => onToggleStatus(row.disease_id)}
            className="data-[state=checked]:bg-[#74a65d]"
          />
        ),
        width: "120px",
      },
      {
        width: "80px",
        cell: (row: DiseaseTableData) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-[#90c577]/20"
              >
                <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border-[#accc8b]"
            >
              <DropdownMenuItem
                onClick={() => onEditDisease(row.disease_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(row.disease_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                {row.is_active ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Khóa bệnh
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Mở khóa bệnh
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteDisease(row.disease_id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa bệnh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-[#accc8b]/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <DataTable
          columns={columns as TableColumn<DiseaseTableData>[]}
          data={diseases}
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          responsive
          fixedHeader
          fixedHeaderScrollHeight="600px"
          pagination
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
          noDataComponent={
            <div className="text-[#44703d] py-4">
              Không có dữ liệu để hiển thị
            </div>
          }
          paginationComponentOptions={{
            rowsPerPageText: "Hiển thị",
            rangeSeparatorText: "trong tổng số",
            noRowsPerPage: false,
          }}
        />
      </div>
    );
  }
);

DiseaseTable.displayName = "DiseaseTable";
