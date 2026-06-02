import Link from 'next/link'
import { Compass, Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zanzibar-100 to-ocean-100 flex items-center justify-center">
            <Compass className="h-12 w-12 text-zanzibar-600" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zanzibar-600 text-white font-medium hover:bg-zanzibar-700 transition-colors">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors">
            <Search className="h-4 w-4" /> Browse Marketplace
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
