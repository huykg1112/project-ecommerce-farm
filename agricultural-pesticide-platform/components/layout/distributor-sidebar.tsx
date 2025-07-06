"use client"

import { BarChart3, Package, ShoppingCart, Warehouse, Percent, FlaskConical, Leaf } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

const distributorMenuItems = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", url: "/dashboard", icon: BarChart3 }],
  },
  {
    title: "Inventory",
    items: [
      { title: "My Products", url: "/dashboard/products", icon: Package },
      { title: "Batch Management", url: "/dashboard/batches", icon: Warehouse },
      { title: "Ingredients", url: "/dashboard/ingredients", icon: FlaskConical },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
      { title: "Promotions", url: "/dashboard/promotions", icon: Percent },
    ],
  },
]

export function DistributorSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary-strong" />
          <span className="font-bold text-lg text-primary-deep">FarmE Distributor</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {distributorMenuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
