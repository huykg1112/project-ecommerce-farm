"use client";

import type React from "react";
import { ThemeProvider } from "next-themes"; // ThemeProvider là một component từ thư viện next-themes, dùng để cung cấp chế độ sáng/tối cho ứng dụng
import dynamic from "next/dynamic";

// Sử dụng dynamic import cho Redux Provider để tránh lỗi localStorage trong SSR
const DynamicReduxProvider = dynamic(
  () => import("./redux-provider").then((mod) => mod.ReduxProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </DynamicReduxProvider>
  );
}
