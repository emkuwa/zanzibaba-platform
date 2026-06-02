/**
 * Price index aggregation.
 *
 * Reads ACTIVE PriceObservation rows for a (material, region) pair within
 * the desired period and upserts a MaterialPriceIndex row capturing
 * statistical summaries.
 *
 * Default invocation: a nightly cron at 02:00 EAT that recomputes the
 * "daily" granularity index for the previous 24 h.
 */

import { prisma } from "@/lib/prisma"
import type { Material, Region } from "@prisma/client"
import { summariseCohort } from "./normalization"

export type IndexGranularity = "daily" | "weekly" | "monthly"

export interface RebuildOptions {
  materialId?: string
  regionId?: string
  granularity?: IndexGranularity
  periodEnd?: Date
}

function granularityWindow(granularity: IndexGranularity, end: Date): { start: Date; end: Date } {
  const start = new Date(end)
  if (granularity === "daily") start.setUTCDate(start.getUTCDate() - 1)
  else if (granularity === "weekly") start.setUTCDate(start.getUTCDate() - 7)
  else if (granularity === "monthly") start.setUTCMonth(start.getUTCMonth() - 1)
  return { start, end }
}

export async function rebuildIndex(opts: RebuildOptions = {}): Promise<{ updated: number }> {
  const granularity = opts.granularity ?? "daily"
  const end = opts.periodEnd ?? new Date()
  const { start, end: periodEnd } = granularityWindow(granularity, end)

  const materialFilter = opts.materialId ? { id: opts.materialId } : { isActive: true }
  const regionFilter = opts.regionId ? { id: opts.regionId } : { isActive: true }

  const materials = await prisma.material.findMany({ where: materialFilter, select: { id: true, slug: true } })
  const regions = await prisma.region.findMany({ where: regionFilter, select: { id: true, code: true } })

  let updated = 0
  for (const material of materials) {
    for (const region of regions) {
      const observations = await prisma.priceObservation.findMany({
        where: {
          materialId: material.id,
          regionId: region.id,
          status: "ACTIVE",
          observedAt: { gte: start, lte: periodEnd },
        },
        select: { unitPrice: true, currency: true, confidence: true },
      })

      if (!observations.length) continue

      const values = observations.map((o) => Number(o.unitPrice))
      const stats = summariseCohort(values)
      const conf = Math.round(
        observations.reduce((s, o) => s + (o.confidence ?? 0), 0) / observations.length
      )

      const prev = await prisma.materialPriceIndex.findFirst({
        where: { materialId: material.id, regionId: region.id, granularity },
        orderBy: { periodStart: "desc" },
        select: { median: true },
      })
      const change = prev?.median && stats.median
        ? ((stats.median - Number(prev.median)) / Number(prev.median)) * 100
        : null

      await prisma.materialPriceIndex.upsert({
        where: {
          materialId_regionId_periodStart_granularity: {
            materialId: material.id,
            regionId: region.id,
            periodStart: start,
            granularity,
          },
        },
        create: {
          materialId: material.id,
          regionId: region.id,
          periodStart: start,
          periodEnd,
          granularity,
          currency: observations[0]?.currency ?? "TZS",
          p25: stats.p25 ?? undefined,
          median: stats.median ?? undefined,
          p75: stats.p75 ?? undefined,
          mean: stats.mean ?? undefined,
          stddev: stats.stddev ?? undefined,
          sampleSize: stats.n,
          changePct: change ?? undefined,
          confidence: conf,
        },
        update: {
          periodEnd,
          p25: stats.p25 ?? undefined,
          median: stats.median ?? undefined,
          p75: stats.p75 ?? undefined,
          mean: stats.mean ?? undefined,
          stddev: stats.stddev ?? undefined,
          sampleSize: stats.n,
          changePct: change ?? undefined,
          confidence: conf,
        },
      })
      updated += 1
    }
  }
  return { updated }
}

/**
 * Find the latest price index for a material in a region, falling back to
 * the nearest region in order: ZNZ → DSM → ARU → DOD → MWZ.
 */
export async function getLatestIndex(materialId: string, preferredRegionId?: string) {
  const order = preferredRegionId ? [preferredRegionId] : []
  const allRegions = await prisma.region.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, code: true },
  })
  for (const r of allRegions) {
    if (!order.includes(r.id)) order.push(r.id)
  }

  for (const regionId of order) {
    const idx = await prisma.materialPriceIndex.findFirst({
      where: { materialId, regionId, granularity: "daily" },
      orderBy: { periodStart: "desc" },
      include: { region: true },
    })
    if (idx && idx.median) return idx
  }
  return null
}

export interface PriceLookupResult {
  material: Material
  region: Region | null
  median: number | null
  p25: number | null
  p75: number | null
  currency: string
  sampleSize: number
  changePct: number | null
  isFallback: boolean
}

export async function lookupPrice(materialSlug: string, regionId?: string): Promise<PriceLookupResult | null> {
  const material = await prisma.material.findUnique({ where: { slug: materialSlug } })
  if (!material) return null
  const idx = await getLatestIndex(material.id, regionId)
  if (!idx) return { material, region: null, median: null, p25: null, p75: null, currency: "TZS", sampleSize: 0, changePct: null, isFallback: true }
  return {
    material,
    region: idx.region,
    median: idx.median ? Number(idx.median) : null,
    p25: idx.p25 ? Number(idx.p25) : null,
    p75: idx.p75 ? Number(idx.p75) : null,
    currency: idx.currency,
    sampleSize: idx.sampleSize,
    changePct: idx.changePct ? Number(idx.changePct) : null,
    isFallback: regionId ? idx.regionId !== regionId : false,
  }
}
