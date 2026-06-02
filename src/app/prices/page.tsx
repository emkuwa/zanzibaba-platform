/**
 * Public price index — /prices
 *
 * Server component, ISR (revalidate 1800s = 30 min). Uses the same
 * `/api/prices` payload but reads directly from Prisma to skip a redundant
 * network hop.
 */

import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Layers, MapPin, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { MATERIAL_CATEGORIES, REGIONS, USD_TO_TZS_RATE } from "@/lib/price-intel/constants"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "Material Prices — Zanzibar, Dar es Salaam, Arusha, Dodoma, Mwanza | Zanzibaba",
  description:
    "Daily material prices across 5 Tanzanian regions and 16 construction categories — cement, rebars, BRC, blocks, tiles, paint, timber, aluminium, FF&E and more. Free, sourced from verified suppliers and updated daily.",
}

const formatTzs = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n))

export default async function PricesPage(props: { searchParams: Promise<{ region?: string; category?: string }> }) {
  const sp = await props.searchParams
  const regionCode = sp.region?.toUpperCase()
  const categorySlug = sp.category?.toUpperCase()

  const region = regionCode
    ? await prisma.region.findUnique({ where: { code: regionCode as "ZNZ" } })
    : null

  const materials = await prisma.material.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { categorySlug: categorySlug as "CEMENT" } : {}),
    },
    orderBy: [{ categorySlug: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    include: { category: true },
    take: 200,
  })

  const indexRows = materials.length
    ? await prisma.materialPriceIndex.findMany({
        where: {
          materialId: { in: materials.map((m) => m.id) },
          granularity: "daily",
          ...(region ? { regionId: region.id } : {}),
        },
        orderBy: { periodStart: "desc" },
        include: { region: true },
      })
    : []

  const byMaterial = new Map<string, (typeof indexRows)[number]>()
  for (const ix of indexRows) {
    if (!byMaterial.has(ix.materialId)) byMaterial.set(ix.materialId, ix)
  }

  const groupedByCategory: Record<string, typeof materials> = {}
  for (const m of materials) {
    const k = m.categorySlug
    groupedByCategory[k] = groupedByCategory[k] ?? []
    groupedByCategory[k].push(m)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* hero */}
      <section className="border-b bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-amber-700">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Material Prices</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Tanzania Material Price Index
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Median construction-material prices across <strong>Zanzibar, Dar es Salaam, Arusha, Dodoma & Mwanza</strong> —
            updated daily from verified suppliers, supplier portals, and weekly market surveys.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/estimate">
              <Button size="lg" className="gap-2 bg-amber-600 hover:bg-amber-700">
                <Calculator className="h-4 w-4" /> Free Cost Estimator
              </Button>
            </Link>
            <Link href="/dashboard/buyer/boq">
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> Upload a BOQ
              </Button>
            </Link>
            <Link href="/rfq">
              <Button size="lg" variant="ghost" className="gap-2">
                <Layers className="h-4 w-4" /> Get Quotes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* region & category filters */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-amber-600" /> Region
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/prices${categorySlug ? `?category=${categorySlug}` : ""}`}>
              <Badge variant={!region ? "default" : "secondary"} className="cursor-pointer px-3 py-1">All regions</Badge>
            </Link>
            {REGIONS.map((r) => (
              <Link
                key={r.code}
                href={`/prices?region=${r.code}${categorySlug ? `&category=${categorySlug}` : ""}`}
              >
                <Badge variant={regionCode === r.code ? "default" : "secondary"} className="cursor-pointer px-3 py-1">
                  {r.name}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="mb-3 mt-5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Layers className="h-4 w-4 text-amber-600" /> Category
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/prices${regionCode ? `?region=${regionCode}` : ""}`}>
              <Badge variant={!categorySlug ? "default" : "secondary"} className="cursor-pointer px-3 py-1">All categories</Badge>
            </Link>
            {MATERIAL_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/prices?category=${c.slug}${regionCode ? `&region=${regionCode}` : ""}`}
              >
                <Badge variant={categorySlug === c.slug ? "default" : "secondary"} className="cursor-pointer px-3 py-1">
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* table */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {Object.entries(groupedByCategory).map(([catSlug, items]) => {
          const cat = MATERIAL_CATEGORIES.find((c) => c.slug === catSlug)
          return (
            <div key={catSlug} className="mb-12">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-slate-900">
                {cat?.name ?? catSlug}
                <span className="ml-2 text-base font-normal text-slate-500">{items.length} materials</span>
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => {
                  const ix = byMaterial.get(m.id)
                  const median = ix?.median ? Number(ix.median) : null
                  const change = ix?.changePct ? Number(ix.changePct) : null
                  return (
                    <Link key={m.id} href={`/prices/${m.slug}`}>
                      <Card className="h-full transition hover:border-amber-400 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{m.name}</h3>
                              {m.spec && <p className="mt-0.5 text-xs text-slate-500">{m.spec}</p>}
                            </div>
                            {change !== null && (
                              <Badge variant={change > 0 ? "danger" : change < 0 ? "default" : "secondary"} className="gap-1 text-xs">
                                {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                {change > 0 ? "+" : ""}{change.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3 flex items-end justify-between">
                            <div>
                              {median ? (
                                <>
                                  <div className="text-2xl font-bold text-amber-700">
                                    TZS {formatTzs(median)}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    ≈ USD {formatTzs(median / USD_TO_TZS_RATE)} · per {m.unit}
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm text-slate-400">Price pending</span>
                              )}
                            </div>
                            {ix?.region && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="mr-1 h-3 w-3" />
                                {ix.region.code}
                              </Badge>
                            )}
                          </div>
                          {ix?.sampleSize ? (
                            <p className="mt-2 text-xs text-slate-400">
                              {ix.sampleSize} {ix.sampleSize === 1 ? "observation" : "observations"} · {ix.confidence}% confidence
                            </p>
                          ) : null}
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
