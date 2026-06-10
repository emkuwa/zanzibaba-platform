import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const featured = await prisma.supplierProfile.findMany({
      where: {
        isFeatured: true,
        featuredExpiresAt: { gt: new Date() },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      },
      select: {
        id: true,
        companyName: true,
        companyLogoUrl: true,
        companyDescription: true,
        country: true,
        city: true,
        website: true,
        verificationBadge: true,
        membershipTier: true,
      },
      orderBy: { featuredExpiresAt: "asc" },
    })

    const directoryFeatured = await prisma.directoryEntity.findMany({
      where: {
        isFeatured: true,
        featuredExpiresAt: { gt: new Date() },
        activationStatus: { in: ["VERIFIED", "FEATURED"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        description: true,
        country: true,
        city: true,
        website: true,
        verificationBadge: true,
        membershipTier: true,
        entityType: true,
      },
      orderBy: { featuredExpiresAt: "asc" },
    })

    return NextResponse.json({
      suppliers: featured,
      directory: directoryFeatured,
      total: featured.length + directoryFeatured.length,
    })
  } catch (error) {
    console.error("Featured suppliers error:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
