import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function BecomePartnerSection() {
  return (
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
  );
}
//Component cho phần trở thành đối tác
