"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity } from "@/lib_dashboard/services/dashboard-service";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Building2,
  Clock,
  Package,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { memo, useMemo } from "react";

interface ActivityFeedProps {
  activities: RecentActivity[];
  loading?: boolean;
}

export const ActivityFeed = memo<ActivityFeedProps>(
  ({ activities, loading }) => {
    const getActivityConfig = useMemo(
      () => (type: RecentActivity["type"]) => {
        const configs = {
          user_registration: {
            icon: UserPlus,
            color: "bg-blue-50 text-blue-600 border-blue-200",
          },
          distributor_request: {
            icon: Building2,
            color:
              "bg-primary-light/20 text-primary-strong border-primary-light",
          },
          product: {
            icon: Package,
            color: "bg-orange-50 text-orange-600 border-orange-200",
          },
          order: {
            icon: ShoppingCart,
            color: "bg-green-50 text-green-600 border-green-200",
          },
        };
        return (
          configs[type] || {
            icon: Clock,
            color: "bg-gray-50 text-gray-600 border-gray-200",
          }
        );
      },
      []
    );

    const getStatusBadge = (activity: RecentActivity) => {
      switch (activity.status) {
        case "active":
          return (
            <Badge
              variant="default"
              className="text-xs bg-green-100 text-green-700"
            >
              Hoạt động
            </Badge>
          );
        case "inactive":
          return (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600"
            >
              Không hoạt động
            </Badge>
          );
        case "pending":
          return (
            <Badge
              variant="outline"
              className="text-xs bg-yellow-100 text-yellow-700"
            >
              Đang chờ
            </Badge>
          );
        case "approved":
          return (
            <Badge
              variant="default"
              className="text-xs bg-green-100 text-green-700"
            >
              Đã duyệt
            </Badge>
          );
        case "rejected":
          return (
            <Badge variant="destructive" className="text-xs">
              Từ chối
            </Badge>
          );
        default:
          return null;
      }
    };

    if (loading) {
      return (
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
              🔔 Hoạt động gần đây
            </CardTitle>
            <p className="text-sm text-agricultural-secondary">
              Theo dõi các hoạt động mới nhất trên hệ thống
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-[#accc8b]/20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#accc8b]/20 rounded w-3/4" />
                    <div className="h-3 bg-[#accc8b]/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="card-agricultural">
        <CardHeader>
          <CardTitle className="text-agricultural-primary font-bold flex items-center gap-2">
            🔔 Hoạt động gần đây
          </CardTitle>
          <p className="text-sm text-agricultural-secondary">
            Theo dõi các hoạt động mới nhất trên hệ thống
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-agricultural-secondary">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có hoạt động nào gần đây</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const { icon: Icon, color } = getActivityConfig(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-light/10 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${color} border`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-agricultural-primary font-medium">
                        {activity.title}
                      </p>
                      <p className="text-xs text-agricultural-tertiary mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-agricultural-secondary">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                        {activity.type === "user_registration" &&
                          activity.user?.email && (
                            <Badge variant="outline" className="text-xs">
                              {activity.user.email}
                            </Badge>
                          )}
                        {activity.type === "user_registration" &&
                          activity.user?.full_name && (
                            <Badge variant="outline" className="text-xs">
                              {activity.user.full_name}
                            </Badge>
                          )}
                        {getStatusBadge(activity)}
                      </div>
                    </div>
                    {index < activities.length - 1 && (
                      <div className="absolute left-6 mt-12 w-px h-4 bg-primary-light/30" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ActivityFeed.displayName = "ActivityFeed";
