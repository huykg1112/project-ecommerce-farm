"use client";

import { authService } from "@/lib/services/auth-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useTokenRefresh() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  // Hàm kiểm tra token
  const checkAndRefreshToken = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push("/login");
        return;
      }

      if (authService.isTokenExpired()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          authService.removeToken();
          router.push("/login");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking token:", error);
      router.push("/login");
    } finally {
      setIsChecking(false); // Đảm bảo luôn cập nhật trạng thái
    }
  };

  useEffect(() => {
    checkAndRefreshToken();
  }, []);

  return { isChecking };
}
