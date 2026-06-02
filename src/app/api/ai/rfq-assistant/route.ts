import { NextResponse } from "next/server"
import { generateRFQDraft } from "@/lib/ai/rfq-assistant"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const textContent = formData.get("text") as string || ""
    const files: { name: string; type: string; size: number; content?: string }[] = []

    const uploadedFiles = formData.getAll("files") as File[]
    for (const file of uploadedFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const content = buffer.toString("utf-8")
      files.push({
        name: file.name,
        type: file.type,
        size: file.size,
        content: content.length > 0 ? content : undefined,
      })
    }

    if (!textContent && files.length === 0) {
      return NextResponse.json({ error: "No content provided. Upload a document or enter text." }, { status: 400 })
    }

    const draft = await generateRFQDraft(textContent, files)
    return NextResponse.json({ draft })
  } catch (error) {
    console.error("RFQ assistant error:", error)
    return NextResponse.json({ error: "Failed to process RFQ" }, { status: 500 })
  }
}
