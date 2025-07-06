"use client"

import type React from "react"

import { memo, useCallback, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import type { UserFormData } from "@/lib/store/user-store"

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => Promise<boolean>
  formData: UserFormData
  onUpdateFormData: (data: Partial<UserFormData>) => void
  title: string
  submitText: string
  isEdit?: boolean
}

export const UserFormModal = memo<UserFormModalProps>(
  ({ open, onClose, onSubmit, formData, onUpdateFormData, title, submitText, isEdit = false }) => {
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const success = await onSubmit()
        if (success) {
          onClose()
        }

        setLoading(false)
      },
      [onSubmit, onClose],
    )

    const handleInputChange = useCallback(
      (field: keyof UserFormData, value: string | boolean) => {
        onUpdateFormData({ [field]: value })
      },
      [onUpdateFormData],
    )

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-[#accc8b]">
          <DialogHeader>
            <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#44703d]">
                  Tên đăng nhập *
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#44703d]">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#44703d]">
                  Mật khẩu *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-[#44703d]">
                Họ và tên *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
                disabled={loading}
                className="border-[#90c577] focus:border-[#74a65d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-[#44703d]">
                  Số điện thoại *
                </Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="+84xxxxxxxxx"
                  required
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cccd" className="text-[#44703d]">
                  CCCD/CMND
                </Label>
                <Input
                  id="cccd"
                  value={formData.cccd || ""}
                  onChange={(e) => handleInputChange("cccd", e.target.value)}
                  placeholder="Nhập số CCCD/CMND"
                  disabled={loading}
                  className="border-[#90c577] focus:border-[#74a65d]"
                />
              </div>
            </div>

            {/* Only show role selection for edit mode and admin users */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#44703d]">
                  Vai trò *
                </Label>
                <Select
                  value={formData.role_name}
                  onValueChange={(value) => handleInputChange("role_name", value as any)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#accc8b]">
                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    <SelectItem value="DISTRIBUTOR">Đại lý</SelectItem>
                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isEdit && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  disabled={loading}
                />
                <Label htmlFor="is_active" className="text-[#44703d]">
                  Tài khoản đang hoạt động
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

UserFormModal.displayName = "UserFormModal"
