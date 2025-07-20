"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateImageFile } from "@/utils/image"

interface ImageUploadProps {
  onImageSelect: (file: File | null, base64: string | null, mimeType?: string) => void
  error?: string | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, error, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    file: File
    preview: string
  } | null>(null)

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      setSelectedImage(null)
      onImageSelect(null, null)
      return
    }

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      console.error('Image validation failed:', validation.error);
      onImageSelect(null, null);
      return;
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      const base64Data = base64.split(',')[1] // Remove data:image/...;base64, prefix
      
      setSelectedImage({
        file,
        preview: base64
      })
      
      onImageSelect(file, base64Data, file.type) // Pass the actual MIME type
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }, [disabled, handleFileChange])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }, [handleFileChange])

  const removeImage = useCallback(() => {
    setSelectedImage(null)
    onImageSelect(null, null)
  }, [onImageSelect])

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer block ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Tải lên hình ảnh cây trồng
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Kéo thả hình ảnh vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Image
                  src={selectedImage.preview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={removeImage}
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">{selectedImage.file.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {selectedImage.file.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Hình ảnh đã được tải lên thành công
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
