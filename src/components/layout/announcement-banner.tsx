"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Rocket, ArrowRight } from "lucide-react"

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative bg-gradient-to-r from-zanzibar-800 via-zanzibar-700 to-emerald-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-white">
          <Rocket className="h-4 w-4 text-gold-400 shrink-0" />
          <span className="hidden sm:inline">
            <span className="font-semibold text-gold-400">Founding Supplier Program Now Open.</span>
            {" "}Join during launch phase and receive priority visibility, verification support, and early marketplace benefits.
          </span>
          <span className="sm:hidden text-xs">
            Founding Supplier Program Now Open — Priority benefits for early members.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/auth/register/supplier"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-gold-500 px-3 py-1 text-xs font-semibold text-white hover:bg-gold-600 transition-colors"
          >
            Become a Founding Supplier <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setVisible(false)}
            className="flex items-center rounded-lg p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
