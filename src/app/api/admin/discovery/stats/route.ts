import { NextResponse } from "next/server"
import { computeDiscoveryStats } from "@/lib/agents/discovery-stats"

export async function GET() {
  try {
    const stats = computeDiscoveryStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to compute discovery stats" },
      { status: 500 }
    )
  }
}
