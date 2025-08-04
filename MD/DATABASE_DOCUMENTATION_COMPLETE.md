# TÀI LIỆU MÔ TẢ CƠ SỞ DỮ LIỆU - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ THUỐC BẢO VỆ THỰC VẬT

## Mô tả các bảng dữ liệu bao gồm thuộc tính và các ràng buộc kèm theo

---

## **28 bảng chính được mô tả chi tiết:**

1. **USER** - Quản lý thông tin người dùng
2. **ROLE** - Phân quyền người dùng
3. **CATEGORY** - Danh mục sản phẩm
4. **PRODUCT** - Thông tin sản phẩm thuốc BVTV
5. **MANUFACTURER** - Nhà sản xuất
6. **ORDER** - Đơn hàng
7. **ORDER_DETAIL** - Chi tiết đơn hàng
8. **ORDER_STATUS** - Trạng thái đơn hàng
9. **PAYMENT_METHOD** - Phương thức thanh toán
10. **BATCH_PRODUCT** - Lô sản phẩm trong kho
11. **INVENSTORY** - Kho hàng
12. **STORE_OWNER_REQUEST** - Yêu cầu đăng ký làm chủ cửa hàng
13. **ADDRESS** - Địa chỉ người dùng
14. **VOUCHER** - Phiếu giảm giá
15. **REVIEW** - Đánh giá sản phẩm
16. **TOKEN** - Token xác thực
17. **DISEASE** - Bệnh hại thực vật
18. **PRODUCT_INGREDIENT** - Thành phần sản phẩm
19. **PRODUCT_DISEASE** - Bệnh hại mà sản phẩm điều trị
20. **PRODUCT_IMAGE** - Hình ảnh sản phẩm
21. **USER_VOUCHER** - Bảng trung gian User-Voucher
22. **PRODUCT_CATEGORY** - Bảng trung gian Product-Category
23. **ACTIVE_INGREDIENT** - Hoạt chất thuốc BVTV
24. **AI_CONSULTATION** - Tư vấn AI chẩn đoán bệnh hại
25. **TREATMENT_PLAN** - Kế hoạch điều trị chi tiết
26. **PRODUCT_TYPE** - Loại sản phẩm thuốc BVTV
27. **PROMOTION** - Khuyến mãi sản phẩm
28. **BATCH_PROMOTION** - Bảng trung gian BatchProduct-Promotion

---

## 1. BẢNG USER Rồi

**Mô tả**: Bảng lưu trữ thông tin của người dùng trong hệ thống

**Bảng 1.1: Bảng mô tả thuộc tính USER**

| STT | Tên Trường     | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | -------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | user_id        | uuid         | X          |            | Không     | Mã định danh người dùng               |
| 2   | username       | varchar(50)  |            |            | Không     | Tên đăng nhập của người dùng          |
| 3   | email          | varchar(100) |            |            | Không     | Địa chỉ email của người dùng          |
| 4   | password       | varchar(255) |            |            | Không     | Mật khẩu của người dùng               |
| 5   | full_name      | varchar(255) |            |            | Có        | Họ và tên đầy đủ của người dùng       |
| 6   | phone_number   | varchar(20)  |            |            | Có        | Số điện thoại của người dùng          |
| 7   | avatar         | varchar(255) |            |            | Có        | Đường dẫn ảnh đại diện                |
| 8   | avatarPublicId | varchar(255) |            |            | Có        | Public ID ảnh trên Cloudinary         |
| 9   | cccd           | varchar(12)  |            |            | Có        | Số căn cước công dân                  |
| 10  | is_active      | boolean      |            |            | Không     | Trạng thái hoạt động (mặc định: true) |
| 11  | created_at     | timestamp    |            |            | Không     | Thời gian tạo tài khoản               |
| 12  | updated_at     | timestamp    |            |            | Không     | Thời gian cập nhật cuối               |
| 13  | is_deleted     | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |
| 14  | role           | Role         |            | X          | Không     | Vai trò của người dùng                |

---

## 2. BẢNG ROLE Rồi

**Mô tả**: Bảng lưu trữ các vai trò trong hệ thống

**Bảng 2.1: Bảng mô tả thuộc tính ROLE**

| STT | Tên Trường  | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ----------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | role_id     | uuid         | X          |            | Không     | Mã định danh vai trò                  |
| 2   | role_name   | varchar(50)  |            |            | Có        | Tên vai trò                           |
| 3   | description | text         |            |            | Có        | Mô tả chi tiết vai trò                |
| 4   | is_active   | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 5   | created_at  | timestamp    |            |            | Không     | Thời gian tạo                         |
| 6   | updated_at  | timestamp    |            |            | Không     | Thời gian cập nhật                    |

---

## 3. BẢNG CATEGORY Rồi

**Mô tả**: Bảng lưu trữ danh mục sản phẩm

**Bảng 3.1: Bảng mô tả thuộc tính CATEGORY**

| STT | Tên Trường    | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | id            | uuid         | X          |            | Không     | Mã định danh danh mục                 |
| 2   | name          | varchar(100) |            |            | Không     | Tên danh mục                          |
| 3   | description   | varchar(255) |            |            | Có        | Mô tả danh mục                        |
| 4   | imageURL      | varchar(255) |            |            | Có        | Đường dẫn ảnh danh mục                |
| 5   | isActive      | boolean      |            |            | Không     | Trạng thái hoạt động (mặc định: true) |
| 6   | image         | varchar      |            |            | Có        | Ảnh danh mục                          |
| 7   | imagePublicId | varchar      |            |            | Có        | Public ID ảnh trên Cloudinary         |
| 8   | createdAt     | timestamp    |            |            | Không     | Thời gian tạo                         |
| 9   | updatedAt     | timestamp    |            |            | Có        | Thời gian cập nhật                    |
| 10  | isDeleted     | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 4. BẢNG PRODUCT Rồi

**Mô tả**: Bảng lưu trữ thông tin sản phẩm thuốc bảo vệ thực vật

**Bảng 4.1: Bảng mô tả thuộc tính PRODUCT**

| STT | Tên Trường         | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------------ | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | product_id         | uuid         | X          |            | Không     | Mã định danh sản phẩm                 |
| 2   | distributor        | User         |            | X          | Không     | Nhà phân phối sản phẩm                |
| 3   | product_name       | varchar(100) |            |            | Có        | Tên sản phẩm                          |
| 4   | description        | text         |            |            | Có        | Mô tả chi tiết sản phẩm               |
| 5   | usage_instructions | text         |            |            | Có        | Hướng dẫn sử dụng                     |
| 6   | is_active          | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 7   | created_at         | timestamp    |            |            | Không     | Thời gian tạo                         |
| 8   | updated_at         | timestamp    |            |            | Không     | Thời gian cập nhật                    |
| 9   | is_deleted         | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |
| 10  | unit_product_price | float        |            |            | Không     | Giá đơn vị sản phẩm (mặc định: 0)     |
| 11  | total_saled        | int          |            |            | Có        | Tổng số lượng đã bán                  |
| 12  | manufacturer       | Manufacturer |            | X          | Không     | Nhà sản xuất                          |

---

## 5. BẢNG MANUFACTURER Rồi

**Mô tả**: Bảng lưu trữ thông tin nhà sản xuất

**Bảng 5.1: Bảng mô tả thuộc tính MANUFACTURER**

| STT | Tên Trường   | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------ | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | id           | uuid         | X          |            | Không     | Mã định danh nhà sản xuất             |
| 2   | name         | varchar(100) |            |            | Không     | Tên nhà sản xuất                      |
| 3   | description  | varchar(255) |            |            | Có        | Mô tả nhà sản xuất                    |
| 4   | logo         | varchar(255) |            |            | Có        | Đường dẫn logo                        |
| 5   | logoPublicId | varchar(255) |            |            | Có        | Public ID logo trên Cloudinary        |
| 6   | isActive     | boolean      |            |            | Không     | Trạng thái hoạt động (mặc định: true) |
| 7   | createdAt    | timestamp    |            |            | Không     | Thời gian tạo                         |
| 8   | updatedAt    | timestamp    |            |            | Có        | Thời gian cập nhật                    |
| 9   | isDeleted    | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 6. BẢNG ORDER rồi

**Mô tả**: Bảng lưu trữ thông tin đơn hàng

**Bảng 6.1: Bảng mô tả thuộc tính ORDER**

| STT | Tên Trường              | Kiểu Dữ Liệu  | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | ----------------------- | ------------- | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | order_id                | uuid          | X          |            | Không     | Mã định danh đơn hàng                |
| 2   | order_code              | varchar(20)   |            |            | Không     | Mã đơn hàng                          |
| 3   | user                    | User          |            | X          | Không     | Khách hàng đặt hàng                  |
| 4   | distributor             | User          |            | X          | Không     | Nhà phân phối                        |
| 5   | status                  | OrderStatus   |            | X          | Không     | Trạng thái đơn hàng                  |
| 6   | payment_method          | PaymentMethod |            | X          | Không     | Phương thức thanh toán               |
| 7   | total_amount            | decimal(10,2) |            |            | Có        | Tổng giá trị đơn hàng                |
| 8   | notes                   | text          |            |            | Có        | Ghi chú đơn hàng                     |
| 9   | shipping_address        | text          |            |            | Có        | Địa chỉ giao hàng                    |
| 10  | estimated_delivery_date | timestamp     |            |            | Có        | Ngày giao hàng dự kiến               |
| 11  | created_at              | timestamp     |            |            | Không     | Thời gian tạo đơn                    |
| 12  | updated_at              | timestamp     |            |            | Không     | Thời gian cập nhật                   |
| 13  | is_deleted              | boolean       |            |            | Có        | Trạng thái xóa mềm (mặc định: false) |

---

## 7. BẢNG ORDER_DETAIL Rồi

**Mô tả**: Bảng lưu trữ chi tiết đơn hàng

**Bảng 7.1: Bảng mô tả thuộc tính ORDER_DETAIL**

| STT | Tên Trường      | Kiểu Dữ Liệu  | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | --------------- | ------------- | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | order_detail_id | uuid          | X          |            | Không     | Mã định danh chi tiết đơn hàng       |
| 2   | order           | Order         |            | X          | Không     | Đơn hàng                             |
| 3   | batch_product   | BatchProduct  |            | X          | Không     | Lô sản phẩm                          |
| 4   | quantity        | int           |            |            | Có        | Số lượng                             |
| 5   | unit_price      | decimal(10,2) |            |            | Có        | Đơn giá                              |
| 6   | subtotal        | decimal(10,2) |            |            | Có        | Thành tiền                           |
| 7   | notes           | text          |            |            | Có        | Ghi chú                              |
| 8   | created_at      | timestamp     |            |            | Không     | Thời gian tạo                        |
| 9   | updated_at      | timestamp     |            |            | Không     | Thời gian cập nhật                   |
| 10  | is_deleted      | boolean       |            |            | Có        | Trạng thái xóa mềm (mặc định: false) |

---

## 8. BẢNG ORDER_STATUS Rồi

**Mô tả**: Bảng lưu trữ các trạng thái đơn hàng

**Bảng 8.1: Bảng mô tả thuộc tính ORDER_STATUS**

| STT | Tên Trường  | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ----------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | status_id   | uuid         | X          |            | Không     | Mã định danh trạng thái               |
| 2   | status_name | varchar(50)  |            |            | Có        | Tên trạng thái                        |
| 3   | description | text         |            |            | Có        | Mô tả trạng thái                      |
| 4   | is_active   | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 5   | created_at  | timestamp    |            |            | Không     | Thời gian tạo                         |
| 6   | updated_at  | timestamp    |            |            | Không     | Thời gian cập nhật                    |

**Các trạng thái được định nghĩa sẵn:**

- PENDING: Chờ xác nhận
- CONFIRMED: Đã xác nhận
- SHIPPING: Đang giao hàng
- DELIVERED: Đã giao hàng
- CANCELLED: Đã hủy
- RETURNED: Đã trả hàng
- FAILED: Giao hàng thất bại
- REFUNDED: Đã hoàn tiền
- COMPLETED: Hoàn thành

---

## 9. BẢNG PAYMENT_METHOD Rồi

**Mô tả**: Bảng lưu trữ các phương thức thanh toán

**Bảng 9.1: Bảng mô tả thuộc tính PAYMENT_METHOD**

| STT | Tên Trường        | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ----------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | payment_method_id | uuid         | X          |            | Không     | Mã định danh phương thức thanh toán   |
| 2   | method_name       | varchar(50)  |            |            | Có        | Tên phương thức                       |
| 3   | description       | text         |            |            | Có        | Mô tả phương thức                     |
| 4   | is_active         | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 5   | created_at        | timestamp    |            |            | Không     | Thời gian tạo                         |
| 6   | updated_at        | timestamp    |            |            | Không     | Thời gian cập nhật                    |

---

## 10. BẢNG BATCH_PRODUCT Rồi

**Mô tả**: Bảng lưu trữ thông tin lô sản phẩm trong kho

**Bảng 10.1: Bảng mô tả thuộc tính BATCH_PRODUCT**

| STT | Tên Trường          | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                               |
| --- | ------------------- | ------------ | ---------- | ---------- | --------- | --------------------------------------- |
| 1   | batch_id            | uuid         | X          |            | Không     | Mã định danh lô sản phẩm                |
| 2   | product             | Product      |            | X          | Không     | Sản phẩm                                |
| 3   | invenstory          | Invenstory   |            | X          | Không     | Kho hàng                                |
| 4   | batch_number        | varchar(50)  |            |            | Không     | Số lô                                   |
| 5   | quantity            | int          |            |            | Có        | Số lượng                                |
| 6   | manufactured_date   | date         |            |            | Có        | Ngày sản xuất                           |
| 7   | expiry_date         | date         |            |            | Có        | Ngày hết hạn                            |
| 8   | low_stock_threshold | int          |            |            | Có        | Ngưỡng cảnh báo hết hàng (mặc định: 10) |
| 9   | unit_product_price  | float        |            |            | Không     | Giá đơn vị (mặc định: 0)                |
| 10  | is_active           | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true)   |
| 11  | created_at          | timestamp    |            |            | Không     | Thời gian tạo                           |
| 12  | updated_at          | timestamp    |            |            | Không     | Thời gian cập nhật                      |
| 13  | is_deleted          | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)    |
| 14  | product_types       | ProductType  |            | X          | Có        | Loại sản phẩm                           |

---

## 11. BẢNG INVENSTORY Rồi

**Mô tả**: Bảng lưu trữ thông tin kho hàng của nhà phân phối

**Bảng 11.1: Bảng mô tả thuộc tính INVENSTORY**

| STT | Tên Trường         | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------------ | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | invenstory_id      | uuid         | X          |            | Không     | Mã định danh kho                      |
| 2   | distributor        | User         |            | X          | Có        | Chủ kho (nhà phân phối)               |
| 3   | name               | varchar(255) |            |            | Có        | Tên cửa hàng/kho                      |
| 4   | business_license   | varchar(255) |            |            | Có        | Giấy phép kinh doanh                  |
| 5   | invenstory_address | varchar(255) |            |            | Có        | Địa chỉ kho                           |
| 6   | invenstory_lat     | decimal(9,6) |            |            | Có        | Vĩ độ                                 |
| 7   | invenstory_lng     | decimal(9,6) |            |            | Có        | Kinh độ                               |
| 8   | invenstory_img     | varchar(255) |            |            | Có        | Ảnh kho                               |
| 9   | is_active          | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 10  | is_deleted         | boolean      |            |            | Có        | Trạng thái xóa mềm (mặc định: false)  |

---

## 12. BẢNG STORE_OWNER_REQUEST rồi

**Mô tả**: Bảng lưu trữ yêu cầu đăng ký làm chủ cửa hàng

**Bảng 12.1: Bảng mô tả thuộc tính STORE_OWNER_REQUEST**

| STT | Tên Trường             | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | ---------------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | store_owner_request_id | uuid         | X          |            | Không     | Mã định danh yêu cầu                 |
| 2   | user                   | User         |            | X          | Không     | Người dùng gửi yêu cầu               |
| 3   | request_date           | timestamp    |            |            | Không     | Ngày gửi yêu cầu                     |
| 4   | request_status         | boolean      |            |            | Không     | Trạng thái yêu cầu (mặc định: false) |
| 5   | approved_date          | timestamp    |            |            | Có        | Ngày phê duyệt                       |
| 6   | name                   | varchar(255) |            |            | Không     | Tên cửa hàng                         |
| 7   | business_license       | varchar(255) |            |            | Không     | Giấy phép kinh doanh                 |
| 8   | invenstory_address     | varchar(255) |            |            | Không     | Địa chỉ kho                          |
| 9   | invenstory_lat         | decimal(9,6) |            |            | Có        | Vĩ độ                                |
| 10  | invenstory_lng         | decimal(9,6) |            |            | Có        | Kinh độ                              |
| 11  | invenstory_img         | varchar(255) |            |            | Có        | Ảnh kho                              |
| 12  | is_deleted             | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false) |
| 13  | created_at             | timestamp    |            |            | Không     | Thời gian tạo                        |

---

## 13. BẢNG ADDRESS Rồi

**Mô tả**: Bảng lưu trữ địa chỉ của người dùng

**Bảng 13.1: Bảng mô tả thuộc tính ADDRESS**

| STT | Tên Trường     | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | -------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | address_id     | uuid         | X          |            | Không     | Mã định danh địa chỉ                  |
| 2   | user           | User         |            | X          | Không     | Người dùng sở hữu                     |
| 3   | address_detail | varchar(500) |            |            | Có        | Chi tiết địa chỉ                      |
| 4   | latitude       | decimal(9,6) |            |            | Có        | Vĩ độ                                 |
| 5   | longitude      | decimal(9,6) |            |            | Có        | Kinh độ                               |
| 6   | is_default     | boolean      |            |            | Có        | Địa chỉ mặc định (mặc định: false)    |
| 7   | is_active      | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 8   | is_deleted     | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |
| 9   | created_at     | timestamp    |            |            | Không     | Thời gian tạo                         |
| 10  | updated_at     | timestamp    |            |            | Không     | Thời gian cập nhật                    |

---

## 14. BẢNG VOUCHER Rồi

**Mô tả**: Bảng lưu trữ thông tin phiếu giảm giá

**Bảng 14.1: Bảng mô tả thuộc tính VOUCHER**

| STT | Tên Trường         | Kiểu Dữ Liệu  | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------------ | ------------- | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | voucher_id         | uuid          | X          |            | Không     | Mã định danh voucher                  |
| 2   | voucher_code       | varchar(50)   |            |            | Không     | Mã voucher                            |
| 3   | min_order_value    | decimal(10,2) |            |            | Có        | Giá trị đơn hàng tối thiểu            |
| 4   | max_discount_value | decimal(10,2) |            |            | Có        | Giá trị giảm tối đa                   |
| 5   | usage_limit        | int           |            |            | Có        | Giới hạn sử dụng                      |
| 6   | used_count         | int           |            |            | Có        | Số lần đã sử dụng (mặc định: 0)       |
| 7   | start_date         | timestamp     |            |            | Có        | Ngày bắt đầu                          |
| 8   | end_date           | timestamp     |            |            | Có        | Ngày kết thúc                         |
| 9   | is_active          | boolean       |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 10  | created_at         | timestamp     |            |            | Không     | Thời gian tạo                         |
| 11  | updated_at         | timestamp     |            |            | Không     | Thời gian cập nhật                    |
| 12  | is_deleted         | boolean       |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 15. BẢNG REVIEW Rồi

**Mô tả**: Bảng lưu trữ đánh giá sản phẩm và phản hồi

**Bảng 15.1: Bảng mô tả thuộc tính REVIEW**

| STT | Tên Trường    | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | ------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | review_id     | uuid         | X          |            | Không     | Mã định danh đánh giá                |
| 2   | product       | Product      |            | X          | Không     | Sản phẩm được đánh giá               |
| 3   | user          | User         |            | X          | Có        | Người dùng đánh giá                  |
| 4   | distributor   | User         |            | X          | Có        | Nhà phân phối phản hồi               |
| 5   | parent_review | Review       |            | X          | Có        | Đánh giá gốc (nếu là phản hồi)       |
| 6   | rating        | int          |            |            | Có        | Điểm đánh giá (1-5)                  |
| 7   | comment       | text         |            |            | Có        | Nội dung bình luận                   |
| 8   | created_at    | timestamp    |            |            | Không     | Thời gian tạo                        |
| 9   | updated_at    | timestamp    |            |            | Không     | Thời gian cập nhật                   |
| 10  | is_deleted    | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false) |

---

## 16. BẢNG TOKEN Rồi

**Mô tả**: Bảng lưu trữ token xác thực của người dùng

**Bảng 16.1: Bảng mô tả thuộc tính TOKEN**

| STT | Tên Trường               | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                       |
| --- | ------------------------ | ------------ | ---------- | ---------- | --------- | ------------------------------- |
| 1   | id                       | uuid         | X          |            | Không     | Mã định danh token              |
| 2   | access_token             | varchar(500) |            |            | Có        | Access token                    |
| 3   | access_token_expires_at  | timestamp    |            |            | Có        | Thời gian hết hạn access token  |
| 4   | refresh_token            | varchar(500) |            |            | Có        | Refresh token                   |
| 5   | refresh_token_expires_at | timestamp    |            |            | Có        | Thời gian hết hạn refresh token |
| 6   | user                     | User         |            | X          | Không     | Người dùng sở hữu token         |

---

## 17. BẢNG DISEASE rồi

**Mô tả**: Bảng lưu trữ thông tin bệnh hại thực vật

**Bảng 17.1: Bảng mô tả thuộc tính DISEASE**

| STT | Tên Trường   | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | ------------ | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | disease_id   | uuid         | X          |            | Không     | Mã định danh bệnh hại                 |
| 2   | disease_name | varchar(100) |            |            | Có        | Tên bệnh hại                          |
| 3   | description  | text         |            |            | Có        | Mô tả bệnh hại                        |
| 4   | is_active    | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 5   | created_at   | timestamp    |            |            | Không     | Thời gian tạo                         |
| 6   | updated_at   | timestamp    |            |            | Không     | Thời gian cập nhật                    |
| 7   | is_deleted   | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 18. BẢNG PRODUCT_INGREDIENT oke

**Mô tả**: Bảng trung gian lưu trữ thành phần của sản phẩm

**Bảng 18.1: Bảng mô tả thuộc tính PRODUCT_INGREDIENT**

| STT | Tên Trường    | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                          |
| --- | ------------- | ------------ | ---------- | ---------- | --------- | ---------------------------------- |
| 1   | product_id    | uuid         | X          | X          | Không     | Mã sản phẩm                        |
| 2   | ingredient_id | uuid         | X          | X          | Không     | Mã thành phần                      |
| 3   | concentration | decimal(5,2) |            |            | Có        | Nồng độ thành phần                 |
| 4   | is_primary    | boolean      |            |            | Có        | Thành phần chính (mặc định: false) |
| 5   | created_at    | timestamp    |            |            | Không     | Thời gian tạo                      |

---

## 19. BẢNG PRODUCT_DISEASE oke

**Mô tả**: Bảng trung gian lưu trữ bệnh hại mà sản phẩm có thể điều trị

**Bảng 19.1: Bảng mô tả thuộc tính PRODUCT_DISEASE**

| STT | Tên Trường | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | product_id | uuid         | X          | X          | Không     | Mã sản phẩm                          |
| 2   | disease_id | uuid         | X          | X          | Không     | Mã bệnh hại                          |
| 3   | is_primary | boolean      |            |            | Không     | Đặc trị hay hỗ trợ (mặc định: false) |
| 4   | created_at | timestamp    |            |            | Không     | Thời gian tạo                        |

---

## 20. BẢNG PRODUCT_IMAGE oke

**Mô tả**: Bảng lưu trữ hình ảnh sản phẩm

**Bảng 20.1: Bảng mô tả thuộc tính PRODUCT_IMAGE**

| STT | Tên Trường       | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                 |
| --- | ---------------- | ------------ | ---------- | ---------- | --------- | ------------------------- |
| 1   | product_image_id | uuid         | X          |            | Không     | Mã định danh ảnh sản phẩm |
| 2   | product          | Product      |            | X          | Không     | Sản phẩm                  |
| 3   | image_url        | varchar(255) |            |            | Không     | Đường dẫn ảnh             |
| 4   | description      | text         |            |            | Có        | Mô tả ảnh                 |
| 5   | created_at       | timestamp    |            |            | Không     | Thời gian tạo             |

---

## 21. BẢNG TRUNG GIAN USER_VOUCHER oke

**Mô tả**: Bảng trung gian Many-to-Many giữa User và Voucher

**Bảng 21.1: Bảng mô tả thuộc tính USER_VOUCHER**

| STT | Tên Trường | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải     |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | ------------- |
| 1   | user_id    | uuid         | X          | X          | Không     | Mã người dùng |
| 2   | voucher_id | uuid         | X          | X          | Không     | Mã voucher    |

---

## 22. BẢNG TRUNG GIAN PRODUCT_CATEGORY

**Mô tả**: Bảng trung gian Many-to-Many giữa Product và Category

**Bảng 22.1: Bảng mô tả thuộc tính PRODUCT_CATEGORY**

| STT | Tên Trường  | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải   |
| --- | ----------- | ------------ | ---------- | ---------- | --------- | ----------- |
| 1   | product_id  | uuid         | X          | X          | Không     | Mã sản phẩm |
| 2   | category_id | uuid         | X          | X          | Không     | Mã danh mục |

---

## 23. BẢNG ACTIVE_INGREDIENT rồi

**Mô tả**: Bảng lưu trữ thông tin hoạt chất trong thuốc bảo vệ thực vật

**Bảng 23.1: Bảng mô tả thuộc tính ACTIVE_INGREDIENT**

| STT | Tên Trường      | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | --------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | ingredient_id   | uuid         | X          |            | Không     | Mã định danh hoạt chất                |
| 2   | ingredient_name | varchar(100) |            |            | Có        | Tên hoạt chất                         |
| 3   | description     | text         |            |            | Có        | Mô tả hoạt chất                       |
| 4   | hazard_level    | varchar(50)  |            |            | Có        | Mức độ nguy hiểm                      |
| 5   | is_active       | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 6   | created_at      | timestamp    |            |            | Không     | Thời gian tạo                         |
| 7   | updated_at      | timestamp    |            |            | Không     | Thời gian cập nhật                    |
| 8   | is_deleted      | boolean      |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 24. BẢNG AI_CONSULTATION rồi

**Mô tả**: Bảng lưu trữ thông tin tư vấn AI cho việc chẩn đoán và điều trị bệnh hại

**Bảng 24.1: Bảng mô tả thuộc tính AI_CONSULTATION**

| STT | Tên Trường                | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                                 |
| --- | ------------------------- | ------------ | ---------- | ---------- | --------- | ----------------------------------------- |
| 1   | consultation_id           | uuid         | X          |            | Không     | Mã định danh phiên tư vấn                 |
| 2   | crop_type                 | varchar(100) |            |            | Có        | Loại cây trồng                            |
| 3   | symptom_description       | text         |            |            | Có        | Mô tả triệu chứng                         |
| 4   | growth_stage              | varchar(50)  |            |            | Có        | Giai đoạn sinh trưởng                     |
| 5   | recommended_treatment     | text         |            |            | Có        | Phương pháp điều trị được đề xuất         |
| 6   | severity_level            | varchar(50)  |            |            | Có        | Mức độ nghiêm trọng (nhẹ/trung bình/nặng) |
| 7   | recommended_name_products | simple-array |            |            | Có        | Danh sách sản phẩm đề xuất                |
| 8   | treatment_duration        | int          |            |            | Có        | Thời gian điều trị (số ngày)              |
| 9   | prevention_tips           | simple-array |            |            | Có        | Mẹo phòng ngừa                            |
| 10  | monitoring_signs          | simple-array |            |            | Có        | Dấu hiệu cần theo dõi                     |
| 11  | user                      | User         |            | X          | Có        | Người dùng yêu cầu tư vấn                 |
| 12  | disease                   | Disease      |            | X          | Có        | Bệnh hại được chẩn đoán                   |
| 13  | created_at                | timestamp    |            |            | Không     | Thời gian tạo                             |
| 14  | updated_at                | timestamp    |            |            | Không     | Thời gian cập nhật                        |
| 15  | is_deleted                | boolean      |            |            | Có        | Trạng thái xóa mềm (mặc định: false)      |

---

## 25. BẢNG TREATMENT_PLAN rồi

**Mô tả**: Bảng lưu trữ kế hoạch điều trị chi tiết theo từng ngày

**Bảng 25.1: Bảng mô tả thuộc tính TREATMENT_PLAN**

| STT | Tên Trường            | Kiểu Dữ Liệu   | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                            |
| --- | --------------------- | -------------- | ---------- | ---------- | --------- | ------------------------------------ |
| 1   | treatment_plan_id     | uuid           | X          |            | Không     | Mã định danh kế hoạch điều trị       |
| 2   | consultation          | AiConsultation |            | X          | Có        | Phiên tư vấn AI                      |
| 3   | day_number            | int            |            |            | Có        | Ngày thứ mấy trong kế hoạch điều trị |
| 4   | treatment_instruction | text           |            |            | Không     | Hướng dẫn điều trị                   |
| 5   | dosage_instruction    | text           |            |            | Có        | Hướng dẫn liều lượng                 |
| 6   | frequency             | varchar(50)    |            |            | Có        | Tần suất sử dụng                     |
| 7   | product               | Product        |            | X          | Có        | Sản phẩm sử dụng                     |
| 8   | created_at            | timestamp      |            |            | Không     | Thời gian tạo                        |
| 9   | updated_at            | timestamp      |            |            | Không     | Thời gian cập nhật                   |
| 10  | is_deleted            | boolean        |            |            | Không     | Trạng thái xóa mềm (mặc định: false) |

---

## 26. BẢNG PRODUCT_TYPE rồi

**Mô tả**: Bảng lưu trữ các loại sản phẩm thuốc bảo vệ thực vật

**Bảng 26.1: Bảng mô tả thuộc tính PRODUCT_TYPE**

| STT | Tên Trường      | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | --------------- | ------------ | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | product_type_id | uuid         | X          |            | Không     | Mã định danh loại sản phẩm            |
| 2   | type_name       | varchar(50)  |            |            | Có        | Tên loại sản phẩm                     |
| 3   | description     | text         |            |            | Có        | Mô tả loại sản phẩm                   |
| 4   | is_active       | boolean      |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 5   | created_at      | timestamp    |            |            | Không     | Thời gian tạo                         |
| 6   | updated_at      | timestamp    |            |            | Không     | Thời gian cập nhật                    |

---

## 27. BẢNG PROMOTION rồi

**Mô tả**: Bảng lưu trữ thông tin khuyến mãi cho các lô sản phẩm

**Bảng 27.1: Bảng mô tả thuộc tính PROMOTION**

| STT | Tên Trường     | Kiểu Dữ Liệu  | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải                             |
| --- | -------------- | ------------- | ---------- | ---------- | --------- | ------------------------------------- |
| 1   | promotion_id   | uuid          | X          |            | Không     | Mã định danh khuyến mãi               |
| 2   | created_by     | User          |            | X          | Không     | Nhà phân phối tạo khuyến mãi          |
| 3   | promotion_name | varchar(100)  |            |            | Có        | Tên chương trình khuyến mãi           |
| 4   | description    | text          |            |            | Có        | Mô tả khuyến mãi                      |
| 5   | discount_value | decimal(10,2) |            |            | Có        | Giá trị giảm giá                      |
| 6   | start_date     | timestamp     |            |            | Có        | Ngày bắt đầu                          |
| 7   | end_date       | timestamp     |            |            | Có        | Ngày kết thúc                         |
| 8   | is_active      | boolean       |            |            | Có        | Trạng thái hoạt động (mặc định: true) |
| 9   | created_at     | timestamp     |            |            | Không     | Thời gian tạo                         |
| 10  | updated_at     | timestamp     |            |            | Không     | Thời gian cập nhật                    |
| 11  | is_deleted     | boolean       |            |            | Không     | Trạng thái xóa mềm (mặc định: false)  |

---

## 28. BẢNG TRUNG GIAN BATCH_PROMOTION oke

**Mô tả**: Bảng trung gian Many-to-Many giữa BatchProduct và Promotion

**Bảng 28.1: Bảng mô tả thuộc tính BATCH_PROMOTION**

| STT | Tên Trường   | Kiểu Dữ Liệu | Khóa Chính | Khóa Ngoại | Được Rỗng | Diễn Giải      |
| --- | ------------ | ------------ | ---------- | ---------- | --------- | -------------- |
| 1   | batch_id     | uuid         | X          | X          | Không     | Mã lô sản phẩm |
| 2   | promotion_id | uuid         | X          | X          | Không     | Mã khuyến mãi  |

---

## CÁC RÀNG BUỘC DỮ LIỆU

### Ràng buộc khóa ngoại:

1. **User.role** → **Role.role_id**: Mỗi người dùng phải có một vai trò
2. **Address.user** → **User.user_id**: Mỗi địa chỉ thuộc về một người dùng
3. **Token.user** → **User.user_id**: Mỗi token thuộc về một người dùng
4. **Product.distributor** → **User.user_id**: Mỗi sản phẩm có một nhà phân phối
5. **Product.manufacturer** → **Manufacturer.id**: Mỗi sản phẩm có một nhà sản xuất
6. **Order.user** → **User.user_id**: Mỗi đơn hàng có một khách hàng
7. **Order.distributor** → **User.user_id**: Mỗi đơn hàng có một nhà phân phối
8. **Order.status** → **OrderStatus.status_id**: Mỗi đơn hàng có một trạng thái
9. **Order.payment_method** → **PaymentMethod.payment_method_id**: Mỗi đơn hàng có một phương thức thanh toán
10. **OrderDetail.order** → **Order.order_id**: Mỗi chi tiết đơn hàng thuộc về một đơn hàng
11. **OrderDetail.batch_product** → **BatchProduct.batch_id**: Mỗi chi tiết đơn hàng có một lô sản phẩm
12. **BatchProduct.product** → **Product.product_id**: Mỗi lô sản phẩm thuộc về một sản phẩm
13. **BatchProduct.invenstory** → **Invenstory.invenstory_id**: Mỗi lô sản phẩm thuộc về một kho
14. **Invenstory.distributor** → **User.user_id**: Mỗi kho có một chủ sở hữu
15. **StoreOwnerRequest.user** → **User.user_id**: Mỗi yêu cầu thuộc về một người dùng
16. **Review.product** → **Product.product_id**: Mỗi đánh giá thuộc về một sản phẩm
17. **Review.user** → **User.user_id**: Mỗi đánh giá có một người đánh giá
18. **Review.distributor** → **User.user_id**: Mỗi phản hồi có một nhà phân phối
19. **Review.parent_review** → **Review.review_id**: Đánh giá phản hồi liên kết với đánh giá gốc
20. **ProductIngredient.product** → **Product.product_id**: Liên kết sản phẩm với thành phần
21. **ProductIngredient.ingredient** → **ActiveIngredient.ingredient_id**: Liên kết với hoạt chất
22. **ProductDisease.product** → **Product.product_id**: Liên kết sản phẩm với bệnh hại
23. **ProductDisease.disease** → **Disease.disease_id**: Liên kết với bệnh hại
24. **ProductImage.product** → **Product.product_id**: Mỗi ảnh thuộc về một sản phẩm
25. **AiConsultation.user** → **User.user_id**: Mỗi phiên tư vấn thuộc về một người dùng
26. **AiConsultation.disease** → **Disease.disease_id**: Mỗi phiên tư vấn liên kết với một bệnh hại
27. **TreatmentPlan.consultation** → **AiConsultation.consultation_id**: Mỗi kế hoạch điều trị thuộc về một phiên tư vấn
28. **TreatmentPlan.product** → **Product.product_id**: Mỗi bước điều trị có thể sử dụng một sản phẩm
29. **BatchProduct.product_types** → **ProductType.product_type_id**: Mỗi lô sản phẩm có một loại sản phẩm
30. **Promotion.created_by** → **User.user_id**: Mỗi khuyến mãi có một người tạo

### Ràng buộc duy nhất:

1. **User.username**: Tên đăng nhập không được trùng lặp
2. **User.email**: Email không được trùng lặp
3. **Voucher.voucher_code**: Mã voucher không được trùng lặp
4. **Order.order_code**: Mã đơn hàng không được trùng lặp
5. **BatchProduct.batch_number**: Số lô không được trùng lặp trong cùng một sản phẩm
6. **ActiveIngredient.ingredient_name**: Tên hoạt chất không được trùng lặp
7. **Disease.disease_name**: Tên bệnh hại không được trùng lặp
8. **ProductType.type_name**: Tên loại sản phẩm không được trùng lặp

### Ràng buộc kiểm tra:

1. **Review.rating**: Giá trị từ 1 đến 5
2. **User.is_active**: Chỉ có thể là true hoặc false
3. **Product.unit_product_price**: Giá trị >= 0
4. **BatchProduct.quantity**: Giá trị >= 0
5. **Voucher.used_count**: Giá trị >= 0 và <= usage_limit
6. **ProductIngredient.concentration**: Giá trị từ 0 đến 100
7. **AiConsultation.treatment_duration**: Giá trị >= 0 (số ngày điều trị)
8. **TreatmentPlan.day_number**: Giá trị >= 1 (ngày thứ mấy trong kế hoạch)
9. **Promotion.discount_value**: Giá trị >= 0 (giá trị giảm giá)
10. **ActiveIngredient.hazard_level**: Chỉ cho phép các giá trị: "Thấp", "Trung bình", "Cao", "Rất cao"

### Ràng buộc tham chiếu:

1. **CASCADE DELETE**: Khi xóa Product sẽ xóa ProductDisease và ProductIngredient liên quan
2. **SET NULL**: Khi xóa User thì các Review sẽ set user_id = NULL
3. **RESTRICT**: Không cho phép xóa Role nếu còn User sử dụng
4. **CASCADE**: Khi xóa AiConsultation sẽ xóa các TreatmentPlan liên quan

---

_Tài liệu được tạo tự động từ Entity TypeORM - Phiên bản 2.0_
