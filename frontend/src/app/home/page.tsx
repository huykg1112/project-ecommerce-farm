"use client";

import BecomePartnerSection from "@/components/home/BecomePartnerSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import DiscountBannerSection from "@/components/home/DiscountBannerSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedSellersSection from "@/components/home/FeaturedSellersSection";
import NewProductsSection from "@/components/home/NewProductsSection";
import SeasonalProductsSection from "@/components/home/SeasonalProductsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import HeroSlider from "@/layouts/Home/hero-slider";
import { AppDispatch } from "@/lib/cart/store";
import { setUser } from "@/lib/features/user-slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Lấy token từ URL query parameters
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Lưu token vào localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Cập nhật trạng thái đăng nhập trong Redux store
      dispatch(setUser({ username: "user" })); // Tạm thời chỉ đặt username

      // Chuyển hướng đến trang chủ
      const callbackUrl = localStorage.getItem("callbackUrl") || "/";
      localStorage.removeItem("callbackUrl"); // Xóa callbackUrl sau khi sử dụng

      router.push(callbackUrl);
    } else {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push("/login");
    }
  });

  // Filter featured products
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 8);
  const newProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);
  const discountedProducts = products
    .filter((product) => (product.discount ?? 0) > 0)
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <BecomePartnerSection />
      <DiscountBannerSection />
      <NewProductsSection products={newProducts} />
      <FeaturedSellersSection />
      <SeasonalProductsSection products={discountedProducts} />
      <WhyChooseUsSection />
    </div>
  );
}
