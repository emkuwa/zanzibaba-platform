import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Building2, Star, Shield, MapPin, Award, ChevronDown,
  HardHat, Users, Home,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Contractors Directory - Zanzibar | Zanzibaba",
  description: "Find verified contractors in Zanzibar for residential, commercial, and hospitality construction projects.",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function ContractorsPage() {
  const items = await prisma.directoryEntity.findMany({
    where: { entityType: "contractor", dataClassification: { notIn: ["TEST", "SYNTHETIC"] } },
    orderBy: [{ isFeatured: "desc" }, { trustScore: "desc" }, { name: "asc" }],
  })

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Reliable Contractors in Zanzibar
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Browse {items.length} contractors specializing in residential, commercial, hospitality, and infrastructure projects.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Location:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Locations <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{items.length}</span> contractors found
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <HardHat className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No contractors yet</h3>
              <p className="mt-1 text-sm text-gray-500">Contractors will appear here once discovered and listed.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => {
                const isUnclaimed = c.activationStatus === "UNCLAIMED"
                const profileUrl = isUnclaimed && c.claimToken
                  ? `/claim/${c.claimToken}`
                  : `/entity/${c.slug}`

                return (
                  <Link key={c.id} href={profileUrl} className="block group">
                    <Card className="transition-all hover:shadow-lg h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                              <HardHat className="h-7 w-7 text-zanzibar-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                                  {c.name}
                                </span>
                                {c.verificationBadge && <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />}
                              </div>
                              {c.city && (
                                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                  <MapPin className="h-3.5 w-3.5" /> {c.city}{c.country ? `, ${c.country}` : ""}
                                </div>
                              )}
                            </div>
                          </div>
                          {c.isFeatured && (
                            <Badge variant="warning" className="text-xs">
                              <Award className="mr-1 h-3 w-3" /> Featured
                            </Badge>
                          )}
                        </div>

                        {Number(c.avgRating) > 0 && (
                          <div className="mt-4 flex items-center gap-2">
                            <StarRating rating={Number(c.avgRating)} />
                            <span className="text-xs text-gray-500">({c.reviewCount} reviews)</span>
                          </div>
                        )}

                        {c.description && (
                          <p className="mt-3 text-sm text-gray-500 line-clamp-2">{c.description}</p>
                        )}

                        <div className="mt-4 flex gap-2">
                          {isUnclaimed ? (
                            <span className="flex-1 inline-flex items-center justify-center rounded-lg bg-amber-50 py-2 text-xs font-medium text-amber-700 border border-amber-200 group-hover:bg-amber-100 transition-colors">
                              Claim This Profile
                            </span>
                          ) : (
                            <span className="flex-1 inline-flex items-center justify-center rounded-lg bg-zanzibar-50 py-2 text-xs font-medium text-zanzibar-700 border border-zanzibar-200 group-hover:bg-zanzibar-100 transition-colors">
                              View Profile
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
