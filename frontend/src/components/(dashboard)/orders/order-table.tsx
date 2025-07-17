"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderStatusEnum, OrderStatusLabels } from "@/lib_dashboard/types/order";
import {
  CheckCircle,
  Eye,
  MoreHorizontal,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface OrderTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (orderId: string) => void;
  onConfirmOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string) => void;
  loading: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  canConfirmOrder: (order: Order) => boolean;
  canCancelOrder: (order: Order) => boolean;
  canUpdateOrderStatus: (order: Order) => boolean;
}

export function OrderTable({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onViewDetails,
  onConfirmOrder,
  onCancelOrder,
  onUpdateStatus,
  loading,
  isAllSelected,
  isIndeterminate,
  canConfirmOrder,
  canCancelOrder,
  canUpdateOrderStatus,
}: OrderTableProps) {
  // Handle selection
  const handleSelectOrder = useCallback(
    (orderId: string) => {
      onSelectOrder(orderId);
    },
    [onSelectOrder]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      onSelectAll(checked);
    },
    [onSelectAll]
  );

  // Status badge component
  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      [OrderStatusEnum.PENDING]: { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", icon: "⏳" },
      [OrderStatusEnum.CONFIRMED]: { color: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: "✅" },
      [OrderStatusEnum.SHIPPING]: { color: "bg-purple-100 text-purple-800 hover:bg-purple-200", icon: "🚚" },
      [OrderStatusEnum.DELIVERED]: { color: "bg-green-100 text-green-800 hover:bg-green-200", icon: "📦" },
      [OrderStatusEnum.CANCELLED]: { color: "bg-red-100 text-red-800 hover:bg-red-200", icon: "❌" },
      [OrderStatusEnum.RETURNED]: { color: "bg-orange-100 text-orange-800 hover:bg-orange-200", icon: "↩️" },
      [OrderStatusEnum.FAILED]: { color: "bg-red-100 text-red-800 hover:bg-red-200", icon: "⚠️" },
      [OrderStatusEnum.REFUNDED]: { color: "bg-gray-100 text-gray-800 hover:bg-gray-200", icon: "💰" },
      [OrderStatusEnum.COMPLETED]: { color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: "🎉" },
    };

    const config = statusConfig[status as OrderStatusEnum] || statusConfig[OrderStatusEnum.PENDING];

    return (
      <Badge className={`${config.color} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {OrderStatusLabels[status as OrderStatusEnum] || status}
      </Badge>
    );
  }, []);

  // Payment method badge
  const getPaymentMethodBadge = useCallback((method: string) => {
    const methodConfig = {
      COD: { color: "bg-orange-100 text-orange-800", icon: "💵" },
      VNPAY: { color: "bg-blue-100 text-blue-800", icon: "💳" },
    };

    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.COD;

    return (
      <Badge variant="outline" className={`${config.color} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {method}
      </Badge>
    );
  }, []);

  // Format date
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Define columns
  const columns: TableColumn<Order>[] = useMemo(
    () => [
      // Selection column
      {
        name: (
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onCheckedChange={handleSelectAll}
            aria-label="Chọn tất cả đơn hàng"
          />
        ),
        cell: (row) => (
          <Checkbox
            checked={selectedOrders.includes(row.order_id)}
            onCheckedChange={() => handleSelectOrder(row.order_id)}
            aria-label={`Chọn đơn hàng ${row.order_code}`}
          />
        ),
        width: "50px",
        sortable: false,
      },
      // Order Code
      {
        name: "Mã đơn hàng",
        selector: (row) => row.order_code,
        sortable: true,
        width: "150px",
        cell: (row) => (
          <div className="font-mono text-sm font-medium text-[#44703d]">
            {row.order_code}
          </div>
        ),
      },
      // Customer
      {
        name: "Khách hàng",
        selector: (row) => row.user.full_name,
        sortable: true,
        width: "200px",
        cell: (row) => (
          <div className="space-y-1">
            <div className="font-medium text-sm">{row.user.full_name}</div>
            <div className="text-xs text-gray-500">{row.user.email}</div>
            {row.user.phone_number && (
              <div className="text-xs text-gray-500">{row.user.phone_number}</div>
            )}
          </div>
        ),
      },
      // Distributor
      {
        name: "Nhà phân phối",
        selector: (row) => row.distributor.full_name,
        sortable: true,
        width: "180px",
        cell: (row) => (
          <div className="space-y-1">
            <div className="font-medium text-sm">{row.distributor.full_name}</div>
            <div className="text-xs text-gray-500">{row.distributor.email}</div>
          </div>
        ),
      },
      // Status
      {
        name: "Trạng thái",
        selector: (row) => row.status.status_name,
        sortable: true,
        width: "150px",
        cell: (row) => getStatusBadge(row.status.status_name),
      },
      // Payment Method
      {
        name: "Thanh toán",
        selector: (row) => row.payment_method.method_name,
        sortable: true,
        width: "120px",
        cell: (row) => getPaymentMethodBadge(row.payment_method.method_name),
      },
      // Total Amount
      {
        name: "Tổng tiền",
        selector: (row) => row.total_amount,
        sortable: true,
        width: "130px",
        cell: (row) => (
          <div className="font-semibold text-[#44703d]">
            {formatCurrency(row.total_amount)}
          </div>
        ),
        right: true,
      },
      // Created Date
      {
        name: "Ngày tạo",
        selector: (row) => row.created_at,
        sortable: true,
        width: "150px",
        cell: (row) => (
          <div className="text-sm text-gray-600">
            {formatDate(row.created_at)}
          </div>
        ),
      },
      // Actions
      {
        name: "Thao tác",
        cell: (row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(row.order_id)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {canConfirmOrder(row) && (
                <DropdownMenuItem
                  onClick={() => onConfirmOrder(row.order_id)}
                  className="text-green-600 focus:text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Xác nhận đơn hàng
                </DropdownMenuItem>
              )}
              
              {canCancelOrder(row) && (
                <DropdownMenuItem
                  onClick={() => onCancelOrder(row.order_id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy đơn hàng
                </DropdownMenuItem>
              )}
              
              {canUpdateOrderStatus(row) && (
                <DropdownMenuItem onClick={() => onUpdateStatus(row.order_id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cập nhật trạng thái
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        width: "80px",
        right: true,
      },
    ],
    [
      isAllSelected,
      isIndeterminate,
      selectedOrders,
      handleSelectAll,
      handleSelectOrder,
      getStatusBadge,
      getPaymentMethodBadge,
      formatDate,
      onViewDetails,
      onConfirmOrder,
      onCancelOrder,
      onUpdateStatus,
      canConfirmOrder,
      canCancelOrder,
      canUpdateOrderStatus,
    ]
  );

  // Custom styles for the table
  const customStyles = {
    header: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e9ecef",
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e9ecef",
        fontSize: "14px",
        fontWeight: "600",
        color: "#44703d",
      },
    },
    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#44703d",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "14px",
        color: "#374151",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        borderBottom: "1px solid #f3f4f6",
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f0f9ff",
        borderBottomColor: "#e0e7ff",
        outline: "1px solid #e0e7ff",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e9ecef",
        minHeight: "56px",
      },
    },
  };

  // No data component
  const NoDataComponent = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">📋</div>
      <div className="text-lg font-medium text-gray-600 mb-2">
        Không có đơn hàng nào
      </div>
      <div className="text-sm text-gray-500">
        Chưa có đơn hàng nào được tạo hoặc không có đơn hàng nào phù hợp với bộ lọc
      </div>
    </div>
  );

  // Progress component
  const ProgressComponent = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#44703d]"></div>
        <div className="text-[#44703d] font-medium">Đang tải dữ liệu...</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <DataTable
        columns={columns}
        data={orders}
        progressPending={loading}
        progressComponent={<ProgressComponent />}
        noDataComponent={<NoDataComponent />}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="600px"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationComponentOptions={{
          rowsPerPageText: "Hiển thị:",
          rangeSeparatorText: "của",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Tất cả",
        }}
        selectableRows={false} // We handle selection manually
        dense={false}
      />
    </div>
  );
}