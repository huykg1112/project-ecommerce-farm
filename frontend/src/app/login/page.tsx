"use client";

import Logo from "@/assets/logo/logoFarme2.png";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppDispatch, RootState } from "@/lib/features/store";
import {
  clearError,
  loginUser,
  registerUser,
  setUser,
} from "@/lib/features/user-slice";
import { authService } from "@/lib/services/auth-service";
import { userService } from "@/lib/services/user-service"; // Thêm import
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("login");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  // Xử lý token từ Google callback và đăng nhập tự động
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (accessToken && refreshToken) {
        authService.saveGoogleTokens(accessToken, refreshToken);
        try {
          const profile = await userService.getProfile(); // Gọi userService thay vì fetchUserProfile
          dispatch(
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
              fullName: profile.fullName,
              phone: profile.phone,
              address: profile.address,
              avatar: profile.avatar,
              roleName: profile.roleName,
            })
          );
          router.push(callbackUrl);
        } catch (err) {
          console.error("Failed to fetch profile after Google login:", err);
          // Có thể thêm logic xóa token nếu profile không lấy được
          authService.removeToken();
        }
      }
    };

    handleGoogleLogin();
  }, [accessToken, refreshToken, dispatch, router, callbackUrl]);

  // Kiểm tra đăng nhập tự động khi reload trang
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && authService.isAuthenticated()) {
        try {
          const profile = await userService.getProfile();
          dispatch(
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
              fullName: profile.fullName,
              phone: profile.phone,
              address: profile.address,
              avatar: profile.avatar,
              roleName: profile.roleName,
            })
          );
          router.push(callbackUrl);
        } catch (err) {
          console.error("Failed to auto-login:", err);
          authService.removeToken();
          dispatch(clearError());
        }
      } else if (isAuthenticated) {
        router.push(callbackUrl);
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch, router, callbackUrl]);

  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      loginUser({
        username: loginUsername,
        password: loginPassword,
      })
    );
    if (loginUser.fulfilled.match(result)) {
      router.push(callbackUrl);
    }
  };

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
      setActiveTab("login");
      setLoginUsername(registerUsername);
      setLoginPassword("");
    }
  };

  const handleGoogleLogin = () => {
    authService.initiateGoogleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Nông Sàn Logo" width={400} height={400} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm
              username={loginUsername}
              setUsername={setLoginUsername}
              password={loginPassword}
              setPassword={setLoginPassword}
              showPassword={showLoginPassword}
              setShowPassword={setShowLoginPassword}
              error={error}
              loading={loading}
              handleSubmit={handleLogin}
              handleGoogleLogin={handleGoogleLogin}
            />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm
              username={registerUsername}
              setUsername={setRegisterUsername}
              email={registerEmail}
              setEmail={setRegisterEmail}
              phone={registerPhone}
              setPhone={setRegisterPhone}
              password={registerPassword}
              setPassword={setRegisterPassword}
              showPassword={showRegisterPassword}
              setShowPassword={setShowRegisterPassword}
              error={error}
              loading={loading}
              handleSubmit={handleRegister}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
