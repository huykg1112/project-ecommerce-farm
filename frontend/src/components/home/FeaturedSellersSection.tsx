import FeaturedSellers from "@/components/seller/featured-sellers";
import { Button } from "@/components/ui/button";
import { InvenstoryClient } from "@/lib_dashboard/types/product";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface FeaturedSellersSectionProps {
  loading?: boolean;
  sellers: InvenstoryClient[];
}

export default function FeaturedSellersSection({
  loading,
  sellers,
}: FeaturedSellersSectionProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-8 text-center">
          Đại Lý Nổi Bật
        </h2>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))
        ) : sellers.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có đại lý nổi bật nào.
          </div>
        ) : (
          <FeaturedSellers sellers={sellers} />
        )}
        <div className="text-center mt-8">
          <Link href="/stores">
            <Button variant="outline" size="lg">
              Xem tất cả đại lý
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
//Component cho phần đại lý nổi bật.
