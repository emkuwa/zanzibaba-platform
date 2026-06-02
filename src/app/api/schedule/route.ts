/**
 * POST /api/schedule — build a priced MaterialSchedule.
 *
 * Body either:
 *   { boqDocumentId: string, regionCode: string }     (build from BOQ)
 *   { projectType, qualityTier, regionCode, builtUpAreaSqm }  (from estimator)
 *
 * GET /api/schedule?id=xxx — fetch a schedule with line items.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { buildScheduleFromBOQ, buildScheduleFromEstimate } from "@/lib/price-intel/schedule"
import { auth } from "@/lib/auth"
import type { ProjectType, QualityTier } from "@prisma/client"

const FromBOQ = z.object({
  boqDocumentId: z.string().cuid(),
  regionCode: z.enum(["ZNZ", "DSM", "ARU", "DOD", "MWZ"]),
  projectId: z.string().cuid().optional(),
  title: z.string().max(160).optional(),
})
const FromEstimate = z.object({
  projectType: z.enum(["VILLA", "HOTEL", "RESORT", "RESIDENTIAL_BLOCK", "OFFICE", "WAREHOUSE", "COMMERCIAL", "HOSPITALITY_FITOUT", "RENOVATION", "CUSTOM"]),
  qualityTier: z.enum(["BASIC", "MID", "PREMIUM"]),
  regionCode: z.enum(["ZNZ", "DSM", "ARU", "DOD", "MWZ"]),
  builtUpAreaSqm: z.number().positive().max(100000),
  projectId: z.string().cuid().optional(),
  title: z.string().max(160).optional(),
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

  if ((body as { boqDocumentId?: string })?.boqDocumentId) {
    const parse = FromBOQ.safeParse(body)
    if (!parse.success) return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })
    const region = await prisma.region.findUnique({ where: { code: parse.data.regionCode } })
    if (!region) return NextResponse.json({ error: "unknown_region" }, { status: 404 })
    const sched = await buildScheduleFromBOQ({
      buyerId,
      projectId: parse.data.projectId ?? null,
      boqDocumentId: parse.data.boqDocumentId,
      regionId: region.id,
      title: parse.data.title,
    })
    return NextResponse.json(sched)
  }

  const parse = FromEstimate.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })
  const region = await prisma.region.findUnique({ where: { code: parse.data.regionCode } })
  if (!region) return NextResponse.json({ error: "unknown_region" }, { status: 404 })
  const sched = await buildScheduleFromEstimate({
    buyerId,
    projectId: parse.data.projectId ?? null,
    regionId: region.id,
    projectType: parse.data.projectType as ProjectType,
    qualityTier: parse.data.qualityTier as QualityTier,
    builtUpAreaSqm: parse.data.builtUpAreaSqm,
    title: parse.data.title,
  })
  return NextResponse.json(sched)
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })
  const sched = await prisma.materialSchedule.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { position: "asc" } }, region: true },
  })
  if (!sched) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json(sched)
}
