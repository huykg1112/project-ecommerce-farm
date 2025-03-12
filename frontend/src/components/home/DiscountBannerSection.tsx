import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DiscountBannerSection() {
  return (
    <section className="py-12 bg-primary-lighter relative overflow-hidden">
      <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-primary-light text-white">
              Khuyến mãi đặc biệt
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Giảm giá đến 30% cho sản phẩm hữu cơ
            </h2>
            <p className="text-gray-700 mb-6">
              Tận hưởng ưu đãi đặc biệt cho các sản phẩm nông nghiệp hữu cơ chất
              lượng cao. Chỉ áp dụng trong thời gian giới hạn!
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              Mua ngay
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/images/organic-products.jpg"
              alt="Sản phẩm hữu cơ"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
//Component cho phần banner khuyến mãi.
