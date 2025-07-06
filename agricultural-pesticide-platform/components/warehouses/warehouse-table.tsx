"use client"

import { memo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, MapPin, Phone, Mail, Building } from "lucide-react"
import type { Invenstory } from "@/types/entities"
import { formatDate } from "@/lib/utils/date"

interface WarehouseTableProps {
  warehouses: Invenstory[]
  onToggleLock: (warehouseId: string) => void
  onEditWarehouse: (warehouseId: string) => void
  onDeleteWarehouse: (warehouseId: string) => void
  loading?: boolean
}

export const WarehouseTable = memo<WarehouseTableProps>(
  ({ warehouses, onToggleLock, onEditWarehouse, onDeleteWarehouse, loading = false }) => {
    const getStatusBadge = useCallback((isLocked: boolean) => {
      return isLocked
        ? { label: "Đã khóa", variant: "destructive" as const }
        : { label: "Đang hoạt động", variant: "default" as const, className: "bg-[#90c577] hover:bg-[#74a65d]" }
    }, [])

    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#accc8b]/10 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-[#accc8b]/30 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#accc8b]/20 hover:bg-[#accc8b]/30">
              <TableHead className="text-[#44703d] font-semibold">Hình ảnh</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Thông tin kho</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Nhà phân phối</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Địa chỉ</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Trạng thái</TableHead>
              <TableHead className="text-[#44703d] font-semibold">Khóa/Mở</TableHead>
              <TableHead className="text-[#44703d] font-semibold w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.invenstory_id} className="hover:bg-[#accc8b]/10 transition-colors">
                <TableCell>
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#accc8b]/10 flex items-center justify-center">
                    {warehouse.invenstory_img ? (
                      <img
                        src={warehouse.invenstory_img || "/placeholder.svg"}
                        alt={warehouse.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-[#90c577]" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-[#44703d]">{warehouse.name}</div>
                    <div className="text-sm text-[#74a65d]">
                      <span className="font-medium">GPKD:</span> {warehouse.business_license}
                    </div>
                    <div className="text-xs text-[#90c577]">Tạo: {formatDate(warehouse.created_at)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-[#44703d]">{warehouse.distributor.full_name}</div>
                    <div className="flex items-center gap-1 text-sm text-[#74a65d]">
                      <Phone className="h-3 w-3" />
                      {warehouse.distributor.phone_number}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#74a65d]">
                      <Mail className="h-3 w-3" />
                      {warehouse.distributor.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1 text-sm text-[#74a65d] max-w-xs">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-3">{warehouse.invenstory_address}</span>
                  </div>
                  {warehouse.invenstory_lat && warehouse.invenstory_lng && (
                    <div className="text-xs text-[#90c577] mt-1">
                      📍 {warehouse.invenstory_lat.toFixed(4)}, {warehouse.invenstory_lng.toFixed(4)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadge(warehouse.is_locked || false).variant}
                    className={getStatusBadge(warehouse.is_locked || false).className}
                  >
                    {getStatusBadge(warehouse.is_locked || false).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={!warehouse.is_locked}
                    onCheckedChange={() => onToggleLock(warehouse.invenstory_id)}
                    className="data-[state=checked]:bg-[#74a65d]"
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#90c577]/20">
                        <MoreHorizontal className="h-4 w-4 text-[#44703d]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#accc8b]">
                      <DropdownMenuItem
                        onClick={() => onEditWarehouse(warehouse.invenstory_id)}
                        className="hover:bg-[#accc8b]/20 text-[#44703d]"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteWarehouse(warehouse.invenstory_id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa kho hàng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
)

WarehouseTable.displayName = "WarehouseTable"
