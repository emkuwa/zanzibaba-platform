"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrustIndicators } from "@/components/ui/trust-indicators"
import { Store, MapPin, Trophy, Package, ChevronRight } from "lucide-react"

interface Supplier {
  name: string
  slug: string
  location: string
  rating: number
  reviews: number
  verified: boolean
  featured: boolean
  products?: number
  tier?: "Premium" | "Professional" | "Basic"
}

interface FeaturedSuppliersProps {
  suppliers: Supplier[]
  title?: string
  description?: string
}

function rankSuppliers(suppliers: Supplier[], sortBy: "rating" | "reviews"): Supplier[] {
  return [...suppliers]
    .sort((a, b) => {
      if (sortBy === "rating") {
        const ratingDiff = b.rating - a.rating
        if (ratingDiff !== 0) return ratingDiff
        return b.reviews - a.reviews
      }
      const reviewsDiff = b.reviews - a.reviews
      if (reviewsDiff !== 0) return reviewsDiff
      return b.rating - a.rating
    })
    .slice(0, 6)
}

function getMedal(index: number) {
  if (index === 0) return { icon: Trophy, className: "text-gold-500", label: "Gold" }
  if (index === 1) return { icon: Trophy, className: "text-gray-400", label: "Silver" }
  if (index === 2) return { icon: Trophy, className: "text-amber-700", label: "Bronze" }
  return null
}

export function FeaturedSuppliers({
  suppliers,
  title = "Top Rated Suppliers",
  description = "Highest-ranked suppliers on Zanzibaba",
}: FeaturedSuppliersProps) {
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating")
  const ranked = rankSuppliers(suppliers, sortBy)

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button
            onClick={() => setSortBy("rating")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === "rating"
                ? "bg-zanzibar-100 text-zanzibar-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => setSortBy("reviews")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === "reviews"
                ? "bg-zanzibar-100 text-zanzibar-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Most Reviewed
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ranked.map((supplier, index) => {
          const medal = getMedal(index)
          const MedalIcon = medal?.icon
          return (
            <Card key={supplier.name} className="group relative overflow-hidden transition-all hover:shadow-lg">
              {MedalIcon && medal && (
                <div className="absolute right-3 top-3">
                  <MedalIcon className={`h-5 w-5 ${medal.className}`} />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                    <Store className="h-6 w-6 text-zanzibar-600" />
                    {index === 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                        1
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/suppliers/${supplier.slug}`}
                      className="font-semibold text-gray-900 hover:text-zanzibar-600 transition-colors"
                    >
                      {supplier.name}
                    </Link>
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{supplier.location}</span>
                    </div>
                  </div>
                </div>

                <TrustIndicators
                  verified={supplier.verified}
                  featured={supplier.featured}
                  rating={supplier.rating}
                  reviewCount={supplier.reviews}
                  size="sm"
                  className="mt-3"
                />

                {supplier.products !== undefined && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Package className="h-3.5 w-3.5" />
                    <span>{supplier.products} products</span>
                  </div>
                )}

                <div className="mt-4">
                  <Link href={`/suppliers/${supplier.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
