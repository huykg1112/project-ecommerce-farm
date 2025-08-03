"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WarningAlert } from "@/lib_dashboard/services/dashboard-service";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { useState } from "react";
import { WarehouseAlertsDetail } from "./warehouse-alerts-detail";

interface WarehouseAlertsSummaryProps {
  warnings: WarningAlert[];
  loading?: boolean;
}

export function WarehouseAlertsSummary({
  warnings,
  loading,
}: WarehouseAlertsSummaryProps) {
  const [selectedAlert, setSelectedAlert] = useState<WarningAlert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (warning: WarningAlert) => {
    setSelectedAlert(warning);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAlert(null);
  };

  if (loading) {
    return (
      <Card className="card-agricultural">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#44703d] font-bold flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo kho hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-[#accc8b]/20 rounded w-3/4" />
            <div className="h-3 bg-[#accc8b]/10 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const expiringSoonWarning = warnings.find((w) => w.type === "expiring_soon");
  const lowStockWarning = warnings.find((w) => w.type === "low_stock");

  return (
    <Card className="card-agricultural">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#44703d] font-bold flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5" />
          Cảnh báo kho hàng
          {warnings.length > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {warnings.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {warnings.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Package className="h-8 w-8 mx-auto mb-1 text-gray-300" />
            <p className="text-sm">Không có cảnh báo</p>
            <p className="text-xs text-gray-400">Kho hàng ổn định</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Expiring Soon Alert */}
            {expiringSoonWarning && (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 text-white rounded-full">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 text-sm">
                      Sắp hết hạn
                    </h4>
                    <p className="text-xs text-red-600">
                      {expiringSoonWarning.count} lô sản phẩm
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => handleViewDetail(expiringSoonWarning)}
                >
                  Xem
                </Button>
              </div>
            )}

            {/* Low Stock Alert */}
            {lowStockWarning && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 text-white rounded-full">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 text-sm">
                      Sắp hết hàng
                    </h4>
                    <p className="text-xs text-yellow-600">
                      {lowStockWarning.count} lô sản phẩm
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => handleViewDetail(lowStockWarning)}
                >
                  Xem
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Detail Modal */}
      {selectedAlert && (
        <WarehouseAlertsDetail
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          alertType={selectedAlert.type}
          items={selectedAlert.items}
          title={selectedAlert.title}
        />
      )}
    </Card>
  );
}
