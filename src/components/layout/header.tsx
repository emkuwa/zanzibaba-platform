"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, User, FileText, Store } from "lucide-react"
import { SearchBar } from "@/components/layout/search-bar"
import { MobileNav } from "@/components/layout/mobile-nav"

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/contractors", label: "Contractors" },
  { href: "/professionals", label: "Professionals" },
  { href: "/hospitality", label: "Hospitality" },
  { href: "/prefab", label: "Prefab" },
  { href: "/projects", label: "Projects" },
  { href: "/rfq", label: "RFQ", highlight: true },
  { href: "/pricing", label: "Pricing" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white shrink-0"
          >
            <span className="text-zanzibar-400">Z</span>ANZIBABA
          </Link>

          <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-1 lg:overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-zanzibar-400"
                      : link.highlight
                      ? "text-gold-400 hover:bg-gray-800 hover:text-gold-300"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block w-40 lg:w-48">
              <SearchBar variant="compact" />
            </div>

            <Link
              href="/rfq"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gold-600"
            >
              <FileText className="h-4 w-4" />
              Post RFQ
            </Link>

            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <User className="h-4 w-4" />
              Log In
            </Link>

            <Link
              href="/auth/register"
              className="hidden sm:inline-flex items-center rounded-lg bg-zanzibar-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zanzibar-700"
            >
              Join Free
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
