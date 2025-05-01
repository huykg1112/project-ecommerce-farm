"use client";

import { CartAnimationProvider } from "@/lib/cart/cart-animation-context";
import { ToastProvider } from "@/lib/provider/toast-provider";
import { TokenRefreshProvider } from "@/lib/provider/token-refresh-provider";
import { WishlistAnimationProvider } from "@/lib/wishlist/wishlist-animation-context";
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
    <ThemeProvider attribute="class" defaultTheme="light">
      <DynamicReduxProvider>
        <ToastProvider>
          <CartAnimationProvider>
            <WishlistAnimationProvider>
              <TokenRefreshProvider>{children}</TokenRefreshProvider>
            </WishlistAnimationProvider>
          </CartAnimationProvider>
        </ToastProvider>
      </DynamicReduxProvider>
    </ThemeProvider>
  );
}
