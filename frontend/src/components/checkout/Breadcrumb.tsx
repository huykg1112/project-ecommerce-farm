import Link from "next/link";

export default function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-primary">
        Trang chủ
      </Link>
      <span className="mx-2">/</span>
      <Link href="/cart" className="hover:text-primary">
        Giỏ hàng
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700 font-medium">Thanh toán</span>
    </div>
  );
}
