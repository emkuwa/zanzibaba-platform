/**
 * GET /api/prices — list current price index for materials with optional
 * filtering by region or category.
 *
 * Query params:
 *   region: RegionCode (ZNZ | DSM | ARU | DOD | MWZ) — defaults to all
 *   category: MaterialCategorySlug — defaults to all
 *   limit: number (default 60, max 200)
 *   q: free-text search across material name and aliases
 *
 * Response shape: { items: PriceItem[], regions: Region[], categories: MaterialCategoryRef[] }
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const revalidate = 1800

export async function GET(req: Request) {
  const url = new URL(req.url)
  const regionCode = url.searchParams.get("region")?.toUpperCase()
  const categorySlug = url.searchParams.get("category")?.toUpperCase()
  const q = url.searchParams.get("q")?.trim()
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? "60")))

  const materialWhere: Prisma.MaterialWhereInput = { isActive: true }
  if (categorySlug) {
    materialWhere.categorySlug = categorySlug as Prisma.MaterialWhereInput["categorySlug"]
  }
  if (q) {
    materialWhere.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { spec: { contains: q, mode: "insensitive" } },
    ]
  }

  const region = regionCode
    ? await prisma.region.findUnique({ where: { code: regionCode as Prisma.RegionWhereUniqueInput["code"] } })
    : null

  const materials = await prisma.material.findMany({
    where: materialWhere,
    orderBy: [{ categorySlug: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    take: limit,
    include: {
      category: { select: { slug: true, name: true, icon: true } },
    },
  })

  const indexWhere: Prisma.MaterialPriceIndexWhereInput = {
    materialId: { in: materials.map((m) => m.id) },
    granularity: "daily",
  }
  if (region) indexWhere.regionId = region.id

  const indices = await prisma.materialPriceIndex.findMany({
    where: indexWhere,
    orderBy: { periodStart: "desc" },
    include: { region: { select: { code: true, name: true } } },
  })

  // For each material, choose the latest index per region (and the preferred
  // region if `region` filter is set).
  const latestByMaterial = new Map<string, typeof indices>()
  for (const ix of indices) {
    const arr = latestByMaterial.get(ix.materialId) ?? []
    arr.push(ix)
    latestByMaterial.set(ix.materialId, arr)
  }

  const items = materials.map((m) => {
    const rows = latestByMaterial.get(m.id) ?? []
    const preferred = region ? rows.find((r) => r.regionId === region.id) ?? rows[0] : rows[0]
    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      categorySlug: m.categorySlug,
      categoryName: m.category.name,
      unit: m.unit,
      spec: m.spec,
      price: preferred && preferred.median
        ? {
            median: Number(preferred.median),
            p25: preferred.p25 ? Number(preferred.p25) : null,
            p75: preferred.p75 ? Number(preferred.p75) : null,
            currency: preferred.currency,
            changePct: preferred.changePct ? Number(preferred.changePct) : null,
            sampleSize: preferred.sampleSize,
            confidence: preferred.confidence,
            regionCode: preferred.region.code,
            regionName: preferred.region.name,
            periodStart: preferred.periodStart,
          }
        : null,
      perRegion: rows.map((r) => ({
        regionCode: r.region.code,
        regionName: r.region.name,
        median: r.median ? Number(r.median) : null,
        currency: r.currency,
      })),
    }
  })

  const regions = await prisma.region.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })
  const categories = await prisma.materialCategoryRef.findMany({ orderBy: { displayOrder: "asc" } })

  return NextResponse.json({
    items,
    regions: regions.map((r) => ({ code: r.code, name: r.name })),
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon, isHospitality: c.isHospitality })),
    filter: { region: regionCode ?? null, category: categorySlug ?? null, q: q ?? null, limit },
  })
}
