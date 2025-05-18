import AddressMapPicker, { AddressData } from "@/components/map/address-map-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface RegisterStoreFormProps {
  error: string | string[] | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export default function RegisterStoreForm({
  error,
  loading,
  handleSubmit,
  setActiveTab,
}: RegisterStoreFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
    cccd: "",
    license: "",
    lat: 0,
    lng: 0,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (address: AddressData) => {
    setFormData(prev => ({
      ...prev,
      address: address.fullAddress,
      lat: address.latitude,
      lng: address.longitude,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    await handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cccd">Căn cước công dân</Label>
        <Input
          id="cccd"
          name="cccd"
          type="text"
          value={formData.cccd}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license">Mã giấy phép kinh doanh</Label>
        <Input
          id="license"
          name="license"
          type="text"
          value={formData.license}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Địa chỉ</Label>
        <AddressMapPicker
          onAddressChange={handleAddressChange}
          initialAddress={{
            fullAddress: formData.address,
            latitude: formData.lat,
            longitude: formData.lng,
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {Array.isArray(error) ? error[0] : error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="link"
          onClick={() => setActiveTab("login")}
        >
          Đã có tài khoản? Đăng nhập
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký đại lý"}
        </Button>
      </div>
    </form>
  );
} 