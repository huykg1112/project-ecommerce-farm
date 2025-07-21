import { createVnpayUrl, verifyVnpayReturn } from "./vnpay-utils";

// Hàm test VNPay với dữ liệu mẫu
export function testVnpaySignature() {
  const testData = {
    vnp_TmnCode: "D30SA57V",
    vnp_HashSecret: "RRDO0WZKFKOBF58K0J6965GWY11WIGAM",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    amount: 10000, // 10,000 VND
    orderId: "TEST123",
    orderInfo: "Test payment",
    ipAddr: "127.0.0.1",
    returnUrl: "http://localhost:3000/api/vnpay/vnpay-return",
  };

  console.log("=== VNPay Signature Test ===");

  // Test tạo URL
  const paymentUrl = createVnpayUrl(
    testData.vnp_TmnCode,
    testData.vnp_HashSecret,
    testData.vnp_Url,
    testData.amount,
    testData.orderId,
    testData.orderInfo,
    testData.ipAddr,
    testData.returnUrl
  );

  console.log("Generated Payment URL:", paymentUrl);

  // Tách các tham số từ URL để test verify
  const url = new URL(paymentUrl);
  const params: { [key: string]: any } = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Test verify
  const isVerified = verifyVnpayReturn(testData.vnp_HashSecret, params);
  console.log(
    "Signature verification:",
    isVerified ? "PASSED ✅" : "FAILED ❌"
  );

  return isVerified;
}

// Hàm test với dữ liệu response từ VNPay
export function testVnpayResponse(responseParams: { [key: string]: any }) {
  const vnp_HashSecret = "RRDO0WZKFKOBF58K0J6965GWY11WIGAM";

  console.log("=== VNPay Response Test ===");
  console.log("Response params:", responseParams);

  const isVerified = verifyVnpayReturn(vnp_HashSecret, responseParams);
  console.log("Response verification:", isVerified ? "PASSED ✅" : "FAILED ❌");

  return isVerified;
}
