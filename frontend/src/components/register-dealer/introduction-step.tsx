import Image from "next/image"

export default function IntroductionStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Chào mừng bạn đến với chương trình đại lý</h2>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Đại lý Farm"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          <p>Trở thành đại lý của chúng tôi, bạn sẽ được hưởng nhiều quyền lợi đặc biệt:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Chiết khấu đặc biệt cho các sản phẩm</li>
            <li>Hỗ trợ marketing và quảng cáo</li>
            <li>Đào tạo sản phẩm chuyên sâu</li>
            <li>Hỗ trợ kỹ thuật 24/7</li>
            <li>Cơ hội tham gia các sự kiện độc quyền</li>
          </ul>

          <p className="font-medium">
            Quy trình đăng ký gồm 4 bước đơn giản và sẽ chỉ mất khoảng 5 phút để hoàn thành.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2">Lưu ý quan trọng:</h3>
        <p className="text-amber-700">
          Sau khi đăng ký, đội ngũ của chúng tôi sẽ xem xét thông tin và liên hệ với bạn trong vòng 2-3 ngày làm việc để
          xác nhận và hướng dẫn các bước tiếp theo.
        </p>
      </div>
    </div>
  )
}
