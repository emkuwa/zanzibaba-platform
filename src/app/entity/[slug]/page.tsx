import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { resolveEntityProfile } from "@/lib/discovery-v2/entity-mapper"
import { getEntityTypeDef } from "@/lib/discovery-v2/entity-types"
import { MapPin, Shield, Star, Globe, Mail, Phone, BadgeCheck, Crown, Store, Building2, HardHat, PencilRuler } from "lucide-react"

export const dynamic = "force-dynamic"

const ICON_MAP: Record<string, any> = {
  Store, Building2, HardHat, PencilRuler, Globe, Shield, Star, Mail, Phone, BadgeCheck, Crown,
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entity = await prisma.directoryEntity.findUnique({ where: { slug } })
  if (!entity) return { title: "Not Found" }
  return {
    title: `${entity.name} — Zanzibaba`,
    description: entity.description || `View ${entity.name} on Zanzibaba marketplace.`,
  }
}

function formatCategories(labels: unknown): string {
  if (Array.isArray(labels)) return labels.join(", ")
  return "General"
}

export default async function EntityDetailPage({ params }: Props) {
  const { slug } = await params

  const entity = await prisma.directoryEntity.findUnique({ where: { slug } })
  if (!entity) notFound()

  const typeDef = getEntityTypeDef(entity.entityType)
  const { profile } = await resolveEntityProfile(entity)
  const categories = formatCategories(entity.categoryLabels)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-zanzibar-800 to-emerald-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Store className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{entity.name}</h1>
                {entity.verificationBadge && (
                  <BadgeCheck className="h-6 w-6 text-blue-400" />
                )}
                {entity.isFeatured && (
                  <Crown className="h-5 w-5 text-amber-400" />
                )}
              </div>
              {typeDef && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-zanzibar-200">
                  {typeDef.label}
                </span>
              )}
              {entity.city && (
                <div className="flex items-center gap-1.5 mt-2 text-zanzibar-200 text-sm">
                  <MapPin className="h-4 w-4" />
                  {entity.city}{entity.country ? `, ${entity.country}` : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {entity.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{entity.description}</p>
              </div>
            )}

            {categories && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.split(", ").map((cat) => (
                    <span key={cat} className="inline-flex items-center rounded-full bg-zanzibar-50 px-3 py-1 text-sm text-zanzibar-700 border border-zanzibar-200">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Business Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {(profile as any).yearEstablished && (
                    <div>
                      <span className="text-gray-500">Established</span>
                      <p className="font-medium text-gray-900">{(profile as any).yearEstablished}</p>
                    </div>
                  )}
                  {(profile as any).employeeCount && (
                    <div>
                      <span className="text-gray-500">Employees</span>
                      <p className="font-medium text-gray-900">{(profile as any).employeeCount}</p>
                    </div>
                  )}
                  {(profile as any).registrationNumber && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Registration</span>
                      <p className="font-medium text-gray-900">{(profile as any).registrationNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {entity.website && (
                  <a href={entity.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zanzibar-600 hover:text-zanzibar-700">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="truncate">{entity.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                {entity.email && (
                  <a href={`mailto:${entity.email}`} className="flex items-center gap-2 text-zanzibar-600 hover:text-zanzibar-700">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{entity.email}</span>
                  </a>
                )}
                {entity.phone && (
                  <a href={`tel:${entity.phone}`} className="flex items-center gap-2 text-zanzibar-600 hover:text-zanzibar-700">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{entity.phone}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Trust & Reputation</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Trust Score</span>
                  <span className="font-medium text-gray-900">{entity.trustScore}/100</span>
                </div>
                {Number(entity.avgRating) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {Number(entity.avgRating).toFixed(1)} ({entity.reviewCount})
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Verification</span>
                  <span className={`font-medium ${entity.verificationBadge ? "text-emerald-600" : "text-gray-400"}`}>
                    {entity.verificationBadge ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Profile Views</span>
                  <span className="font-medium text-gray-900">{entity.profileViews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
