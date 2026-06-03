/**
 * Material detail page — /prices/[slug]
 *
 * Server-rendered with per-region snapshot, sparkline-style history, and
 * top 5 suppliers. Generates structured data (Schema.org Product) for SEO.
 */

import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BadgeCheck, MapPin, Phone, Sparkles, Store, TrendingDown, TrendingUp } from "lucide-react"
import { USD_TO_TZS_RATE } from "@/lib/price-intel/constants"

export const revalidate = 1800

export async function generateStaticParams() {
  try {
    const materials = await prisma.material.findMany({ where: { isActive: true }, select: { slug: true }, take: 200 })
    return materials.map((m) => ({ slug: m.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata(ctx: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await ctx.params
  const mat = await prisma.material.findUnique({ where: { slug }, select: { name: true, spec: true, unit: true } })
  if (!mat) return { title: "Material not found — Zanzibaba" }
  return {
    title: `${mat.name} prices — Zanzibar, Tanzania | Zanzibaba`,
    description: `Latest median price for ${mat.name}${mat.spec ? ` (${mat.spec})` : ""} across Zanzibar, Dar es Salaam, Arusha, Dodoma & Mwanza. Per ${mat.unit}.`,
  }
}

const formatTzs = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n))

export default async function MaterialDetailPage(ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  let material
  try {
    material = await prisma.material.findUnique({
      where: { slug },
      include: { category: true, variants: true },
    })
  } catch {
    notFound()
  }
  if (!material) notFound()

  const indices = await prisma.materialPriceIndex.findMany({
    where: { materialId: material.id, granularity: "daily" },
    orderBy: { periodStart: "desc" },
    include: { region: true },
    take: 50,
  })

  const matSuppliers = await prisma.materialSupplier.findMany({
    where: { materialId: material.id, isActive: true },
    take: 20,
    orderBy: { unitPrice: "asc" },
  })
  const supplierProfiles = matSuppliers.length
    ? await prisma.supplierProfile.findMany({
        where: { id: { in: matSuppliers.map((s) => s.supplierProfileId) } },
        select: { id: true, companyName: true, city: true, country: true, avgRating: true, verificationStatus: true, isFeatured: true, whatsappNumber: true },
      })
    : []
  const profileMap = new Map(supplierProfiles.map((p) => [p.id, p]))

  const byRegion = new Map<string, (typeof indices)[number]>()
  for (const ix of indices) if (!byRegion.has(ix.regionId)) byRegion.set(ix.regionId, ix)
  const regions = await prisma.region.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })

  const lowest = [...byRegion.values()].sort((a, b) => Number(a.median ?? 0) - Number(b.median ?? 0))[0]

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: material.name,
    description: `${material.name}${material.spec ? ` — ${material.spec}` : ""}, sold per ${material.unit}`,
    category: material.category.name,
    offers: [...byRegion.values()].map((ix) => ({
      "@type": "Offer",
      priceCurrency: ix.currency,
      price: ix.median ? Number(ix.median) : undefined,
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "City", name: ix.region.name, addressCountry: "TZ" },
    })),
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="border-b bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link href="/prices" className="inline-flex items-center gap-1 text-sm text-amber-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to prices
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {material.name}
          </h1>
          {material.spec && <p className="mt-1 text-slate-600">{material.spec}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{material.category.name}</Badge>
            <Badge variant="outline">per {material.unit}</Badge>
            {lowest?.median && lowest.region && (
              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                Cheapest in {lowest.region.name}: TZS {formatTzs(Number(lowest.median))}
              </Badge>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/rfq?materialSlug=${material.slug}`}>
              <Button size="lg" className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Sparkles className="h-4 w-4" /> Get Quotes from Suppliers
              </Button>
            </Link>
            <Link href="/estimate">
              <Button variant="outline" size="lg">Estimate Project Cost</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Regional price index</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => {
            const ix = byRegion.get(r.id)
            const change = ix?.changePct ? Number(ix.changePct) : null
            return (
              <Card key={r.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-600">
                      <MapPin className="mr-1 inline h-4 w-4 text-amber-600" />
                      {r.name}
                    </div>
                    {change !== null && (
                      <Badge variant={change > 0 ? "danger" : "default"} className="gap-1 text-xs">
                        {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {change > 0 ? "+" : ""}{change.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  {ix?.median ? (
                    <>
                      <div className="mt-3 text-3xl font-bold text-amber-700">
                        TZS {formatTzs(Number(ix.median))}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Range TZS {formatTzs(Number(ix.p25 ?? 0))} – {formatTzs(Number(ix.p75 ?? 0))}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        ≈ USD {formatTzs(Number(ix.median) / USD_TO_TZS_RATE)} per {material.unit}
                      </div>
                      <div className="mt-3 text-xs text-slate-400">
                        {ix.sampleSize} observation{ix.sampleSize === 1 ? "" : "s"} · {ix.confidence}% confidence
                      </div>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">No data yet for this region. Be the first supplier — claim your listing.</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <h2 className="mb-4 mt-12 text-2xl font-semibold text-slate-900">Suppliers</h2>
        {matSuppliers.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {matSuppliers.map((ms) => {
              const sp = profileMap.get(ms.supplierProfileId)
              if (!sp) return null
              return (
                <Card key={ms.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                          <Store className="h-4 w-4 text-amber-600" /> {sp.companyName}
                          {sp.verificationStatus === "VERIFIED" && <BadgeCheck className="h-4 w-4 text-blue-600" />}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {sp.city ? `${sp.city}, ` : ""}{sp.country}
                        </p>
                      </div>
                      {ms.unitPrice && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-amber-700">TZS {formatTzs(Number(ms.unitPrice))}</div>
                          <div className="text-xs text-slate-400">per {ms.unit ?? material.unit}</div>
                        </div>
                      )}
                    </div>
                    {ms.leadTimeDays && <p className="mt-2 text-xs text-slate-500">Lead time: {ms.leadTimeDays} days</p>}
                    <div className="mt-3 flex gap-2">
                      <Link href={`/suppliers/${sp.id}`}>
                        <Button size="sm" variant="outline">View profile</Button>
                      </Link>
                      {sp.whatsappNumber && (
                        <a
                          href={`https://wa.me/${sp.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in ${material.name}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <Phone className="mr-1 h-3 w-3" /> WhatsApp
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No suppliers listed yet for this material. <Link href="/auth/register" className="text-amber-700 hover:underline">Claim your business →</Link>
          </p>
        )}
      </section>
    </main>
  )
}
