import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderSummaryProps } from "@/interfaces";

export function OrderSummary({
  selectedItemsCount,
  selectedTotal,
  shippingFee,
  discount,
  finalTotal,
  couponCode,
  isApplyingCoupon,
  onCouponCodeChange,
  onApplyCoupon,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Sản phẩm đã chọn</span>
            <span>{selectedItemsCount} sản phẩm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatCurrency(selectedTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>
              {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-lg mb-6">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatCurrency(finalTotal)}</span>
        </div>
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => onCouponCodeChange(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={onApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
            >
              {isApplyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Thử mã "WELCOME10" để được giảm 10%
          </p>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary-dark gap-2"
          onClick={onCheckout}
          disabled={selectedItemsCount === 0}
        >
          Tiến hành thanh toán
          <ArrowRight className="h-4 w-4" />
        </Button>
        {selectedItemsCount === 0 && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Vui lòng chọn ít nhất một sản phẩm để thanh toán
          </p>
        )}
        <div className="mt-4 text-xs text-gray-500">
          <p>* Miễn phí vận chuyển cho đơn hàng từ 300.000đ</p>
          <p>* Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc</p>
        </div>
      </div>
    </div>
  );
}
