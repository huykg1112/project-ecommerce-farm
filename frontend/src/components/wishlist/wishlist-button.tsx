"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthAction } from "@/lib/auth/use-auth-action";
import type { RootState } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface WishlistButtonProps {
  isScrolled: boolean;
}

export default function WishlistButton({ isScrolled }: WishlistButtonProps) {
  const { totalItems } = useSelector((state: RootState) => state.wishlist);
  const router = useRouter();
  const { requireAuth } = useAuthAction();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check login before navigating to wishlist
    requireAuth(() => {
      router.push("/wishlist");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", isScrolled && "text-white")}
      onClick={handleWishlistClick}
      data-wishlist-button="true" // Add data attribute for animation targeting
    >
      <Heart className="h-6 w-6" />
      <span className="sr-only">Wishlist</span>
      {totalItems > 0 && (
        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
