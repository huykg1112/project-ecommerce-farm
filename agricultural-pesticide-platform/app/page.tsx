"use client"

import { useEffect } from "react"
import { useAtom } from "jotai"
import { currentUserAtom, mockUsers } from "@/lib/auth"
import { redirect } from "next/navigation"

export default function LoginPage() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  // Auto-login with Admin role
  useEffect(() => {
    if (!currentUser) {
      const adminUser = mockUsers.find((u) => u.role.role_name === "ADMIN")
      if (adminUser) {
        setCurrentUser(adminUser)
        // Redirect immediately after setting user
        redirect("/dashboard")
      }
    }
  }, [currentUser, setCurrentUser])

  // Show loading while auto-login is happening
  return (
    <div className="min-h-screen flex items-center justify-center agricultural-texture">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74a65d] mx-auto"></div>
        <p className="mt-4 text-[#44703d]">Đang đăng nhập tự động...</p>
      </div>
    </div>
  )
}
