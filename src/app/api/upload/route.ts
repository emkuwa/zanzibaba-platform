import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "receipts")
    await mkdir(uploadsDir, { recursive: true })

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const fileName = `${Date.now()}-${sanitizedName}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    const url = `/uploads/receipts/${fileName}`

    return NextResponse.json({ url, fileName: file.name })
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", details: String(error) },
      { status: 500 }
    )
  }
}
