import Link from "next/link"
import {
  Store, MapPin, Shield, Layers, ChevronRight, Crown,
  Building2, HardHat, PencilRuler, Compass, Handshake, Wrench, Leaf, Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/layout/search-bar"

const ICON_MAP: Record<string, typeof Store> = {
  Store, Building2, HardHat, PencilRuler, Compass, Handshake, Wrench, Leaf, Star,
}

function resolveIcon(name: string) {
  return ICON_MAP[name] || Store
}

function formatCategories(labels: unknown): string {
  if (Array.isArray(labels)) return labels.slice(0, 3).join(", ")
  return "General"
}

function formatTrustScore(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "High", color: "text-emerald-600" }
  if (score >= 40) return { label: "Medium", color: "text-amber-600" }
  return { label: "Listed", color: "text-gray-500" }
}

interface DirectoryEntry {
  id: string
  entityType: string
  slug: string
  name: string
  description: string | null
  categoryLabels: any
  country: string | null
  city: string | null
  website: string | null
  email: string | null
  phone: string | null
  logoUrl: string | null
  verificationBadge: boolean
  isFeatured: boolean
  avgRating: number
  reviewCount: number
  activationStatus: string
  claimToken: string | null
  trustScore: number
}

interface EntityListingProps {
  title: string
  description: string
  iconName: string
  entityTypes: string | string[]
  items: DirectoryEntry[]
  total: number
  entityLabel: string
  entityLabelPlural: string
}

export function EntityListing({
  title,
  description,
  iconName,
  items,
  total,
  entityLabel,
  entityLabelPlural,
}: EntityListingProps) {
  const Icon = resolveIcon(iconName)

  const unclaimedCount = items.filter((i) => i.activationStatus === "UNCLAIMED").length
  const claimedCount = items.filter((i) => i.activationStatus === "CLAIMED").length
  const verifiedCount = items.filter((i) => i.activationStatus === "VERIFIED" || i.activationStatus === "FEATURED").length

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-zanzibar-800 to-emerald-900 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-4">
              <Icon className="h-4 w-4" />
              {entityLabelPlural}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 text-lg text-zanzibar-200">{description}</p>
            <p className="mt-2 text-sm text-zanzibar-300">
              {total} {entityLabelPlural.toLowerCase()} listed
            </p>
            <div className="mt-8 mx-auto max-w-xl">
              <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{total} {entityLabelPlural.toLowerCase()}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                {unclaimedCount} Unclaimed
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                {claimedCount} Claimed
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                {verifiedCount} Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <Icon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No {entityLabelPlural.toLowerCase()} yet</h3>
              <p className="mt-1 text-sm text-gray-500">{entityLabelPlural} will appear here once discovered and claim-ready.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((entry) => {
                const trustInfo = formatTrustScore(entry.trustScore)
                const categories = formatCategories(entry.categoryLabels)
                const isUnclaimed = entry.activationStatus === "UNCLAIMED"
                const profileUrl = isUnclaimed && entry.claimToken
                  ? `/claim/${entry.claimToken}`
                  : `/entity/${entry.slug}`

                return (
                  <Link
                    key={entry.id}
                    href={profileUrl}
                    className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-zanzibar-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex gap-1">
                        {entry.verificationBadge && (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] px-1.5 py-0">
                            Verified
                          </Badge>
                        )}
                        {entry.isFeatured && (
                          <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-200 text-[10px] px-1.5 py-0">
                            Featured
                          </Badge>
                        )}
                        {entry.activationStatus === "UNCLAIMED" && (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] px-1.5 py-0">
                            Unclaimed
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                      {entry.name}
                    </h3>

                    <div className="mt-3 space-y-1.5">
                      {entry.city && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {entry.city}{entry.country ? `, ${entry.country}` : ""}
                        </div>
                      )}
                      {categories && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Layers className="h-3 w-3 shrink-0" />
                          {categories}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield className="h-3 w-3 shrink-0" />
                        Trust: <span className={trustInfo.color}>{trustInfo.label}</span> ({entry.trustScore})
                      </div>
                      {entry.avgRating > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Star className="h-3 w-3 shrink-0" />
                          {entry.avgRating.toFixed(1)} ({entry.reviewCount} reviews)
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      {isUnclaimed ? (
                        <span className="inline-flex items-center justify-center w-full rounded-lg bg-amber-50 py-2 text-xs font-medium text-amber-700 border border-amber-200 group-hover:bg-amber-100 transition-colors">
                          Claim This Profile
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-full rounded-lg bg-zanzibar-50 py-2 text-xs font-medium text-zanzibar-700 border border-zanzibar-200 group-hover:bg-zanzibar-100 transition-colors">
                          View Profile
                        </span>
                      )}
                    </div>
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
