// Định nghĩa các interface cho request và response
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// Kiểm tra xem localStorage có tồn tại hay không (chỉ tồn tại ở phía client)
const isClient = typeof window !== "undefined";

// Service xử lý authentication
export const API_URL = "http://localhost:4200";

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

    const result: LoginResponse = await response.json(); // Chuyển response thành dạng JSON

    // Lưu token vào localStorage (chỉ ở phía client)
    if (isClient) {
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);
    }
    //     console.log("login result", result);
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
    //     console.log("token", token);

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "DELETE",
        headers: {
          //     "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw errorData;
      }

      // Xóa token khỏi localStorage (chỉ ở phía client)
      if (isClient) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("Authorization");
        localStorage.removeItem("Refresh-token");
      }
      // console.log("logout message", await response.json());

      return await response.json();
    } catch (error) {
      // Vẫn xóa token ngay cả khi API gọi thất bại
      console.log("error", error);
      if (isClient) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("Authorization");
        localStorage.removeItem("Refresh-token");
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
    return isClient ? !!localStorage.getItem("access_token") : false;
  },

  // Lấy token
  getToken(): string | null {
    return isClient ? localStorage.getItem("access_token") : null;
  },
};
