import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo-white.svg" alt="Nông Sàn Logo" width={40} height={40} />
              <span className="font-bold text-xl">Nông Sàn</span>
            </div>
            <p className="text-sm text-gray-200 mb-4">
              Sàn thương mại điện tử chuyên về nông nghiệp, kết nối người nông dân với người tiêu dùng.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-primary-light">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary-light">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary-light">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary-light">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/rau-cu" className="text-gray-200 hover:text-white">
                  Rau củ
                </Link>
              </li>
              <li>
                <Link href="/category/trai-cay" className="text-gray-200 hover:text-white">
                  Trái cây
                </Link>
              </li>
              <li>
                <Link href="/category/hat-giong" className="text-gray-200 hover:text-white">
                  Hạt giống
                </Link>
              </li>
              <li>
                <Link href="/category/vat-tu" className="text-gray-200 hover:text-white">
                  Vật tư nông nghiệp
                </Link>
              </li>
              <li>
                <Link href="/category/che-bien" className="text-gray-200 hover:text-white">
                  Sản phẩm chế biến
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/faq" className="text-gray-200 hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="text-gray-200 hover:text-white">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="text-gray-200 hover:text-white">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/help/payment" className="text-gray-200 hover:text-white">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="text-gray-200 hover:text-white">
                  Liên hệ hỗ trợ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 shrink-0" />
                <span>123 Đường Nông Nghiệp, Quận Nông Thôn, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 shrink-0" />
                <span>1900 1234 56</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 shrink-0" />
                <span>hotro@nongsan.vn</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Đăng ký nhận tin</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-3 py-2 bg-white text-black rounded-l-md w-full"
                />
                <button className="bg-primary-light hover:bg-primary text-white px-4 rounded-r-md">Gửi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">© 2023 Nông Sàn. Tất cả các quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-gray-300 hover:text-white">
              Điều khoản sử dụng
            </Link>
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

