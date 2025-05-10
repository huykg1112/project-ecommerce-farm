"use client";

import { AppDispatch } from "@/lib/features/store";
import { setUser } from "@/lib/features/user-slice";
import { authService } from "@/lib/services/auth-service";
import { userService } from "@/lib/services/user-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.error("Google login error:", error);
      router.push(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (accessToken && refreshToken) {
      authService.saveGoogleTokens(accessToken, refreshToken);
      userService
        .getProfile()
        .then((profile) => {
          dispatch(
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
              fullName: profile.fullName,
              phone: profile.phone,
              address: profile.address,
              avatar: profile.avatar,
              roleName: profile.roleName,
            })
          );
          const callbackUrl = localStorage.getItem("callbackUrl") || "/";
          localStorage.removeItem("callbackUrl");
          router.push(callbackUrl);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          router.push(
            `/login?error=${encodeURIComponent("Failed to fetch profile")}`
          );
        });
    } else {
      router.push("/login?error=Không nhận được token");
    }
  }, [accessToken, refreshToken, error, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
