"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import type { CreateProductRequest, UpdateProductRequest } from "@/lib/mock/server"

interface ProductFormData {
  product_name: string
  description: string
  usage_instructions: string
  unit_product_price: number
  category_ids: string[]
  distributor_id: string
  is_active: boolean
  images: Array<{
    id: string
    url: string
    is_primary: boolean
    alt_text?: string
  }>
  diseases: Array<{
    id: string
    disease_id: string
    is_primary: boolean
  }>
  ingredients: Array<{
    id: string
    ingredient_id: string
    concentration: number
    is_primary: boolean
  }>
}

export function ProductFormModal() {
  const {
    isAddModalOpen,
    isEditModalOpen,
    editingProduct,
    closeModals,
    createProduct,
    updateProduct,
    categories,
    diseases,
    activeIngredients,
  } = useProducts()

  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    description: "",
    usage_instructions: "",
    unit_product_price: 0,
    category_ids: [],
    distributor_id: "dist1", // Default to first distributor for demo
    is_active: true,
    images: [],
    diseases: [],
    ingredients: [],
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isOpen = isAddModalOpen || isEditModalOpen
  const isEditing = isEditModalOpen && editingProduct

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingProduct) {
        setFormData({
          product_name: editingProduct.product_name,
          description: editingProduct.description,
          usage_instructions: editingProduct.usage_instructions,
          unit_product_price: editingProduct.unit_product_price,
          category_ids: editingProduct.categories.map((c) => c.category_id),
          distributor_id: editingProduct.distributor.user_id,
          is_active: editingProduct.is_active,
          images:
            editingProduct.product_images?.map((img) => ({
              id: img.image_id,
              url: img.image_url,
              is_primary: img.is_primary,
              alt_text: img.alt_text,
            })) || [],
          diseases:
            editingProduct.product_diseases?.map((pd) => ({
              id: pd.product_disease_id,
              disease_id: pd.disease.disease_id,
              is_primary: pd.is_primary,
            })) || [],
          ingredients:
            editingProduct.product_ingredients?.map((pi) => ({
              id: pi.product_ingredient_id,
              ingredient_id: pi.active_ingredient.ingredient_id,
              concentration: pi.concentration,
              is_primary: pi.is_primary,
            })) || [],
        })
      } else {
        setFormData({
          product_name: "",
          description: "",
          usage_instructions: "",
          unit_product_price: 0,
          category_ids: [],
          distributor_id: "dist1",
          is_active: true,
          images: [],
          diseases: [],
          ingredients: [],
        })
      }
      setErrors({})
    }
  }, [isOpen, isEditing, editingProduct])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.product_name.trim()) {
      newErrors.product_name = "Tên sản phẩm là bắt buộc"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sản phẩm là bắt buộc"
    }

    if (!formData.usage_instructions.trim()) {
      newErrors.usage_instructions = "Hướng dẫn sử dụng là bắt buộc"
    }

    if (formData.unit_product_price <= 0) {
      newErrors.unit_product_price = "Giá sản phẩm phải lớn hơn 0"
    }

    if (formData.category_ids.length === 0) {
      newErrors.category_ids = "Phải chọn ít nhất một danh mục"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)

      if (isEditing && editingProduct) {
        const updateData: UpdateProductRequest = {
          product_id: editingProduct.product_id,
          product_name: formData.product_name,
          description: formData.description,
          usage_instructions: formData.usage_instructions,
          unit_product_price: formData.unit_product_price,
          category_ids: formData.category_ids,
          is_active: formData.is_active,
        }
        await updateProduct(updateData)
      } else {
        const createData: CreateProductRequest = {
          distributor_id: formData.distributor_id,
          category_ids: formData.category_ids,
          product_name: formData.product_name,
          description: formData.description,
          usage_instructions: formData.usage_instructions,
          unit_product_price: formData.unit_product_price,
          is_active: formData.is_active,
        }
        await createProduct(createData)
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }))
  }

  const addImage = () => {
    const newImage = {
      id: `img_${Date.now()}`,
      url: "/placeholder.svg",
      is_primary: formData.images.length === 0,
      alt_text: "",
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }))
  }

  const removeImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }))
  }

  const addDisease = () => {
    const newDisease = {
      id: `disease_${Date.now()}`,
      disease_id: "",
      is_primary: false,
    }
    setFormData((prev) => ({
      ...prev,
      diseases: [...prev.diseases, newDisease],
    }))
  }

  const removeDisease = (diseaseId: string) => {
    setFormData((prev) => ({
      ...prev,
      diseases: prev.diseases.filter((d) => d.id !== diseaseId),
    }))
  }

  const updateDisease = (diseaseId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      diseases: prev.diseases.map((d) => (d.id === diseaseId ? { ...d, [field]: value } : d)),
    }))
  }

  const addIngredient = () => {
    const newIngredient = {
      id: `ingredient_${Date.now()}`,
      ingredient_id: "",
      concentration: 0,
      is_primary: false,
    }
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }))
  }

  const removeIngredient = (ingredientId: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== ingredientId),
    }))
  }

  const updateIngredient = (ingredientId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) => (i.id === ingredientId ? { ...i, [field]: value } : i)),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModals}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin sản phẩm và các mối quan hệ liên quan."
              : "Nhập thông tin chi tiết cho sản phẩm mới."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">
                    Tên sản phẩm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))}
                    placeholder="Nhập tên sản phẩm"
                  />
                  {errors.product_name && <p className="text-sm text-destructive">{errors.product_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_product_price">
                    Giá sản phẩm (VNĐ) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="unit_product_price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.unit_product_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unit_product_price: Number(e.target.value) }))}
                    placeholder="0"
                  />
                  {errors.unit_product_price && <p className="text-sm text-destructive">{errors.unit_product_price}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả sản phẩm <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                  rows={3}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage_instructions">
                  Hướng dẫn sử dụng <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="usage_instructions"
                  value={formData.usage_instructions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usage_instructions: e.target.value }))}
                  placeholder="Nhập hướng dẫn sử dụng chi tiết"
                  rows={3}
                />
                {errors.usage_instructions && <p className="text-sm text-destructive">{errors.usage_instructions}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danh mục sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>
                  Chọn danh mục <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.category_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category_${category.category_id}`}
                        checked={formData.category_ids.includes(category.category_id)}
                        onCheckedChange={() => handleCategoryToggle(category.category_id)}
                      />
                      <Label
                        htmlFor={`category_${category.category_id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.category_name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.category_ids.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.category_ids.map((categoryId) => {
                      const category = categories.find((c) => c.category_id === categoryId)
                      return category ? (
                        <Badge key={categoryId} variant="secondary">
                          {category.category_name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
                {errors.category_ids && <p className="text-sm text-destructive">{errors.category_ids}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Hình ảnh sản phẩm
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm ảnh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.images.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có hình ảnh nào.</p>
              ) : (
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={image.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="URL hình ảnh"
                            value={image.url}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.map((img) =>
                                  img.id === image.id ? { ...img, url: e.target.value } : img,
                                ),
                              }))
                            }}
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`primary_${image.id}`}
                              checked={image.is_primary}
                              onCheckedChange={(checked) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.map((img) => ({
                                    ...img,
                                    is_primary: img.id === image.id ? !!checked : false,
                                  })),
                                }))
                              }}
                            />
                            <Label htmlFor={`primary_${image.id}`} className="text-sm">
                              Ảnh chính
                            </Label>
                          </div>
                        </div>
                        <Input
                          placeholder="Mô tả ảnh (tùy chọn)"
                          value={image.alt_text || ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.map((img) =>
                                img.id === image.id ? { ...img, alt_text: e.target.value } : img,
                              ),
                            }))
                          }}
                        />
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeImage(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diseases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Bệnh điều trị
                <Button type="button" variant="outline" size="sm" onClick={addDisease}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bệnh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.diseases.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có bệnh nào được liên kết.</p>
              ) : (
                <div className="space-y-3">
                  {formData.diseases.map((disease) => (
                    <div key={disease.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Select
                          value={disease.disease_id}
                          onValueChange={(value) => updateDisease(disease.id, "disease_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bệnh" />
                          </SelectTrigger>
                          <SelectContent>
                            {diseases.map((d) => (
                              <SelectItem key={d.disease_id} value={d.disease_id}>
                                {d.disease_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`disease_primary_${disease.id}`}
                          checked={disease.is_primary}
                          onCheckedChange={(checked) => updateDisease(disease.id, "is_primary", !!checked)}
                        />
                        <Label htmlFor={`disease_primary_${disease.id}`} className="text-sm">
                          Điều trị chính
                        </Label>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeDisease(disease.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Hoạt chất
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm hoạt chất
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.ingredients.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có hoạt chất nào được liên kết.</p>
              ) : (
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Select
                          value={ingredient.ingredient_id}
                          onValueChange={(value) => updateIngredient(ingredient.id, "ingredient_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hoạt chất" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeIngredients.map((ai) => (
                              <SelectItem key={ai.ingredient_id} value={ai.ingredient_id}>
                                {ai.ingredient_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Nồng độ %"
                          value={ingredient.concentration}
                          onChange={(e) => updateIngredient(ingredient.id, "concentration", Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`ingredient_primary_${ingredient.id}`}
                          checked={ingredient.is_primary}
                          onCheckedChange={(checked) => updateIngredient(ingredient.id, "is_primary", !!checked)}
                        />
                        <Label htmlFor={`ingredient_primary_${ingredient.id}`} className="text-sm">
                          Chính
                        </Label>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeIngredient(ingredient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: !!checked }))}
                />
                <Label htmlFor="is_active">Kích hoạt sản phẩm</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Sản phẩm sẽ hiển thị trên marketplace khi được kích hoạt
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModals} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo sản phẩm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
