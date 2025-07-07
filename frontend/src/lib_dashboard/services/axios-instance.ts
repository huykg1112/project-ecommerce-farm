import { toast } from "@/components/ui/use-toast";
import { deleteCookie, getCookie, setCookie } from "@/lib/utils";
import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data, // Trực tiếp trả về response.data
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refresh_token");
        const response = await axiosInstance.post("/auth/refresh", {
          refreshToken,
        });
        const { access_token } = response.data;

        setCookie("access_token", access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || "Đã có lỗi xảy ra";
    toast({
      title: "Lỗi",
      description: message,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
