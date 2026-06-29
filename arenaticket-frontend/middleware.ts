import { NextRequest } from "next/server";
import { authRedirectMiddleware } from "./lib/middleware";

export function middleware(request: NextRequest) {
  return authRedirectMiddleware(request);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
