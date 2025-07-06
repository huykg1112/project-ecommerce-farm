"use client"

import type React from "react"
import { useAtom } from "jotai"
import { currentUserAtom, userRoleAtom } from "@/lib/auth"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DistributorSidebar } from "@/components/layout/distributor-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser] = useAtom(currentUserAtom)
  const [userRole] = useAtom(userRoleAtom)

  // Redirect unauthenticated users on the client
//  useEffect(() => {
 //   if (!currentUser) {
//      router.replace("/")
 //   }
 // }, [currentUser, router])

  //if (!currentUser) {
  //  return null
 // }

  const SidebarComponent = AdminSidebar ;
  //const SidebarComponent = userRole === "ADMIN" ? AdminSidebar : DistributorSidebar

  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 agricultural-texture min-h-screen">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
