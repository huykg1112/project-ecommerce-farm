"use client";

import type React from "react";

import type { RootState } from "@/lib/features/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// HOC để bảo vệ các component cần xác thực
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, loading } = useSelector(
      (state: RootState) => state.user
    );

    useEffect(() => {
      // Nếu không đang loading và không được xác thực, chuyển hướng đến trang đăng nhập
      if (!loading && !isAuthenticated) {
        // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
        const currentPath = window.location.pathname;
        router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      }
    }, [isAuthenticated, loading, router]);

    // Nếu đang loading hoặc chưa xác thực, hiển thị loading hoặc null
    if (loading || !isAuthenticated) {
      return null; // hoặc hiển thị loading spinner
    }

    // Nếu đã xác thực, hiển thị component
    return <Component {...props} />;
  };
}
