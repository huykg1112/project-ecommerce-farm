import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// utils.ts này dùng để chứa các hàm tiện ích như formatCurrency để định dạng số tiền, cn để kết hợp các class name, ...

// Hàm giải mã JWT token
export function decodeJWT(
  token: string
): { exp?: number; [key: string]: any } | null {
  try {
    // JWT token có cấu trúc: header.payload.signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

// Kiểm tra token có hết hạn chưa
export function isTokenExpired(token: string): boolean {
  const decodedToken = decodeJWT(token);
  if (!decodedToken || !decodedToken.exp) return true;

  // exp là thời gian hết hạn tính bằng giây
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}
