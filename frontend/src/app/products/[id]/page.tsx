"use client";

import RelatedProducts from "@/components/products/related-products";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { addToCart } from "@/lib/features/cart-slice";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Tìm sản phẩm theo ID
  const product = products.find((p) => p.id === id) || products[0];

  // Hình ảnh sản phẩm (trong thực tế, những hình ảnh này sẽ đến từ dữ liệu sản phẩm)
  const productImages = [
    product.image,
    "/images/products/product-detail-2.jpg",
    "/images/products/product-detail-3.jpg",
    "/images/products/product-detail-4.jpg",
  ];

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        sellerId: product.seller.id,
        sellerName: product.seller.name,
      })
    );
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="cursor-pointer">{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Hình ảnh sản phẩm */}
        <div>
          <div className="relative aspect-square mb-4 border rounded-lg overflow-hidden">
            <Image
              src={productImages[activeImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount && product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square border rounded-md overflow-hidden cursor-pointer ${
                  activeImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Hình ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {product.rating} ({product.ratingCount} đánh giá)
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-green-600">Đã bán 250+</span>
          </div>

          <div className="flex items-center mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </div>
            {product.originalPrice && (
              <div className="ml-3 text-lg text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
            {product.discount && product.discount > 0 && (
              <Badge className="ml-3 bg-red-500">-{product.discount}%</Badge>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Mô tả:</h3>
            <p className="text-gray-600">
              {product.name} được trồng và thu hoạch theo tiêu chuẩn VietGAP,
              đảm bảo an toàn vệ sinh thực phẩm. Sản phẩm tươi ngon, không sử
              dụng hóa chất độc hại, phù hợp cho mọi gia đình.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Đại lý:</h3>
            <Link
              href={`/seller/${product.seller.id}`}
              className="flex items-center"
            >
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage
                  src={`/images/sellers/${product.seller.id}.jpg`}
                  alt={product.seller.name}
                />
                <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-primary hover:underline">
                  {product.seller.name}
                </div>
                <div className="text-xs text-gray-500">Xem cửa hàng</div>
              </div>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Số lượng:
            </h3>
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
              <span className="ml-4 text-sm text-gray-500">
                Còn 500 sản phẩm
              </span>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center text-sm">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <span>Đảm bảo chất lượng</span>
            </div>
            <div className="flex items-center text-sm">
              <RotateCcw className="h-5 w-5 text-primary mr-2" />
              <span>Đổi trả trong 7 ngày</span>
            </div>
            <div className="flex items-center text-sm">
              <MessageCircle className="h-5 w-5 text-primary mr-2" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs thông tin chi tiết */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
          >
            Chi tiết sản phẩm
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
          >
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
          >
            Đánh giá ({product.ratingCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-6">
          <div className="prose max-w-none">
            <h3>Mô tả chi tiết sản phẩm</h3>
            <p>
              {product.name} là sản phẩm nông nghiệp chất lượng cao, được trồng
              và thu hoạch theo tiêu chuẩn VietGAP, đảm bảo an toàn vệ sinh thực
              phẩm. Sản phẩm tươi ngon, không sử dụng hóa chất độc hại, phù hợp
              cho mọi gia đình.
            </p>
            <p>
              Được trồng tại các vùng nông nghiệp sạch, sản phẩm của chúng tôi
              luôn đảm bảo chất lượng và hương vị tự nhiên. Chúng tôi cam kết
              mang đến cho khách hàng những sản phẩm tươi ngon nhất, góp phần
              vào việc bảo vệ sức khỏe của gia đình bạn.
            </p>
            <h3>Đặc điểm nổi bật</h3>
            <ul>
              <li>Sản phẩm tươi ngon, chất lượng cao</li>
              <li>Được trồng và thu hoạch theo tiêu chuẩn VietGAP</li>
              <li>Không sử dụng hóa chất độc hại</li>
              <li>Giàu dinh dưỡng, tốt cho sức khỏe</li>
              <li>Đóng gói cẩn thận, bảo quản tốt</li>
            </ul>
            <h3>Hướng dẫn bảo quản</h3>
            <p>
              Để đảm bảo sản phẩm luôn tươi ngon, bạn nên bảo quản trong tủ lạnh
              ở nhiệt độ 2-5°C. Nên sử dụng trong vòng 5-7 ngày sau khi mua để
              đảm bảo chất lượng tốt nhất.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="pt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                    Xuất xứ
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">Việt Nam</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                    Vùng trồng
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    Đà Lạt, Lâm Đồng
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                    Tiêu chuẩn
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">VietGAP</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                    Quy cách đóng gói
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">500g/gói</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                    Hạn sử dụng
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    7 ngày kể từ ngày thu hoạch
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Đánh giá tổng quan</h3>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-4xl font-bold">
                  {product.rating.toFixed(1)}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {product.ratingCount} đánh giá
                </div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-1">
                    <span className="text-sm text-gray-600 w-3">{star}</span>
                    <Star className="h-4 w-4 text-yellow-400 ml-1 mr-2" />
                    <Progress value={70} className="h-2 flex-1" />
                    <span className="text-sm text-gray-600 ml-2">70%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Đánh giá của khách hàng
            </h3>
            {/* Hiển thị danh sách đánh giá ở đây */}
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>KH</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Khách hàng {index + 1}</div>
                      <div className="text-sm text-gray-500">2 ngày trước</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">
                    Sản phẩm rất tươi ngon, đóng gói cẩn thận. Tôi rất hài lòng
                    với chất lượng và sẽ mua lại.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sản phẩm liên quan */}
      <RelatedProducts
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}
