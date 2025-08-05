# Hệ thống Thương mại điện tử Nông sản

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://nextjs.org/" target="blank"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="120" alt="Next.js Logo" /></a>
</p>

<p align="center">
  Hệ thống thương mại điện tử chuyên biệt cho sản phẩm nông nghiệp, kết nối nông dân và đại lý với giao diện thân thiện và các công cụ hiện đại.
</p>

## Mô tả

Hệ thống thương mại điện tử nông sản là nền tảng mua bán trực tuyến chuyên về thuốc bảo vệ thực vật và các sản phẩm nông nghiệp. Dự án được xây dựng với kiến trúc hiện đại sử dụng **NestJS** cho backend và **Next.js** cho frontend, hỗ trợ đa người dùng và các chức năng quản lý phức tạp.

## Tính năng chính

- **Xác thực người dùng**: Đăng nhập/đăng ký an toàn với JWT và Google OAuth
- **Quản lý sản phẩm**: CRUD đầy đủ cho sản phẩm thuốc bảo vệ thực vật
- **Hệ thống đơn hàng**: Quản lý đơn hàng từ đặt hàng đến giao hàng
- **Thanh toán trực tuyến**: Tích hợp VNPay cho thanh toán an toàn
- **Quản lý đại lý**: Hệ thống đăng ký và quản lý đại lý bán hàng
- **Dashboard quản trị**: Giao diện quản lý cho admin và đại lý
- **Responsive Design**: Giao diện thân thiện trên mọi thiết bị

## Công nghệ sử dụng

- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn/UI, Redux Toolkit
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport.js, Google OAuth
- **Payment**: VNPay Integration
- **File Storage**: Cloudinary
- **Tools**: Node.js, npm, Git

## Cấu trúc dự án

```
project-ecommerce-farm/
├── backendV2/              # Backend (NestJS)
│   ├── src/               # Source code
│   ├── package.json       # Dependencies và scripts
│   └── README.md          # Backend docs
├── frontend/              # Frontend (Next.js)
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies và scripts
│   └── README.md         # Frontend docs
├── AI/                   # AI Module (Python/Rasa)
├── rasa/                # Rasa Chatbot
├── .gitignore           # Git ignore file
├── README.md            # Project overview
└── package.json         # Root scripts
```

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

#### Phần mềm cần thiết

- **Node.js**: Phiên bản 18.x trở lên
- **npm**: Phiên bản 8.x trở lên (đi kèm với Node.js)
- **PostgreSQL**: Phiên bản 13.x trở lên
- **Git**: Để clone repository

#### Hệ điều hành

- Windows 10/11
- macOS 10.15 trở lên
- Linux Ubuntu 18.04 trở lên

### Bước 1: Cài đặt môi trường

#### 1.1. Cài đặt Node.js và npm

**Windows:**

1. Truy cập [nodejs.org](https://nodejs.org/)
2. Tải xuống phiên bản LTS (18.x)
3. Chạy file installer và làm theo hướng dẫn
4. Mở Command Prompt và kiểm tra:
   ```bash
   node --version
   npm --version
   ```

**macOS:**

```bash
# Sử dụng Homebrew
brew install node

# Hoặc tải từ website nodejs.org
```

**Linux (Ubuntu/Debian):**

```bash
# Cập nhật package manager
sudo apt update

# Cài đặt Node.js và npm
sudo apt install nodejs npm

# Kiểm tra phiên bản
node --version
npm --version
```

#### 1.2. Cài đặt PostgreSQL

**Windows:**

1. Truy cập [postgresql.org](https://www.postgresql.org/download/windows/)
2. Tải xuống PostgreSQL installer
3. Chạy installer và làm theo hướng dẫn
4. Ghi nhớ username, password và port (mặc định 5432)

**macOS:**

```bash
# Sử dụng Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**

```bash
# Cài đặt PostgreSQL
sudo apt install postgresql postgresql-contrib

# Khởi động dịch vụ
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 1.3. Cài đặt Git

**Windows:**

1. Truy cập [git-scm.com](https://git-scm.com/download/win)
2. Tải xuống và cài đặt Git for Windows

**macOS:**

```bash
# Sử dụng Homebrew
brew install git

# Hoặc cài đặt Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt install git
```

### Bước 2: Clone và cài đặt dự án

#### 2.1. Clone repository

```bash
git clone https://github.com/huykg1112/project-ecommerce-farm.git
cd project-ecommerce-farm
```

#### 2.2. Cài đặt dependencies cho root project

```bash
npm install
```

#### 2.3. Cài đặt dependencies cho backend

```bash
cd backendV2
npm install
cd ..
```

#### 2.4. Cài đặt dependencies cho frontend

```bash
cd frontend
npm install
cd ..
```

### Bước 3: Cấu hình cơ sở dữ liệu

#### 3.1. Tạo database PostgreSQL

**Sử dụng psql command line:**

```bash
# Đăng nhập PostgreSQL (Windows/macOS/Linux)
psql -U postgres

# Tạo database
CREATE DATABASE ecommerce_farm;

# Tạo user (tùy chọn)
CREATE USER farm_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_farm TO farm_user;

# Thoát psql
\q
```

**Sử dụng pgAdmin (GUI):**

1. Mở pgAdmin
2. Kết nối đến PostgreSQL server
3. Tạo database mới với tên `ecommerce_farm`

#### 3.2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backendV2/`:

```bash
cd backendV2
```

Tạo file `.env` với nội dung:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=ecommerce_farm

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth (tùy chọn)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Cloudinary Configuration (tùy chọn)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=4200
```

### Bước 4: Cấu hình frontend

Tạo file `.env.local` trong thư mục `frontend/`:

```bash
cd frontend
```

Tạo file `.env.local` với nội dung:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4200/api

# Google Maps API (tùy chọn)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Environment
NODE_ENV=development
```

### Bước 5: Khởi động ứng dụng

#### 5.1. Khởi động cả backend và frontend cùng lúc (Khuyến nghị)

Từ thư mục root của dự án:

```bash
# Khởi động cả backend và frontend
npm run dev2

# Hoặc nếu dùng backend cũ
npm run dev
```

Ứng dụng sẽ chạy tại:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:4200](http://localhost:4200)

#### 5.2. Khởi động riêng lẻ

**Khởi động chỉ backend:**

```bash
npm run start:backendV2
```

**Khởi động chỉ frontend:**

```bash
npm run start:frontend
```

### Bước 6: Kiểm tra ứng dụng

#### 6.1. Kiểm tra frontend

1. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)
2. Bạn sẽ thấy trang chủ của hệ thống thương mại điện tử nông sản

#### 6.2. Kiểm tra backend API

1. Truy cập [http://localhost:4200](http://localhost:4200)
2. API documentation (nếu có Swagger): [http://localhost:4200/api/docs](http://localhost:4200/api/docs)

#### 6.3. Kiểm tra database

```bash
# Kết nối database để kiểm tra tables
psql -U postgres -d ecommerce_farm

# Liệt kê các table
\dt

# Thoát
\q
```

### Bước 7: Dữ liệu demo (Tùy chọn)

#### 7.1. Chạy migrations (nếu có)

```bash
cd backendV2
npm run migration:run
```

#### 7.2. Tài khoản demo

Sau khi khởi động thành công, bạn có thể:

- Đăng ký tài khoản mới
- Hoặc sử dụng tài khoản demo (nếu có seed data)

#### 7.3. Thanh toán demo (VNPay)

Sử dụng thông tin thẻ demo:

- **Ngân hàng**: NCB
- **Số thẻ**: 9704198526191432198
- **Tên chủ thẻ**: NGUYEN VAN A
- **Ngày phát hành**: 07/15
- **Mật khẩu OTP**: 123456

## Xử lý sự cố thường gặp

### 1. Lỗi kết nối database

```bash
# Kiểm tra PostgreSQL có chạy không
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Khởi động PostgreSQL nếu chưa chạy
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

### 2. Lỗi port đã được sử dụng

```bash
# Kiểm tra process đang sử dụng port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process nếu cần
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### 3. Lỗi npm install

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json
npm install

# Hoặc sử dụng npm cache clean
npm cache clean --force
```

### 4. Lỗi TypeScript

```bash
# Cài đặt lại TypeScript
npm install -g typescript

# Kiểm tra version
tsc --version
```

## Cấu trúc database

Hệ thống sử dụng PostgreSQL với các bảng chính:

- **Users**: Thông tin người dùng
- **Products**: Sản phẩm thuốc BVTV
- **Orders**: Đơn hàng
- **Categories**: Danh mục sản phẩm
- **Reviews**: Đánh giá sản phẩm
- **Inventories**: Thông tin kho hàng

## Tài khoản mặc định

Sau khi cài đặt thành công, bạn có thể:

1. Đăng ký tài khoản mới qua giao diện web
2. Đăng ký làm đại lý thông qua form đăng ký đại lý
3. Admin sẽ phê duyệt yêu cầu đăng ký đại lý

## Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt:

1. Kiểm tra các yêu cầu hệ thống
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra file .env đã được cấu hình đúng
4. Xem log lỗi trong terminal để debug

## Migration Commands

```bash
# Chạy migration
npx typeorm-ts-node-commonjs migration:run -d src/ormconfig.ts

# Tạo migration mới
npx typeorm-ts-node-commonjs migration:generate src/migrations/MigrationName -d src/ormconfig.ts
```
