import { NextResponse } from "next/server"
import { addLead } from "@/lib/leads/lead-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { type, source, data, contact } = body

    if (!type || !["rfq", "contact", "supplier-inquiry", "quote-request"].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be: rfq, contact, supplier-inquiry, quote-request' }, { status: 400 })
    }

    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 })
    }

    const lead = addLead({
      type,
      source,
      data: data || {},
      contact: {
        name: contact?.name || "",
        email: contact?.email || "",
        phone: contact?.phone || "",
      },
    })

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
