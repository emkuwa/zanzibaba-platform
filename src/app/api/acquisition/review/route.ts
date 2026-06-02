import { NextRequest, NextResponse } from "next/server"
import { getLeadsByStatus, updateLeadStatus, getLeadById } from "@/lib/acquisition/prisma-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "REVIEW_PENDING"
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")
    const id = searchParams.get("id")

    if (id) {
      const lead = await getLeadById(id)
      if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 })
      return NextResponse.json(lead)
    }

    const leads = await getLeadsByStatus(status, limit, offset)
    return NextResponse.json({ leads, count: leads.length })
  } catch (error) {
    console.error("Review queue error:", error)
    return NextResponse.json(
      { error: "Failed to fetch review queue", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, reviewedBy, reviewNotes } = body

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 })
    }

    if (!["REVIEW_PENDING", "APPROVED", "REJECTED", "IMPORTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await updateLeadStatus(id, status, reviewedBy, reviewNotes)
    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    console.error("Review update error:", error)
    return NextResponse.json(
      { error: "Failed to update lead status", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
