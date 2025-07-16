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
import type { AppDispatch } from "@/lib/features/store";
import { logoutUser, updateAvatar } from "@/lib/features/user-slice";

import { userService } from "@/lib/services/user-service";

import AddressMapPicker, {
  type AddressData,
} from "@/components/map/address-map-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChangePasswordDto,
  UpdateProfileDto,
  UserAddress,
  UserProfile,
} from "@/interfaces";
import { withAuth } from "@/lib/auth/with-auth";
import { showToast } from "@/lib/toast-provider";
import { deleteCookie } from "@/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  Heart,
  LayoutDashboard,
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
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState<
    string | undefined
  >();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<UserAddress>>({
    address_detail: "",
    latitude: 0,
    longitude: 0,
  });

  const dispatch = useDispatch<AppDispatch>();

  // Form states
  const [formData, setFormData] = useState<UpdateProfileDto>({
    full_name: "",
    phone_number: "",
    address: "",
    email: "",
    lat: 0,
    lng: 0,
    cccd: "",
    license_number: "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordDto>({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Fetch profile data
  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        let address = [
          {
            address_detail: "",
            latitude: 0,
            longitude: 0,
          },
        ] as UserAddress[];
        if (data.addresses.length) {
          address = data.addresses;
        }
        // Kiểm tra và xác thực tọa độ
        const lat =
          address[0].latitude && !isNaN(Number(address[0].latitude))
            ? Number(address[0].latitude)
            : 0;
        const lng =
          address[0].longitude && !isNaN(Number(address[0].longitude))
            ? Number(address[0].longitude)
            : 0;

        setFormData({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          address: address[0].address_detail || "",
          email: data.email || "",
          lat: lat,
          lng: lng,
          cccd: data.cccd || "",
          license_number: data.license_number || "",
        });
        setProfile(data);
        // lọc các địa có is_active là true và is_deleted là false
        address = address.filter((addr) => addr.is_active && !addr.is_deleted);

        setAddresses(address);
        const def = address.find((a) => a.is_default);
        setDefaultAddressId(def?.address_id);
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        if (
          error.message.includes("Unauthorized") ||
          error.message.includes("Session expired")
        ) {
          showToast.error(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          dispatch(logoutUser());
          router.push("/login");
        } else {
          showToast.error(
            error.message || "Có lỗi xảy ra khi tải thông tin cá nhân"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, router, userService]);

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

  // Handle address change from map picker
  const handleAddressChange = (address: AddressData) => {
    setFormData((prev) => ({
      ...prev,
      address: address.fullAddress,
      lat: address.latitude,
      lng: address.longitude,
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
      setAddresses(
        updatedProfile.addresses.filter(
          (addr) => addr.is_active && !addr.is_deleted
        )
      );
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
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);
      await userService.changePassword(passwordData);
      showToast.success("Đổi mật khẩu thành công");

      // Reset password form
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      console.error("Failed to change password:", error);
      showToast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng và kích thước file
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(file.type)) {
      showToast.error("Chỉ hỗ trợ file JPG, PNG hoặc GIF");
      return;
    }
    if (file.size > maxSize) {
      showToast.error("Kích thước file không được vượt quá 10MB");
      return;
    }

    try {
      setUploadingAvatar(true);
      await dispatch(updateAvatar(file)).unwrap();
      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
      showToast.success("Cập nhật avatar thành công");
    } catch (error: any) {
      showToast.error(error.message || "Cập nhật avatar thất bại");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSetDefault = async (address_id: string) => {
    try {
      await userService.setDefaultAddress(address_id);
      setDefaultAddressId(address_id);
      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
      setAddresses(
        updatedProfile.addresses.filter(
          (addr) => addr.is_active && !addr.is_deleted
        )
      );

      showToast.success("Đã cập nhật địa chỉ mặc định");
    } catch (error: any) {
      showToast.error(error.message || "Không thể cập nhật địa chỉ mặc định");
    }
  };

  const handleDeleteAddress = async (address_id: string) => {
    try {
      await userService.deleteAddress(address_id);

      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
      setAddresses(
        updatedProfile.addresses.filter(
          (addr) => addr.is_active && !addr.is_deleted
        )
      );
      if (defaultAddressId === address_id) {
        setDefaultAddressId(undefined);
      }
      setDefaultAddressId(
        updatedProfile.addresses.find((addr) => addr.is_default)?.address_id
      );
      showToast.success("Đã xóa địa chỉ");
    } catch (error: any) {
      showToast.error(error.message || "Không thể xóa địa chỉ");
    }
  };

  const handleAddAddress = async () => {
    try {
      await userService.addAddress({
        address_detail: newAddress.address_detail,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        is_default: false,
      });
      setShowAddAddress(false);
      setNewAddress({ address_detail: "", latitude: 0, longitude: 0 });
      const updatedProfile = await userService.getProfile();
      setAddresses(
        updatedProfile.addresses.filter(
          (addr) => addr.is_active && !addr.is_deleted
        )
      );
      setDefaultAddressId(
        updatedProfile.addresses.find((addr) => addr.is_default)?.address_id
      );
      setProfile(updatedProfile);
      showToast.success("Đã thêm địa chỉ mới");
    } catch (error: any) {
      showToast.error(error.message || "Không thể thêm địa chỉ");
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
      showToast.success("Đăng xuất thành công");
      router.push("/");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      // Có thể hiển thị thông báo lỗi ở đây nếu cần
    }
  };

  const handleShowCurrentPassword = () => {
    setIsShowCurrentPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev);
  };

  const handleShowNewPassword = () => {
    setIsShowNewPassword((prev) => !prev);
  };

  const handleRoutingDashboard = () => {
    router.push("/dashboard");
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
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

                {profile?.role_name !== "Client" && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-transparent  hover:bg-red-50"
                    onClick={handleRoutingDashboard}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Trang quản lý
                  </Button>
                )}
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
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Họ và tên</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Nguyễn Văn A"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone_number">Số điện thoại</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="0912345678"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="example@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cccd">Căn cước công dân</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="cccd"
                            name="cccd"
                            value={formData.cccd}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Nhập số CCCD"
                          />
                        </div>
                      </div>
                    </div>
                    {profile?.role_name === "Distributor" && (
                      <div className="md:col-span-2">
                        <div>
                          <Label htmlFor="license">
                            Mã giấy phép kinh doanh
                          </Label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                              id="license"
                              name="license"
                              value={formData.license_number}
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Nhập mã giấy phép kinh doanh"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Address List UI */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="font-bold">Địa chỉ giao hàng</Label>
                        <Button
                          type="button"
                          onClick={() => setShowAddAddress(true)}
                        >
                          Thêm địa chỉ
                        </Button>
                      </div>
                      <RadioGroup
                        value={defaultAddressId}
                        onValueChange={handleSetDefault}
                      >
                        {addresses &&
                          addresses.length > 0 &&
                          addresses[0].address_detail !== "" &&
                          addresses.map((addr) => (
                            <div
                              key={addr.address_id}
                              className="flex items-center gap-2 mb-2"
                            >
                              <RadioGroupItem value={addr.address_id} />
                              <span>{addr.address_detail}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {addr.is_default ? "(Mặc định)" : ""}
                              </span>
                              {!addr.is_default && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  type="button"
                                  onClick={() =>
                                    handleDeleteAddress(addr.address_id)
                                  }
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          ))}
                      </RadioGroup>
                    </div>

                    {/* Address Map Picker */}
                    <div>
                      <Label className="flex items-center mb-2">
                        <MapPin className="mr-2 h-4 w-4" />
                        Địa chỉ
                      </Label>
                      <AddressMapPicker
                        onAddressChange={handleAddressChange}
                        initialAddress={{
                          fullAddress: formData.address || "",
                          latitude: formData.lat || 0,
                          longitude: formData.lng || 0,
                        }}
                      />
                    </div>

                    <Button type="submit" disabled={updating}>
                      {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Dialog thêm địa chỉ */}
              <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                  </DialogHeader>
                  <div className="mb-4">
                    <Label>Địa chỉ</Label>
                    <Input
                      value={newAddress.address_detail || ""}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address_detail: e.target.value,
                        })
                      }
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <div className="mb-4">
                    <Label>Chọn vị trí trên bản đồ</Label>
                    <AddressMapPicker
                      onAddressChange={(addr) =>
                        setNewAddress({
                          ...newAddress,
                          address_detail: addr.fullAddress,
                          latitude: addr.latitude,
                          longitude: addr.longitude,
                        })
                      }
                      initialAddress={{
                        fullAddress: newAddress.address_detail || "",
                        latitude: newAddress.latitude || 0,
                        longitude: newAddress.longitude || 0,
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAddress}>Lưu</Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Hủy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                        <Label htmlFor="old_password">Mật khẩu hiện tại</Label>
                        <div className="relative">
                          <Input
                            id="old_password"
                            name="old_password"
                            type={isShowCurrentPassword ? "text" : "password"}
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            required
                          />
                          {isShowCurrentPassword ? (
                            <EyeIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowCurrentPassword}
                            />
                          ) : (
                            <EyeOffIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowCurrentPassword}
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new_password">Mật khẩu mới</Label>
                        <div className="relative">
                          <Input
                            id="new_password"
                            name="new_password"
                            type={isShowNewPassword ? "text" : "password"}
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            required
                          />
                          {isShowNewPassword ? (
                            <EyeIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowNewPassword}
                            />
                          ) : (
                            <EyeOffIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowNewPassword}
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                          thường, số và ký tự đặc biệt
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                          Xác nhận mật khẩu mới
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm_password"
                            name="confirm_password"
                            type={isShowConfirmPassword ? "text" : "password"}
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            required
                          />
                          {isShowConfirmPassword ? (
                            <EyeIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowConfirmPassword}
                            />
                          ) : (
                            <EyeOffIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={handleShowConfirmPassword}
                            />
                          )}
                        </div>
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

export default withAuth(ProfilePage);
// export default ProfilePage;
