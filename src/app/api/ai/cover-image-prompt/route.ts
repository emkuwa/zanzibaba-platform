import { NextResponse } from "next/server"
import { generateCoverImagePrompt, CATEGORY_COLORS } from "@/lib/ai/cover-image"

export async function POST(req: Request) {
  try {
    const { categorySlug, companyName } = await req.json()
    if (!categorySlug) {
      return NextResponse.json({
        prompt: null,
        colors: CATEGORY_COLORS["general"],
        template: "Professional business facility with corporate branding",
      })
    }

    const result = await generateCoverImagePrompt(categorySlug, companyName || "Supplier")
    return NextResponse.json({
      prompt: result,
      colors: CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS["general"],
      template: result?.prompt || null,
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
