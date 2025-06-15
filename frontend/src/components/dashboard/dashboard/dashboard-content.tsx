"use client"

import { useState } from "react"
import { Users, ShoppingCart, TrendingUp, DollarSign, Package, FolderTree } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminRevenueChart } from "@/components/admin-revenue-chart"
import { AdminUserChart } from "@/components/admin-user-chart"
import { DashboardHeader } from "@/components/dashboard/dashboard/dashboard-header"
// import { useGetUserStatisticsQuery } from "@/lib/redux/services/userApi"
// import { useGetCategoryStatisticsQuery } from "@/lib/redux/services/categoryApi"
// import { useGetProductStatisticsQuery } from "@/lib/redux/services/productApi"

export function AdminDashboardContent() {
  const [period, setPeriod] = useState("today")

  const { data: userStats } = useGetUserStatisticsQuery({})
  const { data: categoryStats } = useGetCategoryStatisticsQuery()
  const { data: productStats } = useGetProductStatisticsQuery()

  return (
    <>
      <DashboardHeader />

      <div className="flex-1 overflow-auto bg-[#f8f9fa]">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-[#44703d]">Dashboard Admin</h2>
              <p className="text-sm text-[#74a65d]">Tổng quan hệ thống FramE</p>
            </div>

            <Tabs defaultValue="today" className="space-y-4" onValueChange={setPeriod}>
              <TabsList className="bg-white border border-[#74a65d]/20 p-1">
                <TabsTrigger value="today" className="data-[state=active]:bg-[#90c577] data-[state=active]:text-white">
                  Hôm nay
                </TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-[#90c577] data-[state=active]:text-white">
                  Tuần này
                </TabsTrigger>
                <TabsTrigger value="month" className="data-[state=active]:bg-[#90c577] data-[state=active]:text-white">
                  Tháng này
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#74a65d]/20 bg-white shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#74a65d]">Tổng người dùng</p>
                    <h3 className="mt-1 text-3xl font-bold text-[#44703d]">{userStats?.totalStats.totalUsers || 0}</h3>
                    <p className="mt-1 text-xs text-[#74a65d]">Người dùng trong hệ thống</p>
                  </div>
                  <div className="rounded-full bg-[#accc8b]/30 p-3">
                    <Users className="h-6 w-6 text-[#599146]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#74a65d]/20 bg-white shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#74a65d]">Tổng sản phẩm</p>
                    <h3 className="mt-1 text-3xl font-bold text-[#44703d]">{productStats?.totalProducts || 0}</h3>
                    <p className="mt-1 text-xs text-[#74a65d]">Sản phẩm đang bán</p>
                  </div>
                  <div className="rounded-full bg-[#accc8b]/30 p-3">
                    <Package className="h-6 w-6 text-[#599146]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#74a65d]/20 bg-white shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#74a65d]">Danh mục</p>
                    <h3 className="mt-1 text-3xl font-bold text-[#44703d]">{categoryStats?.totalCategories || 0}</h3>
                    <p className="mt-1 text-xs text-[#74a65d]">Danh mục sản phẩm</p>
                  </div>
                  <div className="rounded-full bg-[#accc8b]/30 p-3">
                    <FolderTree className="h-6 w-6 text-[#599146]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#74a65d]/20 bg-white shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#74a65d]">Doanh thu</p>
                    <h3 className="mt-1 text-3xl font-bold text-[#44703d]">48.5M</h3>
                    <p className="mt-1 text-xs text-green-600">+15.2% so với tháng trước</p>
                  </div>
                  <div className="rounded-full bg-[#accc8b]/30 p-3">
                    <DollarSign className="h-6 w-6 text-[#599146]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-7">
            <Card className="border-[#74a65d]/20 bg-white shadow-sm lg:col-span-4">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#44703d]">Biểu đồ doanh thu</h3>
                  <p className="text-sm text-[#74a65d]">
                    {period === "today" && "Doanh thu theo giờ trong ngày hôm nay"}
                    {period === "week" && "Doanh thu theo ngày trong tuần này"}
                    {period === "month" && "Doanh thu theo tháng trong năm"}
                  </p>
                </div>
                <AdminRevenueChart period={period} />
              </CardContent>
            </Card>

            <Card className="border-[#74a65d]/20 bg-white shadow-sm lg:col-span-3">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#44703d]">Người dùng theo vai trò</h3>
                  <p className="text-sm text-[#74a65d]">Phân bố người dùng trong hệ thống</p>
                </div>
                <AdminUserChart />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="border-[#74a65d]/20 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#44703d]">Hoạt động gần đây</h3>
                  <p className="text-sm text-[#74a65d]">Các hoạt động mới nhất trong hệ thống</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-[#74a65d]/20 p-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#44703d]">Người dùng mới đăng ký</p>
                      <p className="text-xs text-[#74a65d]">Hoàng Văn Em vừa đăng ký tài khoản</p>
                    </div>
                    <span className="text-xs text-[#74a65d]">5 phút trước</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-[#74a65d]/20 p-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#44703d]">Sản phẩm mới được thêm</p>
                      <p className="text-xs text-[#74a65d]">Phân bón hữu cơ Đầu Trâu</p>
                    </div>
                    <span className="text-xs text-[#74a65d]">1 giờ trước</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-[#74a65d]/20 p-3">
                    <div className="rounded-full bg-amber-100 p-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#44703d]">Doanh thu tăng</p>
                      <p className="text-xs text-[#74a65d]">Doanh thu hôm nay tăng 15.2%</p>
                    </div>
                    <span className="text-xs text-[#74a65d]">2 giờ trước</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#74a65d]/20 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#44703d]">Thống kê nhanh</h3>
                  <p className="text-sm text-[#74a65d]">Các chỉ số quan trọng</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#74a65d]">Người dùng hoạt động</span>
                    <span className="font-medium text-[#44703d]">{userStats?.totalStats.activeUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#74a65d]">Người dùng đã xác minh</span>
                    <span className="font-medium text-[#44703d]">{userStats?.totalStats.verifiedUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#74a65d]">Sản phẩm nổi bật</span>
                    <span className="font-medium text-[#44703d]">{productStats?.featuredProducts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#74a65d]">Danh mục hoạt động</span>
                    <span className="font-medium text-[#44703d]">{categoryStats?.activeCategories || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
