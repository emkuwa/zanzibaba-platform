import { NextRequest, NextResponse } from "next/server"
import { sendAllPending, markAsSent, markAsDelivered, markAsOpened } from "@/lib/activation/whatsapp-campaign"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    if (body.action === "send-all") {
      const result = await sendAllPending()
      return NextResponse.json(result)
    }
    if (body.action === "mark-sent" && body.messageId) {
      await markAsSent(body.messageId)
      return NextResponse.json({ success: true, status: "SENT" })
    }
    if (body.action === "mark-delivered" && body.messageId) {
      await markAsDelivered(body.messageId)
      return NextResponse.json({ success: true, status: "DELIVERED" })
    }
    if (body.action === "mark-opened" && body.messageId) {
      await markAsOpened(body.messageId)
      return NextResponse.json({ success: true, status: "OPENED" })
    }
    const result = await sendAllPending()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send WhatsApp messages", details: String(error) },
      { status: 500 }
    )
  }
}
