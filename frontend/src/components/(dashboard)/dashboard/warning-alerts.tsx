import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WarningAlert } from "@/lib_dashboard/services/dashboard-service";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { useState } from "react";
import { WarehouseAlertsDetail } from "./warehouse-alerts-detail";

interface WarningAlertsProps {
  warnings: WarningAlert[];
  loading?: boolean;
}

export function WarningAlerts({ warnings, loading }: WarningAlertsProps) {
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
        <CardHeader>
          <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo kho hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-[#accc8b]/20 rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#accc8b]/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (warnings.length === 0) {
    return (
      <Card className="card-agricultural">
        <CardHeader>
          <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo kho hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Không có cảnh báo nào</p>
            <p className="text-sm">Tất cả sản phẩm đều trong tình trạng tốt</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "expiring_soon":
        return <Clock className="h-4 w-4" />;
      case "low_stock":
        return <Package className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="card-agricultural">
      <CardHeader>
        <CardTitle className="text-[#44703d] font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Cảnh báo kho hàng
          {warnings.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {warnings.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {warnings.map((warning) => (
            <div
              key={warning.id}
              className="flex items-start justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${getSeverityColor(
                    warning.severity
                  )}`}
                >
                  {getIcon(warning.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {warning.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {warning.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {warning.count} sản phẩm
                    </Badge>
                    <Badge
                      className={`text-xs ${getSeverityColor(
                        warning.severity
                      )}`}
                    >
                      {warning.severity === "high" && "Cao"}
                      {warning.severity === "medium" && "Trung bình"}
                      {warning.severity === "low" && "Thấp"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleViewDetail(warning)}
              >
                Xem chi tiết
              </Button>
            </div>
          ))}
        </div>
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
