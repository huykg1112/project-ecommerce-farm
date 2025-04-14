import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import { Truck } from "lucide-react";

interface ShippingMethodProps {
  shippingFee: number;
}

export default function ShippingMethod({ shippingFee }: ShippingMethodProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Phương thức vận chuyển
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="standard">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Giao hàng tiêu chuẩn (2-3 ngày)</Label>
            <span className="ml-auto font-medium">
              {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
            </span>
          </div>
        </RadioGroup>
        <p className="text-xs text-gray-500 mt-2">
          * Miễn phí vận chuyển cho đơn hàng từ 300.000đ
        </p>
      </CardContent>
    </Card>
  );
}
