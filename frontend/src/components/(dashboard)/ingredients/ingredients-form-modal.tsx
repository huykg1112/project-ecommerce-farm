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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ActiveIngredientFormData } from "@/lib_dashboard/store/active-ingredient-store";
import { Loader2 } from "lucide-react";
import type React from "react";
import { memo, useCallback, useState } from "react";

interface IngredientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  formData: ActiveIngredientFormData;
  onUpdateFormData: (data: Partial<ActiveIngredientFormData>) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

export const IngredientFormModal = memo<IngredientFormModalProps>(
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

        const success = await onSubmit();
        if (success) {
          onClose();
        }

        setLoading(false);
      },
      [onSubmit, onClose]
    );

    const handleInputChange = useCallback(
      (field: keyof ActiveIngredientFormData, value: string | boolean) => {
        onUpdateFormData({ [field]: value });
      },
      [onUpdateFormData]
    );

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-[#accc8b] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient_name" className="text-[#44703d]">
                Tên hoạt chất *
              </Label>
              <Input
                id="ingredient_name"
                value={formData.ingredient_name}
                onChange={(e) =>
                  handleInputChange("ingredient_name", e.target.value)
                }
                placeholder="Nhập tên hoạt chất"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#44703d]">
                Mô tả *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Nhập mô tả chi tiết về hoạt chất"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d] min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazard_level" className="text-[#44703d]">
                Mức độ nguy hiểm *
              </Label>
              <Select
                value={formData.hazard_level}
                onValueChange={(value) =>
                  handleInputChange("hazard_level", value)
                }
                disabled={loading}
              >
                <SelectTrigger className="border-[#90c577] focus:border-[#74a65d]">
                  <SelectValue placeholder="Chọn mức độ nguy hiểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Thấp</SelectItem>
                  <SelectItem value="MEDIUM">Trung bình</SelectItem>
                  <SelectItem value="HIGH">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chemical_formula" className="text-[#44703d]">
                Công thức hóa học *
              </Label>
              <Input
                id="chemical_formula"
                value={formData.chemical_formula}
                onChange={(e) =>
                  handleInputChange("chemical_formula", e.target.value)
                }
                placeholder="Ví dụ: C3H8NO5P"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cas_number" className="text-[#44703d]">
                Số CAS *
              </Label>
              <Input
                id="cas_number"
                value={formData.cas_number}
                onChange={(e) =>
                  handleInputChange("cas_number", e.target.value)
                }
                placeholder="Ví dụ: 1071-83-6"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            {isEdit && (
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
                  Hoạt chất đang được sử dụng
                </Label>
              </div>
            )}

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
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

IngredientFormModal.displayName = "IngredientFormModal";
