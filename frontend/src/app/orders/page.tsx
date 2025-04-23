"use client";

import { OrderCard } from "@/components/orders/order-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrdersByUserId, type Order } from "@/data/orders";
import { withAuth } from "@/lib/auth/with-auth";
import { Package, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    // In a real app, we would fetch from API
    // For now, we'll use our mock data
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get orders for the current user
        const userOrders = getOrdersByUserId("user1");
        setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order) => {
        // Search in order number
        if (order.orderNumber.toLowerCase().includes(term)) return true;

        // Search in product names
        if (order.items.some((item) => item.name.toLowerCase().includes(term)))
          return true;

        // Search in seller names
        if (
          order.items.some((item) =>
            item.sellerName.toLowerCase().includes(term)
          )
        )
          return true;

        return false;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm, sortOrder]);

  // If loading
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If no orders
  if (orders.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h1>
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="relative w-40 h-40 mb-6">
            <Image src="/images/empty-orders.svg" alt="Chưa có đơn hàng" fill />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Hãy khám phá các sản phẩm nông nghiệp chất lượng cao và đặt hàng
            ngay hôm nay!
          </p>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mua sắm ngay
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Lịch sử mua hàng</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Lịch sử mua hàng</h1>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-medium">{orders.length} đơn hàng</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm, đại lý..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="shipping">Đang giao hàng</SelectItem>
              <SelectItem value="delivered">Đã giao hàng</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất trước</SelectItem>
              <SelectItem value="oldest">Cũ nhất trước</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <Image
            src="/images/no-results.svg"
            alt="Không tìm thấy đơn hàng"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-medium mb-2">
            Không tìm thấy đơn hàng nào
          </h3>
          <p className="text-gray-500 mb-4">
            Không có đơn hàng nào phù hợp với bộ lọc của bạn.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          >
            Xóa b�� lọc
          </Button>
        </div>
      )}
    </div>
  );
}

export default withAuth(OrdersPage);
