import { NextResponse } from "next/server"
import { importProducts, type ImportSource } from "@/lib/ai/product-import"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const type = formData.get("type") as "url" | "pdf" | "text" || "text"
    const textInput = formData.get("text") as string || ""
    const url = formData.get("url") as string || ""
    const uploadedFile = formData.get("file") as File | null

    let content = textInput
    let fileName: string | undefined

    if (type === "url" && url) {
      try {
        const response = await fetch(url)
        const html = await response.text()
        const textMatch = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        content = textMatch.substring(0, 8000) || url
        fileName = url
      } catch {
        content = url
        fileName = url
      }
    }

    if (uploadedFile) {
      const buffer = Buffer.from(await uploadedFile.arrayBuffer())
      const text = buffer.toString("utf-8")
      if (text.trim().length > 0) content = text
      fileName = uploadedFile.name
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "No content provided. Enter text, paste a URL, or upload a file." }, { status: 400 })
    }

    const source: ImportSource = {
      type,
      content: content.substring(0, 10000),
      fileName,
    }

    const result = await importProducts(source)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Product import error:", error)
    return NextResponse.json({ error: "Failed to import products" }, { status: 500 })
  }
}
