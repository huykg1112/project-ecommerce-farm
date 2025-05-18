import { ChangePasswordDto, RegisterRequest, UpdateProfileDto, UserProfile } from "@/interfaces";

const API_URL = "http://localhost:4200";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  async updateProfile(data: UpdateProfileDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },

  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    return response.json();
  },

  async updateAvatar(file: File): Promise<{ message: string; avatar: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/user/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update avatar");
    }

    return response.json();
  },

  async registerStore(data: RegisterRequest): Promise<{ message: string }> {

    const response = await fetch(`${API_URL}/user/registerDistributor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    console.log("response", response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to register store");
    }

    return response.json();
  },
};
