"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { FileText, Store, Home, Search, User } from "lucide-react"

export function MobileCTA() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[64px] min-h-[44px] justify-center">
          <Home className="h-5 w-5 text-gray-500" />
          <span className="text-[10px] text-gray-500">Home</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[64px] min-h-[44px] justify-center">
          <Search className="h-5 w-5 text-gray-500" />
          <span className="text-[10px] text-gray-500">Browse</span>
        </Link>
        <Link
          href="/rfq"
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 -mt-3 min-w-[72px] min-h-[52px] justify-center rounded-full bg-gold-500 text-white shadow-lg"
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-medium">RFQ</span>
        </Link>
        <Link href="/suppliers" className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[64px] min-h-[44px] justify-center">
          <Store className="h-5 w-5 text-gray-500" />
          <span className="text-[10px] text-gray-500">Suppliers</span>
        </Link>
        <Link href="/auth/login" className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[64px] min-h-[44px] justify-center">
          <User className="h-5 w-5 text-gray-500" />
          <span className="text-[10px] text-gray-500">Login</span>
        </Link>
      </div>
    </div>
  )
}
