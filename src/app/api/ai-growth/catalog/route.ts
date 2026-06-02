import { NextResponse } from "next/server"
import { generateCatalog } from "@/lib/ai-growth/catalog-generator"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const text = formData.get("text") as string || ""
    const source = formData.get("source") as string || "manual"
    const file = formData.get("file") as File | null

    let content = text
    let fileName = source
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      content = buffer.toString("utf-8").substring(0, 10000) || text
      fileName = file.name
    }
    if (!content) return NextResponse.json({ error: "No content provided" }, { status: 400 })

    const result = await generateCatalog(content, fileName)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Catalog generator error:", error)
    return NextResponse.json({ error: "Failed to generate catalog" }, { status: 500 })
  }
}
