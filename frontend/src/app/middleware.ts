import { store } from "@/lib/features/store";
import { refreshToken } from "@/lib/features/user-slice";
import { isTokenExpired } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = [
  "/cart",
  "/wishlist",
  "/profile",
  "/orders",
  "/settings",
  "/checkout",
  "/checkout/success",
];

const authApiRoutes = ["/cart", "/wishlist", "/user", "/orders"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthApiRoute = authApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Chỉ chạy ở phía client
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("access_token");

    // Nếu có token và route yêu cầu xác thực
    if (token && (isAuthRoute || isAuthApiRoute)) {
      // Kiểm tra token hết hạn
      if (isTokenExpired(token)) {
        try {
          // Thử refresh token
          const refreshResult = await store.dispatch(refreshToken()).unwrap();
          token = refreshResult.access_token;
          localStorage.setItem("access_token", token);
        } catch (error) {
          // Nếu refresh thất bại, xóa token và redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          if (isAuthApiRoute) {
            return NextResponse.json(
              { error: "Unauthorized" },
              { status: 401 }
            );
          }

          const url = new URL("/login", request.url);
          url.searchParams.set("callbackUrl", encodeURI(request.url));
          return NextResponse.redirect(url);
        }
      }
    }

    // Nếu không có token và route yêu cầu xác thực
    if (!token && (isAuthRoute || isAuthApiRoute)) {
      if (isAuthApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Chỉ chạy middleware cho các route không phải là static file
  // và không phải là favicon.ico
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
