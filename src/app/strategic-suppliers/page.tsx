import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import {
  Store, MapPin, Shield, Crown, Globe, Building2, CheckCircle2,
  ChevronRight, FileText, Award, Target, ExternalLink,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Strategic Suppliers — Verified Global Network | Zanzibaba",
  description:
    "Zanzibaba's verified strategic supplier network. Fully vetted manufacturers, exporters and distributors serving Zanzibar, East Africa and international markets.",
}

function VerificationBadges({
  verifiedWebsite,
  verifiedCompany,
  verifiedExporter,
  score,
}: {
  verifiedWebsite: boolean
  verifiedCompany: boolean
  verifiedExporter: boolean
  score: number
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {verifiedWebsite && (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-2.5 w-2.5" />
          Verified Website
        </span>
      )}
      {verifiedCompany && (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
          <CheckCircle2 className="h-2.5 w-2.5" />
          Verified Company
        </span>
      )}
      {verifiedExporter && (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 border border-purple-200">
          <Globe className="h-2.5 w-2.5" />
          Verified Exporter
        </span>
      )}
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
        <Shield className="h-2.5 w-2.5" />
        Score: {score}/100
      </span>
    </div>
  )
}

function TrustScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" :
    score >= 60 ? "bg-blue-500" :
    score >= 40 ? "bg-amber-500" :
    "bg-gray-400"

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className="text-[10px] font-medium text-gray-500">{score}%</span>
    </div>
  )
}

function formatCategories(labels: unknown): string {
  if (Array.isArray(labels)) return labels.slice(0, 3).join(", ")
  return "Building Supplies"
}

export default async function StrategicSuppliersPage() {
  const suppliers = await prisma.discoveredLead.findMany({
    where: {
      tier: "A",
      verifiedWebsite: true,
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
    },
    orderBy: [{ verificationScore: "desc" }, { trustScore: "desc" }],
    select: {
      id: true,
      companyName: true,
      city: true,
      country: true,
      categoryLabels: true,
      website: true,
      trustScore: true,
      verificationScore: true,
      verifiedWebsite: true,
      verifiedCompany: true,
      verifiedExporter: true,
      tier: true,
      activationStatus: true,
      claimToken: true,
    },
  })

  const totalVerified = await prisma.discoveredLead.count({
    where: {
      tier: "A",
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
    },
  })

  const verifiedWithCompany = suppliers.filter(s => s.verifiedCompany).length
  const verifiedExporters = suppliers.filter(s => s.verifiedExporter).length

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-300">Verified Network</span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Strategic Supplier Network
            </h1>
            <p className="mt-3 text-lg text-zanzibar-200">
              {totalVerified} fully verified manufacturers, exporters and distributors serving Zanzibar and East Africa.
              Every supplier has passed our verification process.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{suppliers.length}</p>
                <p className="text-[10px] text-gray-500">Website Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{verifiedWithCompany}</p>
                <p className="text-[10px] text-gray-500">Company Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{verifiedExporters}</p>
                <p className="text-[10px] text-gray-500">Export Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{totalVerified}</p>
                <p className="text-[10px] text-gray-500">Tier A Strategic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="bg-gradient-to-r from-zanzibar-50 to-emerald-50 border-b border-gray-200 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How We Verify Suppliers</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Globe,
                  title: "Website Verification",
                  desc: "Each supplier's website is checked for active status, company presence, and operational legitimacy.",
                  color: "text-emerald-600 bg-emerald-100",
                },
                {
                  icon: Building2,
                  title: "Company Verification",
                  desc: "Company name, category and country are cross-referenced against their digital presence and market reputation.",
                  color: "text-blue-600 bg-blue-100",
                },
                {
                  icon: Award,
                  title: "Export Capability",
                  desc: "Suppliers are confirmed to serve international markets through export programs, global partnerships, or direct shipping.",
                  color: "text-purple-600 bg-purple-100",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color} mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Cards */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {suppliers.length === 0 ? (
            <div className="text-center py-16">
              <Store className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No strategic suppliers yet</h3>
              <p className="mt-1 text-sm text-gray-500">Verified suppliers will appear here as they complete the verification process.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">All Strategic Suppliers</h2>
                <Link
                  href="/suppliers"
                  className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 flex items-center gap-1"
                >
                  View Full Directory <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suppliers.map((supplier) => {
                  const categories = formatCategories(supplier.categoryLabels)
                  const isUnclaimed = supplier.activationStatus === "UNCLAIMED"
                  const profileUrl = isUnclaimed && supplier.claimToken
                    ? `/claim/${supplier.claimToken}`
                    : `/suppliers/${supplier.id}`

                  return (
                    <Link
                      key={supplier.id}
                      href={profileUrl}
                      className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600">
                          <Store className="h-5 w-5" />
                        </div>
                        {supplier.verifiedExporter && (
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                            <Globe className="h-2.5 w-2.5 mr-1" />
                            Exporter
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {supplier.companyName || "Unknown Supplier"}
                      </h3>

                      <VerificationBadges
                        verifiedWebsite={supplier.verifiedWebsite}
                        verifiedCompany={supplier.verifiedCompany}
                        verifiedExporter={supplier.verifiedExporter}
                        score={supplier.verificationScore}
                      />

                      <div className="mt-3 space-y-1.5">
                        {supplier.city && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {supplier.city}{supplier.country ? `, ${supplier.country}` : ""}
                          </div>
                        )}
                        {categories && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FileText className="h-3 w-3 shrink-0" />
                            {categories}
                          </div>
                        )}
                        {supplier.website && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">{supplier.website.replace(/^https?:\/\//, "")}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <TrustScoreBar score={supplier.trustScore} />
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex items-center justify-center w-full rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                          View Strategic Supplier
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-zanzibar-800 to-emerald-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white">Want to Join the Strategic Network?</h2>
            <p className="mt-2 text-zanzibar-200">
              Verified suppliers get priority placement in RFQs, featured listings, and direct access to development projects.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/become-supplier"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
              >
                <Crown className="h-4 w-4" /> Become a Strategic Supplier
              </Link>
              <Link
                href="/suppliers"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Browse Full Directory <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
