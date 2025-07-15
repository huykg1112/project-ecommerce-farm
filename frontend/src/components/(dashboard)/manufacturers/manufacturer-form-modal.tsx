"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ManufacturerFormData } from "@/lib_dashboard/store/manufacturer-store";
import { Factory, Upload, X } from "lucide-react";
import { memo, useCallback, useState } from "react";

interface ManufacturerFormModalProps {
  open: boolean;
  title: string;
  submitText: string;
  onClose: () => void;
  formData: ManufacturerFormData;
  onUpdateFormData: (data: Partial<ManufacturerFormData>) => void;
  onSubmit: (logoFile?: File) => Promise<boolean>;
  isEdit?: boolean;
}

export const ManufacturerFormModal = memo<ManufacturerFormModalProps>(
  ({
    open,
    title,
    submitText,
    onClose,
    formData,
    onUpdateFormData,
    onSubmit,
    isEdit = false,
  }) => {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogoChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setLogoFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setLogoPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      },
      []
    );

    const handleRemoveLogo = useCallback(() => {
      setLogoFile(null);
      setLogoPreview(null);
      onUpdateFormData({ logo: "" });
    }, [onUpdateFormData]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setIsSubmitting(true);
        try {
          const success = await onSubmit(logoFile || undefined);
          if (success) {
            setLogoFile(null);
            setLogoPreview(null);
          }
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData.name, logoFile, onSubmit]
    );

    const handleClose = useCallback(() => {
      setLogoFile(null);
      setLogoPreview(null);
      onClose();
    }, [onClose]);

    const displayLogo = logoPreview || formData.logo;

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#44703d]">
                Tên nhà sản xuất *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên nhà sản xuất..."
                value={formData.name}
                onChange={(e) => onUpdateFormData({ name: e.target.value })}
                className="border-[#90c577] focus:border-[#74a65d]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#44703d]">
                Mô tả
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả nhà sản xuất..."
                value={formData.description}
                onChange={(e) =>
                  onUpdateFormData({ description: e.target.value })
                }
                className="border-[#90c577] focus:border-[#74a65d] min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="text-[#44703d]">
                Logo nhà sản xuất
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="border-[#90c577] focus:border-[#74a65d]"
                  />
                </div>
                {displayLogo && (
                  <div className="relative">
                    <img
                      src={displayLogo}
                      alt="Logo preview"
                      className="w-12 h-12 object-cover rounded-lg border border-[#accc8b]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              {!displayLogo && (
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#accc8b] rounded-lg bg-[#accc8b]/5">
                  <div className="text-center">
                    <Factory className="mx-auto h-8 w-8 text-[#74a65d] mb-2" />
                    <p className="text-sm text-[#74a65d]">Chưa có logo</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  onUpdateFormData({ isActive: checked as boolean })
                }
                className="data-[state=checked]:bg-[#74a65d] data-[state=checked]:border-[#74a65d]"
              />
              <Label htmlFor="isActive" className="text-[#44703d]">
                Kích hoạt ngay
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="bg-[#90c577] hover:bg-[#74a65d] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  submitText
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

ManufacturerFormModal.displayName = "ManufacturerFormModal";
