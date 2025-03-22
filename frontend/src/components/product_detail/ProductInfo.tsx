import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import Link from "next/link";
import { ProductInfoProps } from "@/interfaces";

export default function ProductInfo({
  name,
  rating,
  ratingCount,
  price,
  originalPrice,
  discount,
  seller,
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
          {rating} ({ratingCount} đánh giá)
        </span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-sm text-green-600">Đã bán 250+</span>
      </div>
      <div className="flex items-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(price)}
        </div>
        {originalPrice && (
          <div className="ml-3 text-lg text-gray-500 line-through">
            {formatCurrency(originalPrice)}
          </div>
        )}
        {discount && discount > 0 && (
          <Badge className="ml-3 bg-red-500">-{discount}%</Badge>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Mô tả:</h3>
        <p className="text-gray-600">
          {name} được trồng và thu hoạch theo tiêu chuẩn VietGAP, đảm bảo an
          toàn vệ sinh thực phẩm. Sản phẩm tươi ngon, không sử dụng hóa chất độc
          hại, phù hợp cho mọi gia đình.
        </p>
      </div>
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
