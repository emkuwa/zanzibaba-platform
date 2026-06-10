import { NextResponse } from "next/server"
import { findMatchingOpportunities } from "@/lib/ai/opportunity-matching"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { supplierId } = await req.json()
    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 })

    const supplier = await prisma.supplierProfile.findUnique({
      where: { id: supplierId },
      select: {
        id: true,
        companyDescription: true,
        country: true,
        website: true,
        tags: true,
        companyName: true,
        serviceAreas: true,
      },
    })
    if (!supplier) return NextResponse.json({ error: "Supplier not found" }, { status: 404 })

    const supplierCategories = (supplier.serviceAreas as string[]) || [supplier.companyName || ""]
    const supplierTags = supplier.tags || []

    const aiMatches = await findMatchingOpportunities({
      id: supplier.id,
      categories: supplierCategories,
      country: supplier.country,
      tags: supplierTags,
      website: supplier.website,
    })

    // Get real projects matching supplier categories
    const projects = await prisma.project.findMany({
      where: {
        status: { not: "draft" },
        ...(supplierCategories.length > 0
          ? { category: { in: supplierCategories } }
          : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        location: true,
        budget: true,
      },
      take: 5,
    })

    return NextResponse.json({
      matches: aiMatches,
      projects: projects.map((p) => ({
        ...p,
        matchScore: 80,
        matchReason: `Matches your ${p.category} category`,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
