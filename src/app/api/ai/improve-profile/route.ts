import { NextResponse } from "next/server"
import { improveProfile } from "@/lib/ai/improve-profile"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await improveProfile(body)
    if (!result) return NextResponse.json({ error: "AI generation failed" }, { status: 422 })

    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
