import { NextResponse } from "next/server"
import { sendWhatsAppTemplate } from "@/lib/whatsapp/whatsapp"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, template, params } = body

    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Recipient phone number is required" }, { status: 400 })
    }

    if (!template || typeof template !== "string") {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 })
    }

    if (!params || typeof params !== "object") {
      return NextResponse.json({ error: "Template params object is required" }, { status: 400 })
    }

    const result = await sendWhatsAppTemplate(template, to, params as Record<string, string>)

    if (!result.success) {
      return NextResponse.json({ error: `Template "${template}" not found` }, { status: 404 })
    }

    return NextResponse.json({ success: true, messageId: result.messageId }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
