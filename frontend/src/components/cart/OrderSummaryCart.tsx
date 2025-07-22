import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderSummaryProps } from "@/interfaces";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Ticket } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function OrderSummary({
  selectedItemsCount,
  selectedTotal,
  shippingFee,
  discount,
  finalTotal,
  myVoucher = [],
  selectedVoucher,
  onSelectVoucher,
  onCheckout,
}: OrderSummaryProps) {
  // Check if voucher is available based on min_order_value
  const isVoucherAvailable = (voucher: any) => {
    return (
      voucher.is_active &&
      (!voucher.min_order_value || selectedTotal >= voucher.min_order_value)
    );
  };

  const handleVoucherChange = (value: string) => {
    if (value === "none") {
      onSelectVoucher(null);
    } else {
      const voucher = myVoucher.find((v) => v.voucher_id === value);
      // Only allow selection if voucher is available
      if (voucher && isVoucherAvailable(voucher)) {
        onSelectVoucher(voucher);
      }
    }
  };

  return (
    <Card className="sticky top-24 h-fit">
      <div className="p-6">
        <CardHeader className="pb-3">
          <CardTitle>Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
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
              <span>Giảm giá voucher</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-lg mb-6">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatCurrency(finalTotal)}</span>
        </div>

        {/* Voucher Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Chọn voucher giảm giá
          </label>
          <Select
            value={selectedVoucher?.voucher_id || "none"}
            onValueChange={handleVoucherChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn voucher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không sử dụng voucher</SelectItem>
              {myVoucher.map((voucher) => {
                const isAvailable = isVoucherAvailable(voucher);
                return (
                  <SelectItem
                    key={voucher.voucher_id}
                    value={voucher.voucher_id}
                    disabled={!isAvailable}
                    className={
                      !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${
                          !isAvailable ? "text-gray-400" : ""
                        }`}
                      >
                        {voucher.voucher_code}
                      </span>
                      <span
                        className={`text-xs ${
                          !isAvailable ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Giảm tối đa:{" "}
                        {formatCurrency(voucher.max_discount_value || 0)}
                        {voucher.min_order_value &&
                          ` - Đơn tối thiểu: ${formatCurrency(
                            voucher.min_order_value
                          )}`}
                      </span>
                      {!isAvailable && voucher.min_order_value && (
                        <span className="text-xs text-red-400">
                          Thiếu{" "}
                          {formatCurrency(
                            voucher.min_order_value - selectedTotal
                          )}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {myVoucher.length > 0 && (
            <div className="mt-2">
              {myVoucher.filter((v) => !isVoucherAvailable(v)).length > 0 && (
                <p className="text-xs text-orange-500">
                  * Một số voucher chưa đủ điều kiện sử dụng
                </p>
              )}
            </div>
          )}
          {myVoucher.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">
              * Bạn chưa có voucher nào
            </p>
          )}
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
    </Card>
  );
}
