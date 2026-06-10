import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { projectId, supplierId, companyName, category, logoUrl, placement } = await req.json()
    if (!projectId || !supplierId) {
      return NextResponse.json({ error: "projectId and supplierId required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    const existing: any[] = (project.sponsoredSuppliers as any) || []
    const updated = [
      ...existing,
      { supplierId, companyName, category, logoUrl, placement: placement || "sidebar" },
    ]

    await prisma.project.update({
      where: { id: projectId },
      data: { sponsoredSuppliers: updated as any },
    })

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { projectId, supplierId } = await req.json()
    if (!projectId || !supplierId) {
      return NextResponse.json({ error: "projectId and supplierId required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    const existing: any[] = (project.sponsoredSuppliers as any) || []
    const updated = existing.filter((s: any) => s.supplierId !== supplierId)

    await prisma.project.update({
      where: { id: projectId },
      data: { sponsoredSuppliers: updated as any },
    })

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, title: true, sponsoredSuppliers: true, category: true },
      })
      return NextResponse.json({ data: project })
    }

    // Get all projects with sponsored suppliers plus category-matched suppliers
    const projects = await prisma.project.findMany({
      where: { status: { not: "draft" } },
      select: { id: true, title: true, slug: true, category: true, sponsoredSuppliers: true },
      take: 20,
    })

    // Get all suppliers with sponsored categories
    const allSuppliers = await prisma.supplierProfile.findMany({
      select: { id: true, companyName: true, companyLogoUrl: true, sponsoredCategories: true },
    })
    const sponsoredSuppliers = allSuppliers.filter((s) => s.sponsoredCategories !== null)

    // Match suppliers to projects by category
    const enriched = projects.map((p) => {
      const existingSponsors = (p.sponsoredSuppliers as any[]) || []
      const categoryMatches = sponsoredSuppliers.filter((s) => {
        const cats = s.sponsoredCategories as string[] | null
        return cats?.includes(p.category || "")
      })
      return {
        ...p,
        existingSponsors,
        suggestedSponsors: categoryMatches,
      }
    })

    return NextResponse.json({ data: enriched })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
