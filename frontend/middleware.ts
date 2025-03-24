import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Danh sách các route cần đăng nhập
const authRoutes = [
  "/cart",
  "/wishlist",
  "/profile",
  "/orders",
  "/settings",
  "/checkout",
  "/checkout/success",
];

// Danh sách các API route cần đăng nhập
const authApiRoutes = [
  "/api/cart",
  "/api/wishlist",
  "/api/user",
  "/api/orders",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra xem route hiện tại có cần đăng nhập không
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthApiRoute = authApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Lấy token từ localStorage
  const token = localStorage.getItem("access_token") || null;

  // Nếu là route cần đăng nhập và không có token
  if ((isAuthRoute || isAuthApiRoute) && !token) {
    // Nếu là API route, trả về lỗi 401
    if (isAuthApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Nếu là route thông thường, chuyển hướng đến trang đăng nhập
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cụ thể
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

//cách dùng middleware:
// Path: frontend/pages/cart.tsx
// import { withAuth } from "@/lib/auth/with-auth";
//
// export default withAuth(function CartPage() { ... });
