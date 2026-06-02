import { NextRequest, NextResponse } from "next/server"
import { inviteToFoundingProgram } from "@/lib/activation/founding-program"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const campaign = body.campaign || "founding-batch-1"
    const result = await inviteToFoundingProgram(campaign)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to invite founding suppliers", details: String(error) },
      { status: 500 }
    )
  }
}
