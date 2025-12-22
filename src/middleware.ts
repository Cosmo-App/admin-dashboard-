import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Note: For cross-origin setups (Vercel frontend + Render backend),
// middleware cannot read httpOnly cookies set by different domains.
// Authentication is now handled client-side via AuthContext + API session checks.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect from login to dashboard if user explicitly visits root
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other routes - authentication will be handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
