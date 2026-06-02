import { NextResponse } from "next/server"
import { generateClaimLinks, getClaimableLeads } from "@/lib/activation/claim-system"

export async function POST() {
  try {
    const result = await generateClaimLinks()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate claim links", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const leads = await getClaimableLeads()
    return NextResponse.json({ leads, count: leads.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch claimable leads", details: String(error) },
      { status: 500 }
    )
  }
}
