"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, UserCircle, Globe, Package, Share2, Search,
  FileText, PenTool, BarChart3, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const growthNavItems = [
  { label: "Growth Overview", href: "/dashboard/supplier/growth", icon: LayoutDashboard },
  { label: "Profile Generator", href: "/dashboard/supplier/growth/profile", icon: UserCircle },
  { label: "Mini Website", href: "/dashboard/supplier/growth/website", icon: Globe },
  { label: "Catalog Generator", href: "/dashboard/supplier/growth/catalog", icon: Package },
  { label: "Social Content", href: "/dashboard/supplier/growth/social", icon: Share2 },
  { label: "SEO Assistant", href: "/dashboard/supplier/growth/seo", icon: Search },
  { label: "Quote Assistant", href: "/dashboard/supplier/growth/quotes", icon: FileText },
  { label: "Marketing Assets", href: "/dashboard/supplier/growth/marketing", icon: PenTool },
]

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/supplier" className="hover:text-zanzibar-600">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 font-medium">Growth Tools</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sub-nav sidebar */}
        <nav className="lg:w-56 shrink-0 space-y-0.5">
          {growthNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zanzibar-50 text-zanzibar-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
