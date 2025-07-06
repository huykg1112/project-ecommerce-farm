import type { Product, ProductIngredient, ProductDisease, ProductImage } from "@/types/entities"
import { mockUsersData } from "./users"
import { mockCategoriesData } from "./categories"
import { mockDiseasesData } from "./diseases"
import { mockActiveIngredientsData } from "./active-ingredients"

// Get distributors from users
const distributors = mockUsersData.filter((user) => user.role.role_name === "DISTRIBUTOR")

export const mockProductsData: Product[] = [
  {
    product_id: "product1",
    distributor: distributors[0],
    categories: [mockCategoriesData[0], mockCategoriesData[1]], // Thuốc trừ sâu, Thuốc diệt cỏ
    product_name: "FarmGuard Pro - Thuốc trừ sâu đa năng",
    description:
      "Thuốc trừ sâu hiệu quả cao, phòng trừ nhiều loại sâu hại trên lúa, ngô và các cây trồng khác. Công thức tiên tiến với hoạt chất Imidacloprid và Cypermethrin.",
    usage_instructions:
      "Pha loãng 20-30ml/16 lít nước. Phun đều lên lá và thân cây vào buổi sáng sớm hoặc chiều mát. Không phun khi trời mưa hoặc gió mạnh.",
    unit_product_price: 125000,
    is_active: true,
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-01-20"),
  },
  {
    product_id: "product2",
    distributor: distributors[1],
    categories: [mockCategoriesData[2]], // Thuốc trừ nấm
    product_name: "FungiFree Max - Thuốc trừ nấm chuyên dụng",
    description:
      "Thuốc trừ nấm hệ thống và tiếp xúc, phòng trừ hiệu quả các bệnh nấm trên lúa, rau màu. Chứa Mancozeb và Propiconazole.",
    usage_instructions:
      "Pha 25-35ml/16 lít nước. Phun phòng trừ 2-3 lần/vụ, cách nhau 10-14 ngày. Ngừng sử dụng trước thu hoạch 14 ngày.",
    unit_product_price: 98000,
    is_active: true,
    created_at: new Date("2024-01-21"),
    updated_at: new Date("2024-01-21"),
  },
  {
    product_id: "product3",
    distributor: distributors[0],
    categories: [mockCategoriesData[1], mockCategoriesData[3]], // Thuốc diệt cỏ, Phân bón
    product_name: "WeedKiller Plus - Diệt cỏ toàn diện",
    description:
      "Thuốc diệt cỏ hệ thống, tiêu diệt cỏ dại từ gốc rễ. Phù hợp cho ruộng lúa, vườn cây ăn quả. Công thức Glyphosate và 2,4-D.",
    usage_instructions:
      "Pha 40-50ml/16 lít nước cho cỏ 1 lá. Phun trực tiếp lên cỏ dại, tránh phun lên cây trồng. Hiệu quả sau 3-7 ngày.",
    unit_product_price: 85000,
    is_active: true,
    created_at: new Date("2024-01-22"),
    updated_at: new Date("2024-01-22"),
  },
]

export const mockProductImagesData: ProductImage[] = [
  {
    image_id: "img1",
    product: mockProductsData[0],
    image_url: "/placeholder.svg?height=300&width=300",
    is_primary: true,
    alt_text: "FarmGuard Pro - Mặt trước",
    created_at: new Date("2024-01-20"),
  },
  {
    image_id: "img2",
    product: mockProductsData[0],
    image_url: "/placeholder.svg?height=300&width=300",
    is_primary: false,
    alt_text: "FarmGuard Pro - Nhãn sản phẩm",
    created_at: new Date("2024-01-20"),
  },
  {
    image_id: "img3",
    product: mockProductsData[1],
    image_url: "/placeholder.svg?height=300&width=300",
    is_primary: true,
    alt_text: "FungiFree Max - Chai sản phẩm",
    created_at: new Date("2024-01-21"),
  },
  {
    image_id: "img4",
    product: mockProductsData[2],
    image_url: "/placeholder.svg?height=300&width=300",
    is_primary: true,
    alt_text: "WeedKiller Plus - Bao bì sản phẩm",
    created_at: new Date("2024-01-22"),
  },
]

export const mockProductIngredientsData: ProductIngredient[] = [
  {
    product_ingredient_id: "pi1",
    product: mockProductsData[0],
    active_ingredient: mockActiveIngredientsData[1], // Imidacloprid
    concentration: 20.0,
    is_primary: true,
    created_at: new Date("2024-01-20"),
  },
  {
    product_ingredient_id: "pi2",
    product: mockProductsData[0],
    active_ingredient: mockActiveIngredientsData[4], // Cypermethrin
    concentration: 5.0,
    is_primary: false,
    created_at: new Date("2024-01-20"),
  },
  {
    product_ingredient_id: "pi3",
    product: mockProductsData[1],
    active_ingredient: mockActiveIngredientsData[2], // Mancozeb
    concentration: 64.0,
    is_primary: true,
    created_at: new Date("2024-01-21"),
  },
  {
    product_ingredient_id: "pi4",
    product: mockProductsData[1],
    active_ingredient: mockActiveIngredientsData[5], // Propiconazole
    concentration: 12.5,
    is_primary: false,
    created_at: new Date("2024-01-21"),
  },
  {
    product_ingredient_id: "pi5",
    product: mockProductsData[2],
    active_ingredient: mockActiveIngredientsData[0], // Glyphosate
    concentration: 48.0,
    is_primary: true,
    created_at: new Date("2024-01-22"),
  },
  {
    product_ingredient_id: "pi6",
    product: mockProductsData[2],
    active_ingredient: mockActiveIngredientsData[3], // 2,4-D
    concentration: 12.0,
    is_primary: false,
    created_at: new Date("2024-01-22"),
  },
]

export const mockProductDiseasesData: ProductDisease[] = [
  {
    product_disease_id: "pd1",
    product: mockProductsData[0],
    disease: mockDiseasesData[0], // Bệnh đốm lá lúa
    is_primary: true,
    created_at: new Date("2024-01-20"),
  },
  {
    product_disease_id: "pd2",
    product: mockProductsData[0],
    disease: mockDiseasesData[3], // Bệnh đốm nâu lá ngô
    is_primary: false,
    created_at: new Date("2024-01-20"),
  },
  {
    product_disease_id: "pd3",
    product: mockProductsData[1],
    disease: mockDiseasesData[0], // Bệnh đốm lá lúa
    is_primary: true,
    created_at: new Date("2024-01-21"),
  },
  {
    product_disease_id: "pd4",
    product: mockProductsData[1],
    disease: mockDiseasesData[5], // Bệnh phấn trắng
    is_primary: false,
    created_at: new Date("2024-01-21"),
  },
  {
    product_disease_id: "pd5",
    product: mockProductsData[2],
    disease: mockDiseasesData[2], // Bệnh thối rễ
    is_primary: false,
    created_at: new Date("2024-01-22"),
  },
]

// Update products with their relationships
mockProductsData[0].product_images = mockProductImagesData.filter((img) => img.product.product_id === "product1")
mockProductsData[0].product_ingredients = mockProductIngredientsData.filter(
  (pi) => pi.product.product_id === "product1",
)
mockProductsData[0].product_diseases = mockProductDiseasesData.filter((pd) => pd.product.product_id === "product1")

mockProductsData[1].product_images = mockProductImagesData.filter((img) => img.product.product_id === "product2")
mockProductsData[1].product_ingredients = mockProductIngredientsData.filter(
  (pi) => pi.product.product_id === "product2",
)
mockProductsData[1].product_diseases = mockProductDiseasesData.filter((pd) => pd.product.product_id === "product2")

mockProductsData[2].product_images = mockProductImagesData.filter((img) => img.product.product_id === "product3")
mockProductsData[2].product_ingredients = mockProductIngredientsData.filter(
  (pi) => pi.product.product_id === "product3",
)
mockProductsData[2].product_diseases = mockProductDiseasesData.filter((pd) => pd.product.product_id === "product3")
