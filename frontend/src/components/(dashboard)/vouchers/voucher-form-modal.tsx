"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { VoucherFormData } from "@/lib_dashboard/store/voucher-store";
import { formatCurrency } from "@/lib_dashboard/utils/formatters";
import React, { memo, useCallback, useState } from "react";

interface VoucherFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: VoucherFormData;
  onUpdateFormData: (
    field: keyof VoucherFormData,
    value: string | number | boolean | Date | null
  ) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

export const VoucherFormModal = memo<VoucherFormModalProps>(
  ({
    open,
    onClose,
    onSubmit,
    formData,
    onUpdateFormData,
    title,
    submitText,
    isEdit = false,
  }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        onSubmit(e);
        onClose();
        setLoading(false);
      },
      [onSubmit, onClose, formData]
    );

    const handleInputChange = useCallback(
      (
        field: keyof VoucherFormData,
        value: string | number | boolean | Date | null
      ) => {
        if (
          field === "end_date" &&
          formData.start_date &&
          value instanceof Date
        ) {
          if (value < formData.start_date) {
            onUpdateFormData("start_date", value);
            onUpdateFormData("end_date", formData.start_date);
            return;
          }
        }
        onUpdateFormData(field, value);
      },
      [onUpdateFormData, formData]
    );

    const formatCurrencyInput = (value: number | undefined) => {
      return value !== undefined ? formatCurrency(value) : "";
    };

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-[#accc8b] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voucher_code" className="text-[#44703d]">
                Mã voucher *
              </Label>
              <Input
                id="voucher_code"
                value={formData.voucher_code}
                onChange={(e) =>
                  handleInputChange("voucher_code", e.target.value)
                }
                placeholder="Nhập mã voucher"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_value" className="text-[#44703d]">
                Giá trị đơn hàng tối thiểu
              </Label>
              <Input
                id="min_order_value"
                type="text"
                value={formatCurrencyInput(formData.min_order_value)}
                onChange={(e) =>
                  handleInputChange(
                    "min_order_value",
                    Number(e.target.value.replace(/[^0-9]/g, ""))
                  )
                }
                placeholder="Nhập giá trị tối thiểu"
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_discount_value" className="text-[#44703d]">
                Giá trị giảm giá tối đa
              </Label>
              <Input
                id="max_discount_value"
                type="text"
                value={formatCurrencyInput(formData.max_discount_value)}
                onChange={(e) =>
                  handleInputChange(
                    "max_discount_value",
                    Number(e.target.value.replace(/[^0-9]/g, ""))
                  )
                }
                placeholder="Nhập giá trị giảm giá tối đa"
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_limit" className="text-[#44703d]">
                Số lần sử dụng
              </Label>
              <Input
                id="usage_limit"
                type="number"
                value={formData.usage_limit || ""}
                onChange={(e) =>
                  handleInputChange("usage_limit", Number(e.target.value))
                }
                placeholder="Nhập số lần sử dụng"
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-[#44703d]">
                Ngày bắt đầu
              </Label>
              <Input
                id="start_date"
                type="date"
                value={
                  formData.start_date
                    ? new Date(formData.start_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("start_date", new Date(e.target.value))
                }
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-[#44703d]">
                Ngày kết thúc
              </Label>
              <Input
                id="end_date"
                type="date"
                value={
                  formData.end_date
                    ? new Date(formData.end_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("end_date", new Date(e.target.value))
                }
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  handleInputChange("is_active", checked)
                }
                disabled={loading}
                className="data-[state=checked]:bg-[#74a65d]"
              />
              <Label htmlFor="is_active" className="text-[#44703d]">
                Kích hoạt ngay
              </Label>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20 bg-transparent"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#90c577] hover:bg-[#74a65d] text-white"
              >
                {loading ? "Đang xử lý..." : submitText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

VoucherFormModal.displayName = "VoucherFormModal";
