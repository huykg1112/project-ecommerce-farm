"use client";

import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import {
  OrderFilters,
  OrderStatus,
  PaymentMethod,
} from "@/lib_dashboard/types/order";
import { useCallback, useEffect, useMemo, useState } from "react";

// Import the correct Order type
import { OrderFiltersComponent } from "@/components/(dashboard)/orders/order-filters";
import { OrderStatisticsCards } from "@/components/(dashboard)/orders/order-statistics-cards";
import { OrderTable } from "@/components/(dashboard)/orders/order-table";
import type {
  Order as ImportedOrder,
  Order,
} from "@/lib_dashboard/types/order";

export default function OrdersManagementPage() {
  // State management
  const [orders, setOrders] = useState<ImportedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ImportedOrder[]>([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0,
    returned: 0,
    failed: 0,
    refunded: 0,
  });
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "",
    payment_method: "",
    date_from: "",
    date_to: "",
    amount_min: 0,
    amount_max: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<ImportedOrder | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingOperations, setLoadingOperations] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [pymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderServiceManagement.getAllOrders();
        // console.log("Fetched Orders:", data);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch order statuses and payment methods
  useEffect(() => {
    setLoadingOperations(true);
    const fetchOrderStatuses = async () => {
      try {
        const statuses = await orderServiceManagement.getOrderStatuses();
        console.log("Fetched Order Statuses:", statuses);
        const transformedStatuses = statuses.map((status) => ({
          ...status,
          is_active: true, // Default value or fetched value
          created_at: new Date(), // Default value or fetched value
          updated_at: new Date(), // Default value or fetched value
        }));
        setOrderStatuses(transformedStatuses);
      } catch (error) {
        console.error("Error fetching order statuses", error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const methods = await orderServiceManagement.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Error fetching payment methods", error);
      }
    };

    fetchOrderStatuses();
    fetchPaymentMethods();
    setLoadingOperations(false);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilters: OrderFilters) => {
      setFilters(newFilters);
      const filtered = orders.filter((order) => {
        const matchesSearch = newFilters.search
          ? order.order_code.includes(newFilters.search)
          : true;
        const matchesStatus = newFilters.status
          ? order.status.status_name === newFilters.status
          : true;
        const matchesPaymentMethod = newFilters.payment_method
          ? order.payment_method.method_name === newFilters.payment_method
          : true;
        const matchesDateRange =
          newFilters.date_from && newFilters.date_to
            ? new Date(order.created_at) >= new Date(newFilters.date_from) &&
              new Date(order.created_at) <= new Date(newFilters.date_to)
            : true;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPaymentMethod &&
          matchesDateRange
        );
      });
      setFilteredOrders(filtered);
    },
    [orders]
  );

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      payment_method: "",
      date_from: "",
      date_to: "",
      amount_min: 0,
      amount_max: 0,
    });
    setFilteredOrders(orders);
  }, [orders]);

  // Handle statistics calculation
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status.status_name === "PENDING")
        .length,
      confirmed: orders.filter(
        (order) => order.status.status_name === "CONFIRMED"
      ).length,
      shipping: orders.filter(
        (order) => order.status.status_name === "SHIPPING"
      ).length,
      delivered: orders.filter(
        (order) => order.status.status_name === "DELIVERED"
      ).length,
      completed: orders.filter(
        (order) => order.status.status_name === "COMPLETED"
      ).length,
      cancelled: orders.filter(
        (order) => order.status.status_name === "CANCELLED"
      ).length,
      returned: orders.filter(
        (order) => order.status.status_name === "RETURNED"
      ).length,
      failed: orders.filter((order) => order.status.status_name === "FAILED")
        .length,
      refunded: orders.filter(
        (order) => order.status.status_name === "REFUNDED"
      ).length,
    };
  }, [orders]);

  // Handle modal open/close
  const handleOpenDetailModal = useCallback((order: ImportedOrder) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalOpen(false);
  }, []);

  const handleOpenUpdateStatusModal = useCallback((order: ImportedOrder) => {
    setSelectedOrder(order);
    setUpdateStatusModalOpen(true);
  }, []);

  const handleCloseUpdateStatusModal = useCallback(() => {
    setUpdateStatusModalOpen(false);
  }, []);

  const handleOpenConfirmModal = useCallback((order: ImportedOrder) => {
    setSelectedOrder(order);
    setConfirmModalOpen(true);
  }, []);

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModalOpen(false);
  }, []);

  // Handle update order status
  const handleUpdateOrderStatus = useCallback(
    async (orderId: string, statusId: string, notes?: string) => {
      setLoadingOperations(true);
      try {
        await orderServiceManagement.updateOrderStatus(orderId, {
          status_id: statusId,
          notes,
        });
        const updatedOrders = orders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                id: orderId,
                status: { ...order.status, status_id: statusId },
              }
            : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error("Error updating order status", error);
      } finally {
        setLoadingOperations(false);
      }
    },
    [orders]
  );

  const handleConfirmOrder = useCallback(
    async (order: Order) => {
      setLoadingOperations(true);
      try {
        await orderServiceManagement.confirmOrder(order.order_id);
        const updatedOrders = orders.map((o) =>
          o.order_id === order.order_id
            ? { ...o, status: { ...o.status, status_name: "CONFIRMED" } }
            : o
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error("Error confirming order", error);
      } finally {
        setLoadingOperations(false);
      }
    },
    [orders]
  );

  const handleCancelOrder = useCallback(
    async (order: Order) => {
      setLoadingOperations(true);
      try {
        await orderServiceManagement.cancelOrder(order.order_id);
        const updatedOrders = orders.map((o) =>
          o.order_id === order.order_id
            ? { ...o, status: { ...o.status, status_name: "CANCELLED" } }
            : o
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error("Error cancelling order", error);
      } finally {
        setLoadingOperations(false);
      }
    },
    [orders]
  );

  // Handle batch update statuses
  const handleBatchUpdateStatuses = useCallback(
    async (orderIds: string[], statusId: string, notes?: string) => {
      setLoadingOperations(true);
      try {
        await orderServiceManagement.batchUpdateStatus({
          order_ids: orderIds,
          status_id: statusId,
          notes,
        });
        const updatedOrders = orders.map((order) =>
          orderIds.includes(order.order_id)
            ? {
                ...order,
                id: order.order_id,
                status: { ...order.status, status_id: statusId },
              }
            : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error("Error batch updating order statuses", error);
      } finally {
        setLoadingOperations(false);
      }
    },
    [orders]
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <OrderStatisticsCards orders={orders} loading={loading} />

      {/* Filters */}
      <OrderFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        orderStatuses={orderStatuses}
        paymentMethods={pymentMethods}
      />

      {/* Table */}
      <OrderTable
        orders={filteredOrders}
        onViewDetails={handleOpenDetailModal}
        onUpdateStatus={handleOpenUpdateStatusModal}
        onConfirmOrder={handleConfirmOrder}
        onCancelOrder={handleCancelOrder}
        loading={loading}
      />

      {/* Detail Modal */}
      {/* <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
      /> */}

      {/* Update Status Modal */}
      {/* <OrderUpdateStatusModal
        order={selectedOrder}
        open={updateStatusModalOpen}
        onClose={handleCloseUpdateStatusModal}
      /> */}

      {/* Confirm Modal */}
      {/* <ConfirmModal
        order={selectedOrder}
        open={confirmModalOpen}
        onClose={handleCloseConfirmModal}
      /> */}
    </div>
  );
}
