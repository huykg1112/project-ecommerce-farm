"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { withAuth } from "@/lib/auth/with-auth";
import type { AppDispatch } from "@/lib/cart/store";
import { logoutUser } from "@/lib/features/user-slice";
import { userService } from "@/lib/services/user-service";
import { showToast } from "@/lib/toast-provider";

import {
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ChangePasswordDto, UpdateProfileDto, UserProfile } from "@/interfaces";

function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Form states
  const [formData, setFormData] = useState<UpdateProfileDto>({
    fullName: "",
    phone: "",
    address: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordDto>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showToast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await userService.updateProfile(formData);
      showToast.success("Cập nhật thông tin thành công");

      // Refresh profile data
      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showToast.error(error.message || "Cập nhật thông tin thất bại");
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);
      await userService.changePassword(passwordData);
      showToast.success("Đổi mật khẩu thành công");

      // Reset password form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Failed to change password:", error);
      showToast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // Có thể thêm thông báo thành công ở đây nếu cần
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      // Có thể hiển thị thông báo lỗi ở đây nếu cần
    }
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Tài khoản của tôi</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={profile?.avatar || "/avatar-placeholder.png"}
                    alt={profile?.username || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {profile?.fullName || profile?.username}
                </h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                    {profile?.roleName}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </Button>
                <Button
                  variant={activeTab === "password" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("password")}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Đổi mật khẩu
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Đơn hàng của tôi
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Sản phẩm yêu thích
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt tài khoản
                </Button>
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
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn để tận dụng tối đa các
                    tính năng của Nông Sàn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                          id="username"
                          value={profile?.username || ""}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Tên đăng nhập không thể thay đổi
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@example.com"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="0912345678"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ của bạn"
                            className="pl-10 min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark"
                        disabled={updating}
                      >
                        {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>
                    Cập nhật mật khẩu của bạn để bảo vệ tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                        <Input
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                          thường, số và ký tự đặc biệt
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu mới
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark"
                        disabled={changingPassword}
                      >
                        {changingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng của tôi</CardTitle>
                  <CardDescription>
                    Xem lịch sử đơn hàng và trạng thái đơn hàng của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                    </p>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <Link href="/products">Mua sắm ngay</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm yêu thích</CardTitle>
                  <CardDescription>
                    Danh sách các sản phẩm bạn đã đánh dấu yêu thích
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Chưa có sản phẩm yêu thích
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bạn chưa thêm sản phẩm nào vào danh sách yêu thích
                    </p>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <Link href="/products">Khám phá sản phẩm</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý các cài đặt cho tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Thông báo</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email thông báo</p>
                            <p className="text-sm text-gray-500">
                              Nhận thông báo về đơn hàng qua email
                            </p>
                          </div>
                          <div className="flex items-center h-5">
                            <input
                              id="email-notifications"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS thông báo</p>
                            <p className="text-sm text-gray-500">
                              Nhận thông báo về đơn hàng qua SMS
                            </p>
                          </div>
                          <div className="flex items-center h-5">
                            <input
                              id="sms-notifications"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Quyền riêng tư
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Hiển thị thông tin liên hệ
                            </p>
                            <p className="text-sm text-gray-500">
                              Cho phép người bán xem thông tin liên hệ của bạn
                            </p>
                          </div>
                          <div className="flex items-center h-5">
                            <input
                              id="show-contact"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-red-600 mb-2">
                        Xóa tài khoản
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Khi bạn xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa
                        vĩnh viễn. Hành động này không thể hoàn tác.
                      </p>
                      <Button variant="destructive">Xóa tài khoản</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// export default withAuth(ProfilePage);
export default ProfilePage;
