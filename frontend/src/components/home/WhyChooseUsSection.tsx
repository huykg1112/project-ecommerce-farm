import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function WhyChooseUsSection() {
  return (
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
              <h3 className="text-lg font-semibold mb-2">Sản Phẩm Tươi Ngon</h3>
              <p className="text-gray-600">
                Cam kết cung cấp sản phẩm nông nghiệp tươi ngon, chất lượng cao
                từ nông trại đến bàn ăn.
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
                Hệ thống giao hàng hiệu quả, đảm bảo sản phẩm đến tay khách hàng
                trong thời gian ngắn nhất.
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
                Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc và
                hỗ trợ khi cần thiết.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
//Component cho phần tại sao chọn nông sàn.
