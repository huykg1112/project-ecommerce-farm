"use client";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clearError, loginUser, registerUser } from "@/lib/features/user-slice";
import type { AppDispatch, RootState } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
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
      setActiveTab("login");
      setLoginUsername(registerUsername);
      setLoginPassword("");
    }
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
