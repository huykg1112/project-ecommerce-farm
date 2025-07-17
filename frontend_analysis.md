# Phân tích cấu trúc thư mục Frontend

## Tổng quan dự án
Đây là một ứng dụng **Next.js 14** với **TypeScript**, được xây dựng như một sàn thương mại điện tử nông nghiệp tên "**Farme**". Dự án sử dụng App Router của Next.js và được thiết kế với UI hiện đại sử dụng Tailwind CSS và Radix UI.

## Cấu trúc thư mục chính

### 📁 **Frontend Root Directory**
```
frontend/
├── 📄 package.json          # Quản lý dependencies và scripts
├── 📄 next.config.js        # Cấu hình Next.js
├── 📄 tailwind.config.js    # Cấu hình Tailwind CSS
├── 📄 tsconfig.json         # Cấu hình TypeScript
├── 📄 components.json       # Cấu hình shadcn/ui components
├── 📄 postcss.config.mjs    # Cấu hình PostCSS
├── 📄 eslint.config.mjs     # Cấu hình ESLint
├── 📄 README.md             # Hướng dẫn dự án
├── 📁 public/               # Tài nguyên tĩnh
├── 📁 src/                  # Mã nguồn chính
```

### 📁 **src/ - Thư mục mã nguồn chính**
```
src/
├── 📁 app/                  # Next.js App Router (routes & layouts)
├── 📁 components/           # React components tái sử dụng
├── 📁 lib/                  # Utilities, services, và providers
├── 📁 lib_dashboard/        # Dashboard-specific libraries
├── 📁 types/                # TypeScript type definitions
├── 📁 interfaces/           # TypeScript interfaces
├── 📁 hooks/                # Custom React hooks
├── 📁 data/                 # Static data và mock data
├── 📁 layouts/              # Layout components
├── 📁 assets/               # Tài nguyên tĩnh (images, icons)
├── 📁 styles/               # CSS và styling files
```

## Chi tiết cấu trúc

### 🛠️ **Dependencies chính (package.json)**
- **Framework**: Next.js 14.2.16, React 18
- **UI Library**: Radix UI (comprehensive component set)
- **Styling**: Tailwind CSS, styled-components
- **State Management**: Redux Toolkit, Zustand, Jotai
- **Forms**: React Hook Form với Zod validation
- **Maps**: React Google Maps API
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

### 🗂️ **App Router Structure (src/app/)**
Dự án sử dụng **Next.js App Router** với cấu trúc route groups:

```
app/
├── 📄 layout.tsx            # Root layout
├── 📄 loading.tsx           # Global loading UI
├── 📄 not-found.tsx         # 404 page
├── 📄 middleware.ts         # Route middleware
├── 📁 (client)/             # Client-facing routes
│   ├── 📁 home/
│   ├── 📁 products/
│   ├── 📁 cart/
│   ├── 📁 checkout/
│   ├── 📁 profile/
│   ├── 📁 orders/
│   ├── 📁 auth/
│   ├── 📁 login/
│   ├── 📁 wishlist/
│   ├── 📁 seller/
│   ├── 📁 stores/
│   └── 📁 register-dealer/
└── 📁 (dashboard)/          # Admin/Management routes
    ├── 📁 dashboard/
    ├── 📁 products-management/
    ├── 📁 users-management/
    ├── 📁 categories-management/
    ├── 📁 manufacturer-management/
    ├── 📁 ingredients-management/
    ├── 📁 diseases-management/
    ├── 📁 warehouses-management/
    ├── 📁 vouchers-management/
    ├── 📁 agency-requests/
    └── 📁 user-statistics/
```

### 🧩 **Components Structure (src/components/)**
```
components/
├── 📁 ui/                   # shadcn/ui base components
│   ├── 📄 button.tsx
│   ├── 📄 input.tsx
│   ├── 📄 dialog.tsx
│   ├── 📄 table.tsx
│   ├── 📄 form.tsx
│   ├── 📄 card.tsx
│   ├── 📄 sidebar.tsx
│   └── ... (50+ UI components)
├── 📁 auth/                 # Authentication components
├── 📁 cart/                 # Shopping cart components
├── 📁 checkout/             # Checkout process components
├── 📁 home/                 # Homepage components
├── 📁 products/             # Product-related components
├── 📁 product_detail/       # Product detail components
├── 📁 orders/               # Order management components
├── 📁 profile/              # User profile components
├── 📁 seller/               # Seller/Distributor components
├── 📁 wishlist/             # Wishlist components
├── 📁 map/                  # Map components
├── 📁 common/               # Common/Shared components
├── 📁 register-dealer/      # Dealer registration components
└── 📁 (dashboard)/          # Dashboard-specific components
```

### 📚 **Libraries & Utilities (src/lib/)**
```
lib/
├── 📁 auth/                 # Authentication logic
├── 📁 cart/                 # Shopping cart utilities
├── 📁 wishlist/             # Wishlist utilities
├── 📁 features/             # Feature-specific logic
├── 📁 services/             # API services
├── 📁 provider/             # React context providers
├── 📁 dashboard/            # Dashboard utilities
├── 📄 utils.ts              # Common utility functions
└── 📄 toast-provider.tsx    # Toast notification provider
```

### 📋 **Type Definitions (src/types/)**
```
types/
├── 📄 entities.ts           # Main entity types
└── 📁 products/             # Product-specific types
```

**Các entity chính được định nghĩa:**
- `User` - Người dùng (Admin, Distributor, Client)
- `Product` - Sản phẩm nông nghiệp
- `StoreOwnerRequest` - Yêu cầu đăng ký đại lý
- `Role` - Vai trò người dùng
- `ProductImage`, `ProductIngredient` - Chi tiết sản phẩm

### 🎨 **Styling & Theming**
- **Tailwind CSS**: Framework CSS chính
- **shadcn/ui**: Component library dựa trên Radix UI
- **Dark mode**: Hỗ trợ chế độ tối
- **Custom colors**: Sử dụng palette xanh lá (`#599146`) phù hợp với theme nông nghiệp
- **Responsive design**: Thiết kế đáp ứng nhiều kích thước màn hình

### 🌍 **Internationalization**
- **Language**: Tiếng Việt (default locale)
- **SEO**: Metadata được tối ưu cho tiếng Việt
- **Title**: "Farme - Sàn Thương Mại Điện Tử Nông Nghiệp"

### ⚙️ **Configuration Highlights**
1. **Next.js Config**:
   - Auto redirect từ `/` → `/home`
   - ESLint và TypeScript errors bị ignore trong build
   - Tối ưu hóa build với webpack workers
   - Images unoptimized

2. **Development Setup**:
   - Hot reload với `npm run dev`
   - Linting với ESLint
   - Type checking với TypeScript
   - CSS processing với PostCSS

## Đặc điểm kiến trúc

### ✅ **Ưu điểm**
1. **Modular Architecture**: Tách biệt rõ ràng giữa client và dashboard
2. **Type Safety**: Sử dụng TypeScript toàn bộ dự án
3. **Modern UI**: shadcn/ui components với Radix UI primitives
4. **State Management**: Đa dạng với Redux, Zustand, Jotai
5. **Performance**: Next.js 14 với App Router
6. **Responsive**: Tailwind CSS responsive design
7. **Accessibility**: Radix UI đảm bảo accessibility tốt

### 📝 **Các tính năng chính**
1. **E-commerce Platform**: Sàn TMĐT nông nghiệp
2. **Multi-role System**: Client, Distributor, Admin
3. **Product Management**: Quản lý sản phẩm, categories, ingredients
4. **Order System**: Giỏ hàng, checkout, order tracking
5. **Store Registration**: Đăng ký đại lý/distributor
6. **Dashboard**: Quản trị toàn diện
7. **Maps Integration**: Google Maps cho location
8. **Statistics**: Thống kê và báo cáo

### 🎯 **Target Domain**
Dự án tập trung vào lĩnh vực **nông nghiệp** với các sản phẩm như:
- Thuốc bảo vệ thực vật
- Vật tư nông nghiệp  
- Hạt giống
- Các sản phẩm nông nghiệp khác

Đây là một dự án quy mô lớn với kiến trúc hiện đại, phù hợp cho việc phát triển một sàn thương mại điện tử chuyên nghiệp trong lĩnh vực nông nghiệp.