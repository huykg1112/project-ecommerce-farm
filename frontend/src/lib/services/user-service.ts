import {
  ChangePasswordDto,
  RegisterRequest,
  UpdateProfileDto,
  UserAddress,
  UserProfile,
} from "@/interfaces";
import { getCookie } from "../utils";

const API_URL = "http://localhost:4200";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  async updateProfile(data: UpdateProfileDto): Promise<{ message: string }> {
    // console.log("data", data);
    const token = getCookie("access_token");
    console.log("token", token);
    console.log("data", data);
    const response = await fetch(`${API_URL}/user/updateProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log("response", response);

    if (!response.ok) {
      throw new Error("Cập nhật thông tin thất bại");
    }

    return response.json();
  },

  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const body = {
      old_password: data.old_password,
      new_password: data.new_password,
    };
    const response = await fetch(`${API_URL}/user/changePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Thay đổi mật khẩu thất bại");
    }

    return response.json();
  },

  async updateAvatar(file: File): Promise<{ message: string; avatar: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/user/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cập nhật ảnh đại diện thất bại");
    }

    return response.json();
  },

  async registerStore(
    file: File | null,
    data: RegisterRequest
  ): Promise<{ message: string }> {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("name", data.name_store || "");
    formData.append("business_license", data.license || "");
    formData.append("invenstory_address", data.address_store || "");
    formData.append("note", ""); // Nếu có thêm trường
    formData.append("invenstory_lat", data.lat?.toString() || "");
    formData.append("invenstory_lng", data.lng?.toString() || "");

    const response = await fetch(`${API_URL}/store-owner-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`, // Thêm token nếu cần
      },
      body: formData, // Không cần `Content-Type`, trình duyệt sẽ tự động thêm
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng ký cửa hàng thất bại");
    }

    return response.json();
  },

  async getAddresses(): Promise<UserAddress[]> {
    const response = await fetch(`${API_URL}/address`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    if (!response.ok) throw new Error("Không lấy được danh sách địa chỉ");
    const data = await response.json();
    return data.data; // BE trả về { message, data, total }
  },

  async addAddress(address: Partial<UserAddress>): Promise<UserAddress> {
    const response = await fetch(`${API_URL}/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: JSON.stringify(address),
    });
    if (!response.ok) throw new Error("Không thêm được địa chỉ");
    const data = await response.json();
    return data.data;
  },

  async setDefaultAddress(address_id: string): Promise<UserAddress> {
    const response = await fetch(
      `${API_URL}/address/${address_id}/set-default`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Không cập nhật địa chỉ mặc định");
    const data = await response.json();
    return data.data;
  },

  async deleteAddress(address_id: string): Promise<void> {
    const response = await fetch(`${API_URL}/address/${address_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    if (!response.ok) throw new Error("Không xóa được địa chỉ");
  },
};
// Thêm các hàm mới:
