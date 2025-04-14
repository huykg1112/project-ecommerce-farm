import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank">Chuyển khoản ngân hàng</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="momo" id="momo" />
            <Label htmlFor="momo">Ví điện tử MoMo</Label>
          </div>
        </RadioGroup>

        {paymentMethod === "bank" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
            <p className="font-medium mb-2">Thông tin chuyển khoản:</p>
            <p>Ngân hàng: Vietcombank</p>
            <p>Số tài khoản: 1234567890</p>
            <p>Chủ tài khoản: CÔNG TY NÔNG SẢN VIỆT NAM</p>
            <p>Nội dung: [Họ tên] thanh toán đơn hàng</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
