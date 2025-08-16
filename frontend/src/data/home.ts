import { Delivery, Natural, Organic, Support } from "@/assets/icons";
import {
  HeroImage2,
  HeroImage5,
  HeroImage6,
  PhanBon,
} from "@/assets/images/hero-img";
import type { WhyChooseUsSectionData as WhyChooseUsSectionDataType } from "@/interfaces";

export const WhyChooseUsSectionData: WhyChooseUsSectionDataType = {
  title: "Tại Sao Chọn Nền Tảng Thuốc BVTV Của Chúng Tôi?",
  cards: [
    {
      title: "Thuốc Chính Hãng",
      description:
        "Cam kết cung cấp thuốc bảo vệ thực vật chính hãng, có nguồn gốc xuất xứ rõ ràng từ các nhà sản xuất uy tín.",
      icon: Natural,
    },
    {
      title: "An Toàn & Hiệu Quả",
      description:
        "Sản phẩm đạt tiêu chuẩn chất lượng quốc tế, đảm bảo hiệu quả diệt trừ sâu bệnh và an toàn cho người sử dụng.",
      icon: Organic,
    },
    {
      title: "Giao Hàng Toàn Quốc",
      description:
        "Hệ thống phân phối rộng khắp, giao hàng nhanh chóng đến tận nơi, đảm bảo nông dân nhận được sản phẩm kịp thời.",
      icon: Delivery,
    },
    {
      title: "Tư Vấn Chuyên Nghiệp",
      description:
        "Đội ngũ kỹ thuật viên nông nghiệp giàu kinh nghiệm, hỗ trợ tư vấn phương án phòng trừ sâu bệnh hiệu quả.",
      icon: Support,
    },
  ],
};

export const slides = [
  {
    id: 1,
    image: HeroImage2,
    title: "Thuốc Bảo Vệ Thực Vật Chính Hãng",
    description:
      "Đa dạng sản phẩm từ các thương hiệu uy tín, đảm bảo chất lượng và hiệu quả",
    buttonText: "Mua ngay",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: HeroImage5,
    title: "Thuốc Trừ Sâu Chuyên Dụng",
    description:
      "Các loại thuốc diệt côn trùng, sâu bệnh hại hiệu quả cao cho mọi loại cây trồng",
    buttonText: "Khám phá",
    buttonLink: "/products?category=Thuốc%20trừ%20sâu",
  },
  {
    id: 3,
    image: PhanBon,
    title: "Phân Bón chât lượng cao",
    description:
      "Giải pháp toàn diện phòng trừ các bệnh nấm, vi khuẩn trên cây trồng",
    buttonText: "Tìm hiểu thêm",
    buttonLink: "/products?category=Phân%20bón",
  },
  {
    id: 4,
    image: HeroImage6,
    title: "Thuốc Diệt Cỏ An Toàn",
    description:
      "Các sản phẩm diệt cỏ dại hiệu quả, không gây hại cho cây trồng chính",
    buttonText: "Xem ngay",
    buttonLink: "/products?category=Thuốc%20trừ%20cỏ",
  },
];
