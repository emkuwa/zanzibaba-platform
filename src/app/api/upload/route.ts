import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = (formData.get("type") as string) || "cover"
    const supplierId = formData.get("supplierId") as string | null

    if (!file) return NextResponse.json({ error: "File required" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split(".").pop() || "jpg"
    const filename = `supplier_${supplierId || "unknown"}_${type}_${Date.now()}.${ext}`
    const dir = path.join(process.cwd(), "public", "uploads", "suppliers")

    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), buffer)

    const url = `/uploads/suppliers/${filename}`

    return NextResponse.json({ url, filename })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
