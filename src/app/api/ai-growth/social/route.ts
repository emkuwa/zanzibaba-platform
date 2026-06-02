import { NextResponse } from "next/server"
import { generateSocialContent } from "@/lib/ai-growth/social-content"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, products, weeks, campaign } = body
    if (!companyName) return NextResponse.json({ error: "Company name required" }, { status: 400 })
    const calendars = await generateSocialContent(companyName, products || [], weeks || 1, campaign)
    return NextResponse.json({ calendars })
  } catch (error) {
    console.error("Social content error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
