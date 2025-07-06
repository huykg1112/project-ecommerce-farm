"use client"

import { useAtom } from "jotai"
import { currentUserAtom } from "@/lib/auth"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, LogOut, User, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCallback } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  const router = useRouter()

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    router.push("/")
  }, [setCurrentUser, router])

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm"
      style={{
        backgroundColor: "#74a65d",
        borderBottomColor: "#599146",
      }}
    >
      <SidebarTrigger className="-ml-1" style={{ color: "#44703d" }} />

      <div className="flex-1 flex items-center gap-4 ml-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4" style={{ color: "#44703d" }} />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8 bg-white/90 border-[#599146] focus:border-[#44703d]"
            style={{ color: "#44703d" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-[#599146]/30">
          <Bell className="h-4 w-4" style={{ color: "#44703d" }} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#599146]/30">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.full_name} />
                <AvatarFallback style={{ backgroundColor: "#44703d", color: "white" }}>
                  {currentUser?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none" style={{ color: "#44703d" }}>
                  {currentUser?.full_name}
                </p>
                <p className="text-xs leading-none" style={{ color: "#74a65d" }}>
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-[#accc8b]/20">
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#accc8b]/20">
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
