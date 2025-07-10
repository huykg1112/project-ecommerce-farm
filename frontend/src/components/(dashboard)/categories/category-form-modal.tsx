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
import type { CategoryFormData } from "@/lib_dashboard/store/category-store";
import { ImageIcon, Loader2, X } from "lucide-react";
import type React from "react";
import { memo, useCallback, useRef, useState } from "react";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (imageFile?: File) => Promise<boolean>;
  formData: CategoryFormData;
  onUpdateFormData: (data: Partial<CategoryFormData>) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

export const CategoryFormModal = memo<CategoryFormModalProps>(
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
    const [imagePreview, setImagePreview] = useState<string | null>(
      formData.image || null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const success = await onSubmit(selectedFile || undefined);
        if (success) {
          onClose();
          setImagePreview(null);
          setSelectedFile(null);
        }

        setLoading(false);
      },
      [onSubmit, onClose, selectedFile]
    );

    const handleInputChange = useCallback(
      (field: keyof CategoryFormData, value: string | boolean) => {
        onUpdateFormData({ [field]: value });
      },
      [onUpdateFormData]
    );

    const handleImageUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          // Create preview
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            setImagePreview(imageUrl);
          };
          reader.readAsDataURL(file);
        }
      },
      []
    );

    const handleRemoveImage = useCallback(() => {
      setImagePreview(null);
      setSelectedFile(null);
      handleInputChange("image", "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, [handleInputChange]);

    const handleClose = useCallback(() => {
      onClose();
      setImagePreview(formData.image || null);
    }, [onClose, formData.image]);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white border-[#accc8b] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category_name" className="text-[#44703d]">
                Tên danh mục *
              </Label>
              <Input
                id="category_name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả chi tiết về danh mục"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d] min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#44703d]">Hình ảnh danh mục</Label>

              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 border-2 border-dashed border-[#90c577] rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-48 border-2 border-dashed border-[#90c577] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#74a65d] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-12 w-12 text-[#90c577] mb-2" />
                  <p className="text-[#74a65d] text-sm text-center">
                    Nhấp để tải lên hình ảnh danh mục
                  </p>
                  <p className="text-[#90c577] text-xs mt-1">
                    PNG, JPG, GIF tối đa 5MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </div>

            {isEdit && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                  disabled={loading}
                  className="data-[state=checked]:bg-[#74a65d]"
                />
                <Label htmlFor="is_active" className="text-[#44703d]">
                  Danh mục đang hoạt động
                </Label>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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

CategoryFormModal.displayName = "CategoryFormModal";
