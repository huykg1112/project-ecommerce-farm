import { MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";

export default function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center text-sm">
        <Truck className="h-5 w-5 text-primary mr-2" />
        <span>Giao hàng toàn quốc</span>
      </div>
      <div className="flex items-center text-sm">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        <span>Đảm bảo chất lượng</span>
      </div>
      <div className="flex items-center text-sm">
        <RotateCcw className="h-5 w-5 text-primary mr-2" />
        <span>Đổi trả trong 7 ngày</span>
      </div>
      <div className="flex items-center text-sm">
        <MessageCircle className="h-5 w-5 text-primary mr-2" />
        <span>Hỗ trợ 24/7</span>
      </div>
    </div>
  );
}
