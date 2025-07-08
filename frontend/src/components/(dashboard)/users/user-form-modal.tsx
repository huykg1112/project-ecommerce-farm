"use client";

import type React from "react";

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
import type { UserFormData } from "@/lib_dashboard/store/user-store";
import { Loader2 } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  formData: UserFormData;
  onUpdateFormData: (data: Partial<UserFormData>) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

export const UserFormModal = memo<UserFormModalProps>(
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
    // console.log("formData", formData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const refs = {
      username: useRef<HTMLInputElement>(null),
      email: useRef<HTMLInputElement>(null),
      password: useRef<HTMLInputElement>(null),
      full_name: useRef<HTMLInputElement>(null),
      phone_number: useRef<HTMLInputElement>(null),
      cccd: useRef<HTMLInputElement>(null),
    };

    const validate = useCallback(() => {
      const newErrors: Record<string, string> = {};
      // username: required, không chứa khoảng trắng, tối thiểu 3 ký tự
      if (!formData.username || formData.username.trim().length < 3) {
        newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
      } else if (/\s/.test(formData.username)) {
        newErrors.username = "Tên đăng nhập không được chứa khoảng trắng";
      }
      // email: required, đúng định dạng email
      if (!formData.email) {
        newErrors.email = "Email là bắt buộc";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
      // password: required khi tạo mới, tối thiểu 6 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
      if (!isEdit) {
        if (!formData.password) {
          newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
          newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (
          !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(formData.password)
        ) {
          newErrors.password =
            "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
        }
      }
      // full_name: required, tối thiểu 2 ký tự
      if (!formData.full_name || formData.full_name.trim().length < 2) {
        newErrors.full_name = "Họ và tên phải có ít nhất 2 ký tự";
      }
      // phone_number: required, đúng định dạng +84xxxxxxxxx hoặc 0xxxxxxxxx
      if (!formData.phone_number) {
        newErrors.phone_number = "Số điện thoại là bắt buộc";
      } else if (!/^((\+84|0)[0-9]{9,10})$/.test(formData.phone_number)) {
        newErrors.phone_number = "Số điện thoại không hợp lệ";
      }
      // cccd: không bắt buộc, nếu có phải là số, 9-12 ký tự
      if (formData.cccd && !/^\d{9,12}$/.test(formData.cccd)) {
        newErrors.cccd = "CCCD/CMND phải là số và từ 9-12 ký tự";
      }
      setErrors(newErrors);
      return newErrors;
    }, [formData, isEdit]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
          // Focus vào ô đầu tiên có lỗi
          const firstError = Object.keys(newErrors)[0];
          if (refs[firstError as keyof typeof refs]?.current) {
            refs[firstError as keyof typeof refs].current?.focus();
          }
          return;
        }
        setLoading(true);
        const success = await onSubmit();
        if (success) {
          setErrors({});
          onClose();
        }
        setLoading(false);
      },
      [onSubmit, onClose, validate, refs]
    );

    const handleInputChange = useCallback(
      (field: keyof UserFormData, value: string | boolean) => {
        onUpdateFormData({ [field]: value });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      },
      [onUpdateFormData]
    );

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-white border-[#accc8b]">
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
                  ref={refs.username}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Nhập tên đăng nhập"
                  required
                  disabled={loading}
                  className={`border-[#90c577] focus:border-[#74a65d] ${
                    errors.username ? "border-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#44703d]">
                  Email *
                </Label>
                <Input
                  id="email"
                  ref={refs.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  required
                  disabled={loading}
                  className={`border-[#90c577] focus:border-[#74a65d] ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#44703d]">
                  Mật khẩu *
                </Label>
                <Input
                  id="password"
                  ref={refs.password}
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={loading}
                  className={`border-[#90c577] focus:border-[#74a65d] ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-[#44703d]">
                Họ và tên *
              </Label>
              <Input
                id="full_name"
                ref={refs.full_name}
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
                disabled={loading}
                className={`border-[#90c577] focus:border-[#74a65d] ${
                  errors.full_name ? "border-red-500" : ""
                }`}
              />
              {errors.full_name && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.full_name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-[#44703d]">
                  Số điện thoại *
                </Label>
                <Input
                  id="phone_number"
                  ref={refs.phone_number}
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  placeholder="+84xxxxxxxxx hoặc 0xxxxxxxxx"
                  required
                  disabled={loading}
                  className={`border-[#90c577] focus:border-[#74a65d] ${
                    errors.phone_number ? "border-red-500" : ""
                  }`}
                />
                {errors.phone_number && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.phone_number}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cccd" className="text-[#44703d]">
                  CCCD/CMND
                </Label>
                <Input
                  id="cccd"
                  ref={refs.cccd}
                  value={formData.cccd || ""}
                  onChange={(e) => handleInputChange("cccd", e.target.value)}
                  placeholder="Nhập số CCCD/CMND"
                  disabled={loading}
                  className={`border-[#90c577] focus:border-[#74a65d] ${
                    errors.cccd ? "border-red-500" : ""
                  }`}
                />
                {errors.cccd && (
                  <div className="text-red-500 text-xs mt-1">{errors.cccd}</div>
                )}
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
                  onValueChange={(value) =>
                    handleInputChange("role_name", value as any)
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="border-[#90c577] focus:border-[#74a65d] bg-white">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#accc8b]">
                    <SelectItem value="Admin">Quản trị viên</SelectItem>
                    <SelectItem value="Distributor">Đại lý</SelectItem>
                    <SelectItem value="Client">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isEdit && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_active", checked)
                  }
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

UserFormModal.displayName = "UserFormModal";
