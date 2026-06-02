import { NextResponse } from "next/server"
import { computeGrowthDashboard } from "@/lib/ai-growth/growth-dashboard"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dashboard = computeGrowthDashboard({
      profileExists: body.profileExists ?? false,
      websiteExists: body.websiteExists ?? false,
      productsCount: body.productsCount ?? 0,
      productsWithDescriptions: body.productsWithDescriptions ?? 0,
      productsWithPrices: body.productsWithPrices ?? 0,
      socialPostsTotal: body.socialPostsTotal ?? 0,
      socialPostsPublished: body.socialPostsPublished ?? 0,
      leadsTotal: body.leadsTotal ?? 0,
      leadsThisMonth: body.leadsThisMonth ?? 0,
      quotesSent: body.quotesSent ?? 0,
      profileScore: body.profileScore,
      seoScore: body.seoScore,
    })
    return NextResponse.json({ dashboard })
  } catch (error) {
    console.error("Growth dashboard error:", error)
    return NextResponse.json({ error: "Failed to compute dashboard" }, { status: 500 })
  }
}
