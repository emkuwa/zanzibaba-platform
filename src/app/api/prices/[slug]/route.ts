/**
 * GET /api/prices/[slug] — detail for a single material, with per-region
 * price band, 90-day index history (when available), and top suppliers.
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const material = await prisma.material.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  })
  if (!material) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const regions = await prisma.region.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })

  const latest = await prisma.materialPriceIndex.findMany({
    where: { materialId: material.id, granularity: "daily" },
    orderBy: { periodStart: "desc" },
    include: { region: true },
    take: 50,
  })
  const byRegion = new Map<string, typeof latest>()
  for (const ix of latest) {
    const arr = byRegion.get(ix.regionId) ?? []
    arr.push(ix)
    byRegion.set(ix.regionId, arr)
  }

  const perRegion = regions.map((r) => {
    const rows = byRegion.get(r.id) ?? []
    const current = rows[0]
    const history = rows
      .slice(0, 90)
      .map((row) => ({ date: row.periodStart, median: row.median ? Number(row.median) : null, sampleSize: row.sampleSize }))
      .reverse()
    return {
      regionCode: r.code,
      regionName: r.name,
      current: current
        ? {
            median: current.median ? Number(current.median) : null,
            p25: current.p25 ? Number(current.p25) : null,
            p75: current.p75 ? Number(current.p75) : null,
            currency: current.currency,
            changePct: current.changePct ? Number(current.changePct) : null,
            sampleSize: current.sampleSize,
            confidence: current.confidence,
            periodStart: current.periodStart,
          }
        : null,
      history,
    }
  })

  const matSuppliers = await prisma.materialSupplier.findMany({
    where: { materialId: material.id, isActive: true },
    take: 20,
    orderBy: { unitPrice: "asc" },
  })
  const supplierProfiles = matSuppliers.length
    ? await prisma.supplierProfile.findMany({
        where: { id: { in: matSuppliers.map((s) => s.supplierProfileId) } },
        select: { id: true, companyName: true, city: true, country: true, avgRating: true, verificationStatus: true, isFeatured: true, membershipTier: true, whatsappNumber: true },
      })
    : []
  const supplierMap = new Map(supplierProfiles.map((s) => [s.id, s]))

  const suppliers = matSuppliers
    .map((ms) => {
      const sp = supplierMap.get(ms.supplierProfileId)
      if (!sp) return null
      return {
        id: sp.id,
        name: sp.companyName,
        city: sp.city,
        country: sp.country,
        rating: Number(sp.avgRating ?? 0),
        verified: sp.verificationStatus === "VERIFIED",
        featured: sp.isFeatured,
        tier: sp.membershipTier,
        whatsapp: sp.whatsappNumber,
        unitPrice: ms.unitPrice ? Number(ms.unitPrice) : null,
        currency: ms.currency,
        leadTimeDays: ms.leadTimeDays,
        stockStatus: ms.stockStatus,
        regionCode: regions.find((r) => r.id === ms.regionId)?.code ?? null,
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    material: {
      id: material.id,
      slug: material.slug,
      name: material.name,
      spec: material.spec,
      unit: material.unit,
      categorySlug: material.categorySlug,
      categoryName: material.category.name,
      description: material.description,
      imageUrl: material.imageUrl,
      variants: material.variants.map((v) => ({ id: v.id, brand: v.brand, spec: v.spec, sku: v.sku })),
    },
    perRegion,
    suppliers,
  })
}
