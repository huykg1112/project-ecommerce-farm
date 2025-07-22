# VNPay Integration Guide

## Cài đặt thư viện

```bash
npm install vnpay
npm install class-validator class-transformer
```

## Cấu hình Environment Variables

Đảm bảo file `.env` có các biến sau:

```env
VNPAY_TMN_CODE=D30SA57V
VNPAY_HASH_SECRET=5O3U8EFFZRYI5FNUYWW8WVYRAJRV4XRP
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/checkout/success
```

## API Endpoints

### 1. Tạo URL thanh toán

**POST** `/payment/vnpay/create-payment-url`

```json
{
  "amount": 100000,
  "orderId": "ORDER_123456",
  "orderInfo": "Thanh toan don hang ORDER_123456",
  "orderType": "other",
  "bankCode": "NCB"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "vnpayParams": {
      "amount": 100000,
      "orderId": "ORDER_123456",
      "orderInfo": "Thanh toan don hang ORDER_123456",
      "returnUrl": "http://localhost:3000/checkout/success"
    }
  }
}
```

### 2. Xử lý kết quả thanh toán (Return URL)

**GET** `/payment/vnpay/return`

Query parameters sẽ được VNPay gửi về và tự động xử lý, redirect về frontend.

### 3. Xử lý IPN (Instant Payment Notification)

**GET** `/payment/vnpay/ipn`

VNPay sẽ gọi endpoint này để thông báo kết quả thanh toán.

### 4. Kiểm tra trạng thái thanh toán

**GET** `/payment/vnpay/status/:orderId`

## Frontend Integration Example

```javascript
// Tạo thanh toán
const createPayment = async (orderData) => {
  try {
    const response = await fetch('/api/payment/vnpay/create-payment-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.total,
        orderId: orderData.id,
        orderInfo: `Thanh toán đơn hàng ${orderData.id}`,
        orderType: 'other',
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Redirect to VNPay
      window.location.href = result.data.paymentUrl;
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

## Payment Status Codes

- `00`: Giao dịch thành công
- `07`: Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)
- `09`: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng
- `10`: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần
- `11`: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch
- `12`: Thẻ/Tài khoản của khách hàng bị khóa
- `13`: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)
- `24`: Khách hàng hủy giao dịch
- `51`: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch
- `65`: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày
- `75`: Ngân hàng thanh toán đang bảo trì
- `79`: KH nhập sai mật khẩu thanh toán quá số lần quy định
- `99`: Các lỗi khác

## Security Notes

1. **Production Environment**:
   - Đổi `testMode: false` trong PaymentModule
   - Sử dụng URL production của VNPay
   - Bảo mật thông tin TMN_CODE và HASH_SECRET

2. **Validation**:
   - Luôn verify signature từ VNPay
   - Kiểm tra amount và order info
   - Log tất cả giao dịch để audit

3. **Error Handling**:
   - Xử lý timeout
   - Retry mechanism cho IPN
   - Fallback cho các trường hợp lỗi

## Testing

Sử dụng thông tin thẻ test của VNPay:

- Số thẻ: 9704198526191432198
- Tên chủ thẻ: NGUYEN VAN A
- Ngày hết hạn: 07/15
- Mật khẩu OTP: 123456
