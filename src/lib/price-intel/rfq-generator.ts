/**
 * RFQ generation from a priced MaterialSchedule.
 *
 * Strategy:
 *   1. Group ScheduleLineItem by categorySlug.
 *   2. For each group, find candidate suppliers from MaterialSupplier coverage.
 *   3. Pick top-3 suppliers by coverage % × trust score.
 *   4. Create one RFQ per category group, with `invitedSuppliers` populated.
 *   5. Also create one "open public RFQ" for items with no supplier match.
 *
 * RFQs are created with status=OPEN; the buyer can edit/send from the
 * dashboard before invitations go out.
 */

import { prisma } from "@/lib/prisma"
import { USD_TO_TZS_RATE } from "./constants"

export interface RfqGenerationOptions {
  scheduleId: string
  buyerId: string
  deliveryLocation?: string | null
  deliveryTimeline?: string | null
}

export interface GeneratedRfqSummary {
  rfqId: string
  categorySlug: string
  itemCount: number
  estimatedValueTzs: number
  invitedSuppliers: string[]
}

const ensureCategoryRow = async (slug: string, name: string) => {
  return prisma.category.upsert({
    where: { slug },
    create: { slug, name },
    update: {},
  })
}

export async function generateRFQsFromSchedule(opts: RfqGenerationOptions): Promise<GeneratedRfqSummary[]> {
  const schedule = await prisma.materialSchedule.findUnique({
    where: { id: opts.scheduleId },
    include: { lineItems: true, region: true },
  })
  if (!schedule) throw new Error("Schedule not found")

  const byCategory = new Map<string, typeof schedule.lineItems>()
  for (const li of schedule.lineItems) {
    const key = li.categorySlug ?? "UNCATEGORIZED"
    const arr = byCategory.get(key) ?? []
    arr.push(li)
    byCategory.set(key, arr)
  }

  const summaries: GeneratedRfqSummary[] = []
  for (const [categorySlug, items] of byCategory.entries()) {
    if (!items.length) continue
    const totalTzs = items.reduce((s, i) => s + Number(i.costMedian ?? 0), 0)
    const totalUsd = totalTzs / USD_TO_TZS_RATE

    const materialIds = items.map((i) => i.materialId).filter(Boolean) as string[]
    const supplierStats =
      materialIds.length > 0
        ? await prisma.materialSupplier.groupBy({
            by: ["supplierProfileId"],
            where: { materialId: { in: materialIds }, regionId: schedule.regionId, isActive: true },
            _count: { _all: true },
          })
        : []
    const supplierIds = supplierStats.map((s) => s.supplierProfileId)
    const suppliers =
      supplierIds.length > 0
        ? await prisma.supplierProfile.findMany({
            where: { id: { in: supplierIds } },
            select: { id: true, companyName: true, avgRating: true, verificationStatus: true, membershipTier: true },
          })
        : []
    const ranked = suppliers
      .map((s) => {
        const cov = supplierStats.find((x) => x.supplierProfileId === s.id)?._count._all ?? 0
        const trust = Number(s.avgRating ?? 0) / 5
        const verified = s.verificationStatus === "VERIFIED" ? 0.2 : 0
        const score = (cov / Math.max(materialIds.length, 1)) * 0.6 + trust * 0.3 + verified
        return { id: s.id, name: s.companyName, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    const cat = await ensureCategoryRow(
      `auto-${categorySlug.toLowerCase()}`,
      categorySlug.replace(/_/g, " ")
    )

    const description = [
      `Auto-generated from schedule ${schedule.title ?? schedule.id}.`,
      `Region: ${schedule.region.name}`,
      "",
      "Items:",
      ...items.slice(0, 30).map((i) => `- ${i.description} — ${Number(i.qty).toLocaleString()} ${i.unit ?? ""}`.trim()),
      items.length > 30 ? `(+${items.length - 30} more — see schedule)` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const rfq = await prisma.rFQ.create({
      data: {
        buyerId: opts.buyerId,
        categoryId: cat.id,
        title: `${categorySlug.replace(/_/g, " ")} — ${schedule.region.name} (${items.length} items)`,
        description,
        budgetMin: Math.round(totalUsd * 0.9),
        budgetMax: Math.round(totalUsd * 1.15),
        currency: "USD",
        deliveryLocation: opts.deliveryLocation ?? schedule.region.name,
        deliveryTimeline: opts.deliveryTimeline ?? null,
        visibility: ranked.length ? "invited" : "public",
        invitedSuppliers: ranked.map((r) => ({ id: r.id, name: r.name, score: r.score })),
        responseCount: 0,
      },
    })

    summaries.push({
      rfqId: rfq.id,
      categorySlug,
      itemCount: items.length,
      estimatedValueTzs: Math.round(totalTzs),
      invitedSuppliers: ranked.map((r) => r.name),
    })
  }

  return summaries
}
