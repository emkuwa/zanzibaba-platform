/**
 * POST /api/procurement — create a ProcurementPlan from a schedule.
 * GET  /api/procurement?buyerId=xxx — list plans for a buyer.
 * GET  /api/procurement?id=xxx — fetch a single plan.
 * PATCH /api/procurement — advance a task: { taskId, status, notes }.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createProcurementPlan, advanceTask, listPlansForBuyer } from "@/lib/price-intel/procurement"
import { auth } from "@/lib/auth"

const Post = z.object({
  scheduleId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  title: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  targetEndDate: z.string().datetime().optional(),
})

const Patch = z.object({
  taskId: z.string().cuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETE", "SKIPPED"]),
  notes: z.string().max(2000).optional(),
})

export async function POST(req: Request) {
  const session = await auth().catch(() => null)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }) }
  const parse = Post.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })
  const plan = await createProcurementPlan({
    buyerId: session.user.id,
    scheduleId: parse.data.scheduleId,
    projectId: parse.data.projectId,
    title: parse.data.title,
    description: parse.data.description,
    targetEndDate: parse.data.targetEndDate ? new Date(parse.data.targetEndDate) : null,
  })
  return NextResponse.json(plan)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (id) {
    const plan = await prisma.procurementPlan.findUnique({
      where: { id },
      include: { tasks: { orderBy: { position: "asc" } }, schedule: true },
    })
    if (!plan) return NextResponse.json({ error: "not_found" }, { status: 404 })
    return NextResponse.json(plan)
  }
  const buyerId = url.searchParams.get("buyerId")
  if (!buyerId) return NextResponse.json({ error: "missing_id_or_buyerId" }, { status: 400 })
  const list = await listPlansForBuyer(buyerId)
  return NextResponse.json({ items: list })
}

export async function PATCH(req: Request) {
  const session = await auth().catch(() => null)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }) }
  const parse = Patch.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: "validation_error", issues: parse.error.issues }, { status: 422 })
  const updated = await advanceTask(parse.data.taskId, parse.data.status, parse.data.notes)
  return NextResponse.json(updated)
}
