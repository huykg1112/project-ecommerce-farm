import CategoryCard from "@/components/category-card";
import FeaturedSellers from "@/components/featured-sellers";
import HeroSlider from "@/components/hero-slider";
import ProductCard from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

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

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
              Danh Mục Sản Phẩm
            </h2>
            <Link href="/categories">
              <Button variant="link" className="text-primary">
                Xem tất cả danh mục
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
              Sản Phẩm Nổi Bật
            </h2>
            <Link href="/products">
              <Button variant="link" className="text-primary">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Đăng ký làm chủ đại lý - PHẦN MỚI */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trở thành đối tác của Farme
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Mở rộng kinh doanh của bạn với nền tảng thương mại điện tử nông
                nghiệp hàng đầu. Tiếp cận hàng ngàn khách hàng tiềm năng và tăng
                doanh số bán hàng.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <div className="rounded-full bg-white/20 p-1 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Tiếp cận hàng ngàn khách hàng tiềm năng
                </li>
                <li className="flex items-center text-white">
                  <div className="rounded-full bg-white/20 p-1 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Công cụ quản lý đơn hàng và kho hàng hiệu quả
                </li>
                <li className="flex items-center text-white">
                  <div className="rounded-full bg-white/20 p-1 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Hỗ trợ marketing và quảng bá sản phẩm
                </li>
              </ul>
              <Link href="/register-seller">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Đăng ký làm chủ đại lý
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/become-seller.jpg"
                alt="Trở thành đối tác"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discount Banner */}
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
                Tận hưởng ưu đãi đặc biệt cho các sản phẩm nông nghiệp hữu cơ
                chất lượng cao. Chỉ áp dụng trong thời gian giới hạn!
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

      {/* New Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
              Sản Phẩm Mới
            </h2>
            <Link href="/products/new">
              <Button variant="link" className="text-primary">
                Xem tất cả sản phẩm mới
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sellers */}
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

      {/* Seasonal Products */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
              Sản Phẩm Theo Mùa
            </h2>
            <Link href="/seasonal">
              <Button variant="link" className="text-primary">
                Xem tất cả
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-primary-lighter relative overflow-hidden">
        <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
        <div className="container relative">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-12 text-center">
            Tại Sao Chọn Nông Sàn?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-light p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Image
                    src="/icons/fresh.svg"
                    alt="Tươi ngon"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Sản Phẩm Tươi Ngon
                </h3>
                <p className="text-gray-600">
                  Cam kết cung cấp sản phẩm nông nghiệp tươi ngon, chất lượng
                  cao từ nông trại đến bàn ăn.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-light p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Image
                    src="/icons/organic.svg"
                    alt="Hữu cơ"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sản Phẩm Hữu Cơ</h3>
                <p className="text-gray-600">
                  Nhiều sản phẩm được chứng nhận hữu cơ, đảm bảo an toàn cho sức
                  khỏe và thân thiện với môi trường.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-light p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Image
                    src="/icons/delivery.svg"
                    alt="Giao hàng"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Giao Hàng Nhanh Chóng
                </h3>
                <p className="text-gray-600">
                  Hệ thống giao hàng hiệu quả, đảm bảo sản phẩm đến tay khách
                  hàng trong thời gian ngắn nhất.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-light p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Image
                    src="/icons/support.svg"
                    alt="Hỗ trợ"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hỗ Trợ 24/7</h3>
                <p className="text-gray-600">
                  Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc
                  và hỗ trợ khi cần thiết.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
