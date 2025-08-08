"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAuthSectionProps, UserProfile } from "@/interfaces";
import type { AppDispatch, RootState } from "@/lib/features/store";
import { logoutUser } from "@/lib/features/user-slice";
import { userService } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { LayoutDashboard, LogOut, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserAuthSection({ isScrolled }: UserAuthSectionProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // Có thể thêm thông báo thành công ở đây nếu cần
      router.push("/login"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      // Có thể hiển thị thông báo lỗi ở đây nếu cần
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userService.getProfile();
      setProfile(response);
    };
    fetchProfile();
  }, []);

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-12 w-12 border-2 border-[#74a65d]/30">
              <AvatarImage
                src={profile?.avatar || "/avatar-placeholder.png"}
                alt={profile?.username || "User"}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Tài khoản</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Đơn hàng</span>
            </Link>
          </DropdownMenuItem>
          {profile?.role_name !== "Client" && (
            <DropdownMenuItem asChild>
              <Link href="/revenue">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Quản lý</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Đăng xuất</span>
          </DropdownMenuItem>
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
