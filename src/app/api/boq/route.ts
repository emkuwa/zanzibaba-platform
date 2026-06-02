/**
 * POST /api/boq — parse a pasted BOQ.
 * GET  /api/boq?id=xxx — fetch BOQ document.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createBOQFromPaste } from "@/lib/price-intel/boq-parser"
import { auth } from "@/lib/auth"

const PostSchema = z.object({
  rawText: z.string().min(20).max(200000),
  filename: z.string().max(200).optional(),
  projectId: z.string().cuid().optional(),
})

export async function POST(req: Request) {
  const session = await auth().catch(() => null)
  const buyerId = session?.user?.id ?? null
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }
  const parse = PostSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })

  const doc = await createBOQFromPaste({
    buyerId,
    projectId: parse.data.projectId,
    filename: parse.data.filename,
    rawText: parse.data.rawText,
  })

  return NextResponse.json({ document: doc })
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })
  const doc = await prisma.bOQDocument.findUnique({ where: { id } })
  if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json(doc)
}
