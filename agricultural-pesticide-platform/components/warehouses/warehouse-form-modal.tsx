"use client"

import type React from "react"
import { memo, useCallback, useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Building } from "lucide-react"
import type { WarehouseFormData } from "@/lib/store/warehouse-store"
import type { User } from "@/types/entities"

interface WarehouseFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => Promise<boolean>
  formData: WarehouseFormData
  onUpdateFormData: (data: Partial<WarehouseFormData>) => void
  distributors: User[]
  title: string
  submitText: string
  isEdit?: boolean
}

export const WarehouseFormModal = memo<WarehouseFormModalProps>(
  ({ open, onClose, onSubmit, formData, onUpdateFormData, distributors, title, submitText, isEdit = false }) => {
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(formData.invenstory_img || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const success = await onSubmit()
        if (success) {
          onClose()
          setImagePreview(null)
        }

        setLoading(false)
      },
      [onSubmit, onClose],
    )

    const handleInputChange = useCallback(
      (field: keyof WarehouseFormData, value: string | number | boolean | undefined) => {
        onUpdateFormData({ [field]: value })
      },
      [onUpdateFormData],
    )

    const handleImageUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string
            setImagePreview(imageUrl)
            handleInputChange("invenstory_img", imageUrl)
          }
          reader.readAsDataURL(file)
        }
      },
      [handleInputChange],
    )

    const handleRemoveImage = useCallback(() => {
      setImagePreview(null)
      handleInputChange("invenstory_img", "")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, [handleInputChange])

    const handleClose = useCallback(() => {
      onClose()
      setImagePreview(formData.invenstory_img || null)
    }, [onClose, formData.invenstory_img])

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl bg-white border-[#accc8b] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="distributor_id" className="text-[#44703d]">
                  Nhà phân phối *
                </Label>
                <Select
                  value={formData.distributor_id}
                  onValueChange={(value) => handleInputChange("distributor_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-[#90c577] focus:border-[#74a65d]">
                    <SelectValue placeholder="Chọn nhà phân phối" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#accc8b]">
                    {distributors.map((distributor) => (
                      <SelectItem key={distributor.user_id} value={distributor.user_id}>
                        {distributor.full_name} - {distributor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#44703d]">
                  Tên kho hàng *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên kho hàng"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_license" className="text-[#44703d]">
                  Giấy phép kinh doanh *
                </Label>
                <Input
                  id="business_license"
                  value={formData.business_license}
                  onChange={(e) => handleInputChange("business_license", e.target.value)}
                  placeholder="Nhập mã số GPKD"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invenstory_address" className="text-[#44703d]">
                Địa chỉ kho hàng *
              </Label>
              <Textarea
                id="invenstory_address"
                value={formData.invenstory_address}
                onChange={(e) => handleInputChange("invenstory_address", e.target.value)}
                placeholder="Nhập địa chỉ đầy đủ của kho hàng"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invenstory_lat" className="text-[#44703d]">
                  Vĩ độ (Latitude)
                </Label>
                <Input
                  id="invenstory_lat"
                  type="number"
                  step="any"
                  value={formData.invenstory_lat || ""}
                  onChange={(e) =>
                    handleInputChange("invenstory_lat", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                  }
                  placeholder="10.7769"
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invenstory_lng" className="text-[#44703d]">
                  Kinh độ (Longitude)
                </Label>
                <Input
                  id="invenstory_lng"
                  type="number"
                  step="any"
                  value={formData.invenstory_lng || ""}
                  onChange={(e) =>
                    handleInputChange("invenstory_lng", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                  }
                  placeholder="106.6811"
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#44703d]">Hình ảnh kho hàng</Label>

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
                  <Building className="h-12 w-12 text-[#90c577] mb-2" />
                  <p className="text-[#74a65d] text-sm text-center">Nhấp để tải lên hình ảnh kho hàng</p>
                  <p className="text-[#90c577] text-xs mt-1">PNG, JPG, GIF tối đa 5MB</p>
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
                  id="is_locked"
                  checked={!formData.is_locked}
                  onCheckedChange={(checked) => handleInputChange("is_locked", !checked)}
                  disabled={loading}
                  className="data-[state=checked]:bg-[#74a65d]"
                />
                <Label htmlFor="is_locked" className="text-[#44703d]">
                  Kho hàng đang hoạt động
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
              <Button type="submit" disabled={loading} className="bg-[#90c577] hover:bg-[#74a65d] text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
)

WarehouseFormModal.displayName = "WarehouseFormModal"
