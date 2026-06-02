/**
 * Free Cost Estimator — /estimate
 *
 * Client component (form + live recompute via /api/estimate).
 */

"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calculator, FileText, MapPin, Layers, Sparkles, ArrowRight } from "lucide-react"

const PROJECT_TYPES = [
  { v: "VILLA", l: "Villa", h: "150 – 600 sqm" },
  { v: "HOTEL", l: "Hotel", h: "1500 – 10000 sqm" },
  { v: "RESORT", l: "Resort", h: "3000 – 20000 sqm" },
  { v: "RESIDENTIAL_BLOCK", l: "Residential block", h: "500 – 5000 sqm" },
  { v: "OFFICE", l: "Office", h: "500 – 8000 sqm" },
  { v: "COMMERCIAL", l: "Retail / commercial", h: "200 – 5000 sqm" },
  { v: "WAREHOUSE", l: "Warehouse", h: "1000 – 10000 sqm" },
  { v: "HOSPITALITY_FITOUT", l: "Hospitality fit-out (FF&E)", h: "FF&E + OS&E only" },
  { v: "RENOVATION", l: "Renovation", h: "Existing structure" },
]
const TIERS = [
  { v: "BASIC", l: "Basic", d: "Local materials, value-engineered" },
  { v: "MID", l: "Mid-market", d: "Mix of local + imported brands" },
  { v: "PREMIUM", l: "Premium / 5-star", d: "Imported, branded, top-spec" },
]
const REGIONS = [
  { v: "ZNZ", l: "Zanzibar" },
  { v: "DSM", l: "Dar es Salaam" },
  { v: "ARU", l: "Arusha" },
  { v: "DOD", l: "Dodoma" },
  { v: "MWZ", l: "Mwanza" },
]

interface EstimateLine {
  categorySlug: string
  label: string
  sharePct: number
  costMedian: number
  costMin: number
  costMax: number
  currency: string
}
interface EstimateResp {
  estimateId: string | null
  region: { id: string; code: string; name: string }
  totals: { median: number; min: number; max: number; sqmCostMedian: number }
  lineItems: EstimateLine[]
  currency: string
  assumptions: Record<string, unknown>
}

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n)

export default function EstimatePage() {
  const [projectType, setProjectType] = useState("VILLA")
  const [qualityTier, setQualityTier] = useState("MID")
  const [regionCode, setRegionCode] = useState("ZNZ")
  const [sqm, setSqm] = useState(350)
  const [result, setResult] = useState<EstimateResp | null>(null)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    setError(null)
    start(async () => {
      try {
        const r = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectType, qualityTier, regionCode, builtUpAreaSqm: sqm }),
        })
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.message ?? `${r.status} ${r.statusText}`)
        }
        setResult(await r.json())
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-amber-700">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Cost Estimator</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Free Project Cost Estimator
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Get a defensible USD budget range for your project across Zanzibar and mainland Tanzania —
            built on our daily material price index and regional construction benchmarks.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-5">
        {/* form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Project type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {PROJECT_TYPES.map((p) => (
                    <option key={p.v} value={p.v}>{p.l} — {p.h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Layers className="h-4 w-4 text-amber-600" /> Quality tier
                </label>
                <div className="grid gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.v}
                      type="button"
                      onClick={() => setQualityTier(t.v)}
                      className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                        qualityTier === t.v ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <div className="font-medium text-slate-900">{t.l}</div>
                      <div className="text-xs text-slate-500">{t.d}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="h-4 w-4 text-amber-600" /> Region
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r.v}
                      type="button"
                      onClick={() => setRegionCode(r.v)}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        regionCode === r.v ? "bg-amber-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {r.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Built-up area (sqm)</label>
                <Input
                  type="number"
                  min={20}
                  max={100000}
                  value={sqm}
                  onChange={(e) => setSqm(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <Button onClick={run} disabled={pending || sqm < 20} size="lg" className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                {pending ? "Calculating…" : (
                  <>
                    <Calculator className="h-4 w-4" /> Compute Estimate
                  </>
                )}
              </Button>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>
          </Card>
        </div>

        {/* result */}
        <div className="lg:col-span-3">
          {!result && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              <Calculator className="mx-auto h-10 w-10 text-amber-500" />
              <h2 className="mt-3 text-lg font-semibold text-slate-900">Fill out the form and click Compute</h2>
              <p className="mt-1 text-sm">We&apos;ll show a budget range, category breakdown, and route to suppliers.</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-amber-600">{result.region.name}</Badge>
                  <h2 className="text-xl font-semibold text-slate-900">Estimated budget</h2>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-amber-700">{fmt(result.totals.median, result.currency)}</span>
                    <span className="text-sm text-slate-500">median</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Range {fmt(result.totals.min, result.currency)} – {fmt(result.totals.max, result.currency)}
                    &nbsp;·&nbsp; sqm cost {fmt(result.totals.sqmCostMedian, result.currency)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link href="/dashboard/buyer/boq">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-3 w-3" /> Refine with BOQ
                      </Button>
                    </Link>
                    <Link href="/rfq">
                      <Button size="sm" className="gap-1 bg-amber-600 hover:bg-amber-700">
                        Get supplier quotes <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Category breakdown</h3>
                  <div className="space-y-2">
                    {result.lineItems.map((li) => (
                      <div key={li.categorySlug} className="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{li.label}</div>
                          <div className="text-xs text-slate-500">{li.sharePct.toFixed(1)}% of budget</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-amber-700">{fmt(li.costMedian, li.currency)}</div>
                          <div className="text-xs text-slate-500">{fmt(li.costMin, li.currency)} – {fmt(li.costMax, li.currency)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-slate-400">
                Methodology: BCI × tier multiplier + category overlay. See <Link href="/prices" className="underline">Material Price Index</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
