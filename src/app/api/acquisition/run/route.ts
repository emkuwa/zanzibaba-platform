import { NextResponse } from "next/server"
import { runAcquisitionPipeline } from "@/lib/acquisition/pipeline"
import { getAcquisitionStats } from "@/lib/acquisition/prisma-store"
import type { AcquisitionRunResult } from "@/lib/acquisition/types"

export async function POST() {
  try {
    const result: AcquisitionRunResult = await runAcquisitionPipeline()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Acquisition pipeline error:", error)
    return NextResponse.json(
      { error: "Pipeline execution failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await getAcquisitionStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Acquisition stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
