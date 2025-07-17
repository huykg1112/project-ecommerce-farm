"use client";

import { OrderBatchActions } from "@/components/(dashboard)/orders/order-batch-actions";
import { OrderDetailModal } from "@/components/(dashboard)/orders/order-detail-modal";
import { OrderFilters } from "@/components/(dashboard)/orders/order-filters";
import { OrderTable } from "@/components/(dashboard)/orders/order-table";
import { OrderUpdateStatusModal } from "@/components/(dashboard)/orders/order-update-status-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useOrderManagement } from "@/hooks/use-order-management";
import { showToast } from "@/lib/toast-provider";
import { orderDetailModalAtom, updateStatusModalAtom } from "@/lib_dashboard/store/order-store-management";
import { useAtom } from "jotai";
import { Download, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export default function OrdersManagementPage() {
  const {
    // Data states
    filteredOrders,
    ordersLoading,
    orderStats,
    selectedOrders,
    orderCounts,
    filters,
    selectedOrder,

    // Loading states
    batchOperationLoading,

    // Selection states
    isAllSelected,
    isIndeterminate,

    // Query functions
    getAllOrders,
    getOrderStats,
    getOrderById,

    // Filter functions
    handleSearchChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleDateRangeChange,
    handleAmountRangeChange,
    resetOrderFilters,

    // Management functions
    handleConfirmOrder,
    handleCancelOrder,
    handleUpdateOrderStatus,
    handleBatchConfirmOrders,
    handleBatchCancelOrders,
    handleBatchUpdateStatus,

    // Selection functions
    handleToggleOrderSelection,
    handleToggleAllOrdersSelection,
    handleClearSelections,
    getSelectedCount,

    // Utility functions
    handleExportOrders,
    handleRefreshData,

    // Status helper functions
    canConfirmOrder,
    canCancelOrder,
    canUpdateOrderStatus,
    getPendingOrdersCount,
  } = useOrderManagement();

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useAtom(orderDetailModalAtom);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useAtom(updateStatusModalAtom);

  // Action handlers
  const handleViewDetails = useCallback(
    async (orderId: string) => {
      try {
        await getOrderById(orderId);
        setDetailModalOpen(true);
      } catch (error) {
        showToast.error("Không thể tải thông tin chi tiết đơn hàng");
      }
    },
    [getOrderById, setDetailModalOpen]
  );

  const handleConfirmOrderAction = useCallback(
    async (orderId: string) => {
      try {
        await handleConfirmOrder(orderId);
        showToast.success("Xác nhận đơn hàng thành công!");
      } catch (error) {
        showToast.error("Không thể xác nhận đơn hàng");
      }
    },
    [handleConfirmOrder]
  );

  const handleCancelOrderAction = useCallback(
    async (orderId: string) => {
      try {
        await handleCancelOrder(orderId);
        showToast.success("Hủy đơn hàng thành công!");
      } catch (error) {
        showToast.error("Không thể hủy đơn hàng");
      }
    },
    [handleCancelOrder]
  );

  const handleUpdateStatusAction = useCallback(
    async (orderId: string) => {
      try {
        await getOrderById(orderId);
        setUpdateStatusModalOpen(true);
      } catch (error) {
        showToast.error("Không thể tải thông tin đơn hàng");
      }
    },
    [getOrderById, setUpdateStatusModalOpen]
  );

  const handleUpdateStatusSubmit = useCallback(
    async (statusId: string, notes?: string) => {
      if (!selectedOrder) return;
      
      try {
        await handleUpdateOrderStatus(selectedOrder.order_id, { status_id: statusId, notes });
        showToast.success("Cập nhật trạng thái đơn hàng thành công!");
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái đơn hàng");
        throw error;
      }
    },
    [selectedOrder, handleUpdateOrderStatus]
  );

  // Batch action handlers
  const handleBatchConfirm = useCallback(async () => {
    try {
      await handleBatchConfirmOrders(selectedOrders);
      showToast.success("Xác nhận hàng loạt thành công!");
    } catch (error) {
      showToast.error("Không thể xác nhận hàng loạt");
    }
  }, [handleBatchConfirmOrders, selectedOrders]);

  const handleBatchCancel = useCallback(async () => {
    try {
      await handleBatchCancelOrders(selectedOrders);
      showToast.success("Hủy hàng loạt thành công!");
    } catch (error) {
      showToast.error("Không thể hủy hàng loạt");
    }
  }, [handleBatchCancelOrders, selectedOrders]);

  const handleBatchUpdateStatusAction = useCallback(async () => {
    // This would open a modal to select new status for batch
    // For now, just show a message
    showToast.info("Tính năng cập nhật trạng thái hàng loạt đang được phát triển");
  }, []);

  const handleExport = useCallback(async () => {
    try {
      await handleExportOrders();
    } catch (error) {
      showToast.error("Không thể xuất dữ liệu");
    }
  }, [handleExportOrders]);

  const handleRefresh = useCallback(async () => {
    try {
      await handleRefreshData();
      showToast.success("Làm mới dữ liệu thành công!");
    } catch (error) {
      showToast.error("Không thể làm mới dữ liệu");
    }
  }, [handleRefreshData]);

  // Statistics for cards
  const stats = useMemo(
    () => ({
      total: orderStats.total_orders,
      pending: orderStats.pending_orders,
      confirmed: orderStats.confirmed_orders,
      shipping: orderStats.shipping_orders,
      delivered: orderStats.delivered_orders,
      cancelled: orderStats.cancelled_orders,
      completed: orderStats.completed_orders,
    }),
    [orderStats]
  );

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
  }, [setDetailModalOpen]);

  const closeUpdateStatusModal = useCallback(() => {
    setUpdateStatusModalOpen(false);
  }, [setUpdateStatusModalOpen]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#44703d]">
            📋 Quản lý đơn hàng
          </h1>
          <p className="text-[#74a65d] mt-1">
            Quản lý và theo dõi tất cả đơn hàng trong hệ thống
          </p>
          {getPendingOrdersCount() > 0 && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              ⚠️ Có {getPendingOrdersCount()} đơn hàng chờ xác nhận
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={ordersLoading}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={ordersLoading}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        stats={[
          {
            title: "Tổng đơn hàng",
            value: stats.total,
            icon: "📋",
            color: "bg-blue-100 text-blue-800",
          },
          {
            title: "Chờ xác nhận",
            value: stats.pending,
            icon: "⏳",
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            title: "Đã xác nhận",
            value: stats.confirmed,
            icon: "✅",
            color: "bg-green-100 text-green-800",
          },
          {
            title: "Đang giao",
            value: stats.shipping,
            icon: "🚚",
            color: "bg-purple-100 text-purple-800",
          },
          {
            title: "Đã giao",
            value: stats.delivered,
            icon: "📦",
            color: "bg-emerald-100 text-emerald-800",
          },
          {
            title: "Hoàn thành",
            value: stats.completed,
            icon: "🎉",
            color: "bg-indigo-100 text-indigo-800",
          },
        ]}
        title="đơn hàng"
        loading={ordersLoading}
      />

      {/* Filters */}
      <OrderFilters
        search={filters.search || ""}
        status={filters.status || ""}
        payment_method={filters.payment_method || ""}
        date_from={filters.date_from || ""}
        date_to={filters.date_to || ""}
        amount_min={filters.amount_min}
        amount_max={filters.amount_max}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPaymentMethodChange={handlePaymentMethodChange}
        onDateRangeChange={handleDateRangeChange}
        onAmountRangeChange={handleAmountRangeChange}
        onReset={resetOrderFilters}
      />

      {/* Batch Actions */}
      <OrderBatchActions
        selectedCount={getSelectedCount()}
        onBatchConfirm={handleBatchConfirm}
        onBatchCancel={handleBatchCancel}
        onBatchUpdateStatus={handleBatchUpdateStatusAction}
        onClearSelection={handleClearSelections}
        loading={batchOperationLoading}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        selectedOrders={selectedOrders}
        onSelectOrder={handleToggleOrderSelection}
        onSelectAll={handleToggleAllOrdersSelection}
        onViewDetails={handleViewDetails}
        onConfirmOrder={handleConfirmOrderAction}
        onCancelOrder={handleCancelOrderAction}
        onUpdateStatus={handleUpdateStatusAction}
        loading={ordersLoading}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        canConfirmOrder={canConfirmOrder}
        canCancelOrder={canCancelOrder}
        canUpdateOrderStatus={canUpdateOrderStatus}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onClose={closeDetailModal}
        loading={ordersLoading}
      />

      {/* Update Status Modal */}
      <OrderUpdateStatusModal
        order={selectedOrder}
        open={updateStatusModalOpen}
        onClose={closeUpdateStatusModal}
        onSubmit={handleUpdateStatusSubmit}
        loading={batchOperationLoading}
        orderStatuses={orderStatuses}
      />
    </div>
  );
}