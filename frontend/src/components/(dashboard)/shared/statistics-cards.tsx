import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Package, PauseCircle } from "lucide-react";

interface StatisticsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  title: string;
  loading: boolean;
}

export function StatisticsCards({
  stats,
  title,
  loading,
}: StatisticsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total products */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng {title}</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active products */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">{stats.active}</p>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Hoạt động
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive products */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PauseCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tạm dừng</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700"
                >
                  Tạm dừng
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
