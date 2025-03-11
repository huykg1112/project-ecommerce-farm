"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { sellers } from "@/data/sellers";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SellerPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("products");

  // Tìm seller theo ID
  const seller = sellers.find((s) => s.id === id) || sellers[0];

  // Lọc sản phẩm của seller
  const sellerProducts = products.filter(
    (product) => product.seller.id === seller.id
  );

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/sellers" className="hover:text-primary">
          Đại lý
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{seller.name}</span>
      </div>

      {/* Seller Profile */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Image
            src={seller.avatar || "/placeholder.svg"}
            alt={seller.name}
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(seller.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {seller.rating} ({seller.ratingCount} đánh giá)
              </span>
            </div>
            <p className="text-gray-600 mb-4">{seller.productCount} sản phẩm</p>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Phone className="h-5 w-5 mr-2" />
              <span>0123 456 789</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <Mail className="h-5 w-5 mr-2" />
              <span>
                {seller.name.toLowerCase().replace(/\s+/g, "")}@example.com
              </span>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              Liên hệ ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="about">Giới thiệu</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Về {seller.name}</h2>
            <p className="text-gray-600 mb-4">
              {seller.name} là một trong những đại lý hàng đầu trong lĩnh vực
              nông sản. Chúng tôi tự hào cung cấp các sản phẩm chất lượng cao,
              đảm bảo an toàn vệ sinh thực phẩm và giá cả cạnh tranh.
            </p>
            <p className="text-gray-600 mb-4">
              Với nhiều năm kinh nghiệm trong ngành, chúng tôi luôn đặt sự hài
              lòng của khách hàng lên hàng đầu. Đội ngũ nhân viên chuyên nghiệp
              và tận tâm của chúng tôi luôn sẵn sàng hỗ trợ quý khách trong quá
              trình mua sắm.
            </p>
            <p className="text-gray-600">
              Hãy ghé thăm cửa hàng của chúng tôi để trải nghiệm dịch vụ tốt
              nhất và lựa chọn những sản phẩm nông sản tươi ngon nhất!
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Đánh giá từ khách hàng</h2>
            {/* Thêm các đánh giá ở đây */}
            <p className="text-gray-600">Chưa có đánh giá nào.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
