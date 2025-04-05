"use client";

import { AppDispatch } from "@/lib/cart/store";
import { setUser } from "@/lib/features/user-slice";
import { authService } from "@/lib/services/auth-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Lấy token từ URL query parameters
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  useEffect(() => {
    // Nếu có token, lưu vào localStorage và cập nhật trạng thái đăng nhập
    if (accessToken && refreshToken) {
      // Lưu token vào localStorage
      authService.saveGoogleTokens(accessToken, refreshToken);

      // Cập nhật trạng thái đăng nhập trong Redux
      dispatch(setUser({ username: "Google User" }));

      // Lấy callbackUrl từ localStorage (nếu có)
      const callbackUrl = localStorage.getItem("callbackUrl") || "/";
      localStorage.removeItem("callbackUrl"); // Xóa callbackUrl sau khi sử dụng

      // Chuyển hướng đến trang được yêu cầu trước đó
      router.push(callbackUrl);
    } else {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      router.push("/login");
    }
  }, [accessToken, refreshToken, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
