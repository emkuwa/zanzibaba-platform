import { NextResponse } from "next/server"
import {
  getPopulationTargets,
  getPopulationEvents,
  getPopulationProgress,
  getPopulationSummary,
  incrementPopulation,
  addPopulationEvent,
} from "@/lib/population/store"

export async function GET() {
  const targets = getPopulationTargets()
  const progress = getPopulationProgress()
  const events = getPopulationEvents(20)
  const summary = getPopulationSummary()

  return NextResponse.json({
    targets,
    progress,
    events,
    summary,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, entityName, source } = body

    if (!type || !entityName || !source) {
      return NextResponse.json(
        { error: "Missing required fields: type, entityName, source" },
        { status: 400 }
      )
    }

    const validSources = ["csv-import", "manual-seed", "self-registration", "admin-create"]
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { error: `Invalid source. Must be one of: ${validSources.join(", ")}` },
        { status: 400 }
      )
    }

    incrementPopulation(type)
    const event = addPopulationEvent({ type, entityName, source })

    return NextResponse.json({ event, summary: getPopulationSummary() }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
