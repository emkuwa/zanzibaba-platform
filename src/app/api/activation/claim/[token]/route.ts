import { NextRequest, NextResponse } from "next/server"
import { getLeadByClaimToken, claimProfile } from "@/lib/activation/claim-system"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const lead = await getLeadByClaimToken(token)
    if (!lead) {
      return NextResponse.json({ error: "Invalid claim link" }, { status: 404 })
    }
    if (lead.activationStatus !== "UNCLAIMED") {
      return NextResponse.json({ error: "Profile already claimed", claimed: true }, { status: 400 })
    }
    return NextResponse.json({ lead })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch claim", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const result = await claimProfile(token, {
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to claim profile", details: String(error) },
      { status: 500 }
    )
  }
}
