import {
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/interfaces";

// Import hàm kiểm tra token hết hạn
import { deleteCookie, getCookie, isTokenExpired, setCookie } from "../utils";

// Kiểm tra xem localStorage có tồn tại hay không (chỉ tồn tại ở phía client)
const isClient = typeof window !== "undefined";

// Service xử lý authentication
const API_URL = "http://localhost:4200";

export const authService = {
  // Đăng nhập
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    const result: LoginResponse = await response.json();

    // Lưu token vào localStorage (chỉ ở phía client)
    if (isClient) {
      setCookie("access_token", result.access_token);
      setCookie("refresh_token", result.refresh_token);
    }

    return result;
  },

  // Đăng ký
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    return await response.json();
  },

  // Đăng xuất
  async logout(): Promise<{ message: string }> {
    const token = isClient ? localStorage.getItem("access_token") : null;

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw errorData;
      }

      // Xóa token khỏi localStorage (chỉ ở phía client)
      if (isClient) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("Authorization");
        localStorage.removeItem("wishlist");
      }

      return await response.json();
    } catch (error) {
      // Vẫn xóa token ngay cả khi API gọi thất bại
      if (isClient) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("Authorization");
        localStorage.removeItem("wishlist");
      }
      throw error;
    }
  },

  // Refresh token
  async refreshToken(): Promise<RefreshTokenResponse> {
    if (!isClient) {
      throw new Error("Cannot refresh token on server side");
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    const result: RefreshTokenResponse = await response.json();

    // Cập nhật access token trong localStorage
    localStorage.setItem("access_token", result.access_token);

    return result;
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    return isClient ? !!getCookie("access_token") : false;
  },

  // Lấy token
  getToken(): string | null {
    return isClient ? getCookie("access_token") : null;
  },

  // Kiểm tra token còn hạn hay không
  isTokenExpired(): boolean {
    if (!isClient) return true;

    const token = getCookie("access_token");
    if (!token) return true;

    return isTokenExpired(token);
  },
  isTokenExpiredRefresh(): boolean {
    if (!isClient) return true;

    const refreshToken = getCookie("refresh_token");
    if (!refreshToken) return true;

    return isTokenExpired(refreshToken);
  },

  // Xóa token cũ
  removeToken(): void {
    if (isClient) {
      deleteCookie("access_token");
    }
  },
  // Bắt đầu quá trình đăng nhập Google
  initiateGoogleLogin(): void {
    if (isClient) {
      window.location.href = `${API_URL}/auth/google`;
    }
  },

  // Lưu token từ callback Google
  saveGoogleTokens(accessToken: string, refreshToken: string): void {
    if (isClient) {
      setCookie("access_token", accessToken);
      setCookie("refresh_token", refreshToken);
    }
  },

  // Đăng ký đại lý
  async registerStore(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/user/register/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    return await response.json();
  },
};
