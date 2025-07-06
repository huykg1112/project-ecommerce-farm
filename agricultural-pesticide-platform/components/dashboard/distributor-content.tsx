"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockBatchProducts } from "@/lib/mock-data"
import { AlertCard } from "@/components/ui/alert-card"
import { AlertTriangle, Clock } from "lucide-react"
import { VI_AGRICULTURAL } from "@/lib/localization/vi"

interface DistributorContentProps {
  dashboardData: any
}

export const DistributorContent = memo<DistributorContentProps>(({ dashboardData }) => {
  const chartData = useMemo(
    () =>
      mockBatchProducts.map((batch) => ({
        name: batch.batch_number,
        stock: batch.quantity,
        threshold: batch.low_stock_threshold,
      })),
    [],
  )

  const { lowStockBatches, expiringBatches } = useMemo(() => {
    const lowStock = mockBatchProducts.filter((batch) => batch.quantity <= batch.low_stock_threshold)
    const expiring = mockBatchProducts.filter((batch) => {
      const daysUntilExpiry = Math.ceil((batch.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 90
    })
    return { lowStockBatches: lowStock, expiringBatches: expiring }
  }, [])

  const lowStockItems = useMemo(
    () =>
      lowStockBatches.map((batch) => ({
        id: batch.batch_id,
        title: batch.product.product_name,
        subtitle: `Lô: ${batch.batch_number}`,
        value: batch.quantity.toString(),
        threshold: batch.low_stock_threshold.toString(),
        variant: "destructive" as const,
      })),
    [lowStockBatches],
  )

  const expiringItems = useMemo(
    () =>
      expiringBatches.map((batch) => {
        const daysUntilExpiry = Math.ceil((batch.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return {
          id: batch.batch_id,
          title: batch.product.product_name,
          subtitle: `Lô: ${batch.batch_number}`,
          value: `${daysUntilExpiry} ngày`,
          variant: "warning" as const,
        }
      }),
    [expiringBatches],
  )

  return (
    <div className="space-y-6">
      {/* Inventory Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-agricultural-primary">Tồn kho theo lô hàng</CardTitle>
            <p className="text-sm text-agricultural-secondary">Mức tồn kho hiện tại theo từng lô</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBatchProducts.map((batch) => (
                <div
                  key={batch.batch_id}
                  className="flex items-center justify-between p-3 border rounded-lg border-primary-light/30 hover:bg-primary-light/10 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-agricultural-primary">{batch.product.product_name}</h4>
                    <p className="text-sm text-agricultural-secondary">Lô: {batch.batch_number}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={batch.quantity <= batch.low_stock_threshold ? "destructive" : "secondary"}>
                      {batch.quantity} đơn vị
                    </Badge>
                    <p className="text-xs text-agricultural-secondary mt-1">
                      Hết hạn: {batch.expiry_date.toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-agricultural-primary">Biểu đồ tồn kho</CardTitle>
            <p className="text-sm text-agricultural-secondary">Phân bố tồn kho</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-primary-light/50" />
                <XAxis dataKey="name" className="text-agricultural-secondary" fontSize={12} />
                <YAxis className="text-agricultural-secondary" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #599146",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="stock" fill="#599146" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <AlertCard
          title={VI_AGRICULTURAL.alerts.lowStock}
          description={VI_AGRICULTURAL.alerts.productsRunningLow}
          icon={AlertTriangle}
          items={lowStockItems}
          valueLabel={VI_AGRICULTURAL.stats.unitsRemaining}
        />

        <AlertCard
          title={VI_AGRICULTURAL.alerts.expiry}
          description="Sản phẩm sắp hết hạn trong 90 ngày"
          icon={Clock}
          items={expiringItems}
          valueLabel="đến hạn"
        />
      </div>
    </div>
  )
})

DistributorContent.displayName = "DistributorContent"
