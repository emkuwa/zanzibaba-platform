import { NextResponse } from "next/server"
import { chatWithAI, type ChatMessage } from "@/lib/ai/chat-assistant"

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 })
    }

    const reply = await chatWithAI(messages as ChatMessage[], context)
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
