"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAuthSectionProps } from "@/interfaces";
import type { AppDispatch, RootState } from "@/lib/cart/store";
import { logoutUser } from "@/lib/features/user-slice";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function UserAuthSection({ isScrolled }: UserAuthSectionProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // Có thể thêm thông báo thành công ở đây nếu cần
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      // Có thể hiển thị thông báo lỗi ở đây nếu cần
    }
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.jpg" alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link href="/profile">Tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders">Đơn hàng</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Cài đặt</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login" className="hidden sm:block">
      <Button
        className={cn(
          "bg-[#599146] hover:bg-[#44703d] text-white text-base px-6 py-2"
        )}
      >
        Đăng nhập
      </Button>
    </Link>
  );
}
