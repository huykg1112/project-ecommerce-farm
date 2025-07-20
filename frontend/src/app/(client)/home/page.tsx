"use client";
import BecomePartnerSection from "@/components/home/BecomePartnerSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import DiscountBannerSection from "@/components/home/DiscountBannerSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedSellersSection from "@/components/home/FeaturedSellersSection";
import NewProductsSection from "@/components/home/NewProductsSection";
import VouchersSection from "@/components/home/VouchersSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import HeroSlider from "@/layouts/Home/hero-slider";
import { categoryServiceManagement } from "@/lib_dashboard/services/category-service-management";
import { inventoryServiceManagement } from "@/lib_dashboard/services/invenstory-service-management";
import { manufacturerServiceManagement } from "@/lib_dashboard/services/manufacturers-service-management";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { voucherService } from "@/lib_dashboard/services/voucher-service";
import { Category } from "@/lib_dashboard/types/category";
import { Manufacturer } from "@/lib_dashboard/types/manufacturer";
import { InvenstoryClient, Product } from "@/lib_dashboard/types/product";
import { Voucher } from "@/types/entities";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [fetchedVouchers, setFetchedVouchers] = useState<Voucher[]>([]);
  const [fetchedInventory, setFetchedInventory] = useState<InvenstoryClient[]>(
    []
  );
  const [fetchedManufacturers, setFetchedManufacturers] = useState<
    Manufacturer[]
  >([]);

  //fetch data
  useEffect(
    () => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const product = await productServiceManagement.getProductsForUser();
          // console.log("Fetched Products:", product);

          if (product) {
            setFetchedProducts(product);
          }

          const vouchers = await voucherService.getVouchersForUser();
          console.log("Fetched Vouchers:", vouchers);
          if (vouchers) {
            setFetchedVouchers(vouchers);
          }

          const inventory =
            await inventoryServiceManagement.getInventoryForUser();
          console.log("Fetched Inventory:", inventory);
          if (inventory) {
            setFetchedInventory(inventory);
          }

          const manufacturers =
            await manufacturerServiceManagement.getManufacturersForUser();
          // console.log("Fetched Manufacturers:", manufacturers);
          if (manufacturers) {
            setFetchedManufacturers(manufacturers);
          }
          const categories =
            await categoryServiceManagement.getCategoriesForUser();
          // console.log("Featured Categories:", categories);
          if (categories) {
            setFetchedCategories(categories);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    },
    [
      // setFetchedProducts,
      // setFetchedVouchers,
      // setFetchedInventory,
      // setFetchedManufacturers,
      // setFetchedCategories,
    ]
  );

  // useEffect(() => {
  //   console.log("Fetched Products:", fetchedProducts);
  //   console.log("Fetched Vouchers:", fetchedVouchers);
  //   console.log("Fetched Inventory:", fetchedInventory);
  //   console.log("Fetched Manufacturers:", fetchedManufacturers);
  //   console.log("Featured Categories:", featuredCategories);
  // }, []);

  const featuredProducts = useMemo(
    () => fetchedProducts.filter((product) => product).slice(0, 8),
    [fetchedProducts]
  );
  const newProducts = useMemo(
    () =>
      [...fetchedProducts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [fetchedProducts]
  );
  const discountedProducts = useMemo(
    () =>
      fetchedProducts
        .filter(
          (product) =>
            product.batches &&
            product.batches.some(
              (batch) =>
                Array.isArray(batch.promotions) &&
                batch.promotions.some(
                  (promotion) => (promotion.discount_value ?? 0) > 0
                )
            )
        )
        .slice(0, 5),
    [fetchedProducts]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <VouchersSection loading={loading} vouchers={fetchedVouchers} />
      <CategoriesSection loading={loading} categories={fetchedCategories} />
      <FeaturedProductsSection loading={loading} products={featuredProducts} />
      <BecomePartnerSection />
      <DiscountBannerSection />
      <NewProductsSection loading={loading} products={newProducts} />
      <FeaturedSellersSection loading={loading} sellers={fetchedInventory} />
      {/* <SeasonalProductsSection products={discountedProducts} /> */}
      <WhyChooseUsSection />
    </div>
  );
}
