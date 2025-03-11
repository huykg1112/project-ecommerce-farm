"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/categories";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Camera, Heart, Search, ShoppingCart, X } from "lucide-react"; // Thêm X
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const categoryRef = useRef<HTMLLIElement>(null);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [searchValue, setSearchValue] = useState(""); // Thêm state cho giá trị tìm kiếm

  // Xử lý thay đổi màu nền header khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setOpenCategory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainNavItems = [
    { name: "Trang Chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
  ];

  // Hàm xóa nội dung tìm kiếm
  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isScrolled ? "bg-[#90c577] shadow-md" : "bg-white border-b"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={cn(
                "font-bold text-2xl",
                isScrolled ? "text-white" : "text-primary"
              )}
            >
              Farme
            </span>
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              {mainNavItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-base font-medium flex items-center transition-colors duration-200",
                      isScrolled ? "text-white" : "text-gray-700",
                      "hover:text-[#599146] relative"
                    )}
                  >
                    {item.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-full h-0.5 bg-[#599146] transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",
                        isScrolled && "bg-white"
                      )}
                    />
                  </Link>

                  {openCategory && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md border py-3 z-50 animate-in slide-in-from-top-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-base text-gray-700 hover:bg-[#90c577] hover:text-white transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-lg hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm Kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-20 py-3 rounded-full border-gray-300", // Tăng pr-14 lên pr-20 để tạo không gian
                  "focus:outline-none focus:border-[#599146] focus:ring-2 focus:ring-[#599146] focus:ring-opacity-50"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5 text-[#599146]" /> {/* Màu #599146 */}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Camera className="h-5 w-5 text-[#599146]" />{" "}
                  {/* Màu #599146 */}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Search className="h-5 w-5 text-[#599146]" />{" "}
                  {/* Màu #599146 */}
                </Button>
              </div>
            </div>
          </div>

          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative", isScrolled && "text-white")}
            >
              <Heart className="h-6 w-6" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative", isScrolled && "text-white")}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar.jpg" alt="User" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-[#599146] hover:bg-[#44703d] text-white text-base px-6 py-2">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
