import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/about",
  "/contact",
  "/marketplace",
  "/suppliers",
  "/contractors",
  "/professionals",
  "/projects",
  "/rfq",
  "/pricing",
  "/faq",
  "/blog",
  "/privacy",
  "/terms",
  "/hospitality",
  "/prefab",
  "/international",
  "/experience-center",
  "/claim",
  "/api/auth",
  "/api/launch",
  "/api/email",
  "/_next",
  "/images",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]

const rolePrefixes: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/founder": ["ADMIN"],
  "/dashboard/launch": ["ADMIN"],
  "/dashboard/revenue": ["ADMIN"],
  "/dashboard/population": ["ADMIN"],
  "/dashboard/supplier": ["SUPPLIER", "ADMIN"],
  "/dashboard/buyer": ["BUYER", "ADMIN"],
  "/dashboard/contractor": ["CONTRACTOR", "ADMIN"],
  "/dashboard/professional": ["PROFESSIONAL", "ADMIN"],
}

function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => {
    if (route.endsWith("/")) return path.startsWith(route)
    return path.startsWith(route)
  })
}

function getRequiredRoles(path: string): string[] | null {
  for (const [prefix, roles] of Object.entries(rolePrefixes)) {
    if (path.startsWith(prefix)) return roles
  }
  return null
}

export default auth(async function middleware(req: NextRequest & { auth?: any }) {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Require authentication for everything else
  if (!session?.user) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control for dashboard routes
  const requiredRoles = getRequiredRoles(pathname)
  if (requiredRoles && !requiredRoles.includes(session.user.role)) {
    // Redirect to their appropriate dashboard
    const role = session.user.role.toLowerCase()
    const dashUrl = new URL(`/dashboard/${role}`, req.url)
    return NextResponse.redirect(dashUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|robots.txt|sitemap.xml).*)",
  ],
}
