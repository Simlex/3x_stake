import { type NextRequest, NextResponse } from "next/server"
import { validateSession, validateAdminSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith("/api/auth/"))

  // Admin paths
  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin")

  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value

  // If path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If no auth token, return a response that will trigger the login modal
  if (!authToken) {
    const response = NextResponse.next()
    // Add a custom header to indicate that login is required
    response.headers.set("x-require-login", "true")
    // Store the original URL in a cookie for redirect after login
    response.cookies.set("redirect_after_login", path)
    return response
  }

  // For admin paths, validate admin session
  if (isAdminPath) {
    const session = await validateAdminSession(authToken)

    if (!session) {
      // Clear invalid token
      const response = NextResponse.next()
      response.cookies.delete("auth_token")
      response.headers.set("x-require-login", "true")
      response.cookies.set("redirect_after_login", path)
      return response
    }

    // Add admin info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-admin-id", session.admin.id)
    requestHeaders.set("x-admin-role", session.admin.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For regular protected paths, validate user session
  const session = await validateSession(authToken)

  if (!session) {
    // Clear invalid token
    const response = NextResponse.next()
    response.cookies.delete("auth_token")
    response.headers.set("x-require-login", "true")
    response.cookies.set("redirect_after_login", path)
    return response
  }

  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", session.user.id)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
