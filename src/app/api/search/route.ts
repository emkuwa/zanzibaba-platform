import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

interface SearchResult {
  type: "directory" | "project"
  id: string
  title: string
  description: string | null
  location: string | null
  badge: string
  url: string
  score: number
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim()
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 20, 50)

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 })
  }

  const searchTerm = q
  const like = `%${searchTerm}%`

  const [directoryResults, projectResults, directoryTotal, projectTotal] = await Promise.all([
    prisma.directoryEntity.findMany({
      where: {
        activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
        tier: { in: ["A", "B"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { city: { contains: searchTerm, mode: "insensitive" } },
          { country: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { trustScore: "desc" }],
    }),
    prisma.project.findMany({
      where: {
        status: { not: "draft" },
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { location: { contains: searchTerm, mode: "insensitive" } },
          { projectType: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.directoryEntity.count({
      where: {
        activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
        tier: { in: ["A", "B"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { city: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    }),
    prisma.project.count({
      where: {
        status: { not: "draft" },
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    }),
  ])

  const results: SearchResult[] = [
    ...directoryResults.map((e) => ({
      type: "directory" as const,
      id: e.id,
      title: e.name,
      description: e.description,
      location: e.city && e.country ? `${e.city}, ${e.country}` : e.city || e.country,
      badge: e.entityType,
      url: e.claimToken && e.activationStatus === "UNCLAIMED"
        ? `/claim/${e.claimToken}`
        : `/entity/${e.slug}`,
      score: e.trustScore,
    })),
    ...projectResults.map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      badge: p.projectType || "Project",
      url: `/projects/${p.slug}`,
      score: p.isFeatured ? 80 : 50,
    })),
  ]

  results.sort((a, b) => b.score - a.score)

  return NextResponse.json({
    results: results.slice(0, limit),
    total: directoryTotal + projectTotal,
    query: q,
  })
}
