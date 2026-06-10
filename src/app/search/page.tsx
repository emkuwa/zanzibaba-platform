"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search, Store, MapPin, Building2, HardHat, PencilRuler, Compass,
  Wrench, Handshake, Home, Hotel, Warehouse, ChevronRight, Shield, Star, Briefcase,
} from "lucide-react"

interface SearchResult {
  type: "directory" | "project"
  id: string
  title: string
  description: string | null
  location: string | null
  badge: string
  url: string
  score: number
}

const TYPE_ICONS: Record<string, any> = {
  supplier: Store, contractor: HardHat, professional: PencilRuler,
  architect: PencilRuler, engineer: HardHat, surveyor: Compass,
  service: Wrench, partner: Handshake, hotel: Hotel, "hospitality-service": Building2,
  "tour-operator": Compass, developer: Building2, "hardware-store": Store,
  "interior-designer": PencilRuler, landscaping: Wrench,
  Residential: Home, Hospitality: Hotel, Commercial: Building2, Infrastructure: Warehouse,
}

function getIcon(type: string, badge: string): any {
  return TYPE_ICONS[badge] || TYPE_ICONS[type] || Building2
}

const BADGE_COLORS: Record<string, string> = {
  supplier: "bg-emerald-50 text-emerald-600 border-emerald-200",
  contractor: "bg-amber-50 text-amber-600 border-amber-200",
  professional: "bg-blue-50 text-blue-600 border-blue-200",
  architect: "bg-blue-50 text-blue-600 border-blue-200",
  engineer: "bg-amber-50 text-amber-600 border-amber-200",
  surveyor: "bg-green-50 text-green-600 border-green-200",
}

function getBadgeColor(badge: string): string {
  return BADGE_COLORS[badge] || "bg-gray-50 text-gray-600 border-gray-200"
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "directory" | "project">("all")

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`)
      const data = await res.json()
      setResults(data.results || [])
      setTotal(data.total || 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery)
  }, [initialQuery, doSearch])

  const filteredResults = activeTab === "all"
    ? results
    : results.filter((r) => r.type === activeTab)

  const directoryCount = results.filter((r) => r.type === "directory").length
  const projectCount = results.filter((r) => r.type === "project").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              doSearch(query)
            }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search suppliers, contractors, projects, services..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500 text-lg"
              autoFocus
            />
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        {total > 0 && (
          <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-zanzibar-600 text-zanzibar-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All Results ({total})
            </button>
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "directory"
                  ? "border-zanzibar-600 text-zanzibar-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Businesses ({directoryCount})
            </button>
            <button
              onClick={() => setActiveTab("project")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "project"
                  ? "border-zanzibar-600 text-zanzibar-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Projects ({projectCount})
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-zanzibar-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : total === 0 && query ? (
          <div className="text-center py-20">
            <Search className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or browse our categories.
            </p>
          </div>
        ) : total === 0 ? null : (
          <div className="space-y-3">
            {filteredResults.map((result) => {
              const Icon = getIcon(result.type, result.badge)

              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className="block bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{result.title}</h3>
                        {result.type === "project" && (
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getBadgeColor(result.badge)}`}>
                            {result.badge}
                          </span>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{result.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        {result.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {result.location}
                          </span>
                        )}
                        {result.type === "directory" && (
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getBadgeColor(result.badge)}`}>
                            {result.badge}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" /> View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
