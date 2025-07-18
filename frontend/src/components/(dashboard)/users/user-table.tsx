"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib_dashboard/utils/date";
import type { User } from "@/types/entities";
import { Edit, Eye, Lock, MoreHorizontal, Trash2, Unlock } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../user-statistics/user-data-table";

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (userId: string) => void;
  onViewDetails: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  loading?: boolean;
}

export const UserTable = memo<UserTableProps>(
  ({
    users,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    onToggleStatus,
    onViewDetails,
    onEditUser,
    onDeleteUser,
    loading = false,
  }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const isAllSelected = useMemo(() => {
      return users.length > 0 && selectedUsers.length === users.length;
    }, [users.length, selectedUsers.length]);

    const isIndeterminate = useMemo(() => {
      return selectedUsers.length > 0 && selectedUsers.length < users.length;
    }, [selectedUsers.length, users.length]);

    const toggleRowExpansion = useCallback((userId: string) => {
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
        }
        return newSet;
      });
    }, []);

    const getRoleBadge = useCallback((role: string) => {
      const roleConfig = {
        ADMIN: { label: "Quản trị viên", variant: "default" as const },
        DISTRIBUTOR: { label: "Đại lý", variant: "secondary" as const },
        CUSTOMER: { label: "Khách hàng", variant: "outline" as const },
      };
      return (
        roleConfig[role as keyof typeof roleConfig] || {
          label: role,
          variant: "outline" as const,
        }
      );
    }, []);

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? {
            label: "Đang hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã bị khóa", variant: "destructive" as const };
    }, []);

    // Define columns for DataTable
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
        cell: (row: User) => (
          <Checkbox
            checked={selectedUsers.includes(row.user_id)}
            onCheckedChange={() => onSelectUser(row.user_id)}
            aria-label={`Chọn ${row.full_name}`}
            className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
          />
        ),
        allowOverflow: true,
      },
      // {
      //   name: "",
      //   width: "48px",
      //   cell: (row: User) => (
      //     <Button
      //       variant="ghost"
      //       size="sm"
      //       onClick={() => toggleRowExpansion(row.user_id)}
      //       className="h-6 w-6 p-0 hover:bg-[#90c577]/20"
      //     >
      //       {expandedRows.has(row.user_id) ? (
      //         <ChevronDown className="h-4 w-4 text-[#44703d]" />
      //       ) : (
      //         <ChevronRight className="h-4 w-4 text-[#44703d]" />
      //       )}
      //     </Button>
      //   ),
      //   allowOverflow: true,
      // },
      {
        name: "Thông tin người dùng",
        selector: (row: User) => row.full_name,
        sortable: true,
        cell: (row: User) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={row.avatar || "/placeholder.svg"}
                alt={row.full_name}
              />
              <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                {row.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-[#44703d]">
                {row.full_name}
              </div>
              <div className="text-sm text-[#74a65d]">{row.email}</div>
              <div className="text-sm text-[#74a65d]">{row.phone_number}</div>
            </div>
          </div>
        ),
      },
      {
        name: "Vai trò",
        selector: (row: User) => row.role.role_name,
        sortable: true,
        cell: (row: User) => {
          const { label, variant } = getRoleBadge(row.role.role_name);
          return (
            <Badge variant={variant} className="font-medium">
              {label}
            </Badge>
          );
        },
      },
      {
        name: "Trạng thái",
        selector: (row: User) => row.is_active,
        sortable: true,
        cell: (row: User) => {
          const { label, variant, className } = getStatusBadge(row.is_active);
          return (
            <Badge variant={variant} className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        name: "Ngày đăng ký",
        selector: (row: User) => row.created_at,
        sortable: true,
        cell: (row: User) => (
          <div className="text-[#44703d]">{formatDate(row.created_at)}</div>
        ),
      },
      {
        width: "80px",
        cell: (row: User) => (
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
                onClick={() => onViewDetails(row.user_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditUser(row.user_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(row.user_id)}
                className="hover:bg-[#accc8b]/20 text-[#44703d]"
              >
                {row.is_active ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Khóa tài khoản
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Mở khóa tài khoản
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteUser(row.user_id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    // Expanded row component
    const ExpandableRowComponent = ({ data }: { data: User }) => (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#44703d]">Tên đăng nhập:</span>
            <span className="ml-2 text-[#74a65d]">{data.username}</span>
          </div>
          <div>
            <span className="font-semibold text-[#44703d]">CCCD/CMND:</span>
            <span className="ml-2 text-[#74a65d]">
              {data.cccd || "Chưa cập nhật"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-[#44703d]">
              Cập nhật lần cuối:
            </span>
            <span className="ml-2 text-[#74a65d]">
              {formatDate(data.updated_at)}
            </span>
          </div>
        </div>
        <div>
          <span className="font-semibold text-[#44703d]">Mô tả vai trò:</span>
          <span className="ml-2 text-[#74a65d]">{data.role.description}</span>
        </div>
      </div>
    );

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
      <div className="border border-[#accc8b]/30 rounded-lg bg-white overflow-hidden">
        <DataTable
          columns={columns as TableColumn<User>[]}
          data={users}
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          responsive
          fixedHeader
          fixedHeaderScrollHeight="600px"
          expandableRows
          expandableRowsComponent={ExpandableRowComponent}
          expandableRowExpanded={(row: User) => expandedRows.has(row.user_id)}
          onRowClicked={(row: User) => toggleRowExpansion(row.user_id)}
          noDataComponent={
            <div className="text-[#44703d] py-4">
              Không có dữ liệu để hiển thị
            </div>
          }
        />
      </div>
    );
  }
);

UserTable.displayName = "UserTable";
