/**
 * GET /api/materials — list materials with category and unit metadata.
 *   query: category?, q?, limit (default 100, max 500)
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const revalidate = 3600

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get("category")?.toUpperCase()
  const q = url.searchParams.get("q")?.trim()
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? "100")))

  const where: Prisma.MaterialWhereInput = { isActive: true }
  if (category) where.categorySlug = category as Prisma.MaterialWhereInput["categorySlug"]
  if (q)
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { spec: { contains: q, mode: "insensitive" } },
    ]

  const items = await prisma.material.findMany({
    where,
    orderBy: [{ categorySlug: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    take: limit,
    include: { category: { select: { name: true, icon: true } } },
  })

  return NextResponse.json({
    items: items.map((m) => ({
      slug: m.slug,
      name: m.name,
      categorySlug: m.categorySlug,
      categoryName: m.category.name,
      unit: m.unit,
      spec: m.spec,
    })),
  })
}
