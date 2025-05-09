import { Checkbox } from "@/components/ui/checkbox"

interface TermsStepProps {
  termsAccepted: boolean
  updateTermsAccepted: (accepted: boolean) => void
}

export default function TermsStep({ termsAccepted, updateTermsAccepted }: TermsStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Điều khoản và điều kiện</h2>

      <div className="bg-gray-50 p-6 rounded-lg border max-h-[400px] overflow-y-auto">
        <h3 className="font-semibold mb-4">ĐIỀU KHOẢN ĐĂNG KÝ ĐẠI LÝ</h3>

        <div className="space-y-4 text-sm">
          <p>
            <strong>1. ĐỊNH NGHĨA</strong>
            <br />
            "Công ty" có nghĩa là [Tên Công Ty], một công ty được thành lập và hoạt động theo pháp luật Việt Nam.
            <br />
            "Đại lý" có nghĩa là cá nhân hoặc tổ chức đăng ký và được Công ty chấp thuận trở thành đại lý phân phối sản
            phẩm của Công ty.
          </p>

          <p>
            <strong>2. QUYỀN LỢI CỦA ĐẠI LÝ</strong>
            <br />
            2.1. Được phân phối các sản phẩm của Công ty theo chính sách giá dành cho đại lý.
            <br />
            2.2. Được hưởng chiết khấu theo chính sách của Công ty tại từng thời điểm.
            <br />
            2.3. Được hỗ trợ về marketing, quảng cáo và đào tạo sản phẩm.
            <br />
            2.4. Được cung cấp thông tin về sản phẩm mới và chương trình khuyến mãi.
          </p>

          <p>
            <strong>3. TRÁCH NHIỆM CỦA ĐẠI LÝ</strong>
            <br />
            3.1. Tuân thủ các quy định của pháp luật về kinh doanh và phân phối sản phẩm.
            <br />
            3.2. Bán sản phẩm theo đúng giá niêm yết và chính sách của Công ty.
            <br />
            3.3. Không bán hàng giả, hàng nhái hoặc sản phẩm tương tự của đối thủ cạnh tranh.
            <br />
            3.4. Bảo quản sản phẩm theo đúng hướng dẫn của Công ty.
            <br />
            3.5. Cung cấp thông tin chính xác và đầy đủ khi đăng ký làm đại lý.
          </p>

          <p>
            <strong>4. THỜI HẠN HỢP ĐỒNG</strong>
            <br />
            4.1. Thời hạn hợp đồng đại lý là 01 năm kể từ ngày được Công ty chấp thuận.
            <br />
            4.2. Hợp đồng có thể được gia hạn nếu cả hai bên đồng ý.
          </p>

          <p>
            <strong>5. CHẤM DỨT HỢP ĐỒNG</strong>
            <br />
            5.1. Công ty có quyền chấm dứt hợp đồng nếu Đại lý vi phạm các điều khoản của hợp đồng.
            <br />
            5.2. Đại lý có quyền chấm dứt hợp đồng với điều kiện thông báo trước 30 ngày.
          </p>

          <p>
            <strong>6. BẢO MẬT THÔNG TIN</strong>
            <br />
            6.1. Đại lý cam kết bảo mật thông tin về sản phẩm, chiến lược kinh doanh và các thông tin khác của Công ty.
            <br />
            6.2. Công ty cam kết bảo mật thông tin cá nhân của Đại lý theo quy định của pháp luật.
          </p>

          <p>
            <strong>7. GIẢI QUYẾT TRANH CHẤP</strong>
            <br />
            7.1. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng, hòa giải giữa các bên.
            <br />
            7.2. Trường hợp không thể giải quyết được thông qua thương lượng, tranh chấp sẽ được đưa ra Tòa án có thẩm
            quyền để giải quyết.
          </p>

          <p>
            <strong>8. ĐIỀU KHOẢN CHUNG</strong>
            <br />
            8.1. Đại lý không được chuyển nhượng quyền và nghĩa vụ của mình cho bên thứ ba mà không có sự đồng ý bằng
            văn bản của Công ty.
            <br />
            8.2. Mọi sửa đổi, bổ sung đối với hợp đồng này phải được lập thành văn bản và được cả hai bên ký xác nhận.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => updateTermsAccepted(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tôi đã đọc và đồng ý với các điều khoản và điều kiện trên
        </label>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-amber-700 text-sm">
          <span className="font-medium">Lưu ý:</span> Bằng việc đánh dấu vào ô trên, bạn xác nhận đã đọc, hiểu rõ và
          đồng ý với tất cả các điều khoản và điều kiện của chúng tôi. Đây là cơ sở pháp lý cho mối quan hệ hợp tác giữa
          bạn và công ty.
        </p>
      </div>
    </div>
  )
}
