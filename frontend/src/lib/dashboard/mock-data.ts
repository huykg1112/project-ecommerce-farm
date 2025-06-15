
import type { Category, Ingredient, Product, Role, UserProfile, UserStatistics } from "@/interfaces"

// Mock User Roles
export const mockRoles: Role[] = [
      {
            id: "1",
            name: "Admin",
            description: "Quản trị viên hệ thống",
            isActive: true,
      },
      {
            id: "2",
            name: "Distributor",
            description: "Chủ đại lý",
            isActive: true,
      },
      {
            id: "3",
            name: "Client",
            description: "Khách hàng",
            isActive: true,
      },
]

// Mock Users
export const mockUsers: UserProfile[] = [
      {
            id: "1",
            username: "admin",
            email: "admin@frame.vn",
            fullName: "Nguyễn Văn Admin",
            phone: "0901234567",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            avatar: "/placeholder.svg?height=40&width=40",
            isActive: true,
            isVerified: true,
            roleName: "Admin",
            createdAt: new Date("2024-01-15T08:00:00Z").toISOString(),
            updatedAt: new Date("2024-01-15T08:00:00Z").toISOString(),
            lat: 10.762622,
            lng: 106.660172,
            cccd: "123456789012",
            license: "GP123456789",
      },
      {
            id: "2",
            username: "distributor1",
            email: "distributor1@frame.vn",
            fullName: "Trần Thị Bình",
            phone: "0912345678",
            address: "456 Đường DEF, Quận 2, TP.HCM",
            avatar: "/placeholder.svg?height=40&width=40",
            isActive: true,
            isVerified: true,
            roleName: "Distributor",
            createdAt: "2024-01-20T09:00:00Z",
            updatedAt: "2024-01-20T09:00:00Z",
            lat: 10.762622,
            lng: 106.660172,
            cccd: "123456789013",
            license: "GP123456790",
      },
      {
            id: "3",
            username: "distributor2",
            email: "distributor2@frame.vn",
            fullName: "Lê Văn Cường",
            phone: "0923456789",
            address: "789 Đường GHI, Quận 3, TP.HCM",
            avatar: "/placeholder.svg?height=40&width=40",
            isActive: false,
            isVerified: false,
            roleName: "Distributor",
            createdAt: "2024-02-01T10:00:00Z",
            updatedAt: "2024-02-01T10:00:00Z",
            lat: 10.762622,
            lng: 106.660172,
            cccd: "123456789014",
            license: "GP123456791",
      },
      {
            id: "4",
            username: "client1",
            email: "client1@gmail.com",
            fullName: "Phạm Thị Dung",
            phone: "0934567890",
            address: "321 Đường JKL, Quận 4, TP.HCM",
            avatar: "/placeholder.svg?height=40&width=40",
            isActive: true,
            isVerified: false,
            roleName: "Client",
            createdAt: "2024-02-10T11:00:00Z",
            updatedAt: "2024-02-10T11:00:00Z",
      },
      {
            id: "5",
            username: "client2",
            email: "client2@gmail.com",
            fullName: "Hoàng Văn Em",
            phone: "0945678901",
            address: "654 Đường MNO, Quận 5, TP.HCM",
            avatar: "/placeholder.svg?height=40&width=40",
            isActive: true,
            isVerified: false,
            roleName: "Client",
            createdAt: "2024-02-15T12:00:00Z",
            updatedAt: "2024-02-15T12:00:00Z",
      },
]

// Mock User Statistics
export const mockUserStatistics: UserStatistics = {
      pieChart: [
            { label: "Admin", value: 1 },
            { label: "Distributor", value: 2 },
            { label: "Client", value: 2 },
      ],
      barChart: [
            { label: "T1", value: 1 },
            { label: "T2", value: 2 },
            { label: "T3", value: 1 },
            { label: "T4", value: 0 },
            { label: "T5", value: 1 },
            { label: "T6", value: 0 },
            { label: "T7", value: 0 },
      ],
      totalStats: {
            totalUsers: 5,
            activeUsers: 4,
            verifiedUsers: 2,
      },
}

// Mock Categories
export const mockCategories: Category[] = [
      {
            id: "1",
            name: "Phân bón",
            description: "Các loại phân bón cho cây trồng",
            image: "/placeholder.svg?height=100&width=100",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "2",
            name: "Phân bón NPK",
            description: "Phân bón chứa Nitơ, Phốt pho, Kali",
            image: "/placeholder.svg?height=100&width=100",
            isActive: true,
            createdAt: new Date("2024-01-02T00:00:00Z"),
            updatedAt: new Date("2024-01-02T00:00:00Z"),
      },
      {
            id: "3",
            name: "Phân bón hữu cơ",
            description: "Phân bón từ nguồn gốc tự nhiên",
            image: "/placeholder.svg?height=100&width=100",
            isActive: true,

            createdAt: new Date("2024-01-03T00:00:00Z"),
            updatedAt: new Date("2024-01-03T00:00:00Z"),
      },
      {
            id: "4",
            name: "Thuốc bảo vệ thực vật",
            description: "Các loại thuốc trừ sâu, diệt cỏ",
            image: "/placeholder.svg?height=100&width=100",
            isActive: true,
            createdAt: new Date("2024-01-04T00:00:00Z"),
            updatedAt: new Date("2024-01-04T00:00:00Z"),
      },
      {
            id: "5",
            name: "Hạt giống",
            description: "Hạt giống các loại cây trồng",
            image: "/placeholder.svg?height=100&width=100",
            isActive: false,
            createdAt: new Date("2024-01-05T00:00:00Z"),
            updatedAt: new Date("2024-01-05T00:00:00Z"),
      },
]

// Mock Ingredients
export const mockIngredients: Ingredient[] = [
      {
            id: "1",
            name: "Nitơ (N)",
            description: "Nguyên tố dinh dưỡng chính cho cây trồng",
            unit: "%",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "2",
            name: "Phốt pho (P2O5)",
            description: "Nguyên tố dinh dưỡng cho hệ rễ",
            unit: "%",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "3",
            name: "Kali (K2O)",
            description: "Nguyên tố dinh dưỡng cho quả",
            unit: "%",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "4",
            name: "Abamectin",
            description: "Hoạt chất diệt côn trùng",
            unit: "g/l",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "5",
            name: "Glyphosate",
            description: "Hoạt chất diệt cỏ",
            unit: "g/l",
            isActive: false,
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
]

// Mock Products
export const mockProducts: Product[] = [
      {
            id: "1",
            name: "Phân bón NPK 20-20-15",
            description: "Phân bón NPK chuyên dùng cho cây ăn quả",
            price: 250000,
            discountPrice: 225000,
            discountStartDate: new Date("2024-01-01T00:00:00Z"),
            discountEndDate: new Date("2024-12-31T23:59:59Z"),
            stock: 100,
            averageRating: 4.5,
            totalSales: 150,
            isFeatured: true,
            usageInstructions: "Pha 20g với 1 lít nước, tưới 2 tuần/lần",
            safetyInstructions: "Đeo găng tay khi sử dụng, tránh xa tầm tay trẻ em",
            storageInstructions: "Bảo quản nơi khô ráo, thoáng mát",
            categories: [mockCategories[0], mockCategories[1]],
            ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[2]],
            images: [
                  {
                        id: "1",
                        url: "/placeholder.svg?height=300&width=300",
                  },
            ],
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
            id: "2",
            name: "Thuốc trừ sâu Abamectin 18EC",
            description: "Thuốc trừ sâu sinh học an toàn",
            price: 180000,
            discountPrice: undefined,
            discountStartDate: undefined,
            discountEndDate: undefined,
            stock: 50,
            averageRating: 4.2,
            totalSales: 80,
            isFeatured: false,
            usageInstructions: "Pha 10ml với 1 lít nước, phun vào buổi chiều",
            safetyInstructions: "Đeo khẩu trang và găng tay, không ăn uống khi sử dụng",
            storageInstructions: "Bảo quản nơi khô ráo, nhiệt độ dưới 30°C",
            categories: [mockCategories[3]],
            ingredients: [mockIngredients[3]],
            images: [
                  {
                        id: "2",
                        url: "/placeholder.svg?height=300&width=300",

                  },
            ],


      },
      {
            id: "3",
            name: "Phân bón hữu cơ Đầu Trâu",
            description: "Phân bón hữu cơ từ phế phẩm nông nghiệp",
            price: 120000,
            discountPrice: 100000,
            discountStartDate: new Date("2024-02-01T00:00:00Z"),
            discountEndDate: new Date("2024-02-29T23:59:59Z"),
            stock: 200,
            averageRating: 4.8,
            totalSales: 300,
            isFeatured: true,
            usageInstructions: "Bón 100g/cây, 1 tháng/lần",
            safetyInstructions: "An toàn với người và vật nuôi",
            storageInstructions: "Bảo quản nơi khô ráo, thoáng mát",
            categories: [mockCategories[0], mockCategories[2]],
            ingredients: [mockIngredients[0], mockIngredients[1]],
            images: [
                  {
                        id: "3",
                        url: "/placeholder.svg?height=300&width=300",

                  },
            ],
      },
]

// Mock Revenue Data
export const mockRevenueData = {
      daily: [
            { name: "00:00", total: 0 },
            { name: "03:00", total: 120000 },
            { name: "06:00", total: 170000 },
            { name: "09:00", total: 450000 },
            { name: "12:00", total: 890000 },
            { name: "15:00", total: 1250000 },
            { name: "18:00", total: 1900000 },
            { name: "21:00", total: 2350000 },
      ],
      weekly: [
            { name: "T2", total: 1200000 },
            { name: "T3", total: 1500000 },
            { name: "T4", total: 1800000 },
            { name: "T5", total: 2100000 },
            { name: "T6", total: 2500000 },
            { name: "T7", total: 3200000 },
            { name: "CN", total: 2800000 },
      ],
      monthly: [
            { name: "T1", total: 15000000 },
            { name: "T2", total: 18000000 },
            { name: "T3", total: 22000000 },
            { name: "T4", total: 25000000 },
            { name: "T5", total: 28000000 },
            { name: "T6", total: 32000000 },
            { name: "T7", total: 30000000 },
            { name: "T8", total: 35000000 },
            { name: "T9", total: 38000000 },
            { name: "T10", total: 42000000 },
            { name: "T11", total: 45000000 },
            { name: "T12", total: 48000000 },
      ],
}

// Mock Category Statistics
export const mockCategoryStatistics = {
      totalCategories: 5,
      activeCategories: 4,
      inactiveCategories: 1,
      categoriesWithProducts: 3,
      pieChart: [
            { label: "Phân bón", value: 2 },
            { label: "Thuốc BVTV", value: 1 },
            { label: "Hạt giống", value: 0 },
      ],
      barChart: [
            { label: "T1", value: 1 },
            { label: "T2", value: 2 },
            { label: "T3", value: 1 },
            { label: "T4", value: 1 },
            { label: "T5", value: 0 },
      ],
}

// Mock Product Statistics
export const mockProductStatistics = {
      totalProducts: 3,
      activeProducts: 3,
      featuredProducts: 2,
      outOfStockProducts: 0,
      pieChart: [
            { label: "Phân bón", value: 2 },
            { label: "Thuốc BVTV", value: 1 },
      ],
      barChart: [
            { label: "T1", value: 1 },
            { label: "T2", value: 1 },
            { label: "T3", value: 1 },
            { label: "T4", value: 0 },
            { label: "T5", value: 0 },
      ],
}

// Mock Ingredient Statistics
export const mockIngredientStatistics = {
      totalIngredients: 5,
      activeIngredients: 4,
      inactiveIngredients: 1,
      ingredientsInUse: 4,
      pieChart: [
            { label: "Dinh dưỡng", value: 3 },
            { label: "Hoạt chất", value: 2 },
      ],
      barChart: [
            { label: "T1", value: 2 },
            { label: "T2", value: 1 },
            { label: "T3", value: 1 },
            { label: "T4", value: 1 },
            { label: "T5", value: 0 },
      ],
}
