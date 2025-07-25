import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ProductTabsProps, Review } from "@/interfaces";
import { showToast } from "@/lib/toast-provider";
import { getCookie } from "@/lib/utils";
import { orderServiceManagement } from "@/lib_dashboard/services/order-service-management";
import { reviewsService } from "@/lib_dashboard/services/reviews-service";
import {
  CreateReviewDto,
  CreateReviewResponseDto,
} from "@/lib_dashboard/types/review";
import {
  AlertTriangle,
  Building2,
  Leaf,
  MessageSquare,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function ProductTabs({
  product,
  reviewStats,
}: ProductTabsProps) {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [user, setUser] = useState<any>(null);
  const [hasOrdered, setHasOrdered] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [checkingEligibility, setCheckingEligibility] =
    useState<boolean>(false);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [responseTexts, setResponseTexts] = useState<{ [key: string]: string }>(
    {}
  );
  const [submittingResponse, setSubmittingResponse] = useState<{
    [key: string]: boolean;
  }>({});

  // Check user authentication and review eligibility
  useEffect(() => {
    const checkReviewEligibility = async () => {
      const userCookie = getCookie("user");
      if (!userCookie || !product?.product_id) {
        return;
      }

      try {
        const userData = JSON.parse(userCookie || "{}");
        setUser(userData);
        setCheckingEligibility(true);

        // Check if user has ordered this product
        const orderedProduct = await orderServiceManagement.isOrderbyProduct(
          product.product_id
        );
        setHasOrdered(orderedProduct);

        // Check if user has already reviewed this product
        if (orderedProduct) {
          const reviewedProduct = await reviewsService.hasReviewedProduct(
            product.product_id
          );
          setHasReviewed(reviewedProduct);
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkReviewEligibility();
  }, [product?.product_id]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.product_id) return;

      try {
        setLoadingReviews(true);
        const productReviews = await reviewsService.getReviewsByProduct(
          product.product_id
        );
        setReviews(productReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product?.product_id]);

  // Handle review submission
  const handleSubmitReview = useCallback(async () => {
    if (!user || !product?.product_id) {
      showToast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (!hasOrdered) {
      showToast.error("Bạn cần mua sản phẩm này trước khi đánh giá");
      return;
    }

    if (hasReviewed) {
      showToast.error("Bạn đã đánh giá sản phẩm này rồi");
      return;
    }

    if (!newReview.comment.trim()) {
      showToast.error("Vui lòng nhập nhận xét về sản phẩm");
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData: CreateReviewDto = {
        product_id: product.product_id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      };

      const createdReview = await reviewsService.createReview(reviewData);
      showToast.success("Đánh giá sản phẩm thành công!");

      // Add new review to the beginning of the list
      setReviews((prevReviews) => [createdReview, ...prevReviews]);

      // Reset form and update state
      setNewReview({ rating: 5, comment: "" });
      setHasReviewed(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      // Error toast is already shown by the service
    } finally {
      setSubmittingReview(false);
    }
  }, [user, product?.product_id, hasOrdered, hasReviewed, newReview]);

  // Handle distributor response
  const handleDistributorResponse = useCallback(
    async (reviewId: string) => {
      const responseText = responseTexts[reviewId]?.trim();
      if (!responseText) {
        showToast.error("Vui lòng nhập nội dung phản hồi");
        return;
      }

      try {
        setSubmittingResponse((prev) => ({ ...prev, [reviewId]: true }));

        const responseData: CreateReviewResponseDto = {
          parent_review_id: reviewId,
          comment: responseText,
        };

        const responseReview = await reviewsService.createDistributorResponse(
          responseData
        );
        showToast.success("Phản hồi thành công!");

        // Update reviews list to include the response
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.review_id === reviewId
              ? {
                  ...review,
                  distributor_response_review: responseReview,
                }
              : review
          )
        );

        // Clear response text
        setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }));
      } catch (error) {
        console.error("Error submitting response:", error);
      } finally {
        setSubmittingResponse((prev) => ({ ...prev, [reviewId]: false }));
      }
    },
    [responseTexts]
  );

  // Render review eligibility message
  const renderReviewEligibilityMessage = () => {
    if (!user) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            Vui lòng đăng nhập để đánh giá sản phẩm
          </p>
        </div>
      );
    }

    if (checkingEligibility) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-600 text-sm">
            Đang kiểm tra quyền đánh giá...
          </p>
        </div>
      );
    }

    if (!hasOrdered) {
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <p className="text-orange-800 text-sm">
            Bạn cần mua sản phẩm này trước khi có thể đánh giá
          </p>
        </div>
      );
    }

    if (hasReviewed) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm">
            Bạn đã đánh giá sản phẩm này. Cảm ơn phản hồi của bạn!
          </p>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-green-800 text-sm">
          Bạn có thể đánh giá sản phẩm này
        </p>
      </div>
    );
  };

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

          {/* Existing Reviews */}
          {(loadingReviews || reviews.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đánh giá từ khách hàng
              </h3>

              {loadingReviews ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllReviews ? reviews : reviews.slice(0, 5))
                    .filter((review) => !review.parent_review_id) // Only show main reviews, not responses
                    .map((review: Review, index: number) => (
                      <div
                        key={review.review_id || index}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#accc8b] text-[#44703d]">
                              {(review.user?.full_name || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {review.user?.full_name || "Khách hàng"}
                                </div>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < (review.rating || 0)
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
                            <p className="text-gray-700 mb-3">
                              {review.comment}
                            </p>

                            {/* Distributor Response Section */}
                            {user?.id === product?.distributor?.user_id &&
                              !review.parent_review_id &&
                              !review.distributor_response_review && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">
                                      Phản hồi
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    <Textarea
                                      value={
                                        responseTexts[review.review_id] || ""
                                      }
                                      onChange={(e) =>
                                        setResponseTexts((prev) => ({
                                          ...prev,
                                          [review.review_id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Nhập phản hồi của bạn..."
                                      rows={3}
                                      className="text-sm"
                                      disabled={
                                        submittingResponse[review.review_id]
                                      }
                                    />
                                    <Button
                                      onClick={() =>
                                        handleDistributorResponse(
                                          review.review_id
                                        )
                                      }
                                      disabled={
                                        submittingResponse[review.review_id] ||
                                        !responseTexts[review.review_id]?.trim()
                                      }
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      {submittingResponse[review.review_id]
                                        ? "Đang gửi..."
                                        : "Gửi phản hồi"}
                                    </Button>
                                  </div>
                                </div>
                              )}

                            {/* Display existing distributor response */}
                            {review.distributor_response_review && (
                              <div className="mt-3 pl-4 border-l-2 border-blue-200">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">
                                      {review.distributor_response_review
                                        .distributor?.full_name || "Đại lý"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        review.distributor_response_review.created_at
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {review.distributor_response_review.comment}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Show More Button */}
                  {reviews.filter((r) => !r.parent_review_id).length > 5 &&
                    !showAllReviews && (
                      <div className="text-center">
                        <Button
                          onClick={() => setShowAllReviews(true)}
                          variant="outline"
                          className="border-[#accc8b] text-[#44703d] hover:bg-[#accc8b]/20"
                        >
                          Xem thêm (
                          {reviews.filter((r) => !r.parent_review_id).length -
                            5}{" "}
                          đánh giá)
                        </Button>
                      </div>
                    )}

                  {/* Show Less Button */}
                  {showAllReviews &&
                    reviews.filter((r) => !r.parent_review_id).length > 5 && (
                      <div className="text-center">
                        <Button
                          onClick={() => setShowAllReviews(false)}
                          variant="outline"
                          className="border-[#accc8b] text-[#44703d] hover:bg-[#accc8b]/20"
                        >
                          Thu gọn
                        </Button>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Add Review Form */}
          {!hasReviewed && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Viết đánh giá
              </h3>

              {/* Review Eligibility Message */}
              {renderReviewEligibilityMessage()}

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
                        disabled={
                          !user ||
                          !hasOrdered ||
                          hasReviewed ||
                          submittingReview
                        }
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            star <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          } ${
                            !user ||
                            !hasOrdered ||
                            hasReviewed ||
                            submittingReview
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-yellow-300 cursor-pointer"
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
                    disabled={
                      !user || !hasOrdered || hasReviewed || submittingReview
                    }
                    className={`${
                      !user || !hasOrdered || hasReviewed || submittingReview
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSubmitReview}
                  disabled={
                    !user ||
                    !hasOrdered ||
                    hasReviewed ||
                    submittingReview ||
                    checkingEligibility
                  }
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
