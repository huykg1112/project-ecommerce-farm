import FeaturedSellers from "@/components/seller/featured-sellers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturedSellersSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-8 text-center">
          Đại Lý Nổi Bật
        </h2>
        <FeaturedSellers />
        <div className="text-center mt-8">
          <Link href="/sellers">
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
