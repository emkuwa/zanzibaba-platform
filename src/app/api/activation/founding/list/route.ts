import { NextRequest, NextResponse } from "next/server"
import { getFoundingSuppliers, getFoundingStats } from "@/lib/activation/founding-program"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get("stage")
    const stats = searchParams.get("stats")

    if (stats === "true") {
      const s = await getFoundingStats()
      return NextResponse.json(s)
    }

    const suppliers = await getFoundingSuppliers(stage || undefined)
    return NextResponse.json({ suppliers, count: suppliers.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch founding suppliers", details: String(error) },
      { status: 500 }
    )
  }
}
