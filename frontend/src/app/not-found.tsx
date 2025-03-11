import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/images/404-plant.svg"
          alt="404 Not Found"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold text-primary-dark mb-4">
        Trang không tồn tại
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Có vẻ như bạn đang tìm kiếm một trang không tồn tại hoặc đã được di
        chuyển.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
          <Link href="/">Về trang chủ</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">Xem sản phẩm</Link>
        </Button>
      </div>
      <div className="mt-12 p-6 bg-primary-lighter rounded-lg max-w-md">
        <h2 className="text-xl font-semibold text-primary-dark mb-3">
          Bạn đang tìm gì?
        </h2>
        <ul className="text-left space-y-2">
          <li>
            <Link href="/products" className="text-primary hover:underline">
              • Danh sách sản phẩm nông nghiệp
            </Link>
          </li>
          <li>
            <Link href="/categories" className="text-primary hover:underline">
              • Danh mục sản phẩm
            </Link>
          </li>
          <li>
            <Link href="/sellers" className="text-primary hover:underline">
              • Danh sách đại lý
            </Link>
          </li>
          <li>
            <Link href="/help" className="text-primary hover:underline">
              • Trung tâm hỗ trợ
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
