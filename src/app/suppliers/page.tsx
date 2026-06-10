import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SearchBar } from "@/components/layout/search-bar"
import { Badge } from "@/components/ui/badge"
import { ActivationBadges, TrustBadges } from "@/components/ui/supplier-badges"
import {
  Store, MapPin, Shield, Layers, ChevronRight, Crown, FileText,
  Globe, Building2, Briefcase,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Supplier Directory — Zanzibar Building Materials | Zanzibaba",
  description: "Browse verified suppliers and manufacturers in Zanzibaba's international supplier network. Building materials, furniture, kitchens, and hospitality supplies.",
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
      tier: { in: ["A", "B"] },
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
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

  const unclaimedCount = leads.filter((l) => l.activationStatus === "UNCLAIMED").length
  const claimedCount = leads.filter((l) => l.activationStatus === "CLAIMED").length
  const verifiedCount = leads.filter((l) => l.activationStatus === "VERIFIED").length
  const foundingCount = leads.filter((l) => foundingLeadIds.has(l.id)).length

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-zanzibar-800 to-emerald-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Supplier Directory</h1>
            <p className="mt-2 text-zanzibar-200">
              Verified international supplier network — {leads.length} strategic suppliers serving East Africa and Zanzibar
            </p>
            <div className="mt-6 mx-auto max-w-xl">
              <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{leads.length} suppliers</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                {unclaimedCount} Available
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                {claimedCount} Claimed
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                {verifiedCount} Verified
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
                {foundingCount} Founding
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

      {/* Why These Suppliers Matter */}
      <section className="bg-gradient-to-r from-zanzibar-50 to-emerald-50 border-b border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-100 text-zanzibar-600">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Why These Suppliers Matter</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
              This directory includes manufacturers, exporters, distributors and project suppliers from Tanzania, Kenya, UAE, India, China, Turkey and South Africa. Buyers can contact suppliers directly or request Fulfillment by Materials.Zanzibaba. Suppliers can claim and enhance their profiles to increase visibility and access opportunities across Zanzibar and East Africa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-zanzibar-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-zanzibar-700 transition-colors"
              >
                <Briefcase className="h-4 w-4" /> Browse Opportunities
              </Link>
              <Link
                href="/fulfillment"
                className="inline-flex items-center gap-2 rounded-lg border border-zanzibar-300 px-5 py-2.5 text-sm font-medium text-zanzibar-700 hover:bg-zanzibar-50 transition-colors"
              >
                <Building2 className="h-4 w-4" /> Request Fulfillment Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Cards */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {leads.length === 0 ? (
            <div className="text-center py-16">
              <Store className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No suppliers yet</h3>
              <p className="mt-1 text-sm text-gray-500">Suppliers will appear here once added to the network.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {leads.map((lead) => {
                const trustInfo = formatTrustScore(lead.trustScore)
                const categories = formatCategories(lead.categoryLabels)
                const isFounding = foundingLeadIds.has(lead.id)
                const isUnclaimed = lead.activationStatus === "UNCLAIMED"
                const isClaimed = lead.activationStatus === "CLAIMED" || lead.activationStatus === "VERIFIED" || lead.activationStatus === "FEATURED"
                const isStrategic = lead.trustScore >= 70
                const hasWebsite = !!lead.website
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

                    <div className="mt-2">
                      <TrustBadges
                        hasWebsite={hasWebsite}
                        isStrategic={isStrategic}
                        isFounding={isFounding}
                        isClaimed={isClaimed}
                      />
                    </div>

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
                          View Available Profile
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
