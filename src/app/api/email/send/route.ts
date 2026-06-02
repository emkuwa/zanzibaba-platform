import { NextResponse } from "next/server"
import { sendTemplatedEmail } from "@/lib/email/sender"
import { emailTemplateMeta } from "@/lib/email/templates"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, template, params } = body

    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    if (!template || typeof template !== "string") {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 })
    }

    if (!emailTemplateMeta[template]) {
      return NextResponse.json({ error: `Template "${template}" not found` }, { status: 404 })
    }

    if (!params || typeof params !== "object") {
      return NextResponse.json({ error: "Template params object is required" }, { status: 400 })
    }

    const result = await sendTemplatedEmail(template, to, params)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
