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

export default function Home() {
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
