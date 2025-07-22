"use client";

import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryServiceManagement } from "@/lib_dashboard/services/invenstory-service-management";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { InvenstoryClient, Product } from "@/lib_dashboard/types/product";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SellerPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [invenstory, setInventory] = useState<InvenstoryClient | undefined>();
  const [products, setProducts] = useState<Product[] | undefined>();

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      try {
        const inventorys =
          await inventoryServiceManagement.getInventoryForUser();
        console.log("Fetched Inventorys:", inventorys);
        const sellerData = inventorys.find(
          (seller) => seller.distributor.user_id === id
        );
        console.log("Seller Data:", sellerData);
        setInventory(sellerData);
        if (
          sellerData &&
          sellerData.distributor &&
          sellerData.distributor.user_id
        ) {
          const products =
            await productServiceManagement.getProductsByDistributor(
              sellerData.distributor.user_id
            );
          console.log("Products for Seller:", products);
          setProducts(products);
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  const totalStarRating = useMemo(() => {
    if (!products) return 0;
    const total = products.reduce((acc = 0, product) => {
      if (!product.reviews || product.reviews.length === 0) return acc;
      const totalRatingProduct = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      return acc + totalRatingProduct;
    }, 0);
    return total / products.length || 0;
  }, [products]);

  const totalRating = useMemo(() => {
    if (!products) return 0;
    return products.reduce((acc = 0, product) => {
      if (!product.reviews || product.reviews.length === 0) return acc;
      return acc + product.reviews.length;
    }, 0);
  }, [products]);

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
        <span className="text-gray-700 font-medium">{invenstory?.name}</span>
      </div>

      {/* Seller Profile */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Image
            src={invenstory?.invenstory_img || "/placeholder.svg"}
            alt={invenstory?.name || "Seller Avatar"}
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{invenstory?.name}</h1>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(totalRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {totalStarRating} ({totalRating} đánh giá)
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {products?.length || 0} sản phẩm
            </p>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              <Link href={`/stores?searchStores=${invenstory?.name}`}>
                <span className="hover:text-green-500 ">
                  {invenstory?.invenstory_address ||
                    "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"}
                </span>
              </Link>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Phone className="h-5 w-5 mr-2" />
              <span>
                {invenstory?.distributor?.phone_number || "0123 456 789"}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <Mail className="h-5 w-5 mr-2" />
              <span>
                {invenstory?.distributor?.email || "example@example.com"}
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
        </TabsList>
        <TabsContent value="products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.length ? (
              products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))
            ) : (
              <p className="text-gray-600">Chưa có sản phẩm nào.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="about">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Về {invenstory?.name}</h2>
            <p className="text-gray-600 mb-4">
              {invenstory?.name} là một trong những đại lý hàng đầu trong lĩnh
              vực nông sản. Chúng tôi tự hào cung cấp các sản phẩm chất lượng
              cao, đảm bảo an toàn vệ sinh thực phẩm và giá cả cạnh tranh.
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
      </Tabs>
    </div>
  );
}
