"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Order,
  OrderStatusEnum,
  OrderStatusLabels,
} from "@/lib_dashboard/types/order";
import Image from "next/image";
import { useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface OrderTableProps {
  orders: Order[];
  // selectedOrders: string[];
  // onSelectOrder: (orderId: string) => void;
  // onSelectAll: (checked: boolean) => void;
  onViewDetails: (order: Order) => void;
  onConfirmOrder: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  loading: boolean;
  // isAllSelected: boolean;
  // isIndeterminate: boolean;
  // canConfirmOrder: (order: Order) => boolean;
  // canCancelOrder: (order: Order) => boolean;
  // canUpdateOrderStatus: (order: Order) => boolean;
}

export function OrderTable({
  orders,
  // onSelectOrder,
  // onSelectAll,
  onViewDetails,
  onCancelOrder,
  onConfirmOrder,
  onUpdateStatus,
  loading,
}: OrderTableProps) {
  // Handle selection
  // const handleSelectOrder = useCallback(
  //   (orderId: string) => {
  //     onSelectOrder(orderId);
  //   },
  //   [onSelectOrder]
  // );

  // const handleSelectAll = useCallback(
  //   (checked: boolean) => {
  //     onSelectAll(checked);
  //   },
  //   [onSelectAll]
  // );

  // Status badge component
  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      [OrderStatusEnum.PENDING]: {
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        icon: "⏳",
      },
      [OrderStatusEnum.CONFIRMED]: {
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        icon: "✅",
      },
      [OrderStatusEnum.SHIPPING]: {
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        icon: "🚚",
      },
      [OrderStatusEnum.DELIVERED]: {
        color: "bg-green-100 text-green-800 hover:bg-green-200",
        icon: "📦",
      },
      [OrderStatusEnum.CANCELLED]: {
        color: "bg-red-100 text-red-800 hover:bg-red-200",
        icon: "❌",
      },
      [OrderStatusEnum.RETURNED]: {
        color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        icon: "↩️",
      },
      [OrderStatusEnum.FAILED]: {
        color: "bg-red-100 text-red-800 hover:bg-red-200",
        icon: "⚠️",
      },
      [OrderStatusEnum.REFUNDED]: {
        color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        icon: "💰",
      },
      [OrderStatusEnum.COMPLETED]: {
        color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        icon: "🎉",
      },
    };

    const config =
      statusConfig[status as OrderStatusEnum] ||
      statusConfig[OrderStatusEnum.PENDING];

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

    const config =
      methodConfig[method as keyof typeof methodConfig] || methodConfig.COD;

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
  const columns: TableColumn<Order>[] = [
    // Order Code
    {
      name: "Mã đơn hàng",
      selector: (row: Order) => row.order_code,
      sortable: true,
      width: "150px",
      cell: (row: Order) => (
        <div className="font-mono text-sm font-medium text-[#44703d]">
          {row.order_code}
        </div>
      ),
    },
    // Customer
    {
      name: "Người mua",
      selector: (row: Order) => row.user.full_name,
      sortable: true,
      cell: (row: Order) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.user.avatar || "/placeholder.svg"}
            alt={row.user.full_name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-[#44703d]">{row.user.full_name}</span>
        </div>
      ),
    },
    // Created Date
    {
      name: "Ngày đặt hàng",
      selector: (row: Order) =>
        new Date(row.created_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      sortable: true,
      cell: (row: Order) => (
        <span className="text-sm text-[#44703d]">
          {new Date(row.created_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    // Estimated Delivery Date
    {
      name: "Ngày giao dự kiến",
      selector: (row: Order) =>
        row.estimated_delivery_date
          ? new Date(row.estimated_delivery_date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Chưa xác định",
      sortable: true,
      cell: (row: Order) => (
        <span className="text-sm text-[#44703d]">
          {row.estimated_delivery_date
            ? new Date(row.estimated_delivery_date).toLocaleDateString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )
            : "Chưa xác định"}
        </span>
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
    // Actions
    {
      name: "Thao tác",
      cell: (row: Order) => (
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(row)}
            className="text-sm text-blue-600 hover:underline"
          >
            Xem hóa đơn
          </button>
          {row.status.status_name === OrderStatusEnum.PENDING && (
            <button
              onClick={() => onConfirmOrder(row)}
              className="text-sm text-green-600 hover:underline"
            >
              Xác nhận đơn
            </button>
          )}
          <button
            onClick={() => onUpdateStatus(row)}
            className="text-sm text-green-600 hover:underline"
          >
            Cập nhật đơn
          </button>
          <button
            onClick={() => onCancelOrder(row)}
            className="text-sm text-red-600 hover:underline"
          >
            Hủy đơn
          </button>
        </div>
      ),
      width: "80px",
      right: true,
    },
  ];

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
        Chưa có đơn hàng nào được tạo hoặc không có đơn hàng nào phù hợp với bộ
        lọc
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
