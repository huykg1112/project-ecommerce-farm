"use client";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  BatchProduct,
  BatchProductFormData,
  ProductType,
} from "@/lib_dashboard/types/batch-product";
import { Product } from "@/lib_dashboard/types/product";
import { Promotion } from "@/lib_dashboard/types/promotion";
import { CalendarIcon, Package, Percent, Tag } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

interface BatchProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BatchProductFormData) => Promise<boolean>;
  initialData?: BatchProduct | null;
  formData: BatchProductFormData;
  onFormDataChange: (updates: Partial<BatchProductFormData>) => void;
  loading?: boolean;
  // Dropdown data
  products: Product[];
  productTypes: ProductType[];
  promotions: Promotion[];
}

export function BatchProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  formData,
  onFormDataChange,
  loading = false,
  products,
  productTypes,
  promotions,
}: BatchProductFormModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(initialData);
  const title = isEditMode ? "Chỉnh sửa lô sản phẩm" : "Tạo lô sản phẩm mới";

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && initialData) {
      onFormDataChange({
        product_id: initialData.product.product_id,
        invenstory_id: initialData.invenstory?.invenstory_id || "",
        batch_number: initialData.batch_number,
        quantity: initialData.quantity,
        manufactured_date: initialData.manufactured_date
          ? new Date(initialData.manufactured_date).toISOString().split("T")[0]
          : "",
        expiry_date: new Date(initialData.expiry_date)
          .toISOString()
          .split("T")[0],
        low_stock_threshold: initialData.low_stock_threshold,
        is_active: initialData.is_active,
        product_type_id: initialData.product_types?.product_type_id || "",
        promotion_ids: initialData.promotions?.map((p) => p.promotion_id) || [],
      });
    }
  }, [isEditMode, initialData, onFormDataChange]);

  // Get selected product details
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.product_id === formData.product_id);
  }, [products, formData.product_id]);

  // Get active promotions
  const activePromotions = useMemo(() => {
    return promotions.filter((p) => p.is_active);
  }, [promotions]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_id) {
      newErrors.product_id = "Vui lòng chọn sản phẩm";
    }

    if (!formData.invenstory_id) {
      newErrors.invenstory_id = "Vui lòng chọn kho";
    }

    if (!formData.batch_number.trim()) {
      newErrors.batch_number = "Vui lòng nhập số lô";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = "Vui lòng chọn ngày hết hạn";
    }

    if (formData.low_stock_threshold < 0) {
      newErrors.low_stock_threshold = "Ngưỡng cảnh báo phải >= 0";
    }

    // Validate dates
    if (formData.manufactured_date && formData.expiry_date) {
      const manufDate = new Date(formData.manufactured_date);
      const expiryDate = new Date(formData.expiry_date);

      if (manufDate >= expiryDate) {
        newErrors.expiry_date = "Ngày hết hạn phải sau ngày sản xuất";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    const success = await onSubmit(formData);
    if (success) {
      onClose();
      setErrors({});
    }
  }, [validateForm, onSubmit, formData, onClose]);

  // Handle product type selection
  const handleProductTypeToggle = useCallback(
    (productTypeId: string, checked: boolean) => {
      const currentId = formData.product_type_id;
      const newId = checked ? productTypeId : "";

      onFormDataChange({ product_type_id: newId });
    },
    [formData.product_type_id, onFormDataChange]
  );

  // Handle promotion selection
  const handlePromotionToggle = useCallback(
    (promotionId: string, checked: boolean) => {
      const currentIds = formData.promotion_ids;
      const newIds = checked
        ? [...currentIds, promotionId]
        : currentIds.filter((id) => id !== promotionId);

      onFormDataChange({ promotion_ids: newIds });
    },
    [formData.promotion_ids, onFormDataChange]
  );

  const handleProdutChange = useCallback(
    (productId: string) => {
      onFormDataChange({ product_id: productId });

      // Clear errors related to product selection
      if (errors.product_id) {
        setErrors((prev) => ({ ...prev, product_id: "" }));
      }
    },
    [onFormDataChange, errors]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof BatchProductFormData, value: any) => {
      onFormDataChange({ [field]: value });

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [onFormDataChange, errors]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin lô sản phẩm"
              : "Tạo lô sản phẩm mới trong hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Thông tin cơ bản</h3>
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product_id">
                Sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => handleProdutChange(value)}
                disabled={loading}
              >
                <SelectTrigger
                  className={cn(errors.product_id && "border-red-500")}
                >
                  <SelectValue placeholder="Chọn sản phẩm..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.product_id}
                      value={product.product_id}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={product.images[0]?.image_url}
                          alt={product.images[0]?.image_url}
                          width={16}
                          height={16}
                        />
                        {product.product_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_id && (
                <p className="text-sm text-red-500">{errors.product_id}</p>
              )}
            </div>

            {/* Warehouse Selection */}
            {/* <div className="space-y-2">
              <Label htmlFor="invenstory_id">
                Kho <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.invenstory_id}
                onValueChange={(value) =>
                  handleInputChange("invenstory_id", value)
                }
                disabled={loading}
              >
                <SelectTrigger
                  className={cn(errors.invenstory_id && "border-red-500")}
                >
                  <SelectValue placeholder="Chọn sản phẩm..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.product_id}
                      value={product.product_id}
                    >
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        {product.product_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.invenstory_id && (
                <p className="text-sm text-red-500">{errors.invenstory_id}</p>
              )}
            </div> */}

            {/* Batch Number */}
            <div className="space-y-2">
              <Label htmlFor="batch_number">
                Số lô <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batch_number"
                value={formData.batch_number}
                onChange={(e) =>
                  handleInputChange("batch_number", e.target.value)
                }
                placeholder="Ví dụ: LOT2024001"
                disabled={loading}
                className={cn(errors.batch_number && "border-red-500")}
              />
              {errors.batch_number && (
                <p className="text-sm text-red-500">{errors.batch_number}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Số lượng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 0)
                }
                placeholder="Nhập số lượng..."
                disabled={loading}
                className={cn(errors.quantity && "border-red-500")}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-2">
              <Label htmlFor="low_stock_threshold">
                Ngưỡng cảnh báo hết hàng
              </Label>
              <Input
                id="low_stock_threshold"
                type="number"
                min="0"
                value={formData.low_stock_threshold}
                onChange={(e) =>
                  handleInputChange(
                    "low_stock_threshold",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Ví dụ: 10"
                disabled={loading}
                className={cn(errors.low_stock_threshold && "border-red-500")}
              />
              {errors.low_stock_threshold && (
                <p className="text-sm text-red-500">
                  {errors.low_stock_threshold}
                </p>
              )}
            </div>
          </div>

          {/* Dates and Additional Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-gray-900">
                Ngày tháng & Bổ sung
              </h3>
            </div>

            {/* Manufactured Date */}
            <div className="space-y-2">
              <Label htmlFor="manufactured_date">Ngày sản xuất</Label>
              <Input
                id="manufactured_date"
                type="date"
                value={formData.manufactured_date}
                onChange={(e) =>
                  handleInputChange("manufactured_date", e.target.value)
                }
                disabled={loading}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry_date">
                Ngày hết hạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) =>
                  handleInputChange("expiry_date", e.target.value)
                }
                disabled={loading}
                className={cn(errors.expiry_date && "border-red-500")}
              />
              {errors.expiry_date && (
                <p className="text-sm text-red-500">{errors.expiry_date}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  handleInputChange("is_active", checked)
                }
                disabled={loading}
              />
              <Label htmlFor="is_active">Trạng thái hoạt động</Label>
            </div>

            {/* Product Types */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-600" />
                <Label>Loại sản phẩm</Label>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {productTypes.map((productType) => (
                  <div
                    key={productType.product_type_id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`product_type_${productType.product_type_id}`}
                      checked={
                        formData.product_type_id === productType.product_type_id
                      }
                      onCheckedChange={(checked) =>
                        handleProductTypeToggle(
                          productType.product_type_id,
                          checked as boolean
                        )
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`product_type_${productType.product_type_id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {productType.type_name}
                    </Label>
                  </div>
                ))}
                {productTypes.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Không có loại sản phẩm nào
                  </p>
                )}
              </div>
            </div>

            {/* Promotions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-orange-600" />
                <Label>Khuyến mãi</Label>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {activePromotions.map((promotion) => (
                  <div
                    key={promotion.promotion_id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`promotion_${promotion.promotion_id}`}
                      checked={formData.promotion_ids.includes(
                        promotion.promotion_id
                      )}
                      onCheckedChange={(checked) =>
                        handlePromotionToggle(
                          promotion.promotion_id,
                          checked as boolean
                        )
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`promotion_${promotion.promotion_id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      <div>
                        <span className="font-medium">
                          {promotion.promotion_name}
                        </span>
                        <span className="text-orange-600 ml-2">
                          -{promotion.discount_value}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(
                          promotion?.start_date || ""
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          promotion?.end_date || ""
                        ).toLocaleDateString()}
                      </div>
                    </Label>
                  </div>
                ))}
                {activePromotions.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Không có khuyến mãi nào đang hoạt động
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Product Info */}
        {selectedProduct && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Thông tin sản phẩm đã chọn
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Tên sản phẩm:</span>
                <span className="ml-2 font-medium">
                  {selectedProduct.product_name}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Giá:</span>
                <span className="ml-2 font-medium">
                  {selectedProduct.unit_product_price.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
