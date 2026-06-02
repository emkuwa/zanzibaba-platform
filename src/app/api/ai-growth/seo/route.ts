import { NextResponse } from "next/server"
import { generateSEO } from "@/lib/ai-growth/seo-assistant"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, products, location, description } = body
    if (!companyName) return NextResponse.json({ error: "Company name required" }, { status: 400 })
    const content = await generateSEO(companyName, products || [], location || "", description || "")
    return NextResponse.json(content)
  } catch (error) {
    console.error("SEO assistant error:", error)
    return NextResponse.json({ error: "Failed to generate SEO content" }, { status: 500 })
  }
}
