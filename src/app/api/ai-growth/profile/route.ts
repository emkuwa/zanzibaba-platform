import { NextResponse } from "next/server"
import { generateProfile } from "@/lib/ai-growth/generator"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, website, whatsapp, products, location, description } = body
    if (!companyName) return NextResponse.json({ error: "Company name required" }, { status: 400 })
    const profile = await generateProfile({ companyName, website, whatsapp, products: products || [], location, description })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile generator error:", error)
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 })
  }
}
