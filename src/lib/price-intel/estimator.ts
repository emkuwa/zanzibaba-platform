/**
 * Cost estimation engine.
 *
 * Two-stage parametric model — see docs/17 §7.
 *
 *   Stage 1 — building cost index (BCI):
 *     base_budget = sqm × benchmark.sqmCostMedian × tierMultiplier
 *
 *   Stage 2 — material composition overlay:
 *     for each category share, derive perCategory cost & implied qty.
 *
 * Persists the estimate to ProjectEstimate + EstimateLineItem when
 * `persist=true`. Returns the computed shape regardless.
 */

import { prisma } from "@/lib/prisma"
import type { ProjectType, QualityTier } from "@prisma/client"
import { MATERIAL_CATEGORIES, QUALITY_TIERS, USD_TO_TZS_RATE } from "./constants"

export interface EstimateInput {
  projectType: ProjectType
  qualityTier: QualityTier
  regionId: string
  builtUpAreaSqm: number
  buyerId?: string | null
  sessionRef?: string | null
  projectName?: string | null
  persist?: boolean
}

export interface EstimateLine {
  categorySlug: string
  label: string
  sharePct: number
  costMedian: number
  costMin: number
  costMax: number
  currency: string
}

export interface EstimateResult {
  estimateId: string | null
  projectName: string | null
  region: { id: string; code: string; name: string }
  projectType: ProjectType
  qualityTier: QualityTier
  builtUpAreaSqm: number
  currency: string
  totals: {
    median: number
    min: number
    max: number
    sqmCostMedian: number
  }
  lineItems: EstimateLine[]
  assumptions: Record<string, unknown>
}

/**
 * Run an estimate with no DB write — pure compute.
 */
async function computeEstimate(input: EstimateInput) {
  const region = await prisma.region.findUnique({ where: { id: input.regionId } })
  if (!region) throw new Error("Unknown region " + input.regionId)

  const tier = QUALITY_TIERS.find((t) => t.value === input.qualityTier)
  if (!tier) throw new Error("Unknown tier " + input.qualityTier)

  // Stage 1: BCI lookup
  const benchmark = await prisma.costBenchmark.findFirst({
    where: {
      regionId: region.id,
      projectType: input.projectType,
      qualityTier: input.qualityTier,
      isActive: true,
    },
    orderBy: { effectiveFrom: "desc" },
  })

  // Use benchmark if found, else fall back to mid-tier with multiplier
  let sqmCostMedian: number
  let sqmCostP25: number
  let sqmCostP75: number
  let currency = "USD"
  if (benchmark) {
    sqmCostMedian = Number(benchmark.sqmCostMedian)
    sqmCostP25 = benchmark.sqmCostP25 ? Number(benchmark.sqmCostP25) : sqmCostMedian * 0.85
    sqmCostP75 = benchmark.sqmCostP75 ? Number(benchmark.sqmCostP75) : sqmCostMedian * 1.2
    currency = benchmark.currency
  } else {
    const midBenchmark = await prisma.costBenchmark.findFirst({
      where: {
        regionId: region.id,
        projectType: input.projectType,
        qualityTier: "MID",
        isActive: true,
      },
      orderBy: { effectiveFrom: "desc" },
    })
    if (!midBenchmark) throw new Error("No cost benchmark seeded for region " + region.code)
    const midMedian = Number(midBenchmark.sqmCostMedian)
    sqmCostMedian = midMedian * tier.multiplier
    sqmCostP25 = sqmCostMedian * 0.85
    sqmCostP75 = sqmCostMedian * 1.2
    currency = midBenchmark.currency
  }

  const baseMedian = input.builtUpAreaSqm * sqmCostMedian
  const baseMin = input.builtUpAreaSqm * sqmCostP25
  const baseMax = input.builtUpAreaSqm * sqmCostP75

  // Stage 2: category overlay
  const lineItems: EstimateLine[] = []
  for (const cat of MATERIAL_CATEGORIES) {
    const share = cat.shareByProjectType[input.projectType]
    if (!share || share <= 0) continue
    lineItems.push({
      categorySlug: cat.slug,
      label: cat.name,
      sharePct: Number((share * 100).toFixed(2)),
      costMedian: Math.round(baseMedian * share),
      costMin: Math.round(baseMin * share),
      costMax: Math.round(baseMax * share),
      currency,
    })
  }
  lineItems.sort((a, b) => b.costMedian - a.costMedian)

  const totals = {
    median: Math.round(baseMedian),
    min: Math.round(baseMin),
    max: Math.round(baseMax),
    sqmCostMedian: Math.round(sqmCostMedian),
  }

  return {
    region,
    tier,
    benchmark,
    sqmCostMedian,
    sqmCostP25,
    sqmCostP75,
    currency,
    totals,
    lineItems,
  }
}

/**
 * Run estimate, optionally persisting to DB.
 */
export async function runEstimate(input: EstimateInput): Promise<EstimateResult> {
  const computed = await computeEstimate(input)

  let estimateId: string | null = null
  if (input.persist) {
    const estimate = await prisma.projectEstimate.create({
      data: {
        buyerId: input.buyerId ?? undefined,
        sessionRef: input.sessionRef ?? undefined,
        projectName: input.projectName ?? undefined,
        projectType: input.projectType,
        qualityTier: input.qualityTier,
        regionId: computed.region.id,
        builtUpAreaSqm: input.builtUpAreaSqm,
        budgetMin: computed.totals.min,
        budgetMedian: computed.totals.median,
        budgetMax: computed.totals.max,
        currency: computed.currency,
        assumptions: {
          sqmCostMedian: computed.sqmCostMedian,
          sqmCostP25: computed.sqmCostP25,
          sqmCostP75: computed.sqmCostP75,
          tierMultiplier: computed.tier.multiplier,
          usdToTzsRate: USD_TO_TZS_RATE,
        },
        lineItems: {
          create: computed.lineItems.map((li) => ({
            categorySlug: li.categorySlug as never,
            label: li.label,
            qty: 1,
            costMedian: li.costMedian,
            costMin: li.costMin,
            costMax: li.costMax,
            sharePct: li.sharePct,
          })),
        },
      },
    })
    estimateId = estimate.id
  }

  return {
    estimateId,
    projectName: input.projectName ?? null,
    region: { id: computed.region.id, code: computed.region.code, name: computed.region.name },
    projectType: input.projectType,
    qualityTier: input.qualityTier,
    builtUpAreaSqm: input.builtUpAreaSqm,
    currency: computed.currency,
    totals: computed.totals,
    lineItems: computed.lineItems,
    assumptions: {
      sqmCostMedian: computed.sqmCostMedian,
      sqmCostP25: computed.sqmCostP25,
      sqmCostP75: computed.sqmCostP75,
      tierMultiplier: computed.tier.multiplier,
      usdToTzsRate: USD_TO_TZS_RATE,
      note: computed.benchmark ? "from-benchmark" : "tier-multiplier-derived",
    },
  }
}
