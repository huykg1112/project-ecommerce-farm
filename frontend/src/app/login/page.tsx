"use client";

import type React from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clearError, loginUser, registerUser } from "@/lib/features/user-slice";
import type { AppDispatch, RootState } from "@/lib/store";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState("login");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get user state from Redux
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      loginUser({
        username: loginUsername,
        password: loginPassword,
      })
    );
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      // Registration successful, switch to login tab
      setActiveTab("login");
      // Pre-fill login form with registered username
      setLoginUsername(registerUsername);
      setLoginPassword("");
    }
  };

  // Toggle password visibility
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  // Format error messages for display
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Nông Sàn Logo" width={60} height={60} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Đăng nhập
                </CardTitle>
                <CardDescription className="text-center">
                  Đăng nhập để tiếp tục mua sắm trên Nông Sàn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      {formatErrorMessage(error)}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nhập username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={toggleLoginPasswordVisibility}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">
                        Hoặc đăng nhập với
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Image
                        src="/icons/google.svg"
                        width={20}
                        height={20}
                        alt="Google"
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Image
                        src="/icons/facebook.svg"
                        width={20}
                        height={20}
                        alt="Facebook"
                        className="mr-2"
                      />
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
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
                    <AlertDescription>
                      {formatErrorMessage(error)}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Nhập username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="example@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Số điện thoại</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="0912345678"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={toggleRegisterPasswordVisibility}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ
                      thường, số và ký tự đặc biệt.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      Tôi đồng ý với{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
