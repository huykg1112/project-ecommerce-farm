"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Gift,
  Headphones,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function DealerRegistrationPolicy() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Chính sách đăng ký trở thành đại lý
      </h2>

      {/* Introduction Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Đại lý Farm"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>

          <div className="md:w-1/2 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Chào mừng bạn đến với chương trình đại lý
            </h3>
            <p className="text-gray-600">
              Trở thành đại lý của chúng tôi, bạn sẽ được hưởng nhiều quyền lợi
              đặc biệt và cơ hội phát triển kinh doanh bền vững trong lĩnh vực
              thuốc bảo vệ thực vật.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Chiết khấu hấp dẫn</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Hỗ trợ marketing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Đào tạo chuyên sâu</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Quyền lợi đại lý
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <h4 className="font-semibold text-gray-800">
                Chiết khấu đặc biệt
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Chiết khấu 15-25% cho sản phẩm thường</li>
              <li>• Chiết khấu 30-40% cho sản phẩm độc quyền</li>
              <li>• Bonus thêm theo doanh số tháng</li>
              <li>• Ưu đãi đặc biệt ngày lễ, tết</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Hỗ trợ marketing</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thiết kế poster, banner miễn phí</li>
              <li>• Hỗ trợ quảng cáo Facebook Ads</li>
              <li>• Cung cấp mẫu content marketing</li>
              <li>• Tài trợ sự kiện, hội thảo</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-8 w-8 text-purple-600" />
              <h4 className="font-semibold text-gray-800">
                Đào tạo chuyên sâu
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Khóa học kiến thức sản phẩm</li>
              <li>• Kỹ năng tư vấn khách hàng</li>
              <li>• Cập nhật xu hướng thị trường</li>
              <li>• Chứng chỉ đại lý chính thức</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <Headphones className="h-8 w-8 text-orange-600" />
              <h4 className="font-semibold text-gray-800">Hỗ trợ kỹ thuật</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hotline hỗ trợ 24/7</li>
              <li>• Kỹ thuật viên tư vấn trực tiếp</li>
              <li>• Hỗ trợ xử lý khiếu nại</li>
              <li>• Báo cáo tình hình thị trường</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <Gift className="h-8 w-8 text-red-600" />
              <h4 className="font-semibold text-gray-800">Ưu đãi độc quyền</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tham gia sự kiện đại lý</li>
              <li>• Du lịch thưởng hàng năm</li>
              <li>• Quà tặng sinh nhật, kỷ niệm</li>
              <li>• Ưu tiên sản phẩm mới</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="h-8 w-8 text-indigo-600" />
              <h4 className="font-semibold text-gray-800">
                Chính sách tài chính
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thanh toán linh hoạt Net 15/30</li>
              <li>• Hạn mức tín dụng cao</li>
              <li>• Hỗ trợ vay vốn ưu đãi</li>
              <li>• Chiết khấu thanh toán sớm</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Điều kiện trở thành đại lý
        </h3>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-amber-800">Yêu cầu bắt buộc</h4>
          </div>
          <p className="text-amber-700 text-sm">
            Để đảm bảo tuân thủ quy định pháp luật về kinh doanh thuốc BVTV, đại
            lý cần đáp ứng đầy đủ các điều kiện sau:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">
              Điều kiện pháp lý
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    Giấy phép kinh doanh
                  </p>
                  <p className="text-sm text-gray-600">
                    Giấy chứng nhận đủ điều kiện kinh doanh thuốc BVTV do Sở
                    NN&PTNT cấp
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    Nhân sự chuyên môn
                  </p>
                  <p className="text-sm text-gray-600">
                    Có ít nhất 1 kỹ thuật viên nông nghiệp hoặc được đào tạo
                    chuyên môn
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Cơ sở vật chất</p>
                  <p className="text-sm text-gray-600">
                    Kho bảo quản đạt tiêu chuẩn, diện tích tối thiểu 20m²
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">
              Điều kiện kinh doanh
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Kinh nghiệm</p>
                  <p className="text-sm text-gray-600">
                    Ít nhất 2 năm kinh nghiệm trong lĩnh vực nông nghiệp hoặc
                    bán hàng
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    Năng lực tài chính
                  </p>
                  <p className="text-sm text-gray-600">
                    Vốn lưu động tối thiểu 100 triệu đồng
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    Mạng lưới khách hàng
                  </p>
                  <p className="text-sm text-gray-600">
                    Có kế hoạch phát triển thị trường rõ ràng
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Quy trình đăng ký
        </h3>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium mb-2">
            <Clock className="inline w-5 h-5 mr-2" />
            Quy trình đăng ký chỉ mất 4 bước đơn giản và hoàn thành trong 5-7
            ngày làm việc
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-[#7baa66] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Điền thông tin đăng ký
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Hoàn thành form đăng ký online với đầy đủ thông tin cá nhân và
                doanh nghiệp
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-4">
                <li>Thông tin cá nhân và liên hệ</li>
                <li>Thông tin doanh nghiệp</li>
                <li>Kinh nghiệm và kế hoạch kinh doanh</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-[#7baa66] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Nộp hồ sơ và giấy tờ
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Upload các giấy tờ pháp lý cần thiết để xác minh tư cách đại lý
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-4">
                <li>Giấy chứng nhận kinh doanh</li>
                <li>Giấy phép kinh doanh thuốc BVTV</li>
                <li>Chứng chỉ kỹ thuật viên</li>
                <li>Sơ yếu lý lịch và CMND/CCCD</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-[#7baa66] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Xét duyệt và thẩm định
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Đội ngũ chúng tôi sẽ xem xét hồ sơ và thực hiện thẩm định
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-4">
                <li>Xác minh thông tin và giấy tờ</li>
                <li>Khảo sát cơ sở kinh doanh (nếu cần)</li>
                <li>Đánh giá năng lực và kế hoạch</li>
                <li>Thông báo kết quả trong 2-3 ngày</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-[#7baa66] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Ký hợp đồng và bắt đầu
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                Hoàn tất thủ tục và bắt đầu hành trình đại lý
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-4">
                <li>Ký hợp đồng đại lý</li>
                <li>Đào tạo sản phẩm và hệ thống</li>
                <li>Thiết lập tài khoản và công cụ</li>
                <li>Bắt đầu kinh doanh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Lưu ý quan trọng
        </h3>
        <div className="space-y-2 text-amber-700 text-sm">
          <p>
            • Sau khi đăng ký, đội ngũ của chúng tôi sẽ liên hệ với bạn trong
            vòng 2-3 ngày làm việc để xác nhận và hướng dẫn các bước tiếp theo.
          </p>
          <p>
            • Tất cả thông tin đăng ký được bảo mật tuyệt đối và chỉ sử dụng cho
            mục đích xét duyệt đại lý.
          </p>
          <p>
            • Đại lý cần tuân thủ nghiêm ngặt các quy định pháp luật về kinh
            doanh thuốc BVTV.
          </p>
          <p>
            • Chương trình đại lý có thể thay đổi điều kiện và quyền lợi theo
            thời gian, sẽ thông báo trước ít nhất 30 ngày.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-3">
          Hỗ trợ đăng ký đại lý
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-700">
              <strong>Hotline:</strong> 1900-xxxx
            </p>
            <p className="text-green-700">
              <strong>Email:</strong> dealer@farm.com
            </p>
          </div>
          <div>
            <p className="text-green-700">
              <strong>Thời gian hỗ trợ:</strong> 8:00 - 17:30 (T2-T6)
            </p>
            <p className="text-green-700">
              <strong>Zalo/Telegram:</strong> 0xxx-xxx-xxx
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
