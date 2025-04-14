"use client";

import type { RootState } from "@/lib/features/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function useAuthAction() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Hàm kiểm tra đăng nhập trước khi thực hiện hành động
  const requireAuth = (callback?: () => void, redirectUrl?: string) => {
    if (!isAuthenticated) {
      // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
      const currentPath = redirectUrl || window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return false;
    }

    // Nếu đã đăng nhập và có callback, thực hiện callback
    if (callback) {
      callback();
    }

    return true;
  };

  return { requireAuth, isAuthenticated };
}
