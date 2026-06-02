import { NextResponse } from "next/server"
import { trackEvent, getAnalyticsSummary, getEvents } from "@/lib/analytics/tracker"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, entityType, entityId, metadata } = body

    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 })
    }

    trackEvent(event, { entityType, entityId, metadata })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const includeEvents = searchParams.get("events") === "true"

  const summary = getAnalyticsSummary()
  const recentEvents = includeEvents ? getEvents().slice(0, 50) : []

  return NextResponse.json({ summary, events: recentEvents })
}
