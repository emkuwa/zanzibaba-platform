"use client"

import { useEffect, useState } from "react"
import { Star, Award, MapPin, ExternalLink, Loader2 } from "lucide-react"
import { VerificationBadge } from "@/components/ui/verification-badge"
import { FeaturedBadge } from "@/components/ui/featured-badge"

interface FeaturedSupplier {
  id: string
  companyName: string
  companyLogoUrl: string | null
  companyDescription: string | null
  country: string | null
  city: string | null
  website: string | null
  verificationBadge: boolean
  membershipTier: string
}

interface DirectoryFeatured {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
  country: string | null
  city: string | null
  website: string | null
  verificationBadge: boolean
  membershipTier: string
  entityType: string
}

export function FeaturedSuppliersSection() {
  const [suppliers, setSuppliers] = useState<FeaturedSupplier[]>([])
  const [directory, setDirectory] = useState<DirectoryFeatured[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/featured-suppliers")
      .then((r) => r.json())
      .then((data) => {
        setSuppliers(data.suppliers || [])
        setDirectory(data.directory || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
        </div>
      </section>
    )
  }

  const all = [
    ...suppliers.map((s) => ({ ...s, name: s.companyName, logo: s.companyLogoUrl, slug: s.id, type: "supplier" as const, description: s.companyDescription })),
    ...directory.map((d) => ({ ...d, name: d.name, logo: d.logoUrl, type: d.entityType as string, companyName: "", companyLogoUrl: null, companyDescription: null })),
  ]

  if (all.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center">
            <Award className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Suppliers</h2>
            <p className="text-sm text-gray-500">Trusted partners across Zanzibar and East Africa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {all.slice(0, 6).map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-zanzibar-200 transition-all">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{item.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    {item.verificationBadge && <VerificationBadge type="supplier" verified />}
                    <FeaturedBadge size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {item.city && item.country ? `${item.city}, ${item.country}` : item.country || item.type}
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={item.type === "supplier" ? `/suppliers/${item.id}` : `/entity/${item.slug}`}
                  className="text-xs font-medium text-zanzibar-600 hover:text-zanzibar-700 flex items-center gap-1"
                >
                  View Profile <ExternalLink className="h-3 w-3" />
                </a>
                {item.website && (
                  <a href={item.website.startsWith("http") ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
