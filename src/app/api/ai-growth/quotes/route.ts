import { NextResponse } from "next/server"
import { generateQuote } from "@/lib/ai-growth/quote-assistant"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rfqText, supplierName, clientName } = body
    if (!rfqText || !supplierName) return NextResponse.json({ error: "RFQ text and supplier name required" }, { status: 400 })
    const quote = await generateQuote(rfqText, supplierName, clientName)
    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Quote assistant error:", error)
    return NextResponse.json({ error: "Failed to generate quote" }, { status: 500 })
  }
}
