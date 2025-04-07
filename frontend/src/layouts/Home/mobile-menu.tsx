"use client";

import Logo from "@/assets/logo/logoFarme2.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories } from "@/data/categories";
import type { AppDispatch, RootState } from "@/lib/cart/store";
import { logoutUser } from "@/lib/features/user-slice";
import { cn } from "@/lib/utils";
import {
  FileText,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface MobileMenuProps {
  isScrolled: boolean;
}

export default function MobileMenu({ isScrolled }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  const { totalItems: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setOpen(false);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  const mainNavItems = [
    { name: "Trang Chủ", href: "/", icon: <Home className="h-5 w-5 mr-2" /> },
    {
      name: "Sản phẩm",
      href: "/products",
      icon: <ShoppingBag className="h-5 w-5 mr-2" />,
    },
    {
      name: "Cửa hàng & Đại lý",
      href: "/stores",
      icon: <Package className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
    {
      name: "Blog",
      href: "/blog",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      name: "Liên hệ",
      href: "/contact",
      icon: <Phone className="h-5 w-5 mr-2" />,
    },
  ];

  const userNavItems = [
    {
      name: "Tài khoản",
      href: "/profile",
      icon: <User className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
    {
      name: "Đơn hàng",
      href: "/orders",
      icon: <Package className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
    {
      name: "Yêu thích",
      href: "/wishlist",
      icon: <Heart className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
    {
      name: "Giỏ hàng",
      href: "/cart",
      icon: <ShoppingBag className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
    {
      name: "Cài đặt",
      href: "/settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
      requireAuth: true,
    },
  ];

  const handleAuthRequiredClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, đóng menu và chuyển hướng đến trang đăng nhập
      setOpen(false);
      router.push("/login");
      return;
    }

    // Nếu đã đăng nhập, chuyển hướng đến trang tương ứng
    router.push(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", isScrolled && "text-white")}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 ml-4">
                <Image
                  src={Logo}
                  alt="Farme Logo"
                  width={130}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {/* User section */}
          {isAuthenticated ? (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>
                    {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {currentUser?.username || "Người dùng"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-1" />
                    Tài khoản
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b">
              <p className="text-sm text-gray-500 mb-3">
                Đăng nhập để trải nghiệm đầy đủ tính năng
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/login?tab=register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Main navigation */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Menu chính
            </h3>
            <nav>
              <ul className="space-y-1">
                {mainNavItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100",
                        pathname === item.href && "bg-gray-100 font-medium"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Categories */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Danh mục sản phẩm
            </h3>
            <nav>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.name}`}
                      className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      {category.name}
                      <span className="ml-auto text-xs text-gray-500">
                        {category.productCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* User specific navigation - only shown when logged in */}
          {isAuthenticated && (
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Tài khoản & Mua sắm
              </h3>
              <nav>
                <ul className="space-y-1">
                  {userNavItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100",
                          pathname === item.href && "bg-gray-100 font-medium"
                        )}
                        onClick={(e) =>
                          item.requireAuth
                            ? handleAuthRequiredClick(e, item.href)
                            : undefined
                        }
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}

          {/* Support section */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Hỗ trợ</h3>
            <nav>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/help"
                    className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <SheetFooter className="p-4 border-t text-center">
          <p className="text-xs text-gray-500">
            © 2023 Nông Sàn. Tất cả các quyền được bảo lưu.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
