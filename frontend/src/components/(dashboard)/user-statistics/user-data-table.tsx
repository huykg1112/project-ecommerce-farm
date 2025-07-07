"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib_dashboard/utils/date";
import type { User } from "@/types/entities";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { memo, useMemo, useState } from "react";

interface UserDataTableProps {
  users: User[];
  loading?: boolean;
}

export const UserDataTable = memo<UserDataTableProps>(
  ({ users, loading = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date" | "role">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredAndSortedUsers = useMemo(() => {
      let filtered = users;

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.full_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.phone_number.includes(searchTerm)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "name":
            comparison = a.full_name.localeCompare(b.full_name);
            break;
          case "date":
            comparison =
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime();
            break;
          case "role":
            comparison = a.role.role_name.localeCompare(b.role.role_name);
            break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });

      return filtered;
    }, [users, searchTerm, sortBy, sortOrder]);

    const paginatedUsers = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredAndSortedUsers.slice(startIndex, endIndex);
    }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
      return Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    }, [filteredAndSortedUsers.length, itemsPerPage]);

    const getRoleBadge = (role: string) => {
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
    };

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

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40 border-[#90c577] focus:border-[#74a65d] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#accc8b]">
                <SelectItem value="date">Ngày đăng ký</SelectItem>
                <SelectItem value="name">Tên</SelectItem>
                <SelectItem value="role">Vai trò</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
                <TableHead className="text-[#44703d] font-semibold">
                  Thông tin người dùng
                </TableHead>
                <TableHead className="text-[#44703d] font-semibold">
                  Số điện thoại
                </TableHead>
                <TableHead className="text-[#44703d] font-semibold">
                  Email
                </TableHead>
                <TableHead className="text-[#44703d] font-semibold">
                  Vai trò
                </TableHead>
                <TableHead className="text-[#44703d] font-semibold">
                  Ngày đăng ký
                </TableHead>
                <TableHead className="text-[#44703d] font-semibold">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user.user_id}
                  className="hover:bg-[#accc8b]/10 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.full_name}
                        />
                        <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#44703d]">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-[#74a65d]">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#44703d]">
                    {user.phone_number}
                  </TableCell>
                  <TableCell className="text-[#44703d]">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getRoleBadge(user.role.role_name).variant}
                      className="font-medium"
                    >
                      {getRoleBadge(user.role.role_name).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#44703d]">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadge(user.is_active).variant}
                      className={getStatusBadge(user.is_active).className}
                    >
                      {getStatusBadge(user.is_active).label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
            <span>trong tổng số {filteredAndSortedUsers.length} kết quả</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#44703d] mr-4">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-[#90c577] hover:bg-[#accc8b]/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

UserDataTable.displayName = "UserDataTable";
