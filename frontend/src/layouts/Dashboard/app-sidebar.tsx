"use client";

import Logo from "@/assets/logo/logoFarme2.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  ChevronRight,
  FolderTree,
  Leaf,
  LogOut,
  PieChart,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      label: "Bảng điều khiển",
      icon: BarChart3,
      href: "/dashboard",
    },
    {
      id: "users-management",
      label: "Quản lý người dùng",
      icon: Users,
      href: "/users-management",
    },
    {
      id: "user-statistics",
      label: "Thống kê người dùng",
      icon: TrendingUp,
      href: "/user-statistics",
    },
    {
      id: "categories-management",
      label: "Quản lý danh mục",
      icon: FolderTree,
      href: "/categories-management",
    },
    {
      id: "category-statistics",
      label: "Thống kê danh mục",
      icon: PieChart,
      href: "/category-statistics",
    },
    {
      id: "products-management",
      label: "Quản lý sản phẩm",
      icon: ShoppingCart,
      href: "/products-management",
    },
    {
      id: "ingredients-management",
      label: "Thành phần sản phẩm",
      icon: Leaf,
      href: "/ingredients-management",
    },
  ];

  return (
    <Sidebar className="h-screen flex-col w-72 bg-[#44703d] text-white">
      <SidebarHeader className="flex flex-row h-16 items-center gap-3 border-b border-[#599146] px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
          <Image
            src={Logo}
            alt="Farme Logo"
            width={130}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white">FramE</span>
          <span className="text-xs text-[#accc8b]">Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 px-3 text-sm font-semibold uppercase text-[#accc8b]">
            Quản lý hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === item.id}
                    className={`flex items-center gap-3 rounded-md px-4 py-5 text-[15px] font-medium transition-colors ${
                      activeItem === item.id
                        ? "bg-[#599146] text-white"
                        : "text-[#e0e0e0] hover:bg-[#599146]/70 hover:text-white"
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium text-base">
                        {item.label}
                      </span>
                      {activeItem === item.id && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-[#599146] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium text-[#e0e0e0] transition-colors hover:bg-[#599146]/70 hover:text-white"
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Cài đặt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium text-[#e0e0e0] transition-colors hover:bg-[#599146]/70 hover:text-white">
              <LogOut className="h-5 w-5" />
              <Link href="/">
                <span>Trang chủ</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
