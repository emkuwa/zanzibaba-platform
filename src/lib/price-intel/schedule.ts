/**
 * Material schedule generator.
 *
 * Given either:
 *   (a) a parsed BOQDocument with line items, or
 *   (b) a (projectType, region, sqm, tier) tuple → estimator results,
 *
 * produce a MaterialSchedule with priced ScheduleLineItem rows.
 */

import { prisma } from "@/lib/prisma"
import type { MaterialCategorySlug, ProjectType, QualityTier } from "@prisma/client"
import { lookupPrice } from "./index-aggregator"
import { runEstimate } from "./estimator"
import { matchMaterialBySlug } from "./boq-parser"
import { USD_TO_TZS_RATE } from "./constants"

export interface ScheduleFromEstimateInput {
  buyerId?: string | null
  projectId?: string | null
  regionId: string
  projectType: ProjectType
  qualityTier: QualityTier
  builtUpAreaSqm: number
  title?: string
}

export interface ScheduleFromBOQInput {
  buyerId?: string | null
  projectId?: string | null
  regionId: string
  boqDocumentId: string
  title?: string
}

export interface ParsedBOQLine {
  description: string
  qty: number
  unit?: string | null
  rate?: number | null
  amount?: number | null
}

interface ScheduleLine {
  description: string
  materialId?: string | null
  categorySlug?: MaterialCategorySlug | null
  qty: number
  unit?: string | null
  unitPriceMedian: number | null
  unitPriceLow: number | null
  unitPriceHigh: number | null
  costMedian: number | null
  matchScore: number
  needsReview: boolean
  topSuppliers: Array<{ supplierProfileId: string; companyName: string; price: number | null; leadTimeDays?: number | null }>
}

/** Build a schedule from a parsed BOQ. */
export async function buildScheduleFromBOQ(input: ScheduleFromBOQInput) {
  const boq = await prisma.bOQDocument.findUnique({ where: { id: input.boqDocumentId } })
  if (!boq) throw new Error("BOQ not found")
  const parsed: ParsedBOQLine[] = (boq.parsed as { lines?: ParsedBOQLine[] } | null)?.lines ?? []
  return await buildScheduleFromLines({
    lines: parsed,
    buyerId: input.buyerId ?? null,
    projectId: input.projectId ?? null,
    boqDocumentId: input.boqDocumentId,
    regionId: input.regionId,
    title: input.title ?? `Schedule from ${boq.filename ?? "BOQ"}`,
  })
}

/** Build a schedule from estimator output. */
export async function buildScheduleFromEstimate(input: ScheduleFromEstimateInput) {
  const est = await runEstimate({
    projectType: input.projectType,
    qualityTier: input.qualityTier,
    regionId: input.regionId,
    builtUpAreaSqm: input.builtUpAreaSqm,
    persist: false,
  })

  // For each estimator line, attempt to find a representative Material in the
  // category and derive a qty from cost ÷ median price.
  const lines: ParsedBOQLine[] = []
  for (const li of est.lineItems) {
    const sample = await prisma.material.findFirst({
      where: { categorySlug: li.categorySlug as MaterialCategorySlug, isActive: true },
      orderBy: { displayOrder: "asc" },
    })
    if (!sample) {
      lines.push({ description: li.label, qty: 1, unit: "lot", rate: li.costMedian, amount: li.costMedian })
      continue
    }
    const px = await lookupPrice(sample.slug, input.regionId)
    const usdLineCost = li.costMedian
    const tzsLineCost = usdLineCost * USD_TO_TZS_RATE
    const unitPriceTzs = px?.median ?? 0
    const qty = unitPriceTzs > 0 ? Math.round((tzsLineCost / unitPriceTzs) * 100) / 100 : 1
    lines.push({ description: sample.name, qty, unit: sample.unit, rate: unitPriceTzs, amount: tzsLineCost })
  }

  return await buildScheduleFromLines({
    lines,
    buyerId: input.buyerId ?? null,
    projectId: input.projectId ?? null,
    boqDocumentId: null,
    regionId: input.regionId,
    title: input.title ?? `Estimate-derived schedule (${input.projectType})`,
  })
}

interface BuildArgs {
  lines: ParsedBOQLine[]
  buyerId: string | null
  projectId: string | null
  boqDocumentId: string | null
  regionId: string
  title: string
}

async function buildScheduleFromLines(args: BuildArgs) {
  const priced: ScheduleLine[] = []
  for (const line of args.lines) {
    const match = await matchMaterialBySlug(line.description)
    let unitPriceMedian: number | null = null
    let unitPriceLow: number | null = null
    let unitPriceHigh: number | null = null
    let costMedian: number | null = line.amount ?? null
    let topSuppliers: ScheduleLine["topSuppliers"] = []
    let categorySlug: MaterialCategorySlug | null = null
    let materialId: string | null = null
    if (match.material) {
      materialId = match.material.id
      categorySlug = match.material.categorySlug as MaterialCategorySlug
      const px = await lookupPrice(match.material.slug, args.regionId)
      if (px) {
        unitPriceMedian = px.median
        unitPriceLow = px.p25
        unitPriceHigh = px.p75
      }
      if (unitPriceMedian && line.qty) costMedian = Math.round(unitPriceMedian * line.qty)
      const suppliers = await prisma.materialSupplier.findMany({
        where: { materialId: match.material.id, regionId: args.regionId, isActive: true },
        take: 5,
        include: { material: false },
      })
      const supplierProfiles = suppliers.length
        ? await prisma.supplierProfile.findMany({
            where: { id: { in: suppliers.map((s) => s.supplierProfileId) } },
            select: { id: true, companyName: true, avgRating: true },
          })
        : []
      const profileMap = new Map(supplierProfiles.map((p) => [p.id, p]))
      topSuppliers = suppliers
        .map((s) => ({
          supplierProfileId: s.supplierProfileId,
          companyName: profileMap.get(s.supplierProfileId)?.companyName ?? "",
          price: s.unitPrice ? Number(s.unitPrice) : null,
          leadTimeDays: s.leadTimeDays ?? null,
        }))
        .sort((a, b) => {
          const ap = a.price ?? Number.POSITIVE_INFINITY
          const bp = b.price ?? Number.POSITIVE_INFINITY
          return ap - bp
        })
        .slice(0, 3)
    }
    priced.push({
      description: line.description,
      materialId,
      categorySlug,
      qty: line.qty,
      unit: line.unit ?? match.material?.unit ?? null,
      unitPriceMedian,
      unitPriceLow,
      unitPriceHigh,
      costMedian,
      matchScore: match.score,
      needsReview: match.score < 0.78,
      topSuppliers,
    })
  }

  const grandTotalTzs = priced.reduce((s, l) => s + (l.costMedian ?? 0), 0)
  const totalsByCategory: Record<string, number> = {}
  for (const l of priced) {
    if (!l.categorySlug || !l.costMedian) continue
    totalsByCategory[l.categorySlug] = (totalsByCategory[l.categorySlug] ?? 0) + l.costMedian
  }

  const schedule = await prisma.materialSchedule.create({
    data: {
      buyerId: args.buyerId ?? undefined,
      projectId: args.projectId ?? undefined,
      boqDocumentId: args.boqDocumentId ?? undefined,
      regionId: args.regionId,
      title: args.title,
      totalsByCategory,
      grandTotalTzs,
      grandTotalUsd: grandTotalTzs > 0 ? Math.round(grandTotalTzs / USD_TO_TZS_RATE) : undefined,
      currency: "TZS",
      lineItems: {
        create: priced.map((line, position) => ({
          description: line.description,
          materialId: line.materialId ?? undefined,
          categorySlug: line.categorySlug ?? undefined,
          qty: line.qty,
          unit: line.unit ?? undefined,
          unitPriceMedian: line.unitPriceMedian ?? undefined,
          unitPriceLow: line.unitPriceLow ?? undefined,
          unitPriceHigh: line.unitPriceHigh ?? undefined,
          costMedian: line.costMedian ?? undefined,
          matchScore: line.matchScore,
          needsReview: line.needsReview,
          topSuppliers: line.topSuppliers,
          position,
        })),
      },
    },
    include: { lineItems: true },
  })
  return schedule
}
