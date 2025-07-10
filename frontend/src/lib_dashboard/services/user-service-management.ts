import { RegisterResponse } from "@/interfaces/auths";
import { RegisterRequest } from "@/interfaces/users";
import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import { UpdateUserRequest } from "../mock/server";
import { axiosInstance } from "./axios-instance";
export const API_URL = "http://localhost:4200";

export const userServiceManagement = {
  async getUsers() {
    try {
      const response = await axiosInstance.get("/user/findAll");
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi lấy danh sách người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async updateUser(id: string, data: UpdateUserRequest) {
    try {
      //bỏ id ra khỏi data
      const { user_id, ...rest } = data;
      const response = await axiosInstance.put(`/user/updateUser/${id}`, rest);
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi cập nhật người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      // console.log("msg", msg);
      showToast.error(msg);
      throw error;
    }
  },

  async updateUserStatus(id: string) {
    try {
      const response = await axiosInstance.put(`/user/updateUserStatus/${id}`);
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi cập nhật trạng thái người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async deleteUser(id: string) {
    try {
      const response = await axiosInstance.delete(`/user/deleteUser/${id}`);
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi xóa người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async changeRole(id: string, roleId: string) {
    try {
      const response = await axiosInstance.put(`/user/changeRole`, {
        id,
        roleId,
      });
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi thay đổi vai trò người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const response = await axiosInstance.get(`/user/findOne`, {
        params: { id },
      });
      console.log();
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi lấy thông tin người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },

  async createUser(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await axiosInstance.post(`/user/register`, data);
      return response.data;
    } catch (error: any) {
      let msg = "Lỗi khi tạo người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
