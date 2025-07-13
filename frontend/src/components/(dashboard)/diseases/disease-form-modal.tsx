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
import { Textarea } from "@/components/ui/textarea";
import { DiseaseFormData } from "@/lib_dashboard/types/disease";
import { Loader2 } from "lucide-react";
import type React from "react";
import { memo, useCallback, useState } from "react";

interface DiseaseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void | string>;
  formData: DiseaseFormData;
  onUpdateFormData: (data: Partial<DiseaseFormData>) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

export const DiseaseFormModal = memo<DiseaseFormModalProps>(
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
        await onSubmit();
        onClose();
        setLoading(false);
      },
      [onSubmit, onClose]
    );

    const handleInputChange = useCallback(
      (field: keyof DiseaseFormData, value: string | boolean) => {
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
              <Label htmlFor="disease_name" className="text-[#44703d]">
                Tên bệnh *
              </Label>
              <Input
                id="disease_name"
                value={formData.disease_name}
                onChange={(e) =>
                  handleInputChange("disease_name", e.target.value)
                }
                placeholder="Nhập tên bệnh"
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
                placeholder="Nhập mô tả chi tiết về bệnh"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d] min-h-[100px]"
                rows={4}
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
                  Bệnh đang được sử dụng
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

DiseaseFormModal.displayName = "DiseaseFormModal";
