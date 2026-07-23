import { NextRequest } from "next/server";
import { authRedirectMiddleware } from "./src/lib/middleware";

export function middleware(request: NextRequest) {
  return authRedirectMiddleware(request);
}

export const config = {
  matcher: ["/login", "/register", "/forgot-password", "/reset-password", "/admin/:path*", "/dashboard/:path*"],
};
