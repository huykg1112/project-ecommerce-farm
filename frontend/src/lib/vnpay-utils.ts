import * as crypto from "crypto";

export function sortObject(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  const sorted: { [key: string]: any } = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export function createVnpayUrl(
  vnp_TmnCode: string,
  vnp_HashSecret: string,
  vnp_Url: string,
  amount: number,
  orderId: string,
  orderInfo: string,
  ipAddr: string,
  returnUrl: string
): string {
  // Tạo createDate theo format VNPay: YmdHis (GMT+7)
  const date = new Date();
  // Chuyển sang GMT+7 (Vietnam timezone)
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const createDate = vietnamTime
    .toISOString()
    .replace(/[-T:]/g, "")
    .slice(0, 14);

  const vnp_Params: { [key: string]: string | number } = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddr,
    vnp_Locale: "vn",
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: orderId,
  };

  // Sắp xếp tham số theo thứ tự alphabet
  const sortedParams = sortObject(vnp_Params);

  // Tạo hash data (KHÔNG encode URI cho hash)
  const hashData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join("&");

  // Tạo secure hash theo chuẩn VNPay
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const vnp_SecureHash = hmac.update(hashData, "utf8").digest("hex");

  // Tạo query string cho URL (CÓ encode URI)
  const queryParams = Object.keys(sortedParams)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`
    )
    .join("&");

  const finalUrl = `${vnp_Url}?${queryParams}&vnp_SecureHash=${vnp_SecureHash}`;

  console.log("VNPay URL created:", finalUrl);
  console.log("Hash data (for signature):", hashData);
  console.log("Query params (for URL):", queryParams);
  console.log("Secure hash:", vnp_SecureHash);

  return finalUrl;
}

export function verifyVnpayReturn(
  vnp_HashSecret: string,
  vnp_Params: { [key: string]: any }
): boolean {
  const secureHash = vnp_Params["vnp_SecureHash"];

  // Xóa các tham số không cần thiết cho việc verify
  const paramsToVerify = { ...vnp_Params };
  delete paramsToVerify["vnp_SecureHash"];
  delete paramsToVerify["vnp_SecureHashType"];

  // Sắp xếp tham số theo alphabet
  const sortedParams = sortObject(paramsToVerify);

  // Tạo hash data giống như khi tạo URL (KHÔNG encode URI)
  const hashData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join("&");

  // Tạo hash để so sánh theo chuẩn VNPay
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const calculatedHash = hmac.update(hashData, "utf8").digest("hex");

  console.log("Verify - Hash data:", hashData);
  console.log("Verify - Received hash:", secureHash);
  console.log("Verify - Calculated hash:", calculatedHash);

  return calculatedHash === secureHash;
}
