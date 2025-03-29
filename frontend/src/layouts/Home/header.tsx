"use client";

import Logo from "@/assets/logo/logoFarme2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/categories";
import { RootState } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import { Camera, Heart, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

// Sử dụng dynamic import cho phần user authentication
const UserAuthSection = dynamic(
  () => import("../../components/auth/user-auth-section"),
  {
    ssr: false,
  }
);
const CartButton = dynamic(
  () => import("../../components/products/cart-button"),
  {
    ssr: false,
  }
);
const MobileMenu = dynamic(() => import("./mobile-menu"), { ssr: false });
const SearchModal = dynamic(() => import("./search-modal"), { ssr: false });

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const categoryRef = useRef<HTMLLIElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: "Trang Chủ", href: "/home" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Cưa hàng & Đại lý", href: "/stores" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
  ];

  // Hàm xóa nội dung tìm kiếm
  const clearSearch = () => {
    setSearchValue("");
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      router.push("/login");
      return;
    }

    // Nếu đã đăng nhập, chuyển hướng đến trang yêu thích
    router.push("/wishlist");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isScrolled ? "bg-[#7baa66] shadow-md" : "bg-[#f1f1f1f1] border-b"
      )}
    >
      <div className="container flex h-[90px] items-center justify-between">
        <div className="md:hidden">
          <MobileMenu isScrolled={isScrolled} />
        </div>
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

          <nav className="hidden md:flex pt-2">
            <ul className="flex space-x-8">
              {mainNavItems.map((item, index) => {
                const isActive = pathname === item.href; // Kiểm tra trang hiện tại
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-xl font-semibold flex items-center transition-all duration-200 relative group",
                        isScrolled ? "text-white" : "text-gray-700",
                        isActive ? "text-[#599146]" : "hover:text-[#599146]"
                      )}
                    >
                      {item.name}
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 w-full h-0.5 bg-[#599146] transform scale-x-0 origin-left transition-transform duration-300 ease-in-out",
                          isActive ? "scale-x-100" : "group-hover:scale-x-100",
                          isScrolled && "bg-[#477e35]"
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
                );
              })}
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
                  "w-full pl-12 pr-20 py-3 rounded-full border-gray-300",
                  "focus:outline-none focus:border-[#599146] focus:ring-2 focus:ring-[#599146] focus:ring-opacity-50"
                )}
                //bắt đầu tìm kiếm khi nhấn Enter
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5 text-[#599146]" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Camera className="h-5 w-5 text-[#599146]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 text-[#599146]" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", isScrolled && "text-white")}
            onClick={() => setSearchModalOpen(true)}
          >
            <Search className="h-6 w-6" />
          </Button>
          <Link href="/wishlist" className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative", isScrolled && "text-white")}
              onClick={handleWishlistClick}
            >
              <Heart className="h-6 w-6" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          <div className="hidden sm:block cart-button-header">
            <CartButton isScrolled={isScrolled} />
          </div>

          <UserAuthSection isScrolled={isScrolled} />
        </div>
      </div>
      <SearchModal isOpen={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </header>
  );
}
