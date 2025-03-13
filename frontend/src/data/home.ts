import { Delivery, Natural, Organic, Support } from "@/assets/icons";
import type { WhyChooseUsSectionData as WhyChooseUsSectionDataType } from "@/interfaces";

export const WhyChooseUsSectionData: WhyChooseUsSectionDataType = {
  title: "Tại Sao Chọn Nông Sàn?",
  cards: [
    {
      title: "Sản Phẩm Tươi Ngon",
      description:
        "Cam kết cung cấp sản phẩm nông nghiệp tươi ngon, chất lượng cao từ nông trại đến bàn ăn.",
      icon: Natural,
    },
    {
      title: "Sản Phẩm Hữu Cơ",
      description:
        "Nhiều sản phẩm được chứng nhận hữu cơ, đảm bảo an toàn cho sức khỏe và thân thiện với môi trường.",
      icon: Organic,
    },
    {
      title: "Giao Hàng Nhanh Chóng",
      description:
        "Hệ thống giao hàng hiệu quả, đảm bảo sản phẩm đến tay khách hàng trong thời gian ngắn nhất.",
      icon: Delivery,
    },
    {
      title: "Hỗ Trợ 24/7",
      description:
        "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ khi cần thiết.",
      icon: Support,
    },
  ],
};
