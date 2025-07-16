import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/interfaces";
import {
  Heart,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

interface ProfileSidebarProps {
  profile: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  uploadingAvatar: boolean;
  handleAvatarClick: () => void;
  handleLogout: () => void;
}

function ProfileSidebar({
  profile,
  activeTab,
  setActiveTab,
  uploadingAvatar,
  handleAvatarClick,
  handleLogout,
}: ProfileSidebarProps) {
  const navItems = [
    { tab: "profile", icon: User, label: "Thông tin cá nhân" },
    { tab: "password", icon: ShieldCheck, label: "Đổi mật khẩu" },
    { tab: "orders", icon: Package, label: "Đơn hàng của tôi" },
    { tab: "wishlist", icon: Heart, label: "Sản phẩm yêu thích" },
    { tab: "settings", icon: Settings, label: "Cài đặt tài khoản" },
  ];

  return (
    <div className="md:col-span-1">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar
                className="h-24 w-24 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={profile?.avatar || "/avatar-placeholder.png"}
                  alt={profile?.username || "User"}
                />
                <AvatarFallback className="text-2xl">
                  {profile?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">
              {profile?.full_name || profile?.username}
            </h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                {profile?.role_name}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ tab, icon: Icon, label }) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
