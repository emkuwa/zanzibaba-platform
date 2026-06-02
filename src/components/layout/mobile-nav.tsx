"use client"

import { useEffect, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { FileText } from "lucide-react"

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

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-80 max-w-full flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900" onClick={onClose}>
            ZANZIBABA
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    link.highlight
                      ? "text-gold-600 bg-gold-50 hover:bg-gold-100"
                      : "text-gray-700 hover:bg-zanzibar-50 hover:text-zanzibar-600"
                  }`}
                >
                  {link.highlight && <FileText className="inline mr-2 h-4 w-4" />}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4 space-y-2">
          <Link
            href="/rfq"
            onClick={onClose}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 text-sm font-medium text-white transition-colors hover:bg-gold-600"
          >
            <FileText className="h-4 w-4" />
            Post RFQ — Get Quotes
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-lg border border-zanzibar-600 px-4 text-sm font-medium text-zanzibar-600 transition-colors hover:bg-zanzibar-50"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-lg bg-zanzibar-600 px-4 text-sm font-medium text-white transition-colors hover:bg-zanzibar-700"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
