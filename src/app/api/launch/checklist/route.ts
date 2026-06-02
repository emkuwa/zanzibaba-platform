import { NextRequest, NextResponse } from "next/server"
import {
  getLaunchData,
  updateItem,
  resetAll,
  logDaily,
  getDailySummary,
} from "@/lib/launch/checklist"

export async function GET() {
  try {
    const data = getLaunchData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load checklist" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, itemId, value, note } = body

    switch (action) {
      case "update": {
        if (!itemId || value === undefined) {
          return NextResponse.json({ error: "itemId and value required" }, { status: 400 })
        }
        const updated = updateItem(itemId, value)
        if (!updated) {
          return NextResponse.json({ error: `Item not found: ${itemId}` }, { status: 404 })
        }
        return NextResponse.json({ item: updated })
      }

      case "log-daily": {
        const log = logDaily(note || "")
        return NextResponse.json({ log })
      }

      case "summary": {
        const summary = getDailySummary(body.date)
        return NextResponse.json({ summary })
      }

      case "reset": {
        resetAll()
        return NextResponse.json({ success: true, items: getLaunchData().items })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checklist operation failed" },
      { status: 500 }
    )
  }
}
