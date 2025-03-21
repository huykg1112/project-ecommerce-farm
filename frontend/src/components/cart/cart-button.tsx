"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthAction } from "@/lib/auth/use-auth-action";
import type { RootState } from "@/lib//cart/store";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface CartButtonProps {
  isScrolled: boolean;
}

export default function CartButton({ isScrolled }: CartButtonProps) {
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const { requireAuth } = useAuthAction();

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Kiểm tra đăng nhập trước khi chuyển đến trang giỏ hàng
    requireAuth(() => {
      router.push("/cart");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", isScrolled && "text-white")}
      onClick={handleCartClick}
      data-cart-button="true" // Thêm data attribute để tìm vị trí cho animation
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="sr-only">Cart</span>
      {totalItems > 0 && (
        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
