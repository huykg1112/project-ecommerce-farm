"use client"

import type * as React from "react"
import { BarChart3, Users, Package, Settings, ShoppingCart, Leaf, ChevronRight, LogOut, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/sidebar"

// Navigation data with hierarchical structure
const data = {
  navMain: [
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Thống kê người dùng",
          url: "/dashboard/user-statistics",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Người dùng",
          url: "/dashboard/users",
        },
        {
          title: "Duyệt đại lý",
          url: "/dashboard/agency-requests",
        },
        {
          title: "Đại lý",
          url: "/dashboard/distributors",
        },
        {
          title: "Khách hàng",
          url: "/dashboard/customers",
        },
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Sản phẩm",
          url: "/dashboard/products",
        },
        {
          title: "Danh mục",
          url: "/dashboard/categories",
        },
        {
          title: "Hoạt chất",
          url: "/dashboard/active-ingredients",
        },
        {
          title: "Bệnh cây trồng",
          url: "/dashboard/diseases",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Đơn hàng",
          url: "/dashboard/orders",
        },
        {
          title: "Quản lý kho",
          url: "/dashboard/warehouses",
        },
        {
          title: "Khuyến mãi",
          url: "/dashboard/promotions",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Cài đặt hệ thống",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      style={
        {
          "--sidebar-background": "#74a65d",
          "--sidebar-foreground": "#44703d",
          "--sidebar-primary": "#44703d",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#599146",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "#599146",
          "--sidebar-ring": "#44703d",
        } as React.CSSProperties
      }
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-[#74a65d]">
                  <Leaf className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">FarmE Platform</span>
                  <span className="truncate text-xs text-white/80">Quản trị hệ thống</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.title === "Analytics"} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="group/label text-sm text-white hover:bg-[#599146] hover:text-white">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild className="text-white/90 hover:bg-[#599146] hover:text-white">
                          <a href={subItem.url}>{subItem.title}</a>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-[#599146] data-[state=open]:text-white hover:bg-[#599146] hover:text-white"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="rounded-lg bg-white text-[#74a65d]">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">Admin</span>
                    <span className="truncate text-xs text-white/80">admin@farme.vn</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-white/80" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder.svg" alt="Admin" />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin</span>
                      <span className="truncate text-xs">admin@farme.vn</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
