import { NextResponse } from "next/server"
import { getWhatsAppStats } from "@/lib/activation/whatsapp-campaign"

export async function GET() {
  try {
    const stats = await getWhatsAppStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp stats", details: String(error) },
      { status: 500 }
    )
  }
}
