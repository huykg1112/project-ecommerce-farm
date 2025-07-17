import {
  batchCancelOrdersAtom,
  batchConfirmOrdersAtom,
  batchOperationLoadingAtom,
  batchUpdateStatusAtom,
  cancelOrderAtom,
  clearOrderSelectionsAtom,
  confirmOrderAtom,
  fetchOrderByIdAtom,
  fetchOrdersAtom,
  fetchOrderStatsAtom,
  fetchOrderStatusesAtom,
  filteredOrdersAtom,
  isAllOrdersSelectedAtom,
  isOrdersIndeterminateAtom,
  orderCountsByStatusAtom,
  orderFiltersAtom,
  ordersDataAtom,
  ordersLoadingAtom,
  orderStatsAtom,
  orderStatusesAtom,
  resetOrderFiltersAtom,
  selectedOrderAtom,
  selectedOrdersAtom,
  toggleAllOrdersSelectionAtom,
  toggleOrderSelectionAtom,
  updateOrderFiltersAtom,
  updateOrderStatusAtom,
  exportOrdersAtom,
  refreshOrderDataAtom,
} from "@/lib_dashboard/store/order-store-management";
import { BatchUpdateStatusRequest, OrderFilters, UpdateOrderStatusRequest } from "@/lib_dashboard/types/order";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

/**
 * Hook tổng hợp cho quản lý đơn hàng trong dashboard
 * Kết hợp tất cả functionality cần thiết cho trang quản lý đơn hàng
 */
export const useOrderManagement = () => {
  // === DIRECT ATOM ACCESS ===
  const allOrders = useAtomValue(ordersDataAtom);
  const filteredOrders = useAtomValue(filteredOrdersAtom);
  const ordersLoading = useAtomValue(ordersLoadingAtom);
  const orderStats = useAtomValue(orderStatsAtom);
  const selectedOrders = useAtomValue(selectedOrdersAtom);
  const orderCounts = useAtomValue(orderCountsByStatusAtom);
  const batchOperationLoading = useAtomValue(batchOperationLoadingAtom);
  const filters = useAtomValue(orderFiltersAtom);
  const selectedOrder = useAtomValue(selectedOrderAtom);
  const isAllSelected = useAtomValue(isAllOrdersSelectedAtom);
  const isIndeterminate = useAtomValue(isOrdersIndeterminateAtom);
  const orderStatuses = useAtomValue(orderStatusesAtom);

  // === ACTIONS ===
  const [, fetchOrders] = useAtom(fetchOrdersAtom);
  const [, fetchOrderStats] = useAtom(fetchOrderStatsAtom);
  const [, fetchOrderById] = useAtom(fetchOrderByIdAtom);
  const [, fetchOrderStatuses] = useAtom(fetchOrderStatusesAtom);
  const [, updateOrderStatus] = useAtom(updateOrderStatusAtom);
  const [, confirmOrder] = useAtom(confirmOrderAtom);
  const [, cancelOrder] = useAtom(cancelOrderAtom);
  const [, batchUpdateStatus] = useAtom(batchUpdateStatusAtom);
  const [, batchConfirmOrders] = useAtom(batchConfirmOrdersAtom);
  const [, batchCancelOrders] = useAtom(batchCancelOrdersAtom);

  // Filter actions
  const [, updateFilters] = useAtom(updateOrderFiltersAtom);
  const [, resetFilters] = useAtom(resetOrderFiltersAtom);

  // Selection actions
  const [, toggleOrderSelection] = useAtom(toggleOrderSelectionAtom);
  const [, toggleAllOrdersSelection] = useAtom(toggleAllOrdersSelectionAtom);
  const [, clearSelections] = useAtom(clearOrderSelectionsAtom);

  // Utility actions
  const [, exportOrders] = useAtom(exportOrdersAtom);
  const [, refreshData] = useAtom(refreshOrderDataAtom);

  // === MANAGEMENT FUNCTIONS ===

  /**
   * Load all orders
   */
  const getAllOrders = useCallback(async () => {
    return await fetchOrders();
  }, [fetchOrders]);

  /**
   * Load order statistics
   */
  const getOrderStats = useCallback(async () => {
    return await fetchOrderStats();
  }, [fetchOrderStats]);

  /**
   * Load order statuses
   */
  const getOrderStatuses = useCallback(async () => {
    return await fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  /**
   * Get order by ID
   */
  const getOrderById = useCallback(async (id: string) => {
    return await fetchOrderById(id);
  }, [fetchOrderById]);

  /**
   * Update order filters
   */
  const updateOrderFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  /**
   * Reset order filters
   */
  const resetOrderFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  /**
   * Update order status
   */
  const handleUpdateOrderStatus = useCallback(
    async (orderId: string, data: UpdateOrderStatusRequest) => {
      return await updateOrderStatus(orderId, data);
    },
    [updateOrderStatus]
  );

  /**
   * Confirm order (quick action)
   */
  const handleConfirmOrder = useCallback(
    async (orderId: string, notes?: string) => {
      return await confirmOrder(orderId, notes);
    },
    [confirmOrder]
  );

  /**
   * Cancel order (quick action)
   */
  const handleCancelOrder = useCallback(
    async (orderId: string, notes?: string) => {
      return await cancelOrder(orderId, notes);
    },
    [cancelOrder]
  );

  /**
   * Batch update status
   */
  const handleBatchUpdateStatus = useCallback(
    async (request: BatchUpdateStatusRequest) => {
      return await batchUpdateStatus(request);
    },
    [batchUpdateStatus]
  );

  /**
   * Batch confirm orders
   */
  const handleBatchConfirmOrders = useCallback(
    async (orderIds: string[], notes?: string) => {
      return await batchConfirmOrders(orderIds, notes);
    },
    [batchConfirmOrders]
  );

  /**
   * Batch cancel orders
   */
  const handleBatchCancelOrders = useCallback(
    async (orderIds: string[], notes?: string) => {
      return await batchCancelOrders(orderIds, notes);
    },
    [batchCancelOrders]
  );

  /**
   * Toggle order selection
   */
  const handleToggleOrderSelection = useCallback(
    (orderId: string) => {
      toggleOrderSelection(orderId);
    },
    [toggleOrderSelection]
  );

  /**
   * Toggle all orders selection
   */
  const handleToggleAllOrdersSelection = useCallback(
    (checked: boolean) => {
      toggleAllOrdersSelection(checked);
    },
    [toggleAllOrdersSelection]
  );

  /**
   * Clear all selections
   */
  const handleClearSelections = useCallback(() => {
    clearSelections();
  }, [clearSelections]);

  /**
   * Get selected count
   */
  const getSelectedCount = useCallback(() => {
    return selectedOrders.length;
  }, [selectedOrders.length]);

  /**
   * Export orders
   */
  const handleExportOrders = useCallback(async () => {
    return await exportOrders();
  }, [exportOrders]);

  /**
   * Refresh all data
   */
  const handleRefreshData = useCallback(async () => {
    return await refreshData();
  }, [refreshData]);

  // === FILTER HELPER FUNCTIONS ===

  /**
   * Search orders
   */
  const handleSearchChange = useCallback(
    (search: string) => {
      updateOrderFilters({ search });
    },
    [updateOrderFilters]
  );

  /**
   * Filter by status
   */
  const handleStatusChange = useCallback(
    (status: string) => {
      updateOrderFilters({ status: status === "all" ? "" : status });
    },
    [updateOrderFilters]
  );

  /**
   * Filter by payment method
   */
  const handlePaymentMethodChange = useCallback(
    (paymentMethod: string) => {
      updateOrderFilters({ payment_method: paymentMethod === "all" ? "" : paymentMethod });
    },
    [updateOrderFilters]
  );

  /**
   * Filter by date range
   */
  const handleDateRangeChange = useCallback(
    (dateFrom: string, dateTo: string) => {
      updateOrderFilters({ date_from: dateFrom, date_to: dateTo });
    },
    [updateOrderFilters]
  );

  /**
   * Filter by amount range
   */
  const handleAmountRangeChange = useCallback(
    (amountRange: { min?: number; max?: number }) => {
      updateOrderFilters({ amount_min: amountRange.min, amount_max: amountRange.max });
    },
    [updateOrderFilters]
  );

  /**
   * Sort orders
   */
  const handleSortChange = useCallback(
    (sortBy: OrderFilters["sort_by"], sortOrder: OrderFilters["sort_order"] = "desc") => {
      updateOrderFilters({ sort_by: sortBy, sort_order: sortOrder });
    },
    [updateOrderFilters]
  );

  // === STATUS HELPER FUNCTIONS ===

  /**
   * Check if order can be confirmed
   */
  const canConfirmOrder = useCallback((order: any) => {
    return order.status.status_name === "PENDING";
  }, []);

  /**
   * Check if order can be cancelled
   */
  const canCancelOrder = useCallback((order: any) => {
    return ["PENDING", "CONFIRMED"].includes(order.status.status_name);
  }, []);

  /**
   * Check if order status can be updated
   */
  const canUpdateOrderStatus = useCallback((order: any) => {
    return !["CANCELLED", "COMPLETED", "REFUNDED"].includes(order.status.status_name);
  }, []);

  /**
   * Get pending orders count
   */
  const getPendingOrdersCount = useCallback(() => {
    return orderCounts.pending;
  }, [orderCounts.pending]);

  /**
   * Get orders that need confirmation
   */
  const getOrdersNeedingConfirmation = useCallback(() => {
    return filteredOrders.filter((order) => order.status.status_name === "PENDING");
  }, [filteredOrders]);

  // === AUTO-LOAD DATA ===
  useEffect(() => {
    // Auto load data when component mounts
    getAllOrders();
    getOrderStats();
    getOrderStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to prevent rerender

      return {
      // === DATA STATES ===
      allOrders,
      filteredOrders,
      ordersLoading,
      orderStats,
      selectedOrders,
      orderCounts,
      filters,
      selectedOrder,
      orderStatuses,

      // === LOADING STATES ===
      batchOperationLoading,

      // === SELECTION STATES ===
      isAllSelected,
      isIndeterminate,

      // === QUERY FUNCTIONS ===
      getAllOrders,
      getOrderStats,
      getOrderById,
      getOrderStatuses,

    // === FILTER FUNCTIONS ===
    updateOrderFilters,
    resetOrderFilters,
    handleSearchChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleDateRangeChange,
    handleAmountRangeChange,
    handleSortChange,

    // === MANAGEMENT FUNCTIONS ===
    handleUpdateOrderStatus,
    handleConfirmOrder,
    handleCancelOrder,
    handleBatchUpdateStatus,
    handleBatchConfirmOrders,
    handleBatchCancelOrders,

    // === SELECTION FUNCTIONS ===
    handleToggleOrderSelection,
    handleToggleAllOrdersSelection,
    handleClearSelections,
    getSelectedCount,

    // === UTILITY FUNCTIONS ===
    handleExportOrders,
    handleRefreshData,

    // === STATUS HELPER FUNCTIONS ===
    canConfirmOrder,
    canCancelOrder,
    canUpdateOrderStatus,
    getPendingOrdersCount,
    getOrdersNeedingConfirmation,
  };
};