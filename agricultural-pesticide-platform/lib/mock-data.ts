import type { Product, Order, BatchProduct, Category, ActiveIngredient, Disease } from "@/types/entities"

export const mockCategories: Category[] = [
  { category_id: "1", category_name: "Thuốc diệt cỏ", description: "Sản phẩm kiểm soát cỏ dại", is_active: true },
  { category_id: "2", category_name: "Thuốc trừ sâu", description: "Sản phẩm kiểm soát côn trùng", is_active: true },
  { category_id: "3", category_name: "Thuốc trừ nấm", description: "Kiểm soát bệnh nấm", is_active: true },
  { category_id: "4", category_name: "Phân bón", description: "Sản phẩm dinh dưỡng cây trồng", is_active: true },
]

export const mockActiveIngredients: ActiveIngredient[] = [
  {
    ingredient_id: "1",
    ingredient_name: "Glyphosate",
    description: "Non-selective herbicide",
    hazard_level: "Medium",
    is_active: true,
  },
  {
    ingredient_id: "2",
    ingredient_name: "Imidacloprid",
    description: "Systemic insecticide",
    hazard_level: "High",
    is_active: true,
  },
  {
    ingredient_id: "3",
    ingredient_name: "Mancozeb",
    description: "Protective fungicide",
    hazard_level: "Medium",
    is_active: true,
  },
]

export const mockDiseases: Disease[] = [
  { disease_id: "1", disease_name: "Rice Blast", description: "Fungal disease affecting rice", is_active: true },
  { disease_id: "2", disease_name: "Corn Borer", description: "Insect pest in corn crops", is_active: true },
  { disease_id: "3", disease_name: "Leaf Spot", description: "Common fungal infection", is_active: true },
]

export const mockProducts: Product[] = [
  {
    product_id: "1",
    distributor: { user_id: "2" } as any,
    categories: [mockCategories[0]],
    product_name: "RoundUp Max",
    description: "Thuốc diệt cỏ mạnh mẽ cho kiểm soát cỏ dại",
    usage_instructions: "Pha loãng 1:100 với nước, phun đều",
    unit_product_price: 250000,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    product_id: "2",
    distributor: { user_id: "2" } as any,
    categories: [mockCategories[1]],
    product_name: "InsectKill Pro",
    description: "Thuốc trừ sâu hệ thống cho kiểm soát sâu hại",
    usage_instructions: "Sử dụng 2ml trên 1 lít nước",
    unit_product_price: 180000,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

export const mockBatchProducts: BatchProduct[] = [
  {
    batch_id: "1",
    product: mockProducts[0],
    batch_number: "RU2024001",
    quantity: 150,
    manufactured_date: new Date("2024-01-15"),
    expiry_date: new Date("2026-01-15"),
    low_stock_threshold: 20,
    is_active: true,
  },
  {
    batch_id: "2",
    product: mockProducts[1],
    batch_number: "IK2024001",
    quantity: 8,
    manufactured_date: new Date("2024-02-01"),
    expiry_date: new Date("2025-12-01"),
    low_stock_threshold: 15,
    is_active: true,
  },
]

export const mockOrders: Order[] = [
  {
    order_id: "1",
    user: { user_id: "3", full_name: "Farmer John" } as any,
    distributor: { user_id: "2" } as any,
    status: { status_name: "CONFIRMED" } as any,
    total_amount: 750000,
    created_at: new Date("2024-12-01"),
    order_details: [],
  },
  {
    order_id: "2",
    user: { user_id: "4", full_name: "Green Farm Co." } as any,
    distributor: { user_id: "2" } as any,
    status: { status_name: "SHIPPING" } as any,
    total_amount: 1200000,
    created_at: new Date("2024-12-02"),
    order_details: [],
  },
]

// Analytics data
export const salesData = [
  { month: "T1", revenue: 45000000, orders: 120 },
  { month: "T2", revenue: 52000000, orders: 145 },
  { month: "T3", revenue: 48000000, orders: 132 },
  { month: "T4", revenue: 61000000, orders: 168 },
  { month: "T5", revenue: 55000000, orders: 155 },
  { month: "T6", revenue: 67000000, orders: 189 },
]

export const categoryDistribution = [
  { name: "Thuốc diệt cỏ", value: 35, fill: "#22c55e" },
  { name: "Thuốc trừ sâu", value: 28, fill: "#16a34a" },
  { name: "Thuốc trừ nấm", value: 22, fill: "#15803d" },
  { name: "Phân bón", value: 15, fill: "#166534" },
]
