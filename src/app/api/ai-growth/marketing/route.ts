import { NextResponse } from "next/server"
import { generateMarketingAsset } from "@/lib/ai-growth/marketing-assets"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, companyName, products, location, description } = body
    if (!type || !companyName) return NextResponse.json({ error: "Asset type and company name required" }, { status: 400 })
    const asset = await generateMarketingAsset(type, companyName, products || [], location || "", description || "")
    return NextResponse.json({ asset })
  } catch (error) {
    console.error("Marketing assets error:", error)
    return NextResponse.json({ error: "Failed to generate asset" }, { status: 500 })
  }
}
