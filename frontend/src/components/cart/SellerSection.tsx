import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SellerSectionProps } from "@/interfaces";
import { ChevronDown, ChevronUp, Store } from "lucide-react";
import { CartItem } from "./CartItem";

export function SellerSection({
  sellerId,
  sellerName,
  items,
  selectedItems,
  expandedSellers,
  onSelectSellerItems,
  onToggleSellerExpanded,
  onSelectItem,
  onQuantityChange,
  onRemoveItem,
  isSellerSelected,
  isSellerPartiallySelected,
}: SellerSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`seller-${sellerId}`}
            checked={isSellerSelected(sellerId)}
            indeterminate={isSellerPartiallySelected(sellerId)}
            onCheckedChange={(checked) =>
              onSelectSellerItems(sellerId, !!checked)
            }
          />
          <label
            htmlFor={`seller-${sellerId}`}
            className="font-medium flex items-center cursor-pointer"
          >
            <Store className="h-4 w-4 mr-2 text-primary" />
            {sellerName}
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8"
          onClick={() => onToggleSellerExpanded(sellerId)}
        >
          {expandedSellers.includes(sellerId) ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expandedSellers.includes(sellerId) && (
        <div className="divide-y">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelectItem={onSelectItem}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
