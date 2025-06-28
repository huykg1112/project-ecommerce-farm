# Address Module API Documentation

## Overview

Module quản lý địa chỉ của người dùng với các chức năng CRUD cơ bản.

## Base URL

```
/address
```

## Authentication

Tất cả các endpoint đều yêu cầu authentication. Sử dụng JWT token trong header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Tạo địa chỉ mới

**POST** `/address`

**Request Body:**

```json
{
  "address_detail": "123 Đường ABC, Quận 1, TP.HCM",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "is_default": false
}
```

**Response:**

```json
{
  "message": "Địa chỉ đã được tạo thành công",
  "data": {
    "address_id": "uuid",
    "address_detail": "123 Đường ABC, Quận 1, TP.HCM",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "is_default": false,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Lấy danh sách địa chỉ

**GET** `/address`

**Response:**

```json
{
  "message": "Lấy danh sách địa chỉ thành công",
  "data": [
    {
      "address_id": "uuid",
      "address_detail": "123 Đường ABC, Quận 1, TP.HCM",
      "latitude": 10.762622,
      "longitude": 106.660172,
      "is_default": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 3. Lấy thông tin địa chỉ theo ID

**GET** `/address/:id`

**Response:**

```json
{
  "message": "Lấy thông tin địa chỉ thành công",
  "data": {
    "address_id": "uuid",
    "address_detail": "123 Đường ABC, Quận 1, TP.HCM",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "is_default": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Cập nhật địa chỉ

**PATCH** `/address/:id`

**Request Body:**

```json
{
  "address_detail": "456 Đường XYZ, Quận 2, TP.HCM",
  "latitude": 10.787272,
  "longitude": 106.74981,
  "is_default": true
}
```

**Response:**

```json
{
  "message": "Cập nhật địa chỉ thành công",
  "data": {
    "address_id": "uuid",
    "address_detail": "456 Đường XYZ, Quận 2, TP.HCM",
    "latitude": 10.787272,
    "longitude": 106.74981,
    "is_default": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Set địa chỉ mặc định

**PATCH** `/address/:id/set-default`

**Response:**

```json
{
  "message": "Đã set địa chỉ mặc định thành công",
  "data": {
    "address_id": "uuid",
    "address_detail": "123 Đường ABC, Quận 1, TP.HCM",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "is_default": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Xóa địa chỉ

**DELETE** `/address/:id`

**Response:**

```json
{
  "message": "Xóa địa chỉ thành công",
  "data": {
    "address_id": "uuid"
  }
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Vui lòng đăng nhập",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Address with ID uuid not found for this user",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Địa chỉ này đã là địa chỉ mặc định",
  "error": "Bad Request"
}
```

## Validation Rules

- `address_detail`: String (optional)
- `latitude`: Number, valid latitude (-90 to 90) (optional)
- `longitude`: Number, valid longitude (-180 to 180) (optional)
- `is_default`: Boolean (optional)

## Features

1. **Soft Delete**: Địa chỉ không bị xóa hoàn toàn mà chỉ set `is_active = false`
2. **Default Address Management**: Tự động quản lý địa chỉ mặc định (chỉ có 1 địa chỉ mặc định)
3. **User Isolation**: Mỗi user chỉ có thể truy cập địa chỉ của mình
4. **Ordering**: Danh sách địa chỉ được sắp xếp theo địa chỉ mặc định trước, sau đó theo thời gian tạo
5. **Validation**: Validation đầy đủ cho tọa độ địa lý

## Testing với Postman

1. **Authentication**: Thêm header `Authorization: Bearer <your-jwt-token>`
2. **Content-Type**: Set `Content-Type: application/json` cho các request có body
3. **URL**: Sử dụng base URL của server + `/address`
