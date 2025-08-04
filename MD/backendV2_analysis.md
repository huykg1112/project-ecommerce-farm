# Phân tích cấu trúc thư mục Backend V2

## Tổng quan dự án
Đây là một backend API được xây dựng bằng **NestJS** với **TypeScript**, phục vụ cho sàn thương mại điện tử nông nghiệp "Farme". Backend sử dụng **PostgreSQL** làm cơ sở dữ liệu chính và được thiết kế theo kiến trúc **modular** với các tính năng hiện đại như JWT authentication, file upload, AI consultation, và payment integration.

## Cấu trúc thư mục chính

### 📁 **Backend Root Directory**
```
backendV2/
├── 📄 package.json           # Dependencies và scripts
├── 📄 nest-cli.json          # NestJS CLI configuration
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 tsconfig.build.json    # Build-specific TypeScript config
├── 📄 eslint.config.mjs      # ESLint configuration
├── 📄 .prettierrc            # Prettier formatting rules
├── 📄 .gitignore             # Git ignore rules
├── 📄 README.md              # Project documentation
├── 📄 docs.doc               # Additional documentation (32KB)
├── 📄 database_documentation.markdown # Database schema docs (23KB)
├── 📄 productdata.json       # Product data file
├── 📁 src/                   # Source code chính
├── 📁 test/                  # Test files
```

### 📁 **src/ - Thư mục mã nguồn chính**
```
src/
├── 📄 main.ts                # Application bootstrap
├── 📄 app.module.ts          # Root module (104 lines)
├── 📄 app.controller.ts      # Root controller
├── 📄 app.service.ts         # Root service
├── 📄 ormconfig.ts           # TypeORM configuration
├── 📄 datasource.ts          # Database connection
├── 📄 public.decorator.ts    # Custom decorator for public routes
├── 📁 modules/               # Feature modules (28 modules)
├── 📁 auth/                  # Authentication module
├── 📁 cloudinary/            # File upload service
├── 📁 migrations/            # Database migrations
├── 📁 types/                 # TypeScript type definitions
├── 📁 serializers/           # Data transformation classes
```

## Chi tiết cấu trúc

### 🛠️ **Technology Stack (package.json)**

**Core Framework:**
- **NestJS 11.x**: Progressive Node.js framework
- **TypeScript 5.7.x**: Static typing
- **TypeORM 0.3.x**: ORM cho PostgreSQL
- **PostgreSQL (pg)**: Database chính

**Authentication & Security:**
- **Passport**: Authentication middleware
- **JWT**: JSON Web Tokens
- **bcrypt**: Password hashing
- **Google OAuth 2.0**: Social authentication

**File Management:**
- **Cloudinary**: Cloud image/file storage
- **Multer**: File upload middleware

**Validation & Transformation:**
- **class-validator**: DTO validation
- **class-transformer**: Object transformation

**Development Tools:**
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

### 🗂️ **Modules Architecture (28 modules)**

Hệ thống được tổ chức thành **28 modules** theo feature-based architecture:

#### **Core Business Modules:**
1. **user** - Quản lý người dùng
2. **role** - Phân quyền hệ thống
3. **product** - Quản lý sản phẩm nông nghiệp
4. **category** - Phân loại sản phẩm
5. **manufacturer** - Nhà sản xuất
6. **order** - Quản lý đơn hàng
7. **cart** - Giỏ hàng

#### **Product-Related Modules:**
8. **product-ingredient** - Thành phần sản phẩm
9. **product-type** - Loại sản phẩm
10. **product_image** - Hình ảnh sản phẩm
11. **product_disease** - Bệnh mà sản phẩm điều trị
12. **batch-product** - Lô sản phẩm
13. **active-ingredient** - Hoạt chất
14. **disease** - Bệnh cây trồng

#### **E-commerce Modules:**
15. **cart-item** - Chi tiết giỏ hàng
16. **order-detail** - Chi tiết đơn hàng
17. **order-status** - Trạng thái đơn hàng
18. **payment-method** - Phương thức thanh toán
19. **promotion** - Khuyến mãi
20. **voucher** - Mã giảm giá
21. **review** - Đánh giá sản phẩm
22. **wishlist** - Danh sách yêu thích

#### **Support & Advanced Modules:**
23. **address** - Địa chỉ giao hàng
24. **invenstory** - Kho hàng/đại lý
25. **store_owner_request** - Yêu cầu đăng ký đại lý
26. **ai-consultation** - Tư vấn AI
27. **treatment-plan** - Kế hoạch điều trị
28. **token** - Quản lý tokens

### 🏗️ **Module Structure Pattern**
Mỗi module tuân theo cấu trúc chuẩn của NestJS:

```
module-name/
├── 📄 module-name.module.ts     # Module definition
├── 📄 module-name.controller.ts # HTTP endpoints
├── 📄 module-name.service.ts    # Business logic
├── 📁 dto/                      # Data Transfer Objects
├── 📁 entities/                 # TypeORM entities
```

### 🗃️ **Database Design (PostgreSQL)**

**Đặc điểm chính:**
- **UUID Primary Keys**: Sử dụng UUID cho tất cả entities
- **3NF Normalization**: Chuẩn hóa cơ sở dữ liệu đến dạng 3NF
- **Atomic Design**: Các module được thiết kế atomic
- **Migration Support**: Hỗ trợ database migrations

**Entities chính:**
- `User` - Người dùng (Admin, Distributor, Client)
- `Product` - Sản phẩm thuốc BVTV
- `Order` - Đơn hàng
- `Category` - Danh mục sản phẩm
- `Disease` - Bệnh cây trồng
- `ActiveIngredient` - Hoạt chất

### 🔐 **Authentication & Authorization**

**JWT Strategy:**
- JWT tokens cho authentication
- Role-based access control (RBAC)
- Google OAuth integration
- Session management với express-session

**Guards & Decorators:**
- `JwtAuthGuard` - JWT protection
- `RolesGuard` - Role-based authorization
- `@Public()` decorator - Public routes
- Passport strategies

### ☁️ **File Management (Cloudinary)**
```
cloudinary/
├── 📄 cloudinary.module.ts     # Cloudinary configuration
├── 📄 cloudinary.service.ts    # Upload service
```

**Features:**
- Cloud-based file storage
- Image optimization
- Secure upload với multer
- Multiple file format support

### 🤖 **AI Features**

**AI Consultation System:**
- Tư vấn bệnh cây trồng dựa trên triệu chứng
- Đề xuất kế hoạch điều trị (Treatment Plan)
- Liên kết với database bệnh và thuốc điều trị

### ⚙️ **Application Configuration**

**main.ts Bootstrap:**
- CORS configuration cho cross-origin requests
- Global validation pipes
- Session middleware setup
- Static file serving
- Error handling với try-catch

**Database Configuration:**
- TypeORM với PostgreSQL
- Environment-based configuration
- Migration support
- Connection pooling
- Logging enabled

### 📝 **Development Features**

**Code Quality:**
- ESLint + Prettier integration
- TypeScript strict mode
- Validation pipes với class-validator
- DTO pattern cho data validation

**Testing:**
- Jest testing framework
- Unit tests support
- E2E testing setup
- Coverage reports

**Development Scripts:**
```bash
npm run start:dev     # Development mode với watch
npm run build         # Production build
npm run test          # Run tests
npm run lint          # Code linting
npm run migration:*   # Database migrations
```

## Đặc điểm kiến trúc

### ✅ **Ưu điểm**

1. **Modular Architecture**: 28 modules được tổ chức rõ ràng theo features
2. **Type Safety**: Full TypeScript với strict mode
3. **Database Design**: PostgreSQL với UUID và 3NF normalization
4. **Authentication**: JWT + OAuth với role-based access
5. **File Management**: Cloud storage với Cloudinary
6. **AI Integration**: Tư vấn bệnh cây trồng thông minh
7. **Validation**: Comprehensive DTO validation
8. **Migration Support**: Database versioning với TypeORM
9. **Testing**: Complete testing setup
10. **Documentation**: Extensive database documentation

### 🎯 **Business Domain Features**

**E-commerce Core:**
- Multi-role system (Admin, Distributor, Client)
- Product catalog với categories
- Shopping cart & checkout
- Order management & tracking
- Payment integration ready
- Promotion & voucher system

**Agricultural Specialization:**
- Pesticide product management
- Disease-product relationship mapping
- Active ingredient tracking
- Treatment plan generation
- Store/distributor location management
- AI-powered consultation

**Geographic Features:**
- Address management
- Store location với lat/lng
- Inventory distribution

### 📊 **Scale & Performance**

**Database:**
- PostgreSQL với connection pooling
- UUID cho horizontal scaling
- Indexing strategy
- Migration-based schema evolution

**API Design:**
- RESTful endpoints
- Pagination support
- Validation layers
- Error handling
- Logging

**Security:**
- Password hashing với bcrypt
- JWT token management
- Role-based permissions
- CORS configuration
- Session security

## Kết luận

Backend V2 là một hệ thống được thiết kế rất chuyên nghiệp với:
- **Architecture**: Modular, scalable, maintainable
- **Technology**: Modern stack với NestJS, TypeORM, PostgreSQL
- **Domain**: Chuyên biệt cho nông nghiệp với AI consultation
- **Features**: Đầy đủ tính năng e-commerce + agricultural domain knowledge
- **Quality**: High code quality với TypeScript, testing, documentation

Đây là một backend enterprise-grade phù hợp cho việc phát triển một sàn thương mại điện tử quy mô lớn trong lĩnh vực nông nghiệp.