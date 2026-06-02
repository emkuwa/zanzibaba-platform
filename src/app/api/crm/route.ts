import { NextResponse } from "next/server"
import { addLead, getLeads, getLead, updateLeadStatus, addFollowUp, getCRMStats, updateLead } from "@/lib/crm/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const stats = searchParams.get("stats")

  if (stats === "true") {
    return NextResponse.json(getCRMStats())
  }

  if (id) {
    const lead = getLead(id)
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    return NextResponse.json(lead)
  }

  const filters = {
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    assignedTo: searchParams.get("assignedTo") || undefined,
    source: searchParams.get("source") || undefined,
  }
  const leads = getLeads(
    filters.status || filters.type || filters.assignedTo || filters.source ? filters : undefined
  )
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "status") {
      const lead = updateLeadStatus(data.id, data.status, data.staff, data.notes)
      return NextResponse.json(lead)
    }

    if (action === "follow-up") {
      const lead = addFollowUp(data.id, data.action, data.staff, data.notes)
      return NextResponse.json(lead)
    }

    if (action === "update") {
      const lead = updateLead(data.id, data.updates)
      return NextResponse.json(lead)
    }

    const lead = addLead(data)
    return NextResponse.json(lead, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Invalid request" }, { status: 400 })
  }
}
