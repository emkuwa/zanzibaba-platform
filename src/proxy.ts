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
  "/become-supplier",
  "/partners",
  "/services",
  "/travel",
  "/developers",
  "/estimate",
  "/prices",
  "/fulfillment",
  "/search",
  "/s",
  "/entity",
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
  return publicRoutes.some((route) => path === route || path.startsWith(route + "/"))
}

function getRequiredRoles(path: string): string[] | null {
  for (const [prefix, roles] of Object.entries(rolePrefixes)) {
    if (path.startsWith(prefix)) return roles
  }
  return null
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  const session = await auth()

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!session?.user) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const requiredRoles = getRequiredRoles(pathname)
  if (requiredRoles && !requiredRoles.includes(session.user.role as string)) {
    const role = (session.user.role as string).toLowerCase()
    const dashUrl = new URL(`/dashboard/${role}`, req.url)
    return NextResponse.redirect(dashUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images/|robots.txt|sitemap.xml).*)",
  ],
}