"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import dynamic from "next/dynamic";
const UserAuthSection = dynamic(
  () => import("@/components/auth/user-auth-section"),
  {
    ssr: false,
  }
);

export function DashboardHeader() {


  return (
    <header className="flex h-16 items-center w-full justify-between border-b border-[#74a65d]/20 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-bold text-[#44703d]">Bảng điều khiển</h1>
      </div>

      <div className="relative hidden w-96 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74a65d]" />
        <Input
          placeholder="Tìm kiếm..."
          className="border-[#74a65d]/30 pl-10 focus-visible:ring-[#90c577]"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="relative border-[#74a65d]/30 text-[#74a65d] hover:bg-[#accc8b]/30 hover:text-[#599146]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
          <span className="sr-only">Thông báo</span>
        </Button>
        <UserAuthSection isScrolled={false} />

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar className="h-10 w-10 border-2 border-[#74a65d]/30">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="Avatar"
                />
                <AvatarFallback className="bg-[#90c577] text-white">
                  ND
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Thông báo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <Link href="/" className="text-red-500">
                <span>Trang chủ</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  );
}
