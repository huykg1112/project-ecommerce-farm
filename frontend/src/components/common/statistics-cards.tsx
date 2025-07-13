import { Eye, EyeOff, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type StatisticsCardProps = {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  title: string;
};

export const StatisticsCards = ({ stats, title }: StatisticsCardProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="card-agricultural">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-[#44703d]">
            Tổng số {title}
          </CardTitle>
          <Package className="h-5 w-5 text-[#74a65d]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#44703d]">{stats.total}</div>
          <p className="text-xs text-[#74a65d]">
            Tất cả {title} trong hệ thống
          </p>
        </CardContent>
      </Card>

      <Card className="card-agricultural">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-[#44703d]">
            Đang hoạt động
          </CardTitle>
          <Eye className="h-5 w-5 text-[#90c577]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#44703d]">
            {stats.active}
          </div>
          <p className="text-xs text-[#74a65d]">{title} hiển thị công khai</p>
        </CardContent>
      </Card>

      <Card className="card-agricultural">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-[#44703d]">
            Đã tắt
          </CardTitle>
          <EyeOff className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#44703d]">
            {stats.inactive}
          </div>
          <p className="text-xs text-[#74a65d]">{title} tạm thời ẩn</p>
        </CardContent>
      </Card>
    </div>
  );
};
