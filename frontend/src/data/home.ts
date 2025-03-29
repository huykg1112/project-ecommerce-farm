import { Delivery, Natural, Organic, Support } from "@/assets/icons";
import {
  HeroImage1,
  HeroImage2,
  HeroImage3,
  HeroImage4,
} from "@/assets/images/hero-img";
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

export const slides = [
  {
    id: 1,
    image: HeroImage1,
    title: "Sản phẩm nông nghiệp tươi ngon",
    description: "Trực tiếp từ nông trại đến bàn ăn của bạn",
    buttonText: "Mua ngay",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: HeroImage2,
    title: "Vật tư nông nghiệp chất lượng cao",
    description: "Đầy đủ các loại vật tư, phân bón, thuốc bảo vệ thực vật",
    buttonText: "Khám phá",
    buttonLink: "/products?category=Vật%20tư%20nông%20nghiệp",
  },
  {
    id: 3,
    image: HeroImage3,
    title: "Hạt giống chất lượng",
    description: "Đa dạng các loại hạt giống, đảm bảo tỷ lệ nảy mầm cao",
    buttonText: "Tìm hiểu thêm",
    buttonLink: "/products?category=Hạt%20giống",
  },
  {
    id: 4,
    image: HeroImage4,
    title: "Sản phẩm chế biến sạch",
    description: "Sản phẩm chế biến từ nguyên liệu sạch, an toàn",
    buttonText: "Xem ngay",
    buttonLink: "/products?category=Sản%20phẩm%20chế%20biến",
  },
];
