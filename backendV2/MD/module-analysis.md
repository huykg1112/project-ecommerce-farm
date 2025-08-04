# Phân tích các Module trong BackendV2

## Tổng quan hệ thống

Hệ thống BackendV2 là một ứng dụng NestJS quản lý đơn hàng và sản phẩm, có vẻ như dành cho lĩnh vực nông nghiệp (thuốc bảo vệ thực vật). Dưới đây là phân tích chi tiết 5 module chính:

## 1. Module Order (Đơn hàng)

### Mục đích
- Quản lý đơn hàng của khách hàng
- Xử lý quy trình đặt hàng từ tạo đến hoàn thành
- Kết nối khách hàng với nhà phân phối

### Cấu trúc Entity
```typescript
- order_id: UUID (Primary Key)
- order_code: string (Mã đơn hàng duy nhất)
- user: User (Khách hàng đặt hàng)
- distributor: User (Nhà phân phối)
- status: OrderStatus (Trạng thái đơn hàng)
- payment_method: PaymentMethod (Phương thức thanh toán)
- total_amount: decimal (Tổng tiền)
- notes: text (Ghi chú)
- shipping_address: text (Địa chỉ giao hàng)
- estimated_delivery_date: timestamp (Ngày giao hàng dự kiến)
- order_details: OrderDetail[] (Chi tiết đơn hàng)
```

### Chức năng chính
- Tạo đơn hàng mới với mã tự động
- Lấy danh sách đơn hàng theo user/distributor
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng
- Thống kê đơn hàng theo trạng thái và doanh thu

## 2. Module Order-Detail (Chi tiết đơn hàng)

### Mục đích
- Lưu trữ thông tin chi tiết từng sản phẩm trong đơn hàng
- Kết nối đơn hàng với các lô sản phẩm cụ thể
- Tính toán giá tiền cho từng item

### Cấu trúc Entity
```typescript
- order_detail_id: UUID (Primary Key)
- order: Order (Đơn hàng)
- batch_product: BatchProduct (Lô sản phẩm)
- quantity: int (Số lượng)
- unit_price: decimal (Đơn giá)
- subtotal: decimal (Thành tiền)
- notes: text (Ghi chú)
```

### Chức năng chính
- Tạo chi tiết đơn hàng với validation số lượng
- Kiểm tra tồn kho và hạn sử dụng
- Tính toán tự động subtotal
- Tạo hàng loạt chi tiết đơn hàng
- Tính tổng tiền theo order_id

## 3. Module Order-Status (Trạng thái đơn hàng)

### Mục đích
- Quản lý các trạng thái của đơn hàng
- Theo dõi quy trình xử lý đơn hàng
- Tự động tạo các trạng thái mặc định

### Cấu trúc Entity
```typescript
- status_id: UUID (Primary Key)
- status_name: string (Tên trạng thái)
- description: text (Mô tả)
- is_active: boolean (Trạng thái hoạt động)
```

### Các trạng thái được định nghĩa
- **PENDING**: Chờ xác nhận
- **CONFIRMED**: Đã xác nhận
- **SHIPPING**: Đang giao hàng
- **DELIVERED**: Đã giao hàng
- **CANCELLED**: Đã hủy
- **RETURNED**: Đã trả hàng
- **FAILED**: Giao hàng thất bại
- **REFUNDED**: Đã hoàn tiền
- **COMPLETED**: Hoàn thành

### Chức năng chính
- Tạo tự động các trạng thái mặc định
- Cập nhật trạng thái đơn hàng
- Quản lý trạng thái hoạt động/không hoạt động

## 4. Module Payment-Method (Phương thức thanh toán)

### Mục đích
- Quản lý các phương thức thanh toán
- Hỗ trợ thanh toán COD và VNPay
- Chuẩn bị tích hợp thanh toán online

### Cấu trúc Entity
```typescript
- payment_method_id: UUID (Primary Key)
- method_name: string (Tên phương thức)
- description: text (Mô tả)
- is_active: boolean (Trạng thái hoạt động)
```

### Phương thức thanh toán hỗ trợ
- **COD**: Thanh toán khi nhận hàng
- **VNPAY**: Thanh toán trực tuyến qua VNPay

### Chức năng chính
- Tạo phương thức thanh toán mới
- Tạo tự động phương thức mặc định
- Validation chỉ cho phép COD và VNPAY
- Chuẩn bị tích hợp VNPay API

## 5. Module Batch-Product (Lô sản phẩm)

### Mục đích
- Quản lý lô hàng theo từng batch
- Theo dõi hạn sử dụng và tồn kho
- Kết nối với inventory và sản phẩm

### Cấu trúc Entity
```typescript
- batch_id: UUID (Primary Key)
- product: Product (Sản phẩm)
- invenstory: Invenstory (Kho hàng)
- batch_number: string (Số lô)
- quantity: int (Số lượng)
- manufactured_date: date (Ngày sản xuất)
- expiry_date: date (Ngày hết hạn)
- low_stock_threshold: int (Ngưỡng cảnh báo tồn kho)
- is_active: boolean (Trạng thái hoạt động)
- product_types: ProductType[] (Loại sản phẩm)
- order_details: OrderDetail[] (Chi tiết đơn hàng)
- promotions: Promotion[] (Khuyến mãi)
```

### Chức năng chính
- Tạo và quản lý lô sản phẩm
- Theo dõi sản phẩm sắp hết hạn
- Cảnh báo tồn kho thấp
- Giảm số lượng khi có đơn hàng
- Lọc theo nhiều tiêu chí

## Mối quan hệ giữa các Module

### Luồng xử lý đơn hàng
1. **Khách hàng** tạo đơn hàng → **Order**
2. **Order** có trạng thái mặc định PENDING → **Order-Status**
3. **Order** chọn phương thức thanh toán → **Payment-Method**
4. **Order** chứa nhiều chi tiết → **Order-Detail**
5. **Order-Detail** tham chiếu đến lô sản phẩm → **Batch-Product**

### Sơ đồ quan hệ
```
Order (1) ←→ (n) Order-Detail (n) ←→ (1) Batch-Product
  ↓                                        ↓
Order-Status                           Product + Inventory
  ↓
Payment-Method
```

### Quy trình nghiệp vụ
1. **Tạo đơn hàng**: Khách hàng chọn sản phẩm từ batch, hệ thống tạo Order và Order-Detail
2. **Xác nhận**: Nhà phân phối xác nhận đơn hàng, cập nhật status thành CONFIRMED
3. **Thanh toán**: Xử lý thanh toán qua COD hoặc VNPay
4. **Giao hàng**: Cập nhật trạng thái SHIPPING → DELIVERED
5. **Hoàn thành**: Trạng thái COMPLETED, giảm số lượng trong batch

## Đặc điểm kỹ thuật

### Công nghệ sử dụng
- **Framework**: NestJS với TypeScript
- **Database**: TypeORM với PostgreSQL
- **Validation**: class-validator, class-transformer
- **Authentication**: JWT (có thể)

### Tính năng nổi bật
- **Soft Delete**: Sử dụng is_deleted thay vì xóa thật
- **UUID**: Sử dụng UUID cho tất cả primary key
- **Timestamp**: Tự động theo dõi created_at, updated_at
- **Validation**: Validation nghiêm ngặt cho tất cả input
- **Relationship**: Sử dụng TypeORM relations hiệu quả

### Điểm mạnh
- Kiến trúc module rõ ràng, dễ bảo trì
- Validation đầy đủ và xử lý lỗi tốt
- Hỗ trợ nhiều tính năng nâng cao (thống kê, filter, pagination)
- Chuẩn bị sẵn cho tích hợp thanh toán online

### Điểm cần cải thiện
- Cần hoàn thiện tích hợp VNPay
- Có thể thêm logging và monitoring
- Cần thêm unit tests
- Có thể tối ưu performance với caching

## Kết luận

Hệ thống được thiết kế khá hoàn chỉnh cho một ứng dụng e-commerce B2B trong lĩnh vực nông nghiệp. Các module có mối quan hệ chặt chẽ và hỗ trợ đầy đủ quy trình từ đặt hàng đến giao hàng. Kiến trúc module rõ ràng giúp dễ dàng mở rộng và bảo trì trong tương lai.