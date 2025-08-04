# Tài liệu mô tả chi tiết các module trong hệ thống sàn TMĐT bán thuốc bảo vệ thực vật

## Tổng quan
Hệ thống sàn thương mại điện tử (TMĐT) bán thuốc bảo vệ thực vật (BVTV) được thiết kế để kết nối nông dân với các đại lý, hỗ trợ mua bán sản phẩm, quản lý kho hàng, và cung cấp tư vấn AI về bệnh cây trồng. Cơ sở dữ liệu sử dụng **PostgreSQL** với **UUID** làm khóa chính (trừ trường hợp ERD sử dụng Integer như đã cung cấp), đảm bảo khả năng mở rộng và bảo mật. Các module được tổ chức theo nguyên tắc **atomic** và chuẩn hóa **3NF**, giảm dư thừa dữ liệu và đảm bảo tính toàn vẹn.

Tài liệu này mô tả chi tiết 28 module chính, được sắp xếp từ **module rìa** (ít phụ thuộc, tương tác trực tiếp với người dùng hoặc hệ thống bên ngoài) đến **module lõi** (phụ thuộc nhiều, trung tâm của hệ thống). Mỗi module được trình bày với:
- **Công dụng**: Vai trò tổng quát trong hệ thống.
- **Chức năng chính**: Các tính năng cụ thể mà module hỗ trợ.
- **Thuộc tính**: Các trường dữ liệu chính (dựa trên ERD).
- **Mối quan hệ**: Liên kết với các module khác.
- **Vai trò trong TMĐT và AI**: Cách module hỗ trợ quy trình bán hàng và tư vấn bệnh cây trồng.

### Đặc trưng của hệ thống
1. **Quản lý người dùng và xác thực**: Hỗ trợ đăng ký, đăng nhập, và phân quyền qua các vai trò.
2. **Quản lý sản phẩm và kho hàng**: Quản lý sản phẩm, lô hàng, và thành phần đặc trị.
3. **Tư vấn AI**: Phân tích triệu chứng bệnh cây trồng và đề xuất lộ trình điều trị.
4. **Định vị địa lý**: Tìm đại lý gần nhất dựa trên tọa độ.
5. **Giỏ hàng và đơn hàng**: Hỗ trợ mua sắm và thanh toán (VNPAY, COD).
6. **Khuyến mãi**: Quản lý chương trình khuyến mãi và mã giảm giá.
7. **Đánh giá và yêu thích**: Cho phép khách hàng đánh giá và lưu sản phẩm yêu thích.
8. **Quản lý đại lý**: Xử lý yêu cầu đăng ký đại lý.

### Sắp xếp module
Các module được sắp xếp từ **rìa** (ít phụ thuộc, tương tác trực tiếp với người dùng hoặc hệ thống bên ngoài) đến **lõi** (phụ thuộc nhiều, trung tâm của quy trình TMĐT và AI). Module rìa thường là các module liên quan đến người dùng, xác thực, hoặc dữ liệu độc lập (như `Users`, `Access_Tokens`, `Roles`). Module lõi là các module tích hợp nhiều mối quan hệ và xử lý logic phức tạp (như `Orders`, `AI_Consultation`, `Treatment_Plan`).

---

## Mô tả chi tiết các module

### 1. Module rìa (Outer Modules)

#### 1.1. Users
- **Công dụng**: Quản lý thông tin người dùng, bao gồm khách hàng, đại lý, và quản trị viên, là điểm khởi đầu cho mọi tương tác trong hệ thống.
- **Chức năng chính**:
  - Đăng ký và đăng nhập người dùng với thông tin xác thực (username, password, email).
  - Lưu trữ thông tin liên lạc (phone, address) và trạng thái tài khoản (user_status, user_verify).
  - Liên kết với vai trò (`Roles`) để phân quyền.
- **Thuộc tính**:
  - `user_id` (Integer, khóa chính): Định danh duy nhất.
  - `username` (Characters(60)): Tên đăng nhập, duy nhất.
  - `password` (Characters(100)): Mật khẩu mã hóa.
  - `email` (Characters(100)): Email duy nhất để xác thực.
  - `phone` (Characters(20)): Số điện thoại liên lạc.
  - `address` (Text): Địa chỉ mặc định.
  - `user_status` (Boolean): Trạng thái tài khoản (TRUE = hoạt động).
  - `user_verify` (Boolean): Trạng thái xác minh tài khoản.
- **Mối quan hệ**:
  - 1:N với `Address` (một người dùng có nhiều địa chỉ).
  - 1:1 với `Roles` (mỗi người dùng có một vai trò).
  - 1:N với `Access_Tokens`, `Orders`, `Cart`, `Review`, `Wishlist`, `AI_Consultation`, `Store_Owner_Request`.
- **Vai trò trong TMĐT**: Là module cốt lõi để quản lý tài khoản khách hàng, đại lý, và quản trị viên, hỗ trợ đăng nhập, đặt hàng, và quản lý kho.
- **Vai trò trong AI**: Người dùng đã xác thực có thể sử dụng tính năng tư vấn AI để nhận đề xuất điều trị bệnh cây trồng.

#### 1.2. Access_Tokens
- **Công dụng**: Quản lý token xác thực để đảm bảo an toàn cho các yêu cầu API.
- **Chức năng chính**:
  - Tạo và lưu trữ access token và refresh token với thời gian hết hạn.
  - Xác thực người dùng khi truy cập các endpoint bảo mật.
  - Hỗ trợ làm mới token để duy trì phiên đăng nhập.
- **Thuộc tính**:
  - `access_token` (Text): Token xác thực cho API.
  - `expires_at` (Timestamp): Thời gian hết hạn của access token.
  - `refresh_token` (Text): Token để làm mới access token.
  - `expires_at` (Timestamp): Thời gian hết hạn của refresh token.
- **Mối quan hệ**:
  - N:1 với `Users` (mỗi token thuộc về một người dùng).
- **Vai trò trong TMĐT**: Đảm bảo các giao dịch mua hàng, quản lý kho, và đánh giá sản phẩm được thực hiện bởi người dùng đã xác thực.
- **Vai trò trong AI**: Bảo vệ tính năng tư vấn AI, chỉ cho phép người dùng đã đăng nhập sử dụng.

#### 1.3. Roles
- **Công dụng**: Định nghĩa các vai trò người dùng (Khách hàng, Đại lý, Quản trị viên) để phân quyền.
- **Chức năng chính**:
  - Gán vai trò cho người dùng để kiểm soát quyền truy cập (VD: Đại lý quản lý kho, Quản trị viên phê duyệt yêu cầu đại lý).
  - Hỗ trợ mở rộng thêm vai trò mới (VD: Nhà cung cấp).
- **Thuộc tính**:
  - `role_id` (Integer, khóa chính): Định danh duy nhất.
  - `role_name` (Characters(60)): Tên vai trò (VD: "Customer", "Agent").
  - `role_description` (Text): Mô tả chi tiết vai trò.
- **Mối quan hệ**:
  - 1:N với `Users` (một vai trò áp dụng cho nhiều người dùng).
- **Vai trò trong TMĐT**: Phân quyền để khách hàng đặt hàng, đại lý quản lý sản phẩm, và quản trị viên kiểm soát hệ thống.
- **Vai trò trong AI**: Quản trị viên có thể quản lý dữ liệu tư vấn AI, khách hàng sử dụng tính năng tư vấn.

#### 1.4. Address
- **Công dụng**: Lưu trữ địa chỉ của người dùng để hỗ trợ giao hàng và định vị đại lý gần nhất.
- **Chức năng chính**:
  - Lưu trữ thông tin địa chỉ chi tiết (address, city, province).
  - Hỗ trợ tính năng định vị địa lý để tìm đại lý gần nhất.
- **Thuộc tính**:
  - `address_id` (Integer, khóa chính): Định danh duy nhất.
  - `user_id` (Integer, khóa ngoại): Liên kết với `Users`.
  - `address` (Text): Địa chỉ chi tiết.
- **Mối quan hệ**:
  - N:1 với `Users` (một người dùng có nhiều địa chỉ).
  - 1:N với `Orders` (một địa chỉ được sử dụng cho nhiều đơn hàng).
- **Vai trò trong TMĐT**: Cung cấp địa chỉ giao hàng và hỗ trợ tìm đại lý gần nhất.
- **Vai trò trong AI**: Không trực tiếp, nhưng có thể gián tiếp hỗ trợ tư vấn dựa trên vị trí địa lý (VD: bệnh cây trồng phổ biến ở khu vực).

#### 1.5. Review
- **Công dụng**: Quản lý đánh giá và bình luận của khách hàng về sản phẩm.
- **Chức năng chính**:
  - Lưu trữ đánh giá (rating, comment) và thời gian tạo.
  - Hỗ trợ xây dựng uy tín sản phẩm và cải thiện chất lượng.
- **Thuộc tính**:
  - `review_id` (Integer, khóa chính): Định danh duy nhất.
  - `rating` (Integer): Điểm đánh giá (1-5).
  - `comment` (Text): Bình luận chi tiết.
  - `created_at` (Timestamp): Thời gian tạo đánh giá.
- **Mối quan hệ**:
  - N:1 với `Users` (một người dùng có thể để lại nhiều đánh giá).
  - N:1 với `Products` (một sản phẩm có nhiều đánh giá).
- **Vai trò trong TMĐT**: Tăng độ tin cậy và hỗ trợ khách hàng đưa ra quyết định mua hàng.
- **Vai trò trong AI**: Đánh giá có thể cung cấp dữ liệu để cải thiện độ chính xác của tư vấn AI.

#### 1.6. Wishlist
- **Công dụng**: Quản lý danh sách sản phẩm yêu thích của khách hàng.
- **Chức năng chính**:
  - Lưu trữ sản phẩm mà khách hàng muốn theo dõi hoặc mua sau.
  - Tăng tương tác người dùng với hệ thống.
- **Thuộc tính**:
  - `wishlist_id` (Integer, khóa chính): Định danh duy nhất.
  - `user_id` (Integer, khóa ngoại): Liên kết với `Users`.
  - `product_id` (Integer, khóa ngoại): Liên kết với `Products`.
- **Mối quan hệ**:
  - N:1 với `Users` (một người dùng có nhiều sản phẩm yêu thích).
  - N:1 với `Products` (một sản phẩm có thể được yêu thích bởi nhiều người dùng).
- **Vai trò trong TMĐT**: Tăng cơ hội bán hàng bằng cách nhắc nhở khách hàng về sản phẩm yêu thích.
- **Vai trò trong AI**: Có thể đề xuất sản phẩm yêu thích trong tư vấn AI.

#### 1.7. Vouchers
- **Công dụng**: Quản lý mã giảm giá để khuyến khích mua hàng.
- **Chức năng chính**:
  - Lưu trữ thông tin mã giảm giá (voucher_name, discount_percent, start_date, end_date).
  - Hỗ trợ áp dụng giảm giá cho đơn hàng.
- **Thuộc tính**:
  - `voucher_id` (Integer, khóa chính): Định danh duy nhất.
  - `voucher_name` (Characters(60)): Tên mã giảm giá.
  - `voucher_type` (Characters(20)): Loại mã (VD: percentage, fixed).
  - `voucher_description` (Text): Mô tả chi tiết.
  - `discount_percent` (Float): Phần trăm giảm giá.
  - `start_date` (Timestamp): Thời gian bắt đầu.
  - `end_date` (Timestamp): Thời gian kết thúc.
- **Mối quan hệ**:
  - N:1 với `Promotions` (một chương trình khuyến mãi có nhiều mã giảm giá).
- **Vai trò trong TMĐT**: Tăng doanh số bán hàng thông qua khuyến mãi.
- **Vai trò trong AI**: Có thể áp dụng mã giảm giá cho sản phẩm được đề xuất bởi AI.

#### 1.8. Promotions
- **Công dụng**: Quản lý các chương trình khuyến mãi để thu hút khách hàng.
- **Chức năng chính**:
  - Lưu trữ thông tin khuyến mãi (promotion_name, start_date, end_date, is_active).
  - Hỗ trợ tạo chiến dịch khuyến mãi cho đại lý.
- **Thuộc tính**:
  - `promotion_id` (Integer, khóa chính): Định danh duy nhất.
  - `promotion_name` (Characters(100)): Tên chương trình.
  - `promotion_description` (Text): Mô tả chi tiết.
  - `start_date` (Timestamp): Thời gian bắt đầu.
  - `end_date` (Timestamp): Thời gian kết thúc.
  - `is_active` (Boolean): Trạng thái hoạt động.
- **Mối quan hệ**:
  - 1:N với `Vouchers` (một chương trình khuyến mãi có nhiều mã giảm giá).
- **Vai trò trong TMĐT**: Tăng doanh số và thu hút khách hàng.
- **Vai trò trong AI**: Không trực tiếp, nhưng có thể khuyến mãi sản phẩm được đề xuất bởi AI.

#### 1.9. Discount_Types
- **Công dụng**: Quản lý các loại giảm giá (VD: phần trăm, cố định).
- **Chức năng chính**:
  - Lưu trữ thông tin loại giảm giá để áp dụng cho chương trình khuyến mãi.
- **Thuộc tính**:
  - `discount_type_id` (Integer, khóa chính): Định danh duy nhất.
  - `type_name` (Characters(50)): Tên loại giảm giá.
  - `description` (Text): Mô tả chi tiết.
  - `is_active` (Boolean): Trạng thái hoạt động.
- **Mối quan hệ**:
  - 1:N với `Promotions` (một loại giảm giá áp dụng cho nhiều chương trình).
- **Vai trò trong TMĐT**: Hỗ trợ quản lý các loại khuyến mãi linh hoạt.
- **Vai trò trong AI**: Không trực tiếp, nhưng có thể liên quan đến sản phẩm được đề xuất.

#### 1.10. Payment_Method
- **Công dụng**: Quản lý các phương thức thanh toán (VD: VNPAY, COD).
- **Chức năng chính**:
  - Lưu trữ thông tin phương thức thanh toán (method_name, method_description).
  - Hỗ trợ thanh toán an toàn cho đơn hàng.
- **Thuộc tính**:
  - `payment_method_id` (Integer, khóa chính): Định danh duy nhất.
  - `method_name` (Characters(20)): Tên phương thức.
  - `method_description` (Text): Mô tả chi tiết.
- **Mối quan hệ**:
  - 1:N với `Orders` (một phương thức thanh toán được sử dụng cho nhiều đơn hàng).
- **Vai trò trong TMĐT**: Hoàn tất giao dịch mua hàng.
- **Vai trò trong AI**: Không trực tiếp, nhưng hỗ trợ thanh toán cho sản phẩm được đề xuất bởi AI.

#### 1.11. Order_Status
- **Công dụng**: Quản lý trạng thái của đơn hàng (VD: pending, shipped).
- **Chức năng chính**:
  - Lưu trữ các trạng thái đơn hàng để theo dõi tiến độ.
- **Thuộc tính**:
  - `status_id` (Integer, khóa chính): Định danh duy nhất.
  - `status_name` (Characters(60)): Tên trạng thái.
- **Mối quan hệ**:
  - 1:N với `Orders` (một trạng thái áp dụng cho nhiều đơn hàng).
  - 1:N với `Store_Owner_Request` (một trạng thái áp dụng cho nhiều yêu cầu đại lý).
- **Vai trò trong TMĐT**: Cung cấp thông tin về tiến độ đơn hàng cho khách hàng và đại lý.
- **Vai trò trong AI**: Không trực tiếp, nhưng có thể theo dõi đơn hàng liên quan đến sản phẩm được đề xuất.

#### 1.12. Store_Owner_Request
- **Công dụng**: Quản lý yêu cầu đăng ký trở thành đại lý (bao gồm luồng phê duyệt admin).
- **Chức năng chính**:
  - Lưu trữ thông tin yêu cầu đăng ký đại lý và trạng thái phê duyệt.
  - Hỗ trợ quản trị viên xét duyệt yêu cầu.
- **Thuộc tính**:
  - `request_id` (Integer, khóa chính): Định danh duy nhất.
  - `user_id` (Integer, khóa ngoại): Liên kết với `Users`.
  - `status_id` (Integer, khóa ngoại): Liên kết với `Order_Status`.
- **Mối quan hệ**:
  - N:1 với `Users` (một người dùng gửi một yêu cầu).
  - N:1 với `Order_Status` (một trạng thái áp dụng cho nhiều yêu cầu).
- **Vai trò trong TMĐT**: Hỗ trợ mở rộng mạng lưới đại lý.
- **Vai trò trong AI**: Không trực tiếp, nhưng đại lý được phê duyệt có thể quản lý sản phẩm được đề xuất bởi AI.

### 2. Module trung tâm (Core Modules)

#### 2.1. Categories
- **Công dụng**: Phân loại sản phẩm thuốc BVTV theo danh mục (VD: thuốc trừ sâu, thuốc trừ nấm).
- **Chức năng chính**:
  - Tổ chức sản phẩm để dễ dàng tìm kiếm và quản lý.
  - Hỗ trợ lọc sản phẩm trên giao diện người dùng.
- **Thuộc tính**:
  - `category_id` (Integer, khóa chính): Định danh duy nhất.
  - `category_name` (Characters(60)): Tên danh mục.
  - `category_description` (Text): Mô tả chi tiết.
- **Mối quan hệ**:
  - 1:N với `Products` (một danh mục chứa nhiều sản phẩm).
- **Vai trò trong TMĐT**: Tăng trải nghiệm người dùng khi tìm kiếm sản phẩm.
- **Vai trò trong AI**: Hỗ trợ AI đề xuất sản phẩm theo danh mục phù hợp với bệnh cây trồng.

#### 2.2. Product_Types
- **Công dụng**: Phân loại sản phẩm theo dạng bào chế (VD: dung dịch, hạt, bột).
- **Chức năng chính**:
  - Cung cấp thông tin về dạng bào chế để hỗ trợ lựa chọn sản phẩm.
- **Thuộc tính**:
  - `product_type_id` (Integer, khóa chính): Định danh duy nhất.
  - `voucher_name` (Characters(60)): Tên loại sản phẩm (lưu ý: có thể là lỗi đánh máy trong ERD, nên là `type_name`).
  - `voucher_description` (Text): Mô tả chi tiết (có thể là `type_description`).
- **Mối quan hệ**:
  - 1:N với `Products` (một loại sản phẩm áp dụng cho nhiều sản phẩm).
- **Vai trò trong TMĐT**: Hỗ trợ khách hàng chọn sản phẩm phù hợp với phương pháp sử dụng.
- **Vai trò trong AI**: Giúp AI đề xuất sản phẩm dựa trên dạng bào chế phù hợp.

#### 2.3. Product_Images
- **Công dụng**: Lưu trữ hình ảnh minh họa cho sản phẩm.
- **Chức năng chính**:
  - Cung cấp hình ảnh để tăng tính hấp dẫn và minh bạch cho sản phẩm.
- **Thuộc tính**:
  - `product_image_id` (Integer, khóa chính): Định danh duy nhất.
  - `image_url` (Text): Đường dẫn hình ảnh.
- **Mối quan hệ**:
  - N:1 với `Products` (một sản phẩm có nhiều hình ảnh).
- **Vai trò trong TMĐT**: Tăng trải nghiệm người dùng và hỗ trợ quyết định mua hàng.
- **Vai trò trong AI**: Có thể hỗ trợ nhận diện hình ảnh bệnh cây trồng nếu tích hợp AI hình ảnh.

#### 2.4. Inventories
- **Công dụng**: Quản lý kho hàng của đại lý.
- **Chức năng chính**:
  - Lưu trữ thông tin kho (tên, vị trí, số lượng, hình ảnh).
  - Hỗ trợ quản lý tồn kho và cảnh báo khi số lượng thấp.
- **Thuộc tính**:
  - `inventory_id` (Integer, khóa chính): Định danh duy nhất.
  - `inventory_name` (Characters(60)): Tên kho.
  - `inventory_location` (Text): Vị trí kho.
  - `inventory_description` (Text): Mô tả chi tiết.
  - `inventory_qty` (Float): Số lượng tồn kho.
  - `inventory_img` (Text): Hình ảnh kho.
- **Mối quan hệ**:
  - 1:N với `Batch_Products` (một kho chứa nhiều lô sản phẩm).
- **Vai trò trong TMĐT**: Đảm bảo sản phẩm có sẵn để bán.
- **Vai trò trong AI**: Đảm bảo sản phẩm được đề xuất bởi AI có sẵn trong kho.

#### 2.5. Batch_Products
- **Công dụng**: Quản lý lô hàng của sản phẩm.
- **Chức năng chính**:
  - Lưu trữ thông tin lô hàng (số lượng, ngày hết hạn, ngưỡng tồn kho thấp).
  - Hỗ trợ cảnh báo khi lô gần hết hoặc hết hạn.
- **Thuộc tính**:
  - `batch_id` (Integer, khóa chính): Định danh duy nhất.
  - `quantity` (Number): Số lượng sản phẩm trong lô.
  - `expiry_date` (Date): Ngày hết hạn.
  - `low_stock_threshold` (Float): Ngưỡng tồn kho thấp.
- **Mối quan hệ**:
  - N:1 với `Products` (một sản phẩm có nhiều lô).
  - N:1 với `Inventories` (một kho chứa nhiều lô).
  - 1:N với `Order_Detail` và `Cart_Item` (một lô được sử dụng trong nhiều chi tiết đơn hàng hoặc giỏ hàng).
- **Vai trò trong TMĐT**: Quản lý tồn kho và đảm bảo sản phẩm hợp lệ.
- **Vai trò trong AI**: Đảm bảo sản phẩm được đề xuất chưa hết hạn và có đủ số lượng.

#### 2.6. Products
- **Công dụng**: Quản lý thông tin sản phẩm thuốc BVTV.
- **Chức năng chính**:
  - Lưu trữ thông tin sản phẩm (tên, mô tả, hướng dẫn sử dụng, giá).
  - Là trung tâm của quy trình bán hàng.
- **Thuộc tính**:
  - `product_id` (Integer, khóa chính): Định danh duy nhất.
  - `product_name` (Characters(100)): Tên sản phẩm.
  - `product_description` (Text): Mô tả chi tiết.
  - `to_use_instructions` (Text): Hướng dẫn sử dụng.
  - `unit_product_price` (Float): Giá đơn vị.
- **Mối quan hệ**:
  - N:1 với `Categories`, `Product_Types`, `Inventories`.
  - 1:N với `Product_Images`, `Batch_Products`, `Product_Ingredient`, `Review`, `Wishlist`, `Treatment_Plan`.
- **Vai trò trong TMĐT**: Là đối tượng chính của giao dịch mua bán.
- **Vai trò trong AI**: Được đề xuất trong tư vấn AI dựa trên bệnh cây trồng.

#### 2.7. Product_Ingredient
- **Công dụng**: Quản lý thành phần đặc trị của sản phẩm.
- **Chức năng chính**:
  - Lưu trữ thông tin thành phần (tên, mô tả, mức độ nguy hiểm, tính ô nhiễm).
  - Liên kết nhiều-nhiều giữa `Products` và `Ingredients`.
- **Thuộc tính**:
  - `ingredient_id` (Integer, khóa ngoại): Liên kết với `Ingredients`.
  - `product_id` (Integer, khóa ngoại): Liên kết với `Products`.
  - `ingredient_name` (Characters(100)): Tên thành phần.
  - `ingredient_description` (Text): Mô tả chi tiết.
  - `Hazard_Level` (Number): Mức độ nguy hiểm.
  - `contamination` (Boolean): Tính ô nhiễm.
- **Mối quan hệ**:
  - Nhiều-nhiều giữa `Products` và `Ingredients`.
- **Vai trò trong TMĐT**: Cung cấp thông tin chi tiết về thành phần để hỗ trợ quyết định mua hàng.
- **Vai trò trong AI**: Hỗ trợ AI đánh giá hiệu quả và an toàn của sản phẩm.

#### 2.8. Ingredients
- **Công dụng**: Lưu trữ thông tin về các thành phần đặc trị.
- **Chức năng chính**:
  - Cung cấp chi tiết về thành phần (tên, mô tả, mức độ nguy hiểm).
- **Thuộc tính**:
  - `ingredient_id` (Integer, khóa chính): Định danh duy nhất.
  - `ingredient_name` (Characters(100)): Tên thành phần.
  - `ingredient_description` (Text): Mô tả chi tiết.
  - `Hazard_Level` (Number): Mức độ nguy hiểm.
  - `contamination` (Boolean): Tính ô nhiễm.
- **Mối quan hệ**:
  - 1:N với `Product_Ingredient` (một thành phần có trong nhiều sản phẩm).
- **Vai trò trong TMĐT**: Hỗ trợ khách hàng hiểu rõ thành phần sản phẩm.
- **Vai trò trong AI**: Cung cấp dữ liệu để AI đề xuất sản phẩm dựa trên thành phần.

#### 2.9. Diseases
- **Công傍
- **Công dụng**: Lưu trữ thông tin về các bệnh cây trồng.
- **Chức năng chính**:
  - Cung cấp chi tiết về bệnh (tên, mô tả).
- **Thuộc tính**:
  - `disease_id` (Integer, khóa chính): Định danh duy nhất.
  - `disease_name` (Characters(100)): Tên bệnh.
  - `disease_description` (Text): Mô tả chi tiết.
- **Mối quan hệ**:
  - Không trực tiếp, nhưng liên kết gián tiếp qua `Product_Ingredient` và `AI_Consultation`.
- **Vai trò trong TMĐT**: Không trực tiếp, nhưng hỗ trợ thông tin bệnh cho khách hàng.
- **Vai trò trong AI**: Là dữ liệu đầu vào chính cho tư vấn AI.

#### 2.10. AI_Consultation
- **Công dụng**: Quản lý tư vấn AI về bệnh cây trồng.
- **Chức năng chính**:
  - Lưu trữ thông tin tư vấn (loại cây, triệu chứng, phương pháp điều trị).
  - Tích hợp với AI để phân tích và đề xuất.
- **Thuộc tính**:
  - `consultation_id` (Integer,