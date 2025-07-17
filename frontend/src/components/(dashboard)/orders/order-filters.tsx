"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusEnum, OrderStatusLabels } from "@/lib_dashboard/types/order";
import { Calendar, RotateCcw, Search } from "lucide-react";
import { useCallback, useState } from "react";

interface OrderFiltersProps {
  search: string;
  status: string;
  payment_method: string;
  date_from: string;
  date_to: string;
  amount_min?: number;
  amount_max?: number;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onPaymentMethodChange: (paymentMethod: string) => void;
  onDateRangeChange: (dateFrom: string, dateTo: string) => void;
  onAmountRangeChange: (amountRange: { min?: number; max?: number }) => void;
  onReset: () => void;
}

export function OrderFilters({
  search,
  status,
  payment_method,
  date_from,
  date_to,
  amount_min,
  amount_max,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onDateRangeChange,
  onAmountRangeChange,
  onReset,
}: OrderFiltersProps) {
  // Local state for amount inputs to handle intermediate values
  const [localAmountMin, setLocalAmountMin] = useState<string>(
    amount_min?.toString() || ""
  );
  const [localAmountMax, setLocalAmountMax] = useState<string>(
    amount_max?.toString() || ""
  );

  // Local state for date inputs
  const [localDateFrom, setLocalDateFrom] = useState<string>(date_from || "");
  const [localDateTo, setLocalDateTo] = useState<string>(date_to || "");

  // Handle amount range changes with debouncing
  const handleAmountChange = useCallback(() => {
    const min = localAmountMin ? parseFloat(localAmountMin) : undefined;
    const max = localAmountMax ? parseFloat(localAmountMax) : undefined;

    if (min !== amount_min || max !== amount_max) {
      onAmountRangeChange({ min, max });
    }
  }, [localAmountMin, localAmountMax, amount_min, amount_max, onAmountRangeChange]);

  // Handle date range changes
  const handleDateChange = useCallback(() => {
    if (localDateFrom !== date_from || localDateTo !== date_to) {
      onDateRangeChange(localDateFrom, localDateTo);
    }
  }, [localDateFrom, localDateTo, date_from, date_to, onDateRangeChange]);

  const handleAmountMinChange = useCallback((value: string) => {
    setLocalAmountMin(value);
  }, []);

  const handleAmountMaxChange = useCallback((value: string) => {
    setLocalAmountMax(value);
  }, []);

  const handleDateFromChange = useCallback((value: string) => {
    setLocalDateFrom(value);
  }, []);

  const handleDateToChange = useCallback((value: string) => {
    setLocalDateTo(value);
  }, []);

  const handleAmountBlur = useCallback(() => {
    handleAmountChange();
  }, [handleAmountChange]);

  const handleDateBlur = useCallback(() => {
    handleDateChange();
  }, [handleDateChange]);

  const handleAmountKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAmountChange();
      }
    },
    [handleAmountChange]
  );

  const handleDateKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleDateChange();
      }
    },
    [handleDateChange]
  );

  const handleReset = useCallback(() => {
    setLocalAmountMin("");
    setLocalAmountMax("");
    setLocalDateFrom("");
    setLocalDateTo("");
    onReset();
  }, [onReset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#44703d]">🔍 Bộ lọc đơn hàng</CardTitle>
        <CardDescription>
          Tìm kiếm và lọc đơn hàng theo các tiêu chí khác nhau
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74a65d]" />
              <Input
                id="search"
                placeholder="Mã đơn hàng, khách hàng..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-[#74a65d]/30 focus-visible:ring-[#90c577]"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={status || "all"} onValueChange={onStatusChange}>
              <SelectTrigger className="border-[#74a65d]/30 focus:ring-[#90c577]">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(OrderStatusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Phương thức thanh toán</Label>
            <Select value={payment_method || "all"} onValueChange={onPaymentMethodChange}>
              <SelectTrigger className="border-[#74a65d]/30 focus:ring-[#90c577]">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="COD">COD - Thanh toán khi nhận hàng</SelectItem>
                <SelectItem value="VNPAY">VNPay - Thanh toán trực tuyến</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="date-from">Từ ngày</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74a65d]" />
              <Input
                id="date-from"
                type="date"
                value={localDateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                onBlur={handleDateBlur}
                onKeyPress={handleDateKeyPress}
                className="pl-10 border-[#74a65d]/30 focus-visible:ring-[#90c577]"
              />
            </div>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="date-to">Đến ngày</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74a65d]" />
              <Input
                id="date-to"
                type="date"
                value={localDateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                onBlur={handleDateBlur}
                onKeyPress={handleDateKeyPress}
                className="pl-10 border-[#74a65d]/30 focus-visible:ring-[#90c577]"
              />
            </div>
          </div>

          {/* Amount Min */}
          <div className="space-y-2">
            <Label htmlFor="amount-min">Giá trị từ (VNĐ)</Label>
            <Input
              id="amount-min"
              type="number"
              placeholder="0"
              value={localAmountMin}
              onChange={(e) => handleAmountMinChange(e.target.value)}
              onBlur={handleAmountBlur}
              onKeyPress={handleAmountKeyPress}
              className="border-[#74a65d]/30 focus-visible:ring-[#90c577]"
            />
          </div>

          {/* Amount Max */}
          <div className="space-y-2">
            <Label htmlFor="amount-max">Giá trị đến (VNĐ)</Label>
            <Input
              id="amount-max"
              type="number"
              placeholder="999999999"
              value={localAmountMax}
              onChange={(e) => handleAmountMaxChange(e.target.value)}
              onBlur={handleAmountBlur}
              onKeyPress={handleAmountKeyPress}
              className="border-[#74a65d]/30 focus-visible:ring-[#90c577]"
            />
          </div>

          {/* Reset Button */}
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full border-[#74a65d]/30 text-[#44703d] hover:bg-[#accc8b]/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}