import { ChangePasswordDto, UpdateProfileDto, UserProfile } from "@/interfaces";
import { authService } from "./auth-service";

const API_URL = "http://localhost:4200";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    let token = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken && !token) {
      throw new Error("Unauthorized");
    }
    if ((refreshToken && !token) || authService.isTokenExpiredRefresh()) {
      // Nếu refresh token có nhưng access token không có, gọi refresh token
      await authService.refreshToken();
      token = localStorage.getItem("access_token")!;
    }

    let response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Nếu token hết hạn, thử refresh
    if (response.status === 401) {
      await authService.refreshToken();
      token = localStorage.getItem("access_token")!;
      response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  },

  async updateProfile(data: UpdateProfileDto): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return await response.json();
  },

  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }

    const response = await fetch(`${API_URL}/user/change-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }

    return await response.json();
  },
};
