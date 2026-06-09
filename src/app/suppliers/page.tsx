import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SearchBar } from "@/components/layout/search-bar"
import { Badge } from "@/components/ui/badge"
import { ActivationBadges } from "@/components/ui/supplier-badges"
import {
  Store, MapPin, Shield, Star, Layers, ChevronRight, Crown, FileText,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Supplier Directory — Zanzibar Building Materials | Zanzibaba",
  description: "Browse verified and unclaimed suppliers on Zanzibaba. Building materials, furniture, kitchens, and hospitality supplies.",
}

function buildClaimUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/claim/${token}`
}

function formatCategories(labels: unknown): string {
  if (Array.isArray(labels)) return labels.slice(0, 3).join(", ")
  return "Building Supplies"
}

function formatTrustScore(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "High", color: "text-emerald-600" }
  if (score >= 40) return { label: "Medium", color: "text-amber-600" }
  return { label: "Listed", color: "text-gray-500" }
}

export default async function SuppliersPage() {
  const leads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
    },
    orderBy: [{ trustScore: "desc" }, { companyName: "asc" }],
    select: {
      id: true,
      companyName: true,
      city: true,
      country: true,
      categoryLabels: true,
      trustScore: true,
      activationStatus: true,
      claimToken: true,
      phone: true,
      email: true,
      website: true,
    },
  })

  const foundingLeadIds = new Set(
    (await prisma.foundingSupplier.findMany({ select: { leadId: true } })).map((f) => f.leadId)
  )

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-zanzibar-800 to-emerald-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Supplier Directory</h1>
            <p className="mt-2 text-zanzibar-200">
              {leads.length} suppliers discovered across Tanzania and international markets
            </p>
            <div className="mt-6 mx-auto max-w-xl">
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
              <span className="font-medium text-gray-900">{leads.length} suppliers</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                {leads.filter((l) => l.activationStatus === "UNCLAIMED").length} Unclaimed
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                {leads.filter((l) => l.activationStatus === "CLAIMED").length} Claimed
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                {leads.filter((l) => l.activationStatus === "VERIFIED").length} Verified
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
                {leads.filter((l) => foundingLeadIds.has(l.id)).length} Founding
              </span>
            </div>
            <div className="flex gap-2">
              <Link href="/become-supplier" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <Crown className="h-3.5 w-3.5" /> Become a Supplier <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {leads.length === 0 ? (
            <div className="text-center py-16">
              <Store className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No suppliers yet</h3>
              <p className="mt-1 text-sm text-gray-500">Suppliers will appear here once discovered and claim-ready.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {leads.map((lead) => {
                const trustInfo = formatTrustScore(lead.trustScore)
                const categories = formatCategories(lead.categoryLabels)
                const isFounding = foundingLeadIds.has(lead.id)
                const isUnclaimed = lead.activationStatus === "UNCLAIMED"
                const profileUrl = isUnclaimed && lead.claimToken
                  ? `/claim/${lead.claimToken}`
                  : `/suppliers/${lead.id}`

                return (
                  <Link
                    key={lead.id}
                    href={profileUrl}
                    className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-zanzibar-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                        <Store className="h-5 w-5" />
                      </div>
                      <ActivationBadges activationStatus={lead.activationStatus} isFounding={isFounding} />
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                      {lead.companyName || "Unknown Supplier"}
                    </h3>

                    <div className="mt-3 space-y-1.5">
                      {lead.city && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {lead.city}{lead.country ? `, ${lead.country}` : ""}
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
                        Trust: <span className={trustInfo.color}>{trustInfo.label}</span> ({lead.trustScore})
                      </div>
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
