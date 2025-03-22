import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { ProductTabsProps } from "@/interfaces";

export default function ProductTabs({
  name,
  rating,
  ratingCount,
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="details" className="mb-12">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          Chi tiết sản phẩm
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          Thông số kỹ thuật
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base py-3 px-4"
        >
          Đánh giá ({ratingCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="pt-6">
        <div className="prose max-w-none">
          <h3>Mô tả chi tiết sản phẩm</h3>
          <p>
            {name} là sản phẩm nông nghiệp chất lượng cao, được trồng và thu
            hoạch theo tiêu chuẩn VietGAP, đảm bảo an toàn vệ sinh thực phẩm.
            Sản phẩm tươi ngon, không sử dụng hóa chất độc hại, phù hợp cho mọi
            gia đình.
          </p>
          <p>
            Được trồng tại các vùng nông nghiệp sạch, sản phẩm của chúng tôi
            luôn đảm bảo chất lượng và hương vị tự nhiên. Chúng tôi cam kết mang
            đến cho khách hàng những sản phẩm tươi ngon nhất, góp phần vào việc
            bảo vệ sức khỏe của gia đình bạn.
          </p>
          <h3>Đặc điểm nổi bật</h3>
          <ul>
            <li>Sản phẩm tươi ngon, chất lượng cao</li>
            <li>Được trồng và thu hoạch theo tiêu chuẩn VietGAP</li>
            <li>Không sử dụng hóa chất độc hại</li>
            <li>Giàu dinh dưỡng, tốt cho sức khỏe</li>
            <li>Đóng gói cẩn thận, bảo quản tốt</li>
          </ul>
          <h3>Hướng dẫn bảo quản</h3>
          <p>
            Để đảm bảo sản phẩm luôn tươi ngon, bạn nên bảo quản trong tủ lạnh ở
            nhiệt độ 2-5°C. Nên sử dụng trong vòng 5-7 ngày sau khi mua để đảm
            bảo chất lượng tốt nhất.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="pt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                  Xuất xứ
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">Việt Nam</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Vùng trồng
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  Đà Lạt, Lâm Đồng
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Tiêu chuẩn
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">VietGAP</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Quy cách đóng gói
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">500g/gói</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Hạn sử dụng
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  7 ngày kể từ ngày thu hoạch
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="pt-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Đánh giá tổng quan</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {ratingCount} đánh giá
              </div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-1">
                  <span className="text-sm text-gray-600 w-3">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 ml-1 mr-2" />
                  <Progress value={70} className="h-2 flex-1" />
                  <span className="text-sm text-gray-600 ml-2">70%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Đánh giá của khách hàng
          </h3>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>KH</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Khách hàng {index + 1}</div>
                    <div className="text-sm text-gray-500">2 ngày trước</div>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">
                  Sản phẩm rất tươi ngon, đóng gói cẩn thận. Tôi rất hài lòng
                  với chất lượng và sẽ mua lại.
                </p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
