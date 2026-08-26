import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle /admin and /admin/* routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = await verifySessionToken(sessionCookie);

    // If user is visiting the login page
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        // Already logged in, send to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // If user is visiting any other admin route and not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // If user visits root /admin while authenticated, redirect to /admin/dashboard
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
