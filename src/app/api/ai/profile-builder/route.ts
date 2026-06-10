import { NextResponse } from "next/server"
import { extractFromWebsite } from "@/lib/ai/profile-builder"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 })

    const data = await extractFromWebsite(url)
    if (!data) return NextResponse.json({ error: "Failed to extract profile data" }, { status: 422 })

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
