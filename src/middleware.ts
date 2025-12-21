import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

const CREATOR_COOKIE_NAME = "cosmic_creator_token";

// Routes that don't require authentication
const publicRoutes = ["/login", "/creator/login", "/creator/register", "/users/privacy", "/users/support"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const creatorToken = request.cookies.get(CREATOR_COOKIE_NAME)?.value;

  // Check if the route is public
  const isPublicRoute = pathname === "/" || publicRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // Creator routes
  if (pathname.startsWith("/creator")) {
    // Public creator routes
    if (pathname === "/creator/login" || pathname === "/creator/register") {
      // If creator is already logged in, redirect to dashboard
      if (creatorToken) {
        return NextResponse.redirect(new URL("/creator/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protected creator routes
    if (!creatorToken) {
      const loginUrl = new URL("/creator/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Films routes - allow both admin and creator access
  if (pathname.startsWith("/films")) {
    // If creator is authenticated, allow access
    if (creatorToken) {
      return NextResponse.next();
    }
    // If admin is authenticated, allow access
    if (adminToken) {
      return NextResponse.next();
    }
    // If neither, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes
  if (!adminToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If admin is authenticated and trying to access login page or landing page
  if (adminToken && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
