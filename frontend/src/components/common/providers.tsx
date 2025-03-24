"use client";

import { CartAnimationProvider } from "@/lib/cart/cart-animation-context";
import { TokenRefreshProvider } from "@/lib/provider/token-refresh-provider";
import { ToastProvider } from "@/lib/toast-provider";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import type React from "react";

// Sử dụng dynamic import cho Redux Provider để tránh lỗi localStorage trong SSR
const DynamicReduxProvider = dynamic(
  () =>
    import("../../lib/provider/redux-provider").then(
      (mod) => mod.ReduxProvider
    ),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ToastProvider>
          <TokenRefreshProvider>
            <CartAnimationProvider>{children}</CartAnimationProvider>
          </TokenRefreshProvider>
        </ToastProvider>
      </ThemeProvider>
    </DynamicReduxProvider>
  );
}
