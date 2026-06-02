import { NextResponse } from "next/server"
import { generateWebsite } from "@/lib/ai-growth/mini-website"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, products, location, description, phone, email, website } = body
    if (!companyName) return NextResponse.json({ error: "Company name required" }, { status: 400 })
    const site = await generateWebsite({ companyName, products: products || [], location, description, phone, email, website })
    return NextResponse.json({ site })
  } catch (error) {
    console.error("Website generator error:", error)
    return NextResponse.json({ error: "Failed to generate website" }, { status: 500 })
  }
}
