"use client"

import { memo, useMemo, useCallback, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Lock, Unlock, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import type { User } from "@/types/entities"
import { formatDate } from "@/lib/utils/date"

interface UserTableProps {
  users: User[]
  selectedUsers: string[]
  onSelectUser: (userId: string) => void
  onSelectAll: (checked: boolean) => void
  onToggleStatus: (userId: string) => void
  onViewDetails: (userId: string) => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
  loading?: boolean
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
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const isAllSelected = useMemo(() => {
      return users.length > 0 && selectedUsers.length === users.length
    }, [users.length, selectedUsers.length])

    const isIndeterminate = useMemo(() => {
      return selectedUsers.length > 0 && selectedUsers.length < users.length
    }, [selectedUsers.length, users.length])

    const toggleRowExpansion = useCallback((userId: string) => {
      setExpandedRows((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(userId)) {
          newSet.delete(userId)
        } else {
          newSet.add(userId)
        }
        return newSet
      })
    }, [])

    const getRoleBadge = useCallback((role: string) => {
      const roleConfig = {
        ADMIN: { label: "Quản trị viên", variant: "default" as const },
        DISTRIBUTOR: { label: "Đại lý", variant: "secondary" as const },
        CUSTOMER: { label: "Khách hàng", variant: "outline" as const },
      }
      return roleConfig[role as keyof typeof roleConfig] || { label: role, variant: "outline" as const }
    }, [])

    const getStatusBadge = useCallback((isActive: boolean) => {
      return isActive
        ? { label: "Đang hoạt động", variant: "default" as const, className: "bg-[#90c577] hover:bg-[#74a65d]" }
        : { label: "Đã bị khóa", variant: "destructive" as const }
    }, [])

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#accc8b]/10 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Chọn tất cả"
                  className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-[#44703d] font-semibold">Thông tin người dùng</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Vai trò</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Trạng thái</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Ngày đăng ký</TableHead>
              <TableHead className="text-[#44703d] font-semibold w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <>
                <TableRow key={user.user_id} className="hover:bg-[#accc8b]/10 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.user_id)}
                      onCheckedChange={() => onSelectUser(user.user_id)}
                      aria-label={`Chọn ${user.full_name}`}
                      className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(user.user_id)}
                      className="h-6 w-6 p-0 hover:bg-[#90c577]/20"
                    >
                      {expandedRows.has(user.user_id) ? (
                        <ChevronDown className="h-4 w-4 text-[#44703d]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#44703d]" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.full_name} />
                        <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#44703d]">{user.full_name}</div>
                        <div className="text-sm text-[#74a65d]">{user.email}</div>
                        <div className="text-sm text-[#74a65d]">{user.phone_number}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadge(user.role.role_name).variant} className="font-medium">
                      {getRoleBadge(user.role.role_name).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadge(user.is_active).variant}
                      className={getStatusBadge(user.is_active).className}
                    >
                      {getStatusBadge(user.is_active).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#44703d]">{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#90c577]/20">
                          <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#accc8b]">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(user.user_id)}
                          className="hover:bg-[#accc8b]/20 text-[#44703d]"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditUser(user.user_id)}
                          className="hover:bg-[#accc8b]/20 text-[#44703d]"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(user.user_id)}
                          className="hover:bg-[#accc8b]/20 text-[#44703d]"
                        >
                          {user.is_active ? (
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
                          onClick={() => onDeleteUser(user.user_id)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {/* Expanded Row */}
                {expandedRows.has(user.user_id) && (
                  <TableRow className="bg-[#accc8b]/5">
                    <TableCell colSpan={7}>
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-[#44703d]">Tên đăng nhập:</span>
                            <span className="ml-2 text-[#74a65d]">{user.username}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#44703d]">CCCD/CMND:</span>
                            <span className="ml-2 text-[#74a65d]">{user.cccd || "Chưa cập nhật"}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#44703d]">Cập nhật lần cuối:</span>
                            <span className="ml-2 text-[#74a65d]">{formatDate(user.updated_at)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-[#44703d]">Mô tả vai trò:</span>
                          <span className="ml-2 text-[#74a65d]">{user.role.description}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
)

UserTable.displayName = "UserTable"
