import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { supplierId, categories } = await req.json()
    if (!supplierId || !categories) {
      return NextResponse.json({ error: "supplierId and categories required" }, { status: 400 })
    }

    const supplier = await prisma.supplierProfile.update({
      where: { id: supplierId },
      data: { sponsoredCategories: categories },
      select: { id: true, companyName: true, sponsoredCategories: true },
    })

    // Also update DirectoryEntity if exists
    await prisma.directoryEntity.updateMany({
      where: { entityId: supplierId, entityType: "supplier" },
      data: { sponsoredCategories: categories },
    })

    return NextResponse.json({ data: supplier })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    const where: any = {
      sponsoredCategories: { not: null },
    }

    type SupplierWithCat = { id: string; companyName: string; companyLogoUrl: string | null; country: string | null; website: string | null; sponsoredCategories: any }
    let suppliers: SupplierWithCat[] = await prisma.supplierProfile.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        companyLogoUrl: true,
        country: true,
        website: true,
        sponsoredCategories: true,
      },
    }) as any

    if (category) {
      suppliers = suppliers.filter((s) => {
        const cats = s.sponsoredCategories as string[] | null
        return cats?.includes(category)
      })
    }

    return NextResponse.json({ data: suppliers })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
