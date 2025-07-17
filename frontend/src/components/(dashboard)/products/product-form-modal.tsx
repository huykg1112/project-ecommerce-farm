"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { activeIngredientService } from "@/lib_dashboard/services/active-ingredient-service";
import { categoryServiceManagement } from "@/lib_dashboard/services/category-service-management";
import { diseaseServiceManagement } from "@/lib_dashboard/services/disease-service-management";
import { manufacturerServiceManagement } from "@/lib_dashboard/services/manufacturers-service-management";
import { Category } from "@/lib_dashboard/types/category";
import { Manufacturer } from "@/lib_dashboard/types/manufacturer";
import { ProductFormData } from "@/lib_dashboard/types/product";
import { ActiveIngredient, Disease } from "@/types/entities";
import { ImagePlus, Star, StarOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  formData: ProductFormData;
  onUpdateFormData: (updates: Partial<ProductFormData>) => void;
  title: string;
  submitText: string;
  isEdit?: boolean;
}

interface ImageUpload {
  id: string;
  file?: File;
  url: string;
  is_primary: boolean;
  alt_text?: string;
}

export function ProductFormModal({
  open,
  onClose,
  onSubmit,
  formData,
  onUpdateFormData,
  title,
  submitText,
  isEdit = false,
}: ProductFormModalProps) {
  // Hooks for dropdown

  // Local state
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [manufacturers, setManufacturers] = useState<Manufacturer[] | null>(
    null
  );
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [activeIngredients, setActiveIngredients] = useState<
    ActiveIngredient[] | null
  >(null);
  const [diseases, setDiseases] = useState<Disease[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<ImageUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingOptions(true);
      try {
        const [manufacturers, categories, activeIngredients, diseases] =
          await Promise.all([
            manufacturerServiceManagement.getManufacturers(),
            categoryServiceManagement.getCategories(),
            activeIngredientService.list(),
            diseaseServiceManagement.getDiseases(),
          ]);
        setManufacturers(manufacturers);
        setCategories(categories);
        setActiveIngredients(activeIngredients);
        setDiseases(diseases);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchData();
  }, []);

  // const manufacturers = useMemo(async () => {
  //   setLoadingManufacturers(true);
  //   const list = await manufacturerServiceManagement.getManufacturers();
  //   if (list && list.length > 0) {
  //     return list.filter(
  //       (manufacturer: Manufacturer) => manufacturer.isActive
  //     ) as Manufacturer[];
  //   }
  //   setLoadingManufacturers(false);
  //   return [];
  // }, []);

  // const categories = useMemo(async () => {
  //   setLoadingCategories(true);
  //   const list = await categoryServiceManagement.getCategories();
  //   if (list && list.length > 0) {
  //     return list.filter(
  //       (category: Category) => category.isActive
  //     ) as Category[];
  //   }
  //   setLoadingCategories(false);
  //   return [];
  // }, []);

  // const activeIngredients = useMemo(async () => {
  //   setLoadingIngredients(true);
  //   const list = await activeIngredientService.list();
  //   if (list && list.length > 0) {
  //     return list.filter(
  //       (ingredient: Ingredient) => ingredient.isActive
  //     ) as Ingredient[];
  //   }
  //   setLoadingIngredients(false);
  //   return [];
  // }, []);

  // const diseases = useMemo(async () => {
  //   setLoadingDiseases(true);
  //   const list = await diseaseServiceManagement.getDiseases();
  //   if (list && list.length > 0) {
  //     return list.filter((disease: Disease) => disease.is_active) as Disease[];
  //   }
  //   setLoadingDiseases(false);
  //   return [];
  // }, []);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_name?.trim()) {
      newErrors.product_name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả sản phẩm là bắt buộc";
    }

    if (!formData.usage_instructions?.trim()) {
      newErrors.usage_instructions = "Hướng dẫn sử dụng là bắt buộc";
    }

    if (!formData.unit_product_price || formData.unit_product_price <= 0) {
      newErrors.unit_product_price = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.category_ids?.length) {
      newErrors.category_ids = "Phải chọn ít nhất một danh mục";
    }

    if (images.length === 0) {
      newErrors.images = "Phải có ít nhất một hình ảnh sản phẩm";
    }

    if (images.length > 0 && !images.some((img) => img.is_primary)) {
      newErrors.images = "Phải chọn một hình ảnh làm ảnh chính";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images]);

  // Form handlers
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // TODO: Handle image upload to Cloudinary here
      // For now, we'll just pass the form data
      const success = await onSubmit();

      if (success) {
        setImages([]);
        setErrors({});
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, validateForm]);

  const handleClose = useCallback(() => {
    setImages([]);
    setErrors({});
    onClose();
  }, [onClose]);

  const updateFormData = useCallback(
    (updates: Partial<ProductFormData>) => {
      onUpdateFormData(updates);
      // Clear related errors
      if (updates.product_name !== undefined) {
        setErrors((prev) => ({ ...prev, product_name: "" }));
      }
      if (updates.description !== undefined) {
        setErrors((prev) => ({ ...prev, description: "" }));
      }
      if (updates.usage_instructions !== undefined) {
        setErrors((prev) => ({ ...prev, usage_instructions: "" }));
      }
      if (updates.unit_product_price !== undefined) {
        setErrors((prev) => ({ ...prev, unit_product_price: "" }));
      }
      if (updates.category_ids !== undefined) {
        setErrors((prev) => ({ ...prev, category_ids: "" }));
      }
    },
    [onUpdateFormData]
  );

  // Image handling
  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = 5 - images.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      filesToAdd.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImage: ImageUpload = {
              id: Date.now().toString() + Math.random().toString(),
              file,
              url: e.target?.result as string,
              is_primary: images.length === 0, // First image is primary by default
              alt_text: file.name,
            };
            setImages((prev) => [...prev, newImage]);
            setErrors((prev) => ({ ...prev, images: "" }));
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [images.length]
  );

  const handleImageRemove = useCallback((imageId: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      // If we removed the primary image, make the first remaining image primary
      if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  }, []);

  const handleSetPrimaryImage = useCallback((imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === imageId,
      }))
    );
  }, []);

  // manufacturer
  const handleManufacturerChange = useCallback(
    (manufacturerId: string) => {
      updateFormData({ manufacturer_id: manufacturerId });
    },
    [updateFormData]
  );

  // Category selection
  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      const currentCategories = formData.category_ids || [];
      const updatedCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter((id) => id !== categoryId)
        : [...currentCategories, categoryId];

      updateFormData({ category_ids: updatedCategories });
    },
    [formData.category_ids, updateFormData]
  );

  // Ingredient selection
  const handleIngredientToggle = useCallback(
    (ingredientId: string) => {
      const currentIngredients = formData.ingredient_ids || [];
      const updatedIngredients = currentIngredients.includes(ingredientId)
        ? currentIngredients.filter((id) => id !== ingredientId)
        : [...currentIngredients, ingredientId];

      updateFormData({ ingredient_ids: updatedIngredients });
    },
    [formData.ingredient_ids, updateFormData]
  );

  // Disease selection
  const handleDiseaseToggle = useCallback(
    (diseaseId: string) => {
      const currentDiseases = formData.disease_ids || [];
      const updatedDiseases = currentDiseases.includes(diseaseId)
        ? currentDiseases.filter((id) => id !== diseaseId)
        : [...currentDiseases, diseaseId];

      updateFormData({ disease_ids: updatedDiseases });
    },
    [formData.disease_ids, updateFormData]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#44703d]">{title}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin sản phẩm thuốc bảo vệ thực vật"
              : "Thêm sản phẩm thuốc bảo vệ thực vật mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="product_name">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="product_name"
                  value={formData.product_name || ""}
                  onChange={(e) =>
                    updateFormData({ product_name: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm..."
                  className={errors.product_name ? "border-red-500" : ""}
                />
                {errors.product_name && (
                  <p className="text-sm text-red-500">{errors.product_name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Usage Instructions */}
              <div className="space-y-2">
                <Label htmlFor="usage_instructions">
                  Hướng dẫn sử dụng <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="usage_instructions"
                  value={formData.usage_instructions || ""}
                  onChange={(e) =>
                    updateFormData({ usage_instructions: e.target.value })
                  }
                  placeholder="Hướng dẫn chi tiết cách sử dụng sản phẩm..."
                  rows={3}
                  className={errors.usage_instructions ? "border-red-500" : ""}
                />
                {errors.usage_instructions && (
                  <p className="text-sm text-red-500">
                    {errors.usage_instructions}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="unit_product_price">
                  Giá sản phẩm (VND) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit_product_price"
                  type="number"
                  value={formData.unit_product_price || ""}
                  onChange={(e) =>
                    updateFormData({
                      unit_product_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min="0"
                  step="1000"
                  className={errors.unit_product_price ? "border-red-500" : ""}
                />
                {formData.unit_product_price > 0 && (
                  <p className="text-sm text-gray-500">
                    {formatCurrency(formData.unit_product_price)}
                  </p>
                )}
                {errors.unit_product_price && (
                  <p className="text-sm text-red-500">
                    {errors.unit_product_price}
                  </p>
                )}
              </div>

              {loadingOptions ? (
                <div className="text-center text-gray-500">
                  Đang tải danh sách nhà sản xuất...
                </div>
              ) : !manufacturers || manufacturers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không tìm thấy nhà sản xuất.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {manufacturers.map((manufacturer: Manufacturer) => (
                    // mỗi sản phẩm chỉ có một nhà sản xuất
                    <div
                      key={manufacturer.id}
                      className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Checkbox
                        id={`manufacturer-${manufacturer.id}`}
                        checked={formData.manufacturer_id === manufacturer.id}
                        onCheckedChange={() =>
                          handleManufacturerChange(manufacturer.id)
                        }
                        className="mr-2"
                      />
                      <Label
                        htmlFor={`manufacturer-${manufacturer.id}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {manufacturer.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    updateFormData({ is_active: Boolean(checked) })
                  }
                />
                <Label htmlFor="is_active">Sản phẩm đang hoạt động</Label>
              </div>
            </CardContent>
          </Card>
          {/* thêm hình ảnh */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Hình ảnh sản phẩm <span className="text-red-500">*</span>
              </CardTitle>
              <DialogDescription>
                Tải lên tối đa 5 hình ảnh. Hình ảnh đầu tiên sẽ là ảnh chính.
              </DialogDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 5}
                  className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Thêm hình ảnh ({images.length}/5)
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square relative border-2 rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt_text || "Product image"}
                          fill
                          className="object-cover"
                        />

                        {/* Primary indicator */}
                        {image.is_primary && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                            Ảnh chính
                          </Badge>
                        )}

                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            disabled={image.is_primary}
                          >
                            {image.is_primary ? (
                              <Star className="h-4 w-4" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleImageRemove(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-sm text-red-500">{errors.images}</p>
              )}
            </CardContent>
          </Card>

          {/* danh mục */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danh mục sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingOptions ? (
                <div>Đang tải danh mục...</div>
              ) : !categories || categories.length === 0 ? (
                <div>Không có danh mục nào.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category: Category) => (
                    <div
                      key={category.id}
                      className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.category_ids?.includes(category.id)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.id)
                        }
                        className="mr-2"
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoạt chất</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingOptions ? (
                <div>Đang tải hoạt chất...</div>
              ) : !activeIngredients || activeIngredients.length === 0 ? (
                <div>Không có hoạt chất nào.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeIngredients.map(
                    (activeIngredient: ActiveIngredient) => (
                      <div
                        key={activeIngredient.ingredient_id}
                        className="flex gap-3  items-center p-4 border rounded-lg shadow-sm hover:shadow-md"
                      >
                        <Checkbox
                          id={`ingredient-${activeIngredient.ingredient_id}`}
                          checked={formData.ingredient_ids?.includes(
                            activeIngredient.ingredient_id
                          )}
                          onCheckedChange={() =>
                            handleIngredientToggle(
                              activeIngredient.ingredient_id
                            )
                          }
                        />
                        <Label
                          htmlFor={`ingredient-${activeIngredient.ingredient_id}`}
                        >
                          {activeIngredient.ingredient_name ||
                            "Chưa có tên hoạt chất"}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diseases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bệnh cây trồng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingOptions ? (
                <div>Đang tải bệnh cây trồng...</div>
              ) : !diseases || diseases.length === 0 ? (
                <div>Không có bệnh cây trồng nào.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {diseases.map((disease: Disease) => (
                    <div
                      key={disease.disease_id}
                      className="flex gap-3 items-center p-4 border rounded-lg shadow-sm hover:shadow-md"
                    >
                      <Checkbox
                        id={`disease-${disease.disease_id}`}
                        checked={formData.disease_ids?.includes(
                          disease.disease_id
                        )}
                        onCheckedChange={() =>
                          handleDiseaseToggle(disease.disease_id)
                        }
                      />
                      <Label htmlFor={`disease-${disease.disease_id}`}>
                        {disease.disease_name || "Chưa có tên bệnh"}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          >
            {loading ? "Đang xử lý..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
