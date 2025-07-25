"use client";

import Logo from "@/assets/logo/logoFarme2.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { getCookie } from "@/lib/utils";
import {
  BarChart3,
  BookText,
  Box,
  ChevronRight,
  Factory,
  FileCheck,
  FlaskConical,
  Home,
  Leaf,
  LineChart,
  LogOut,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  TicketSlash,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const user = JSON.parse(getCookie("user") || "{}");
  const userRole = user.role_name || "CLIENT";

  const menuItems = {
    navMain: [
      {
        title: "Tổng quan",
        url: "#",
        icon: BarChart3,
        items: [
          ...(userRole !== "Distributor"
            ? [
                {
                  title: "Dashboard",
                  url: "/dashboard",
                  icon: Home,
                },
                {
                  title: "Thống kê người dùng",
                  url: "/user-statistics",
                  icon: BarChart3,
                },
              ]
            : []),
          {
            title: "Thống kê doanh thu",
            url: "/revenue",
            icon: LineChart,
          },
        ],
      },
      ...(userRole !== "Distributor"
        ? [
            {
              title: "Quản lý người dùng",
              url: "#",
              icon: Users,
              items: [
                {
                  title: "Người dùng",
                  url: "/users-management",
                  icon: UsersRound,
                },
                {
                  title: "Duyệt đại lý",
                  url: "/agency-requests",
                  icon: FileCheck,
                },
              ],
            },
          ]
        : []),
      {
        title: "Quản lý sản phẩm",
        url: "#",
        icon: Package,
        items: [
          {
            title: "Sản phẩm",
            url: "/products-management",
            icon: Box,
          },
          ...(userRole !== "Distributor"
            ? [
                {
                  title: "Danh mục",
                  url: "/categories-management",
                  icon: BookText,
                },
              ]
            : []),
          {
            title: "Hoạt chất",
            url: "/ingredients-management",
            icon: FlaskConical,
          },
          {
            title: "Bệnh cây trồng",
            url: "/diseases-management",
            icon: Leaf,
          },
          ...(userRole !== "Distributor"
            ? [
                {
                  title: "Nhà sản xuất",
                  url: "/manufacturer-management",
                  icon: Factory,
                },
              ]
            : []),
        ],
      },
      {
        title: "Quản lý hoạt động",
        url: "#",
        icon: ShoppingCart,
        items: [
          {
            title: "Đơn hàng",
            url: "/orders-management",
            icon: ShoppingBag,
          },
          {
            title: "Quản lý kho",
            url: "/batch-products-management",
            icon: Warehouse,
          },
          ...(userRole !== "Distributor"
            ? [
                {
                  title: "Voucher",
                  url: "vouchers-management",
                  icon: TicketSlash,
                },
              ]
            : []),
          {
            title: "Khuyến mãi",
            url: "promotion-management",
            icon: Percent,
          },
          ...(userRole !== "Distributor"
            ? [
                {
                  title: "Đánh giá",
                  url: "/reviews-management",
                  icon: Star,
                },
              ]
            : []),
        ],
      },
    ],
  };

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
          <span className="text-2xl font-bold text-white">FramE</span>
          <span className="text-sm text-[#accc8b]">Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto pt-4">
        {menuItems.navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.title === "Tổng quan"}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="group/label text-lg font-medium text-white hover:bg-[#599146] hover:text-white">
                  <div className="flex items-center gap-3">
                    <item.icon className="size-5" />
                    <span className="text-lg font-medium">{item.title}</span>
                  </div>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title} className="ml-3">
                        <SidebarMenuButton
                          asChild
                          className="text-white/90 hover:bg-[#599146] hover:text-white text-base font-medium"
                        >
                          <Link href={subItem.url}>
                            <subItem.icon className="size-5" />
                            {subItem.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
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
