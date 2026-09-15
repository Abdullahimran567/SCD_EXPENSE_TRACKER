import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy Middleware to guard protected routes & handle auth redirects
 */
export function proxyMiddleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Guard /dashboard route: Require token cookie or redirect to /login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect logged-in users away from auth pages (/login, /sign, /signup) to /dashboard
  if ((pathname === "/login" || pathname === "/sign" || pathname === "/signup") && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign", "/signup"],
};

export default proxyMiddleware;
