import { NextResponse } from "next/server"
import { prepareWhatsAppMessages, getPendingMessages } from "@/lib/activation/whatsapp-campaign"

export async function POST() {
  try {
    const result = await prepareWhatsAppMessages()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to prepare WhatsApp messages", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const messages = await getPendingMessages()
    return NextResponse.json({ messages, count: messages.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pending messages", details: String(error) },
      { status: 500 }
    )
  }
}
