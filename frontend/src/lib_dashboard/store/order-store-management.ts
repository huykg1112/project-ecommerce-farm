import { showToast } from "@/lib/toast-provider";
import { atom } from "jotai";
import { orderServiceManagement } from "../services/order-service-management";
import {
  BatchUpdateStatusRequest,
  Order,
  OrderFilters,
  OrderStatsResponse,
  OrderStatus,
  OrderTableColumn,
  OrderViewMode,
  UpdateOrderStatusRequest,
} from "../types/order";

// ================================================
// 📊 CORE DATA ATOMS
// ================================================

// Main orders data
export const ordersDataAtom = atom<Order[]>([]);

// Loading states
export const ordersLoadingAtom = atom<boolean>(false);
export const orderDetailLoadingAtom = atom<boolean>(false);
export const orderStatsLoadingAtom = atom<boolean>(false);
export const batchOperationLoadingAtom = atom<boolean>(false);

// Error states
export const ordersErrorAtom = atom<string | null>(null);
export const orderDetailErrorAtom = atom<string | null>(null);

// Selected order for viewing/editing
export const selectedOrderAtom = atom<Order | null>(null);

// Order statistics
export const orderStatsAtom = atom<OrderStatsResponse>({
  total_orders: 0,
  pending_orders: 0,
  confirmed_orders: 0,
  shipping_orders: 0,
  delivered_orders: 0,
  cancelled_orders: 0,
  completed_orders: 0,
  total_revenue: 0,
  avg_order_value: 0,
});

// Order statuses
export const orderStatusesAtom = atom<OrderStatus[]>([]);
export const orderStatusesLoadingAtom = atom<boolean>(false);

// ================================================
// 🔍 FILTER & SEARCH ATOMS
// ================================================

// Filter state
export const orderFiltersAtom = atom<OrderFilters>({
  search: "",
  status: "",
  payment_method: "",
  user_id: "",
  distributor_id: "",
  date_from: "",
  date_to: "",
  amount_min: undefined,
  amount_max: undefined,
  sort_by: "created_at",
  sort_order: "desc",
});

// Search history
export const searchHistoryAtom = atom<string[]>([]);

// ================================================
// 🎨 UI STATE ATOMS
// ================================================

// View mode
export const orderViewModeAtom = atom<OrderViewMode>("table");

// Table column visibility
export const orderTableColumnsAtom = atom<OrderTableColumn>({
  order_code: true,
  customer: true,
  distributor: true,
  status: true,
  payment_method: true,
  total_amount: true,
  created_at: true,
  actions: true,
});

// Selected orders for batch operations
export const selectedOrdersAtom = atom<string[]>([]);

// Modal states
export const orderDetailModalAtom = atom<boolean>(false);
export const updateStatusModalAtom = atom<boolean>(false);
export const confirmOrderModalAtom = atom<boolean>(false);
export const cancelOrderModalAtom = atom<boolean>(false);

// ================================================
// 📊 DERIVED ATOMS - COMPUTED VALUES
// ================================================

// Filtered orders (client-side filtering)
export const filteredOrdersAtom = atom((get) => {
  const orders = get(ordersDataAtom);
  const filters = get(orderFiltersAtom);

  let filtered = [...orders];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.order_code.toLowerCase().includes(searchLower) ||
        order.user.full_name.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower) ||
        order.distributor.full_name.toLowerCase().includes(searchLower) ||
        order.notes?.toLowerCase().includes(searchLower) ||
        order.shipping_address?.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter(
      (order) => order.status.status_name === filters.status
    );
  }

  // Payment method filter
  if (filters.payment_method) {
    filtered = filtered.filter(
      (order) => order.payment_method.method_name === filters.payment_method
    );
  }

  // User filter
  if (filters.user_id) {
    filtered = filtered.filter(
      (order) => order.user.user_id === filters.user_id
    );
  }

  // Distributor filter
  if (filters.distributor_id) {
    filtered = filtered.filter(
      (order) => order.distributor.user_id === filters.distributor_id
    );
  }

  // Date filters
  if (filters.date_from) {
    const fromDate = new Date(filters.date_from);
    filtered = filtered.filter(
      (order) => new Date(order.created_at) >= fromDate
    );
  }

  if (filters.date_to) {
    const toDate = new Date(filters.date_to);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((order) => new Date(order.created_at) <= toDate);
  }

  // Amount filters
  if (filters.amount_min !== undefined) {
    filtered = filtered.filter(
      (order) => order.total_amount >= filters.amount_min!
    );
  }

  if (filters.amount_max !== undefined) {
    filtered = filtered.filter(
      (order) => order.total_amount <= filters.amount_max!
    );
  }

  // Sort orders
  if (filters.sort_by) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sort_by) {
        case "order_code":
          aValue = a.order_code;
          bValue = b.order_code;
          break;
        case "total_amount":
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case "updated_at":
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (filters.sort_order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return filtered;
});

// Selection state helpers
export const isAllOrdersSelectedAtom = atom((get) => {
  const orders = get(filteredOrdersAtom);
  const selectedOrders = get(selectedOrdersAtom);
  return orders.length > 0 && selectedOrders.length === orders.length;
});

export const isOrdersIndeterminateAtom = atom((get) => {
  const orders = get(filteredOrdersAtom);
  const selectedOrders = get(selectedOrdersAtom);
  return selectedOrders.length > 0 && selectedOrders.length < orders.length;
});

// Order counts by status
export const orderCountsByStatusAtom = atom((get) => {
  const orders = get(filteredOrdersAtom);
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status.status_name === "PENDING").length,
    confirmed: orders.filter((o) => o.status.status_name === "CONFIRMED")
      .length,
    shipping: orders.filter((o) => o.status.status_name === "SHIPPING").length,
    delivered: orders.filter((o) => o.status.status_name === "DELIVERED")
      .length,
    cancelled: orders.filter((o) => o.status.status_name === "CANCELLED")
      .length,
    completed: orders.filter((o) => o.status.status_name === "COMPLETED")
      .length,
  };
});

// ================================================
// 🔄 ACTION ATOMS
// ================================================

// Fetch all orders
export const fetchOrdersAtom = atom(null, async (get, set) => {
  set(ordersLoadingAtom, true);
  set(ordersErrorAtom, null);

  try {
    const orders = await orderServiceManagement.getAllOrders();
    set(ordersDataAtom, orders);
  } catch (error) {
    set(
      ordersErrorAtom,
      error instanceof Error ? error.message : "Unknown error"
    );
  } finally {
    set(ordersLoadingAtom, false);
  }
});

// Fetch order by ID
export const fetchOrderByIdAtom = atom(null, async (get, set, id: string) => {
  set(orderDetailLoadingAtom, true);
  set(orderDetailErrorAtom, null);

  try {
    const order = await orderServiceManagement.getOrderById(id);
    set(selectedOrderAtom, order);
    return order;
  } catch (error) {
    set(
      orderDetailErrorAtom,
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  } finally {
    set(orderDetailLoadingAtom, false);
  }
});

// Fetch order statistics
export const fetchOrderStatsAtom = atom(null, async (get, set) => {
  set(orderStatsLoadingAtom, true);

  try {
    const stats = await orderServiceManagement.getOrderStats();
    set(orderStatsAtom, stats);
  } catch (error) {
    console.error("Error fetching order stats:", error);
  } finally {
    set(orderStatsLoadingAtom, false);
  }
});

// Fetch order statuses
export const fetchOrderStatusesAtom = atom(null, async (get, set) => {
  set(orderStatusesLoadingAtom, true);

  try {
    const statuses = await orderServiceManagement.getOrderStatuses();
    set(orderStatusesAtom, statuses);
  } catch (error) {
    console.error("Error fetching order statuses:", error);
  } finally {
    set(orderStatusesLoadingAtom, false);
  }
});

// Update order status
export const updateOrderStatusAtom = atom(
  null,
  async (get, set, orderId: string, data: UpdateOrderStatusRequest) => {
    try {
      const response = await orderServiceManagement.updateOrderStatus(
        orderId,
        data
      );

      // Update the order in the list
      const orders = get(ordersDataAtom);
      const updatedOrders = orders.map((order) =>
        order.order_id === orderId ? response.order : order
      );
      set(ordersDataAtom, updatedOrders);

      // Update selected order if it's the same
      const selectedOrder = get(selectedOrderAtom);
      if (selectedOrder?.order_id === orderId) {
        set(selectedOrderAtom, response.order);
      }

      showToast.success(response.message);
      return response.order;
    } catch (error) {
      throw error;
    }
  }
);

// Confirm order
export const confirmOrderAtom = atom(
  null,
  async (get, set, orderId: string, notes?: string) => {
    try {
      const response = await orderServiceManagement.confirmOrder(
        orderId,
        notes
      );

      // Update the order in the list
      const orders = get(ordersDataAtom);
      const updatedOrders = orders.map((order) =>
        order.order_id === orderId ? response.order : order
      );
      set(ordersDataAtom, updatedOrders);

      // Update selected order if it's the same
      const selectedOrder = get(selectedOrderAtom);
      if (selectedOrder?.order_id === orderId) {
        set(selectedOrderAtom, response.order);
      }

      showToast.success(response.message);
      return response.order;
    } catch (error) {
      throw error;
    }
  }
);

// Cancel order
export const cancelOrderAtom = atom(
  null,
  async (get, set, orderId: string, notes?: string) => {
    try {
      const response = await orderServiceManagement.cancelOrder(orderId, notes);

      // Update the order in the list
      const orders = get(ordersDataAtom);
      const updatedOrders = orders.map((order) =>
        order.order_id === orderId ? response.order : order
      );
      set(ordersDataAtom, updatedOrders);

      // Update selected order if it's the same
      const selectedOrder = get(selectedOrderAtom);
      if (selectedOrder?.order_id === orderId) {
        set(selectedOrderAtom, response.order);
      }

      showToast.success(response.message);
      return response.order;
    } catch (error) {
      throw error;
    }
  }
);

// Batch operations
export const batchUpdateStatusAtom = atom(
  null,
  async (get, set, request: BatchUpdateStatusRequest) => {
    set(batchOperationLoadingAtom, true);

    try {
      const response = await orderServiceManagement.batchUpdateStatus(request);

      // Refresh orders data
      await set(fetchOrdersAtom);

      // Clear selections
      set(selectedOrdersAtom, []);

      showToast.success(response.message);
      return response;
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

export const batchConfirmOrdersAtom = atom(
  null,
  async (get, set, orderIds: string[], notes?: string) => {
    set(batchOperationLoadingAtom, true);

    try {
      const response = await orderServiceManagement.batchConfirmOrders(
        orderIds,
        notes
      );

      // Refresh orders data
      await set(fetchOrdersAtom);

      // Clear selections
      set(selectedOrdersAtom, []);

      showToast.success(response.message);
      return response;
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

export const batchCancelOrdersAtom = atom(
  null,
  async (get, set, orderIds: string[], notes?: string) => {
    set(batchOperationLoadingAtom, true);

    try {
      const response = await orderServiceManagement.batchCancelOrders(
        orderIds,
        notes
      );

      // Refresh orders data
      await set(fetchOrdersAtom);

      // Clear selections
      set(selectedOrdersAtom, []);

      showToast.success(response.message);
      return response;
    } catch (error) {
      throw error;
    } finally {
      set(batchOperationLoadingAtom, false);
    }
  }
);

// ================================================
// 🔧 UTILITY ACTIONS
// ================================================

// Update filters
export const updateOrderFiltersAtom = atom(
  null,
  (get, set, newFilters: Partial<OrderFilters>) => {
    const currentFilters = get(orderFiltersAtom);
    set(orderFiltersAtom, { ...currentFilters, ...newFilters });
  }
);

// Reset filters
export const resetOrderFiltersAtom = atom(null, (get, set) => {
  set(orderFiltersAtom, {
    search: "",
    status: "",
    payment_method: "",
    user_id: "",
    distributor_id: "",
    date_from: "",
    date_to: "",
    amount_min: undefined,
    amount_max: undefined,
    sort_by: "created_at",
    sort_order: "desc",
  });
});

// Selection management
export const toggleOrderSelectionAtom = atom(
  null,
  (get, set, orderId: string) => {
    const selected = get(selectedOrdersAtom);
    const isSelected = selected.includes(orderId);

    if (isSelected) {
      set(
        selectedOrdersAtom,
        selected.filter((id) => id !== orderId)
      );
    } else {
      set(selectedOrdersAtom, [...selected, orderId]);
    }
  }
);

export const toggleAllOrdersSelectionAtom = atom(
  null,
  (get, set, checked: boolean) => {
    if (checked) {
      const orders = get(filteredOrdersAtom);
      set(
        selectedOrdersAtom,
        orders.map((o) => o.order_id)
      );
    } else {
      set(selectedOrdersAtom, []);
    }
  }
);

// Clear all selections
export const clearOrderSelectionsAtom = atom(null, (get, set) => {
  set(selectedOrdersAtom, []);
});

// Add to search history
export const addToSearchHistoryAtom = atom(
  null,
  (get, set, searchTerm: string) => {
    const history = get(searchHistoryAtom);
    const filtered = history.filter((term) => term !== searchTerm);
    set(searchHistoryAtom, [searchTerm, ...filtered].slice(0, 10));
  }
);

// Export orders
export const exportOrdersAtom = atom(null, async (get, set) => {
  try {
    const filters = get(orderFiltersAtom);
    const blob = await orderServiceManagement.exportOrders(filters);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast.success("Xuất dữ liệu thành công!");
  } catch (error) {
    showToast.error("Lỗi khi xuất dữ liệu");
  }
});

// Refresh data
export const refreshOrderDataAtom = atom(null, async (get, set) => {
  await set(fetchOrdersAtom);
  await set(fetchOrderStatsAtom);
});
