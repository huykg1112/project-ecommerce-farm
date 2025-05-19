import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import { ProductActionsProps } from "@/interfaces";

export default function ProductActions({
  quantity,
  decreaseQuantity,
  increaseQuantity,
  handleAddToCart,
  toggleWishlist,
  isWishlisted,
}: ProductActionsProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Số lượng:</h3>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-4 w-8 text-center">{quantity}</span>
          <Button variant="outline" size="icon" onClick={increaseQuantity}>
            <Plus className="h-4 w-4" />
          </Button>
          <span className="ml-4 text-sm text-gray-500">Còn 500 sản phẩm</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          size="lg"
          className="flex-1 bg-primary hover:bg-primary-dark"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`${isWishlisted ? "text-red-500 border-red-500" : ""}`}
          onClick={toggleWishlist}
        >
          <Heart
            className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-red-500" : ""}`}
          />
          Yêu thích
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
