# Product API với Upload Hình Ảnh - Hướng Dẫn Sử Dụng

## 1. Tạo Sản Phẩm Mới (Create Product)

### Endpoint: `POST /products`

**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```javascript
{
  "product_name": "Thuốc trừ sâu ABC",
  "description": "Thuốc trừ sâu hiệu quả cao, an toàn cho môi trường",
  "usage_instructions": "Pha loãng 1:1000 với nước, phun đều lên lá",
  "unit_product_price": 150000,
  "is_active": true,
  "category_ids": ["uuid1", "uuid2"],           // Mảng ID category
  "manufacturer_id": "manufacturer-uuid",        // ID nhà sản xuất
  "ingredient_ids": ["ingredient-uuid1", "ingredient-uuid2"], // Mảng ID thành phần
  "disease_ids": ["disease-uuid1", "disease-uuid2"],         // Mảng ID bệnh
  "images": [File1, File2, File3]               // Mảng files hình ảnh (tối đa 10)
}
```

**Response thành công:**
```json
{
  "product_id": "product-uuid",
  "product_name": "Thuốc trừ sâu ABC",
  "description": "Thuốc trừ sâu hiệu quả cao, an toàn cho môi trường",
  "unit_product_price": 150000,
  "is_active": true,
  "categories": [
    {
      "category_id": "uuid1",
      "category_name": "Thuốc trừ sâu"
    }
  ],
  "manufacturer": {
    "id": "manufacturer-uuid",
    "name": "Công ty ABC",
    "logo": "logo-url"
  },
  "images": [
    {
      "product_image_id": "image-uuid1",
      "image_url": "https://res.cloudinary.com/...",
      "description": "Product image for Thuốc trừ sâu ABC"
    }
  ],
  "product_ingredients": [
    {
      "ingredient_id": "ingredient-uuid1",
      "ingredient_name": "Imidacloprid",
      "is_primary": false
    }
  ],
  "diseases": [
    {
      "disease_id": "disease-uuid1", 
      "disease_name": "Bệnh phấn trắng",
      "is_primary": false
    }
  ]
}
```

## 2. Cập Nhật Sản Phẩm (Update Product)

### Endpoint: `PATCH /products/:id`

**Content-Type:** `multipart/form-data`

**Form Data (tất cả field đều optional):**
```javascript
{
  "product_name": "Thuốc trừ sâu ABC - Updated",
  "description": "Mô tả mới",
  "unit_product_price": 160000,
  "category_ids": ["new-category-uuid"],
  "manufacturer_id": "new-manufacturer-uuid",
  "ingredient_ids": ["new-ingredient-uuid"],
  "disease_ids": ["new-disease-uuid"],
  "images": [NewFile1, NewFile2]  // Hình ảnh mới sẽ được thêm vào (không thay thế)
}
```

## 3. Thêm Hình Ảnh Cho Sản Phẩm

### Endpoint: `POST /products/:id/images`

**Content-Type:** `multipart/form-data`

**Form Data:**
```javascript
{
  "images": [File1, File2, File3]  // Tối đa 10 files
}
```

**Response:**
```json
{
  "message": "Thêm hình ảnh thành công",
  "uploaded_count": 3,
  "images": [
    {
      "product_image_id": "image-uuid1",
      "image_url": "https://res.cloudinary.com/...",
      "description": "Product image for Thuốc trừ sâu ABC"
    }
  ]
}
```

## 4. Xóa Hình Ảnh Sản Phẩm

### Endpoint: `DELETE /products/:id/images`

**Content-Type:** `application/json`

**Body:**
```json
{
  "image_ids": ["image-uuid1", "image-uuid2"]
}
```

**Response:**
```json
{
  "message": "Xóa hình ảnh thành công",
  "removed_count": 2
}
```

## 5. Lấy Thông Tin Sản Phẩm

### Endpoint: `GET /products/:id`

**Response bao gồm đầy đủ liên kết:**
```json
{
  "product_id": "product-uuid",
  "product_name": "Thuốc trừ sâu ABC",
  "description": "...",
  "categories": [...],
  "manufacturer": {...},
  "distributor": {...},
  "images": [...],
  "product_ingredients": [
    {
      "ingredient_id": "ingredient-uuid",
      "ingredient_name": "Imidacloprid",
      "is_primary": false
    }
  ],
  "diseases": [
    {
      "disease_id": "disease-uuid",
      "disease_name": "Bệnh phấn trắng", 
      "is_primary": false
    }
  ]
}
```

## 6. Các Endpoint Khác

- `GET /products` - Lấy tất cả sản phẩm (với relations)
- `GET /products/for-users` - Lấy sản phẩm active cho user
- `GET /products/my-products` - Lấy sản phẩm của distributor hiện tại
- `POST /products/advanced-search` - Tìm kiếm nâng cao

## Lưu Ý Khi Sử Dụng

1. **Upload Hình Ảnh:**
   - Tối đa 10 hình ảnh mỗi lần
   - Chỉ hỗ trợ định dạng hình ảnh (jpg, png, gif, etc.)
   - Hình ảnh sẽ tự động resize và optimize trên Cloudinary

2. **Quyền Truy Cập:**
   - Chỉ DISTRIBUTOR và ADMIN mới có thể tạo/sửa sản phẩm
   - Distributor chỉ có thể sửa sản phẩm của mình
   - Admin có thể sửa tất cả sản phẩm

3. **Validation:**
   - `product_name`: Bắt buộc, 3-100 ký tự
   - `unit_product_price`: Bắt buộc, phải > 0
   - `category_ids`: Bắt buộc, phải là mảng UUID hợp lệ
   - Các ID liên kết (manufacturer, ingredient, disease) phải tồn tại và active

4. **Liên Kết Dữ Liệu:**
   - Khi tạo/cập nhật, hệ thống sẽ tự động tạo liên kết trong bảng trung gian
   - Khi cập nhật ingredient_ids hoặc disease_ids, liên kết cũ sẽ bị xóa và tạo mới
   - Hình ảnh khi update sẽ được thêm vào chứ không thay thế

## Testing với Postman/Thunder Client

1. **Tạo Product mới:**
   - Method: POST
   - URL: `{{baseUrl}}/products`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data với fields như trên

2. **Upload thêm hình ảnh:**
   - Method: POST  
   - URL: `{{baseUrl}}/products/{{productId}}/images`
   - Body: form-data với field `images`

3. **Test với curl:**
```bash
curl -X POST "http://localhost:3000/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "product_name=Test Product" \
  -F "description=Test Description" \
  -F "unit_product_price=100000" \
  -F "category_ids=category-uuid1" \
  -F "category_ids=category-uuid2" \
  -F "manufacturer_id=manufacturer-uuid" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```