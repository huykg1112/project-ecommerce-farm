"use client"

import type React from "react"

import AddressMapPicker, { type AddressData } from "@/components/map/address-map-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"
import { ChangeEvent, useRef, useState } from "react"

interface DealerInfoData {
  dealerName: string
  address: AddressData
  image: File | null
  imagePreview: string
}

interface DealerInfoStepProps {
  data: DealerInfoData
  updateData: (data: Partial<DealerInfoData>) => void
}

export default function DealerInfoStep({ data, updateData }: DealerInfoStepProps) {
  const [errors, setErrors] = useState<{
    dealerName?: string
    address?: string
    image?: string
  }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateDealerName = (name: string) => {
    return name.trim() ? "" : "Vui lòng nhập tên đại lý"
  }

  const handleDealerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateData({ dealerName: value })

    const error = validateDealerName(value)
    setErrors((prev) => ({ ...prev, dealerName: error }))
  }

  const handleAddressChange = (address: AddressData) => {
    updateData({ address })

    const error = address.fullAddress ? "" : "Vui lòng chọn địa chỉ"
    setErrors((prev) => ({ ...prev, address: error }))
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Kích thước ảnh không được vượt quá 5MB" }))
        return
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Vui lòng chọn file ảnh" }))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        updateData({
          image: file,
          imagePreview: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)

      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleRemoveImage = () => {
    updateData({
      image: null,
      imagePreview: "",
    })
  }

  const handleAddressSelect = (address: any) => {
    updateData({
      address: {
        ...data.address,
        ...address,
      },
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Thông tin đại lý</h2>
      <p className="text-gray-600">
        Vui lòng cung cấp thông tin về đại lý của bạn. Thông tin này sẽ được hiển thị công khai trên trang web của chúng
        tôi.
      </p>

      <div className="space-y-2">
        <Label htmlFor="dealerName">
          Tên đại lý <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dealerName"
          value={data.dealerName}
          onChange={handleDealerNameChange}
          placeholder="Đại lý Nông sản Xanh"
        />
        {errors.dealerName && <p className="text-red-500 text-sm">{errors.dealerName}</p>}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          Địa chỉ đại lý <span className="text-red-500">*</span>
        </h3>
        <AddressMapPicker
          onAddressChange={handleAddressChange}
          initialAddress={data.address}
        />
        <div className="mt-2 text-sm text-gray-500">
          <MapPin className="inline-block mr-1" size={14} />
          {data.address.fullAddress || "Chưa chọn địa chỉ"}
        </div>
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <Label>
          Hình ảnh đại lý <span className="text-red-500">*</span>
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1"
        />
        {data.imagePreview && (
          <div className="mt-2">
            <img
              src={data.imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú thêm</Label>
        <Textarea
          id="notes"
          value={data.address.notes}
          onChange={(e) =>
            updateData({
              address: { ...data.address, notes: e.target.value },
            })
          }
          placeholder="Nhập thông tin bổ sung về đại lý của bạn"
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-green-700 text-sm">
          <span className="font-medium">Mẹo:</span> Hình ảnh đại lý nên rõ ràng, chất lượng cao và thể hiện được không
          gian kinh doanh của bạn. Điều này sẽ giúp tăng độ tin cậy với khách hàng.
        </p>
      </div>
    </div>
  )
}
