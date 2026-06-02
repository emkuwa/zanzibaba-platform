"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const categories = [
  { href: "/marketplace", label: "All" },
  { href: "/marketplace/building-materials", label: "Building Materials" },
  { href: "/marketplace/tools-equipment", label: "Tools & Equipment" },
  { href: "/marketplace/finishes-interiors", label: "Finishes & Interiors" },
  { href: "/marketplace/plumbing", label: "Plumbing" },
  { href: "/marketplace/electrical", label: "Electrical" },
  { href: "/marketplace/prefab", label: "Prefab" },
  { href: "/marketplace/hardware", label: "Hardware" },
  { href: "/marketplace/lumber", label: "Lumber & Wood" },
  { href: "/marketplace/landscaping", label: "Landscaping" },
]

interface CategoryNavProps {
  className?: string
}

export function CategoryNav({ className }: CategoryNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("overflow-x-auto scrollbar-hide", className)}>
      <div className="flex gap-1 min-w-max px-4 py-3">
        {categories.map((cat) => {
          const isActive = pathname === cat.href
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zanzibar-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {cat.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
