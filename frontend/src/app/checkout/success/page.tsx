"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withAuth } from "@/lib/auth/with-auth";
import { CheckCircle, Home, Package } from "lucide-react";
import Link from "next/link";

function OrderSuccessPage() {
  // Tạo mã đơn hàng ngẫu nhiên
  const orderNumber = `ORD${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được
          xử lý.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-bold">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-bold">
                    {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Trạng thái đơn hàng
                </p>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">Đã xác nhận</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Thông tin giao hàng
                </p>
                <p className="font-medium">
                  Dự kiến giao hàng trong 2-3 ngày làm việc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-primary hover:bg-primary-dark gap-2">
            <Link href="/orders">
              <Package className="h-4 w-4" />
              Xem đơn hàng của tôi
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Bảo vệ trang bằng HOC
export default withAuth(OrderSuccessPage);
