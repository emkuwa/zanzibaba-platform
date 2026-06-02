import { NextRequest, NextResponse } from "next/server"
import { verifySupplier } from "@/lib/activation/claim-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId } = body
    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 })
    }
    const result = await verifySupplier(leadId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify supplier", details: String(error) },
      { status: 500 }
    )
  }
}
