import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type React from "react";
import PasswordInput from "./PasswordInput";

interface RegisterFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string | string[] | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setActiveTab: (tab: string) => void;
}

export default function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  loading,
  handleSubmit,
  setActiveTab,
}: RegisterFormProps) {
  const formatErrorMessage = (error: string | string[]) => {
    if (Array.isArray(error)) {
      return (
        <ul className="list-disc pl-5">
          {error.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      );
    }
    return error;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản để trải nghiệm Nông Sàn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formatErrorMessage(error)}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-username">Username</Label>
            <Input
              id="register-username"
              type="text"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-phone">Số điện thoại</Label>
            <Input
              id="register-phone"
              type="tel"
              placeholder="0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Mật khẩu</Label>
            <PasswordInput
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
            />
            <p className="text-xs text-gray-500">
              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số
              và ký tự đặc biệt.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal">
              Tôi đồng ý với{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Bạn đã có tài khoản?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
