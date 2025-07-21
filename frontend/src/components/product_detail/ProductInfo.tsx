import { getMaxDiscountForBatch } from "@/app/(client)/products/[id]/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductInfoProps } from "@/interfaces";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductInfo({
  name,
  rating,
  ratingCount,
  price,
  originalPrice,
  discount,
  seller,
  selectedBatch,
  differentProductTypes = [],
  setSelectedBatch,
  categories = [],
  manufacturer,
  totalSaled,
}: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {name}
      </h1>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">
          {rating.toFixed(1)} ({ratingCount} đánh giá)
        </span>
        {totalSaled && (
          <>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-green-600">Đã bán {totalSaled}+</span>
          </>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(price)}
        </div>
        {originalPrice && originalPrice > price && (
          <div className="ml-3 text-lg text-gray-500 line-through">
            {formatCurrency(originalPrice)}
          </div>
        )}
        {discount && discount > 0 && (
          <Badge className="ml-3 bg-red-500">-{discount}%</Badge>
        )}
      </div>

      {/* Product Type Selection */}
      {differentProductTypes.length > 0 && setSelectedBatch && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Loại sản phẩm:
          </h3>
          <Select
            value={selectedBatch?.batch_id}
            onValueChange={(value) => {
              const batch = differentProductTypes.find(
                (b) => b.batch_id === value
              );
              setSelectedBatch(batch || null);
            }}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Chọn loại sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              {differentProductTypes.map((batch) => (
                <SelectItem key={batch.batch_id} value={batch.batch_id}>
                  {batch.product_types?.type_name || "Không có tên"} (Còn{" "}
                  {batch.quantity}){" "}
                  {getMaxDiscountForBatch(batch) ? (
                    <span className="text-red-500 ml-2">
                      Giảm giá {getMaxDiscountForBatch(batch)?.discount_value}%
                    </span>
                  ) : null}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Manufacturer */}
      {manufacturer && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Nhà sản xuất:
          </h3>
          <div className="flex items-center">
            {manufacturer.logo && (
              <Image
                src={manufacturer.logo}
                alt={manufacturer.name}
                width={40}
                height={40}
                className="mr-3 object-contain"
              />
            )}
            <div>
              <div className="font-medium text-gray-900">
                {manufacturer.name}
              </div>
              {manufacturer.description && (
                <div className="text-sm text-gray-500">
                  {manufacturer.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Đại lý:</h3>
        <Link href={`/seller/${seller.id}`} className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage
              src={`/images/sellers/${seller.id}.jpg`}
              alt={seller.name}
            />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-primary hover:underline">
              {seller.name}
            </div>
            <div className="text-xs text-gray-500">Xem cửa hàng</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
