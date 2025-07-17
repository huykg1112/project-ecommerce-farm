# Phân Tích Module Batch-Product

## Tổng Quan
Module `batch-product` là một thành phần quan trọng trong hệ thống quản lý nông dược, chịu trách nhiệm quản lý các lô sản phẩm (batch) với đầy đủ thông tin về số lượng, ngày sản xuất, hạn sử dụng và trạng thái kho.

## Cấu Trúc Module

### 1. Entity - BatchProduct
**File**: `entities/batch-product.entity.ts`

#### Thuộc tính chính:
- `batch_id`: UUID - Khóa chính duy nhất cho mỗi lô sản phẩm
- `batch_number`: string(50) - Số lô sản phẩm 
- `quantity`: int - Số lượng sản phẩm trong lô
- `manufactured_date`: date - Ngày sản xuất
- `expiry_date`: date - Ngày hết hạn
- `low_stock_threshold`: int (default: 10) - Ngưỡng cảnh báo hết hàng
- `is_active`: boolean (default: true) - Trạng thái hoạt động
- `is_deleted`: boolean (default: false) - Soft delete flag
- `created_at`, `updated_at`: timestamp - Thời gian tạo và cập nhật

#### Quan hệ (Relationships):
- **ManyToOne với Product**: Mỗi lô thuộc về một sản phẩm
- **ManyToOne với Inventory**: Mỗi lô thuộc về một kho
- **ManyToMany với ProductType**: Lô có thể thuộc nhiều loại sản phẩm
- **OneToMany với OrderDetail**: Một lô có thể có nhiều chi tiết đơn hàng
- **ManyToMany với Promotion**: Lô có thể tham gia nhiều chương trình khuyến mãi

### 2. DTOs (Data Transfer Objects)

#### CreateBatchProductDto
```typescript
{
  product_id?: string;        // UUID sản phẩm (optional)
  invenstory_id?: string;     // UUID kho (optional)
  batch_number: string;       // Số lô (required, max 50 chars)
  quantity?: number;          // Số lượng (min: 0)
  manufactured_date?: string; // Ngày sản xuất (optional)
  expiry_date: string;        // Ngày hết hạn (required)
  low_stock_threshold?: number; // Ngưỡng cảnh báo (optional)
  is_active?: boolean;        // Trạng thái (optional)
}
```

#### FilterBatchProductDto
```typescript
{
  product_id?: string;         // Lọc theo sản phẩm
  invenstory_id?: string;      // Lọc theo kho
  is_active?: boolean;         // Lọc theo trạng thái
  expiring_soon_days?: number; // Lọc sản phẩm sắp hết hạn (số ngày)
  low_stock?: boolean;         // Lọc sản phẩm sắp hết hàng
  batch_number?: string;       // Tìm kiếm theo số lô
  from_date?: string;          // Lọc từ ngày
  to_date?: string;           // Lọc đến ngày
}
```

#### UpdateBatchProductDto
```typescript
{
  batch_id: string;           // UUID lô cần cập nhật (required)
  product_id: string;         // UUID sản phẩm (required)
  batch_number: string;       // Số lô (required)
  quantity?: number;          // Số lượng mới
  manufactured_date?: string; // Ngày sản xuất mới
  expiry_date: string;        // Ngày hết hạn mới (required)
  low_stock_threshold?: number; // Ngưỡng cảnh báo mới
  is_active?: boolean;        // Trạng thái mới
}
```

### 3. Service - BatchProductService
**File**: `batch-product.service.ts`

#### Các phương thức chính:

##### CRUD Operations:
- `create(dto)`: Tạo lô sản phẩm mới
- `findAll(filter)`: Lấy danh sách lô với filter
- `findOne(id)`: Lấy thông tin một lô theo ID
- `update(id, dto)`: Cập nhật thông tin lô
- `updateBatchs(updateDatas)`: Cập nhật nhiều lô cùng lúc
- `remove(id)`: Xóa mềm một lô (soft delete)

##### Business Logic Methods:
- `findExpiringSoon(days)`: Tìm các lô sắp hết hạn trong số ngày nhất định
- `findLowStock()`: Tìm các lô có số lượng ≤ ngưỡng cảnh báo
- `decreaseQuantity(batchId, amount)`: Giảm số lượng trong lô (khi bán hàng)

##### Query Features:
- Lọc theo sản phẩm, kho, trạng thái
- Tìm kiếm theo số lô (LIKE search)
- Lọc theo khoảng thời gian hết hạn
- Cảnh báo sản phẩm sắp hết hạn/hết hàng
- Soft delete support

### 4. Controller - BatchProductController
**File**: `batch-product.controller.ts`

#### API Endpoints:

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/batch-product` | Tạo lô mới | Protected |
| GET | `/batch-product` | Lấy danh sách lô (có filter) | Public |
| PATCH | `/batch-product` | Cập nhật nhiều lô | Protected |
| GET | `/batch-product/expiring-soon?days=7` | Lô sắp hết hạn | Public |
| GET | `/batch-product/low-stock` | Lô sắp hết hàng | Protected |
| GET | `/batch-product/:id` | Chi tiết một lô | Protected |
| PATCH | `/batch-product/:id` | Cập nhật một lô | Protected |
| DELETE | `/batch-product/:id` | Xóa lô | Protected |
| PATCH | `/batch-product/:id/decrease-quantity` | Giảm số lượng | Protected |

### 5. Module Configuration
**File**: `batch-product.module.ts`

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([BatchProduct])],
  providers: [BatchProductService],
  controllers: [BatchProductController],
  exports: [BatchProductService], // Export service để các module khác sử dụng
})
```

## Tích Hợp Với Các Module Khác

### 1. Order Module
- Sử dụng `BatchProductService` để giảm số lượng khi có đơn hàng
- Import `BatchProductModule` và entity

### 2. Promotion Module
- Relationship ManyToMany để áp dụng khuyến mãi cho các lô
- API endpoint `POST /promotion/:id/batch-product` để gắn lô vào khuyến mãi

### 3. Product Module
- Mỗi lô thuộc về một sản phẩm
- Quan hệ ManyToOne

### 4. Inventory Module
- Mỗi lô thuộc về một kho
- Quan hệ ManyToOne

## Tính Năng Đặc Biệt

### 1. Quản Lý Hạn Sử Dụng
- Cảnh báo sản phẩm sắp hết hạn
- Lọc theo khoảng thời gian hết hạn
- API public để kiểm tra sản phẩm sắp hết hạn

### 2. Quản Lý Tồn Kho
- Ngưỡng cảnh báo hết hàng tùy chỉnh
- API để tìm sản phẩm sắp hết hàng
- Tự động giảm số lượng khi bán

### 3. Soft Delete
- Không xóa vĩnh viễn dữ liệu
- Đánh dấu `is_deleted = true`
- Queries tự động lọc bỏ bản ghi đã xóa

### 4. Batch Operations
- Cập nhật nhiều lô cùng lúc
- Hiệu quả cho việc import/export số lượng lớn

## Use Cases Chính

1. **Quản lý lô hàng mới**: Tạo lô khi nhập hàng mới
2. **Theo dõi hạn sử dụng**: Cảnh báo sản phẩm sắp hết hạn
3. **Quản lý tồn kho**: Theo dõi số lượng, cảnh báo hết hàng
4. **Xử lý đơn hàng**: Giảm số lượng khi bán hàng
5. **Áp dụng khuyến mãi**: Gắn lô vào chương trình khuyến mãi
6. **Báo cáo**: Thống kê theo lô, sản phẩm, kho

## Validation & Security
- Class-validator cho tất cả DTOs
- UUID validation cho IDs
- Date string validation
- Min/Max constraints cho số lượng
- Public endpoints chỉ cho việc xem thông tin cơ bản
- Protected endpoints cho các thao tác quan trọng

## Điểm Mạnh
1. **Flexible Filtering**: Hỗ trợ nhiều tiêu chí lọc phức tạp
2. **Business Logic**: Tích hợp logic nghiệp vụ như cảnh báo hết hạn/hết hàng
3. **Integration Ready**: Dễ dàng tích hợp với các module khác
4. **Data Integrity**: Soft delete và relationship constraints
5. **Performance**: Sử dụng QueryBuilder cho queries phức tạp

## Khuyến Nghị Cải Tiến
1. Thêm audit logging cho các thao tác quan trọng
2. Implement caching cho các queries thường xuyên
3. Thêm bulk operations cho hiệu suất tốt hơn
4. Validation business rules (ví dụ: ngày hết hạn > ngày sản xuất)
5. Thêm indexes cho database performance