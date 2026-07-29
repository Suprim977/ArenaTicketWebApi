import { NextRequest, NextResponse } from "next/server";

const authPages = ["/login", "/register", "/admin/login", "/admin/register", "/request-password-reset", "/reset-password"];
const protectedPaths = ["/admin/dashboard", "/admin/events", "/admin/bookings", "/admin/users", "/admin/payments", "/admin/tickets", "/dashboard", "/profile", "/bookings", "/tickets", "/booking", "/ticket", "/payment"];

export const authRedirectMiddleware = (request: NextRequest): NextResponse => {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const pathname = request.nextUrl.pathname;

  if (authPages.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (requiresAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
};
