"use client";

import { useTokenRefresh } from "@/hooks/use-token-refresh";
import type React from "react";
import { createContext, useContext } from "react";

// Tạo context
interface TokenRefreshContextType {
  isChecking: boolean;
}

const TokenRefreshContext = createContext<TokenRefreshContextType | undefined>(
  undefined
);

// Provider component
export function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useTokenRefresh();

  return (
    <TokenRefreshContext.Provider value={{ isChecking }}>
      {isChecking ? (
        // Hiển thị loading khi đang kiểm tra token
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        // Hiển thị nội dung khi đã kiểm tra xong
        children
      )}
    </TokenRefreshContext.Provider>
  );
}

// Hook để sử dụng context
export function useTokenRefreshContext() {
  const context = useContext(TokenRefreshContext);
  if (context === undefined) {
    throw new Error(
      "useTokenRefreshContext must be used within a TokenRefreshProvider"
    );
  }
  return context;
}
