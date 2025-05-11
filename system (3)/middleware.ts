import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for authentication - either from cookie or localStorage
  // Note: localStorage is not accessible in middleware, so we rely on cookies
  const token = request.cookies.get("XSRF-TOKEN")?.value

  // For development mode, we'll be more permissive with authentication
  const isDevelopment = process.env.NODE_ENV === "development"
  const isAuthenticated = !!token || isDevelopment

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/about"]

  // Admin routes that require admin role
  const adminRoutes = ["/admin"]

  // User routes that require authentication
  const userRoutes = ["/dashboard"]

  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // In development, we'll allow access to protected routes for easier testing
  if (!isAuthenticated && !publicRoutes.some((route) => pathname.startsWith(route)) && !isDevelopment) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check admin routes (would need to verify role on the server side as well)
  if (pathname.startsWith("/admin")) {
    // This is a basic check - in a real app, you'd verify the role from the token
    // For now, we'll just let the API handle the role verification
    // and redirect unauthorized users from the client side
  }

  return NextResponse.next()
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
}
