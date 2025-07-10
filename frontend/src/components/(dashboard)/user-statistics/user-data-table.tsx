"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib_dashboard/utils/date";
import type { User } from "@/types/entities";
import { Search } from "lucide-react";
import { memo, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

// Minimal custom styles to avoid styled-components
export const customStyles = {
  table: {
    style: {
      border: "1px solid rgba(172, 204, 139, 0.3)", // #accc8b/30
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      overflow: "hidden",
    },
  },

  headCells: {
    style: {
      color: "#44703d", // Consistent text color
      fontWeight: "700", // Bold font
      fontSize: "16px", // Larger text
      padding: "12px", // Extra padding for better spacing
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "rgba(172, 204, 139, 0.1)", // #accc8b/10
        transition: "background-color 0.2s",
      },
      color: "#44703d",
      fontSize: "14px",
    },
  },
  pagination: {
    style: {
      backgroundColor: "rgba(172, 204, 139, 0.1)", // #accc8b/10
      border: "1px solid rgba(172, 204, 139, 0.3)", // #accc8b/30
      borderRadius: "8px",
      color: "#44703d",
    },
  },
};

interface UserDataTableProps {
  users: User[];
  loading?: boolean;
}

export const UserDataTable = memo<UserDataTableProps>(
  ({ users, loading = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
      if (!searchTerm) return users;
      const searchLower = searchTerm.toLowerCase();
      return users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone_number.includes(searchTerm)
      );
    }, [users, searchTerm]);

    // Define columns
    const columns = [
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
              <div className="text-sm text-[#74a65d]">@{row.username}</div>
            </div>
          </div>
        ),
      },
      {
        name: "Số điện thoại",
        selector: (row: User) => row.phone_number,
        sortable: true,
        cell: (row: User) => (
          <div className="text-[#44703d] ">{row.phone_number}</div>
        ),
      },
      {
        name: "Email",
        selector: (row: User) => row.email,
        sortable: true,
        cell: (row: User) => <div className="text-[#44703d]">{row.email}</div>,
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
        name: "Ngày đăng ký",
        selector: (row: User) => row.created_at,
        sortable: true,
        cell: (row: User) => (
          <div className="text-[#44703d]">{formatDate(row.created_at)}</div>
        ),
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
    ];

    // Role badge logic
    const getRoleBadge = (role: string) => {
      const roleConfig = {
        Admin: { label: "Quản trị viên", variant: "default" as const },
        Distributor: { label: "Đại lý", variant: "secondary" as const },
        Client: { label: "Khách hàng", variant: "outline" as const },
      };
      return (
        roleConfig[role as keyof typeof roleConfig] || {
          label: role,
          variant: "outline" as const,
        }
      );
    };

    // Status badge logic
    const getStatusBadge = (isActive: boolean) => {
      return isActive
        ? {
            label: "Hoạt động",
            variant: "default" as const,
            className: "bg-[#90c577] hover:bg-[#74a65d]",
          }
        : { label: "Đã khóa", variant: "destructive" as const };
    };

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
      <div className="space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#74a65d]" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#90c577] focus:border-[#74a65d] bg-white"
            />
          </div>
        </div>

        {/* DataTable */}
        <div className="border border-[#accc8b]/30 rounded-lg bg-white overflow-hidden">
          <DataTable
            columns={columns as TableColumn<User>[]}
            data={filteredUsers}
            pagination
            paginationPerPage={itemsPerPage}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
            onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
            customStyles={customStyles}
            className="text-[#44703d]"
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

        {/* Pagination Controls
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#accc8b]/10 rounded-lg border border-[#accc8b]/30">
          <div className="flex items-center gap-2 text-sm text-[#44703d]">
            <span>Hiển thị</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20 h-8 border-[#90c577] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#accc8b]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>trong tổng số {filteredUsers.length} kết quả</span>
          </div>
        </div> */}
      </div>
    );
  }
);

UserDataTable.displayName = "UserDataTable";
