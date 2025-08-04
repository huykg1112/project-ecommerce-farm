import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartItemProps } from "@/interfaces";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartItem({
  item,
  isSelected,
  onSelectItem,
  onQuantityChange,
  onRemoveItem,
}: CartItemProps) {
  // Calculate discounted price if promotion exists
  const originalPrice = item.price;
  const discountValue = item.promotion?.discount_value || 0;
  const discountedPrice = originalPrice - discountValue;
  const finalPrice = discountValue > 0 ? discountedPrice : originalPrice;

  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`item-${item.id}`}
          checked={isSelected}
          onCheckedChange={() => onSelectItem(item.id)}
          className="mt-1"
        />
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <Link
              href={`/products/${item.productId}`}
              className="font-medium hover:text-primary"
            >
              {item.name}
            </Link>
            {/* Display product type */}
            {item.batch?.product_types?.type_name && (
              <p className="text-sm text-gray-500 mt-1">
                Loại: {item.batch.product_types.type_name}
              </p>
            )}
            {/* Display discount if exists */}
            {discountValue > 0 && (
              <div className="mt-1">
                <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded-md">
                  Giảm giá: {formatCurrency(discountValue)}
                </span>
              </div>
            )}
          </div>
          <div className="mt-2 sm:mt-0">
            {/* Show original and discounted price */}
            {discountValue > 0 ? (
              <div className="text-right">
                <div className="text-sm text-gray-400 line-through">
                  {formatCurrency(originalPrice * item.quantity)}
                </div>
                <div className="font-bold text-red-600">
                  {formatCurrency(finalPrice * item.quantity)}
                </div>
              </div>
            ) : (
              <div className="font-bold">
                {formatCurrency(finalPrice * item.quantity)}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8"
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
