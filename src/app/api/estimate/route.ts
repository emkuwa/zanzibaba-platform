/**
 * POST /api/estimate — run a cost estimate.
 * GET  /api/estimate?id=xxx — retrieve a saved estimate by ID.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { runEstimate } from "@/lib/price-intel/estimator"
import type { ProjectType, QualityTier } from "@prisma/client"

const PostSchema = z.object({
  projectType: z.enum(["VILLA", "HOTEL", "RESORT", "RESIDENTIAL_BLOCK", "OFFICE", "WAREHOUSE", "COMMERCIAL", "HOSPITALITY_FITOUT", "RENOVATION", "CUSTOM"]),
  qualityTier: z.enum(["BASIC", "MID", "PREMIUM"]),
  regionCode: z.enum(["ZNZ", "DSM", "ARU", "DOD", "MWZ"]),
  builtUpAreaSqm: z.number().positive().max(100000),
  projectName: z.string().max(120).optional(),
  persist: z.boolean().optional(),
  sessionRef: z.string().max(80).optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }
  const parse = PostSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })
  }
  const input = parse.data
  const region = await prisma.region.findUnique({ where: { code: input.regionCode } })
  if (!region) return NextResponse.json({ error: "unknown_region" }, { status: 404 })

  try {
    const result = await runEstimate({
      projectType: input.projectType as ProjectType,
      qualityTier: input.qualityTier as QualityTier,
      regionId: region.id,
      builtUpAreaSqm: input.builtUpAreaSqm,
      projectName: input.projectName ?? null,
      sessionRef: input.sessionRef ?? null,
      persist: Boolean(input.persist),
    })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: "estimator_failed", message: (e as Error).message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })
  const est = await prisma.projectEstimate.findUnique({
    where: { id },
    include: { region: true, lineItems: true },
  })
  if (!est) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json(est)
}
