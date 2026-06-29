import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/admin", "/dashboard"];

export const authRedirectMiddleware = (request: NextRequest): NextResponse => {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (requiresAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};
