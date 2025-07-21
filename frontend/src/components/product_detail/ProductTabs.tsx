import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ProductTabsProps } from "@/interfaces";
import { AlertTriangle, Building2, Leaf, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductTabs({
  product,
  reviewStats,
}: ProductTabsProps) {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  return (
    <Tabs defaultValue="manufacturer" className="mb-12">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
        <TabsTrigger
          value="manufacturer"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Thông tin sản phẩm
        </TabsTrigger>
        <TabsTrigger
          value="diseases"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          <Leaf className="w-4 h-4 mr-2" />
          Công dụng & Thành phần
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          <Star className="w-4 h-4 mr-2" />
          Đánh giá ({reviewStats?.totalReviews || 0})
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: Thông tin nhà sản xuất, danh mục, mô tả */}
      <TabsContent value="manufacturer" className="pt-6">
        <div className="space-y-6">
          {/* Nhà sản xuất */}
          {product?.manufacturer && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Nhà sản xuất
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  {product.manufacturer.logo && (
                    <Image
                      src={product.manufacturer.logo}
                      alt={product.manufacturer.name}
                      width={60}
                      height={60}
                      className="mr-4 object-contain"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">
                      {product.manufacturer.name}
                    </h4>
                    {product.manufacturer.description && (
                      <p className="text-gray-600">
                        {product.manufacturer.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh mục */}
          {product?.categories && product.categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Danh mục sản phẩm
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category: any) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="text-sm py-1 px-3"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mô tả và hướng dẫn sử dụng */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Mô tả sản phẩm
            </h3>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-700 mb-3">
                <strong>Mô tả:</strong>{" "}
                {product?.description || "Chưa có mô tả"}
              </p>
              <p className="text-gray-700">
                <strong>Hướng dẫn sử dụng:</strong>{" "}
                {product?.usage_instructions || "Chưa có hướng dẫn"}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Tab 2: Bệnh trị được và thành phần */}
      <TabsContent value="diseases" className="pt-6">
        <div className="space-y-6">
          {/* Bệnh trị được */}
          {product?.productDiseases && product.productDiseases.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Bệnh có thể điều trị
              </h3>
              <div className="grid gap-4">
                {product.productDiseases.map(
                  (productDisease: any, index: number) => (
                    <div
                      key={productDisease.disease_id}
                      className="border rounded-lg p-4 bg-orange-50"
                    >
                      <div className="flex items-start">
                        {productDisease.is_primary && (
                          <Badge className="mr-2 bg-orange-500">Đặc trị</Badge>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {productDisease.disease?.disease_name}
                          </h4>
                          <p className="text-gray-700 text-sm">
                            {productDisease.disease?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Thành phần */}
          {product?.product_ingredients &&
            product.product_ingredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-500" />
                  Thành phần hoạt chất
                </h3>
                <div className="grid gap-3">
                  {product.product_ingredients.map(
                    (productIngredient: any, index: number) => (
                      <div
                        key={productIngredient.ingredient_id}
                        className="border rounded-lg p-4 bg-green-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {productIngredient.is_primary && (
                                <Badge className="mr-2 bg-green-500">
                                  Thành phần chính
                                </Badge>
                              )}
                              <h4 className="font-semibold text-gray-900">
                                {productIngredient.ingredient?.ingredient_name}
                              </h4>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">
                              {productIngredient.ingredient?.description}
                            </p>
                            {productIngredient.concentration && (
                              <p className="text-sm text-gray-600">
                                <strong>Nồng độ:</strong>{" "}
                                {productIngredient.concentration}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              productIngredient.ingredient?.hazard_level ===
                              "HIGH"
                                ? "destructive"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {productIngredient.ingredient?.hazard_level ===
                            "HIGH"
                              ? "Độc tính cao"
                              : "Độc tính thấp"}
                          </Badge>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </TabsContent>

      {/* Tab 3: Reviews */}
      <TabsContent value="reviews" className="pt-6">
        <div className="space-y-6">
          {/* Review Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <div className="text-3xl font-bold text-gray-900 mr-2">
                    {reviewStats?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(reviewStats?.averageRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Dựa trên {reviewStats?.totalReviews || 0} đánh giá
                </div>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Viết đánh giá
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét
                </label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={4}
                />
              </div>
              <Button className="w-full sm:w-auto">Gửi đánh giá</Button>
            </div>
          </div>

          {/* Existing Reviews */}
          {product?.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đánh giá từ khách hàng
              </h3>
              <div className="space-y-4">
                {product.reviews.map((review: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {review.user?.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.user?.full_name || "Khách hàng"}
                            </div>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
