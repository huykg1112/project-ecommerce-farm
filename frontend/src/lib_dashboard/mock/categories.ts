import type { Category } from "@/types/entities"

export const mockCategoriesData: Category[] = [
  {
    category_id: "cat_1",
    category_name: "Thuốc diệt cỏ",
    description: "Sản phẩm kiểm soát cỏ dại và thực vật không mong muốn",
    category_img: "/placeholder.svg?height=100&width=100",
    is_active: true,
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-01-10"),
  },
  {
    category_id: "cat_2",
    category_name: "Thuốc trừ sâu",
    description: "Sản phẩm kiểm soát côn trùng và sâu hại cây trồng",
    category_img: "/placeholder.svg?height=100&width=100",
    is_active: true,
    created_at: new Date("2024-01-11"),
    updated_at: new Date("2024-01-11"),
  },
  {
    category_id: "cat_3",
    category_name: "Thuốc trừ nấm",
    description: "Sản phẩm phòng và trị các bệnh nấm trên cây trồng",
    category_img: "/placeholder.svg?height=100&width=100",
    is_active: true,
    created_at: new Date("2024-01-12"),
    updated_at: new Date("2024-01-12"),
  },
  {
    category_id: "cat_4",
    category_name: "Phân bón",
    description: "Sản phẩm cung cấp dinh dưỡng cho cây trồng",
    category_img: "/placeholder.svg?height=100&width=100",
    is_active: true,
    created_at: new Date("2024-01-13"),
    updated_at: new Date("2024-01-13"),
  },
  {
    category_id: "cat_5",
    category_name: "Chất điều hòa sinh trưởng",
    description: "Sản phẩm kích thích và điều hòa sinh trưởng cây trồng",
    category_img: "/placeholder.svg?height=100&width=100",
    is_active: true,
    created_at: new Date("2024-01-14"),
    updated_at: new Date("2024-01-14"),
  },
]
