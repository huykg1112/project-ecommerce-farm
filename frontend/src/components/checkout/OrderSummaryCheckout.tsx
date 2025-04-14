import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/lib/features/cart-slice";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
  selectedItems: CartItem[];
  totalAmount: number;
  shippingFee: number;
  finalTotal: number;
  isSubmitting: boolean;
  handlePlaceOrder: () => void;
}

export default function OrderSummary({
  selectedItems,
  totalAmount,
  shippingFee,
  finalTotal,
  isSubmitting,
  handlePlaceOrder,
}: OrderSummaryProps) {
  return (
    <>
      <Card className="sticky top-24">
        <CardHeader className="pb-3">
          <CardTitle>Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Danh sách sản phẩm */}
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-1">x{item.quantity}</span>
                  </div>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Tổng tiền */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>
                  {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                </span>
              </div>
            </div>

            <Separator />

            {/* Tổng thanh toán */}
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(finalTotal)}</span>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Bằng cách đặt hàng, bạn đồng ý với{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </Button>
      </div>
    </>
  );
}
