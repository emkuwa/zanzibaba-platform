import { NextResponse } from "next/server"
import { getActivationStats } from "@/lib/activation/dashboard-stats"

export async function GET() {
  try {
    const stats = await getActivationStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activation stats", details: String(error) },
      { status: 500 }
    )
  }
}
