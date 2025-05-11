"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

interface PersonalInfoData {
  fullName: string
  email: string
  phone: string
  idNumber: string
  businessLicense: string
}

interface PersonalInfoStepProps {
  data: PersonalInfoData
  updateData: (data: Partial<PersonalInfoData>) => void
}

export default function PersonalInfoStep({ data, updateData }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoData, string>>>({})

  const validateField = (name: keyof PersonalInfoData, value: string) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Vui lòng nhập họ tên"
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email không hợp lệ"
      case "phone":
        return /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(value) ? "" : "Số điện thoại không hợp lệ"
      case "idNumber":
        return /^[0-9]{9,12}$/.test(value) ? "" : "Số CMND/CCCD phải có 9-12 số"
      case "businessLicense":
        return value.trim() ? "" : "Vui lòng nhập số giấy phép kinh doanh"
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateData({ [name]: value })

    const error = validateField(name as keyof PersonalInfoData, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Validate all fields on initial load
  useEffect(() => {
    const newErrors: Partial<Record<keyof PersonalInfoData, string>> = {}

    Object.entries(data).forEach(([key, value]) => {
      const fieldName = key as keyof PersonalInfoData
      newErrors[fieldName] = validateField(fieldName, value)
    })

    setErrors(newErrors)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
      <p className="text-gray-600">
        Vui lòng cung cấp thông tin cá nhân của bạn. Thông tin này sẽ được sử dụng để xác minh danh tính và liên hệ.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input id="phone" name="phone" value={data.phone} onChange={handleChange} placeholder="0912345678" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber">
            Số CMND/CCCD <span className="text-red-500">*</span>
          </Label>
          <Input id="idNumber" name="idNumber" value={data.idNumber} onChange={handleChange} placeholder="123456789" />
          {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="businessLicense">
            Số giấy phép kinh doanh <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessLicense"
            name="businessLicense"
            value={data.businessLicense}
            onChange={handleChange}
            placeholder="0123456789"
          />
          {errors.businessLicense && <p className="text-red-500 text-sm">{errors.businessLicense}</p>}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Lưu ý:</span> Tất cả thông tin cá nhân của bạn sẽ được bảo mật theo chính sách
          của chúng tôi và chỉ được sử dụng cho mục đích xác minh danh tính.
        </p>
      </div>
    </div>
  )
}
