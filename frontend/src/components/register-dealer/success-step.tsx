import { CheckCircle2 } from "lucide-react"

export default function SuccessStep() {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold">Đăng ký thành công!</h2>

      <p className="text-gray-600 max-w-md mx-auto">
        Cảm ơn bạn đã đăng ký trở thành đại lý của chúng tôi. Chúng tôi đã nhận được thông tin đăng ký của bạn và sẽ xem
        xét trong thời gian sớm nhất.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
        <h3 className="font-medium text-blue-800 mb-2">Các bước tiếp theo:</h3>
        <ol className="list-decimal pl-5 text-blue-700 space-y-1">
          <li>Đội ngũ của chúng tôi sẽ xem xét thông tin đăng ký của bạn</li>
          <li>Chúng tôi sẽ liên hệ với bạn qua email hoặc số điện thoại đã đăng ký trong vòng 2-3 ngày làm việc</li>
          <li>Sau khi xác minh thông tin, chúng tôi sẽ gửi hợp đồng đại lý cho bạn</li>
          <li>Ký kết hợp đồng và bắt đầu hợp tác kinh doanh</li>
        </ol>
      </div>

      <p className="text-gray-600">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email{" "}
        <span className="font-medium">support@example.com</span> hoặc hotline{" "}
        <span className="font-medium">1900 1234</span>.
      </p>
    </div>
  )
}
