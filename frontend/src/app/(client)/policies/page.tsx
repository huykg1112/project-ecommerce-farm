"use client";

import DealerRegistrationPolicy from "@/components/policies/dealer-registration-policy";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronRight,
  CreditCard,
  FileText,
  RotateCcw,
  Scale,
  Shield,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PolicySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function PoliciesPage() {
  const [activeSection, setActiveSection] = useState("privacy");
  const contentRef = useRef<HTMLDivElement>(null);

  const policySections: PolicySection[] = [
    {
      id: "privacy",
      title: "Chính sách bảo mật",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chính sách bảo mật thông tin
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Thu thập thông tin
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi thu thập thông tin cần thiết để cung cấp dịch vụ tốt
              nhất cho khách hàng, bao gồm:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thông tin cá nhân: Họ tên, số điện thoại, email, địa chỉ</li>
              <li>
                Thông tin giao dịch: Lịch sử mua hàng, phương thức thanh toán
              </li>
              <li>
                Thông tin kỹ thuật: IP address, loại thiết bị, trình duyệt
              </li>
              <li>
                Thông tin chuyên môn: Giấy phép kinh doanh thuốc BVTV (đối với
                đại lý)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Sử dụng thông tin
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Thông tin được sử dụng để:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Xử lý đơn hàng và giao hàng</li>
              <li>Cung cấp hỗ trợ khách hàng</li>
              <li>Gửi thông tin sản phẩm và khuyến mãi</li>
              <li>Xác minh tư cách đại lý và tuân thủ quy định pháp luật</li>
              <li>Cải thiện chất lượng dịch vụ</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Bảo vệ thông tin
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi cam kết bảo vệ thông tin khách hàng bằng các biện pháp:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Mã hóa dữ liệu SSL 256-bit</li>
              <li>Hệ thống firewall và bảo mật đa lớp</li>
              <li>Kiểm soát truy cập nghiêm ngặt</li>
              <li>Sao lưu dữ liệu định kỳ</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Chính sách vận chuyển",
      icon: Truck,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chính sách vận chuyển
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Phạm vi vận chuyển
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi giao hàng toàn quốc với các khu vực ưu tiên:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thành phố lớn: Giao hàng trong 1-2 ngày</li>
              <li>Tỉnh thành khác: Giao hàng trong 2-3 ngày</li>
              <li>Vùng sâu vùng xa: Giao hàng trong 3-5 ngày</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Phí vận chuyển
            </h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                Miễn phí vận chuyển cho đơn hàng từ 500.000đ
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Đơn hàng dưới 500.000đ: Phí vận chuyển 30.000đ - 50.000đ</li>
              <li>Đại lý: Miễn phí vận chuyển cho mọi đơn hàng</li>
              <li>Vùng xa: Phụ phí thêm 20.000đ - 30.000đ</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Quy định đặc biệt với thuốc BVTV
            </h3>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800">
                <AlertTriangle className="inline w-5 h-5 mr-2" />
                Thuốc BVTV được vận chuyển theo quy định nghiêm ngặt của Bộ
                NN&PTNT
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Đóng gói an toàn, có nhãn cảnh báo</li>
              <li>Vận chuyển bằng xe chuyên dụng</li>
              <li>Kiểm tra giấy phép của người nhận</li>
              <li>Ghi nhận đầy đủ thông tin xuất-nhập kho</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "return",
      title: "Chính sách đổi trả",
      icon: RotateCcw,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chính sách đổi trả hàng
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Điều kiện đổi trả
            </h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium">
                Lưu ý: Thuốc BVTV có quy định đổi trả đặc biệt do tính chất đặc
                thù
              </p>
            </div>

            <h4 className="text-lg font-medium text-gray-800">
              Sản phẩm được đổi trả:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Sản phẩm lỗi do nhà sản xuất</li>
              <li>Sản phẩm không đúng mô tả</li>
              <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
              <li>Giao nhầm sản phẩm</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">
              Sản phẩm KHÔNG được đổi trả:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thuốc BVTV đã mở niêm phong (trừ lỗi từ nhà sản xuất)</li>
              <li>Sản phẩm đã sử dụng</li>
              <li>
                Sản phẩm quá hạn sử dụng do khách hàng bảo quản không đúng cách
              </li>
              <li>Sản phẩm khuyến mãi, giảm giá đặc biệt</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Thời gian đổi trả
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Báo lỗi trong vòng 24h sau khi nhận hàng</li>
              <li>Gửi trả hàng trong vòng 3 ngày làm việc</li>
              <li>Hoàn tiền trong vòng 5-7 ngày làm việc</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Quy trình đổi trả
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Liên hệ hotline: 1900-xxxx hoặc email: support@farm.com</li>
              <li>Cung cấp mã đơn hàng và hình ảnh sản phẩm lỗi</li>
              <li>Nhận mã RMA (Return Merchandise Authorization)</li>
              <li>Đóng gói sản phẩm kèm theo mã RMA</li>
              <li>Gửi hàng về kho hoặc được nhân viên đến thu hồi</li>
              <li>Nhận hoàn tiền hoặc sản phẩm thay thế</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "payment",
      title: "Chính sách thanh toán",
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chính sách thanh toán
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Phương thức thanh toán
            </h3>

            <h4 className="text-lg font-medium text-gray-800">
              Thanh toán online:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thẻ ATM nội địa (Internet Banking)</li>
              <li>Thẻ Visa/Mastercard</li>
              <li>Ví điện tử: VNPay, MoMo, ZaloPay</li>
              <li>Chuyển khoản ngân hàng</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">
              Thanh toán khi nhận hàng (COD):
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thanh toán bằng tiền mặt</li>
              <li>Phí COD: 15.000đ cho đơn hàng dưới 500.000đ</li>
              <li>Miễn phí COD cho đơn hàng từ 500.000đ</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Chính sách thanh toán cho đại lý
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-blue-800 font-medium mb-2">
                Ưu đãi đặc biệt cho đại lý:
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>Thanh toán sau (Net 15/30 ngày)</li>
                <li>
                  Chiết khấu thanh toán sớm: 2% nếu thanh toán trong 7 ngày
                </li>
                <li>Hạn mức tín dụng từ 50-500 triệu đồng</li>
                <li>Hỗ trợ vay vốn với lãi suất ưu đãi</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Bảo mật thanh toán
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Mã hóa SSL 256-bit cho mọi giao dịch</li>
              <li>Tuân thủ chuẩn PCI DSS</li>
              <li>Xác thực 3D-Secure cho thẻ quốc tế</li>
              <li>OTP xác nhận cho mọi giao dịch</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Hoàn tiền
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Hoàn tiền về tài khoản gốc trong 5-7 ngày làm việc</li>
              <li>Hoàn tiền COD: Chuyển khoản sau 1-2 ngày</li>
              <li>Phí hoàn tiền: Miễn phí (nếu lỗi từ nhà bán)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "dealer-registration",
      title: "Chính sách đăng ký đại lý",
      icon: Users,
      content: <DealerRegistrationPolicy />,
    },
    {
      id: "warranty",
      title: "Chính sách bảo hành",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chính sách bảo hành sản phẩm
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Phạm vi bảo hành
            </h3>

            <h4 className="text-lg font-medium text-gray-800">
              Thiết bị phun thuốc:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Bình phun: Bảo hành 12 tháng</li>
              <li>Máy phun điện: Bảo hành 24 tháng</li>
              <li>Phụ kiện: Bảo hành 6 tháng</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">Thuốc BVTV:</h4>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800">
                Bảo hành chất lượng theo tiêu chuẩn nhà sản xuất và quy định của
                Bộ NN&PTNT
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Hiệu quả diệt côn trung/nấm theo đúng nhãn sản phẩm</li>
              <li>Không gây hại cho cây trồng khi sử dụng đúng liều lượng</li>
              <li>Thành phần hoạt chất đảm bảo theo công bố</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Điều kiện bảo hành
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Sản phẩm còn trong thời hạn bảo hành</li>
              <li>Có hóa đơn mua hàng hợp lệ</li>
              <li>Sử dụng đúng hướng dẫn của nhà sản xuất</li>
              <li>Không tự ý sửa chữa hoặc can thiệp vào sản phẩm</li>
              <li>Bảo quản đúng điều kiện quy định</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Quy trình bảo hành
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Liên hệ hotline bảo hành: 1900-xxxx</li>
              <li>Mô tả tình trạng sản phẩm và cung cấp thông tin đơn hàng</li>
              <li>Gửi sản phẩm về trung tâm bảo hành (miễn phí vận chuyển)</li>
              <li>Kiểm tra và đánh giá tình trạng sản phẩm</li>
              <li>Thông báo kết quả và phương án xử lý</li>
              <li>Sửa chữa/thay thế và gửi trả khách hàng</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Trung tâm bảo hành
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Miền Bắc</h4>
                <p className="text-gray-600 text-sm">
                  123 Đường ABC, Quận 1, Hà Nội
                  <br />
                  Tel: (024) 3xxx-xxxx
                  <br />
                  Email: warranty-north@farm.com
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Miền Nam</h4>
                <p className="text-gray-600 text-sm">
                  456 Đường XYZ, Quận 1, TP.HCM
                  <br />
                  Tel: (028) 3xxx-xxxx
                  <br />
                  Email: warranty-south@farm.com
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "safety",
      title: "Quy định an toàn",
      icon: AlertTriangle,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quy định an toàn sử dụng thuốc BVTV
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">
                Cảnh báo quan trọng
              </h3>
            </div>
            <p className="text-red-700">
              Thuốc bảo vệ thực vật là hóa chất có thể gây hại cho con người và
              môi trường nếu không sử dụng đúng cách. Vui lòng đọc kỹ hướng dẫn
              và tuân thủ nghiêm ngặt các quy định an toàn.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Trước khi sử dụng
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Đọc kỹ nhãn sản phẩm và hướng dẫn sử dụng</li>
              <li>Kiểm tra thiết bị bảo hộ cá nhân (PPE)</li>
              <li>Chuẩn bị dụng cụ pha chế và phun thuốc</li>
              <li>
                Kiểm tra điều kiện thời tiết (không phun khi có gió mạnh, mưa)
              </li>
              <li>Thông báo cho người xung quanh về việc phun thuốc</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Thiết bị bảo hộ bắt buộc
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Bảo vệ hô hấp
                </h4>
                <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                  <li>Khẩu trang chống hóa chất</li>
                  <li>Mặt nạ phòng độc (thuốc độc tính cao)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Bảo vệ da</h4>
                <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                  <li>Quần áo dài tay, kín đáo</li>
                  <li>Găng tay chống hóa chất</li>
                  <li>Ủng cao su</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Bảo vệ mắt</h4>
                <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                  <li>Kính bảo hộ</li>
                  <li>Tấm che mặt (nếu cần)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Bảo vệ đầu</h4>
                <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                  <li>Mũ bảo hộ</li>
                  <li>Khăn che đầu</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Trong quá trình sử dụng
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Pha thuốc theo đúng liều lượng và tỷ lệ hướng dẫn</li>
              <li>Không ăn, uống, hút thuốc khi đang phun thuốc</li>
              <li>
                Phun theo hướng gió, tránh để thuốc bay về phía người phun
              </li>
              <li>
                Không để trẻ em và động vật tiếp xúc với khu vực phun thuốc
              </li>
              <li>Thường xuyên kiểm tra thiết bị phun để tránh rò rỉ</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Sau khi sử dụng
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Vệ sinh thiết bị phun thuốc sạch sẽ</li>
              <li>Tắm rửa sạch sẽ và thay quần áo</li>
              <li>Giặt riêng quần áo bảo hộ</li>
              <li>Bảo quản thuốc thừa ở nơi khô ráo, thoáng mát</li>
              <li>Xử lý bao bì thuốc theo quy định</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              5. Xử lý khi bị ngộ độc
            </h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-red-800 font-medium mb-2">
                Các dấu hiệu ngộ độc:
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-red-700">
                <li>Chóng mặt, buồn nôn</li>
                <li>Da bị kích ứng, ngứa rát</li>
                <li>Khó thở, đau ngực</li>
                <li>Đau đầu, mờ mắt</li>
              </ul>

              <h4 className="text-red-800 font-medium mt-4 mb-2">
                Biện pháp sơ cứu:
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-red-700">
                <li>Nhanh chóng ra khỏi khu vực có thuốc</li>
                <li>Tháo bỏ quần áo bị nhiễm thuốc</li>
                <li>Rửa sạch vùng da tiếp xúc với nước</li>
                <li>
                  Gọi cấp cứu: 115 hoặc liên hệ Trung tâm Chống độc: (024)
                  3826-2420
                </li>
                <li>Mang theo nhãn sản phẩm khi đến cơ sở y tế</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              6. Bảo quản và vận chuyển
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp
              </li>
              <li>Để xa tầm với của trẻ em và động vật</li>
              <li>Không bảo quản chung với thực phẩm, thức ăn chăn nuôi</li>
              <li>Kiểm tra định kỳ hạn sử dụng</li>
              <li>Vận chuyển theo đúng quy định về hàng nguy hiểm</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "terms",
      title: "Điều khoản sử dụng",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Điều khoản và điều kiện sử dụng
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Chấp nhận điều khoản
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các
              điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng
              ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của
              chúng tôi.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Quyền và nghĩa vụ của khách hàng
            </h3>

            <h4 className="text-lg font-medium text-gray-800">
              Quyền của khách hàng:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Được cung cấp thông tin chính xác về sản phẩm</li>
              <li>Được bảo mật thông tin cá nhân</li>
              <li>Được hỗ trợ kỹ thuật và tư vấn sản phẩm</li>
              <li>Được đổi trả sản phẩm theo quy định</li>
              <li>Được khiếu nại và giải quyết tranh chấp</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">
              Nghĩa vụ của khách hàng:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Cung cấp thông tin chính xác khi đăng ký</li>
              <li>Sử dụng thuốc BVTV đúng mục đích và liều lượng</li>
              <li>Tuân thủ quy định về an toàn lao động</li>
              <li>Thanh toán đầy đủ và đúng hạn</li>
              <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Quyền và nghĩa vụ của công ty
            </h3>

            <h4 className="text-lg font-medium text-gray-800">
              Quyền của công ty:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Thay đổi giá cả và chính sách bán hàng</li>
              <li>Từ chối phục vụ khách hàng vi phạm quy định</li>
              <li>Thu thập thông tin cần thiết cho việc kinh doanh</li>
              <li>Chấm dứt dịch vụ với khách hàng vi phạm</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">
              Nghĩa vụ của công ty:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Cung cấp sản phẩm chất lượng, đúng mô tả</li>
              <li>Giao hàng đúng thời gian cam kết</li>
              <li>Bảo mật thông tin khách hàng</li>
              <li>Hỗ trợ khách hàng 24/7</li>
              <li>Tuân thủ quy định pháp luật về thuốc BVTV</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Trách nhiệm pháp lý
            </h3>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800">
                <AlertTriangle className="inline w-5 h-5 mr-2" />
                Khách hàng có trách nhiệm tuân thủ nghiêm ngặt quy định pháp
                luật về sử dụng thuốc BVTV
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Tuân thủ Luật Bảo vệ và Kiểm dịch thực vật 2013</li>
              <li>Có giấy phép kinh doanh hợp lệ (đối với đại lý)</li>
              <li>Sử dụng đúng mục đích, không gây ô nhiễm môi trường</li>
              <li>Chịu trách nhiệm về thiệt hại do sử dụng sai quy định</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              5. Giải quyết tranh chấp
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Tranh chấp được giải quyết trước tiên bằng thương lượng</li>
              <li>Nếu không thỏa thuận được, chuyển lên hòa giải</li>
              <li>Cuối cùng sẽ được giải quyết tại Tòa án có thẩm quyền</li>
              <li>Áp dụng pháp luật Việt Nam cho mọi tranh chấp</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800">
              6. Điều khoản chung
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Công ty có quyền sửa đổi điều khoản bất cứ lúc nào</li>
              <li>Thông báo thay đổi sẽ được đăng tải trên website</li>
              <li>
                Điều khoản có hiệu lực kể từ ngày khách hàng sử dụng dịch vụ
              </li>
              <li>
                Nếu một phần điều khoản không hợp lệ, phần còn lại vẫn có hiệu
                lực
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "legal",
      title: "Quy định pháp lý",
      icon: Scale,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quy định pháp lý về thuốc BVTV
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Cơ sở pháp lý
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Luật Bảo vệ và Kiểm dịch thực vật số 41/2013/QH13</li>
              <li>Nghị định 58/2017/NĐ-CP về quản lý thuốc bảo vệ thực vật</li>
              <li>Thông tư 21/2018/TT-MARD hướng dẫn chi tiết</li>
              <li>Thông tư 06/2020/TT-MARD về nhãn thuốc BVTV</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Phân loại thuốc BVTV
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  Nhóm I - Ít độc
                </h4>
                <ul className="list-disc pl-4 text-green-700 text-sm space-y-1">
                  <li>Màu nhãn: Xanh lá cây</li>
                  <li>Bán tự do cho người dân</li>
                  <li>Sử dụng cho cây ăn quả, rau màu</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Nhóm II - Độc vừa
                </h4>
                <ul className="list-disc pl-4 text-yellow-700 text-sm space-y-1">
                  <li>Màu nhãn: Vàng</li>
                  <li>Cần có giấy phép bán</li>
                  <li>Hướng dẫn sử dụng chi tiết</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">
                  Nhóm III - Độc
                </h4>
                <ul className="list-disc pl-4 text-orange-700 text-sm space-y-1">
                  <li>Màu nhãn: Cam</li>
                  <li>Bán có kiểm soát</li>
                  <li>Yêu cầu đào tạo sử dụng</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <h4 className="font-medium text-red-800 mb-2">
                  Nhóm IV - Rất độc
                </h4>
                <ul className="list-disc pl-4 text-red-700 text-sm space-y-1">
                  <li>Màu nhãn: Đỏ</li>
                  <li>Kiểm soát chặt chẽ</li>
                  <li>Chỉ bán cho chuyên gia</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Điều kiện kinh doanh
            </h3>

            <h4 className="text-lg font-medium text-gray-800">
              Đối với cửa hàng bán lẻ:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Có giấy chứng nhận đủ điều kiện kinh doanh thuốc BVTV</li>
              <li>Có người bán hàng được đào tạo chuyên môn</li>
              <li>Có kho bảo quản đáp ứng tiêu chuẩn</li>
              <li>Có hệ thống sổ sách ghi chép đầy đủ</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800">
              Đối với đại lý phân phối:
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Có giấy phép kinh doanh thuốc BVTV</li>
              <li>Có kỹ thuật viên nông nghiệp</li>
              <li>Có kho bảo quản tiêu chuẩn GSP</li>
              <li>Có hệ thống truy xuất nguồn gốc</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Nghĩa vụ của người kinh doanh
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Chỉ kinh doanh thuốc có trong Danh mục được phép</li>
              <li>Bảo đảm chất lượng sản phẩm theo tiêu chuẩn</li>
              <li>Hướng dẫn sử dụng đúng và an toàn</li>
              <li>Lưu trữ hồ sơ, chứng từ theo quy định</li>
              <li>Báo cáo định kỳ với cơ quan quản lý</li>
              <li>Thu hồi sản phẩm khi có yêu cầu</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800">
              5. Chế tài vi phạm
            </h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-red-800 font-medium mb-2">
                Các hành vi bị nghiêm cấm:
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Kinh doanh thuốc không có trong Danh mục</li>
                <li>Bán thuốc hết hạn sử dụng</li>
                <li>Bán thuốc không rõ nguồn gốc</li>
                <li>Bán thuốc nhóm III, IV không đúng đối tượng</li>
                <li>Không ghi chép sổ sách theo quy định</li>
              </ul>

              <h4 className="text-red-800 font-medium mt-4 mb-2">Mức phạt:</h4>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Phạt tiền từ 5-50 triệu đồng</li>
                <li>Tịch thu tang vật vi phạm</li>
                <li>Thu hồi giấy phép kinh doanh</li>
                <li>Truy cứu trách nhiệm hình sự (nếu nghiêm trọng)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              6. Cam kết của công ty
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">
                Chúng tôi cam kết:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>100% sản phẩm có nguồn gốc hợp pháp</li>
                <li>Tuân thủ nghiêm ngặt quy định pháp luật</li>
                <li>Hỗ trợ khách hàng tuân thủ quy định</li>
                <li>Cập nhật liên tục các thay đổi pháp lý</li>
                <li>Phối hợp với cơ quan quản lý khi cần thiết</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      }
    );

    policySections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chính sách và Quy định
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu các chính sách, quy định và hướng dẫn quan trọng khi sử
            dụng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Danh mục chính sách
              </h2>
              <nav className="space-y-2">
                {policySections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                        activeSection === section.id
                          ? "bg-[#7baa66] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#7baa66]"
                      )}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform",
                          activeSection === section.id ? "rotate-90" : ""
                        )}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4" ref={contentRef}>
            <div className="space-y-12">
              {policySections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-lg shadow-md p-8 scroll-mt-24"
                >
                  {section.content}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
