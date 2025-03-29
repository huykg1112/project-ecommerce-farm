import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartHeaderProps } from "@/interfaces";
import { Trash2 } from "lucide-react";

export function CartHeader({
  totalItems,
  selectedItemsLength,
  itemsLength,
  onSelectAll,
  onClearCart,
}: CartHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedItemsLength === itemsLength && itemsLength > 0}
            onCheckedChange={onSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-lg font-semibold cursor-pointer"
          >
            Chọn tất cả ({totalItems} sản phẩm)
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onClearCart}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}
