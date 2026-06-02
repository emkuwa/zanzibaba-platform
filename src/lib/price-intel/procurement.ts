/**
 * Procurement Fulfilment Workflow.
 *
 * Creates and manages ProcurementPlan + ProcurementTask rows that mirror
 * the lifecycle of a project's RFQs through to site delivery.
 *
 * Task templates auto-instantiate when:
 *   - A MaterialSchedule is committed → plan with PRE-RFQ tasks.
 *   - A Quote is accepted → RFQ_AWARDED task closed, PO_ISSUED task opened.
 *   - An Order is shipped/delivered → corresponding tasks advanced.
 */

import { prisma } from "@/lib/prisma"
import type { ProcurementTaskKind } from "@prisma/client"

export const DEFAULT_TASK_SEQUENCE: { kind: ProcurementTaskKind; title: string; description?: string }[] = [
  { kind: "RFQ_AWARDED", title: "RFQ awarded", description: "Buyer selects a winning quote." },
  { kind: "PO_ISSUED", title: "PO issued", description: "Purchase order generated and shared." },
  { kind: "SUPPLIER_CONFIRMED", title: "Supplier confirmed", description: "Supplier acknowledges order and lead time." },
  { kind: "PRODUCTION", title: "In production / preparation", description: "Materials being produced or picked." },
  { kind: "SHIPPED", title: "Shipped", description: "Carrier collects from supplier facility." },
  { kind: "IN_TRANSIT_CUSTOMS", title: "In transit / customs", description: "Customs clearance for imports." },
  { kind: "DELIVERED", title: "Delivered", description: "Materials arrive at site." },
  { kind: "SITE_RECEIVED", title: "Site received", description: "Buyer inspects + accepts on site." },
  { kind: "SIGNED_OFF", title: "Signed off", description: "Final acceptance and supplier rating." },
]

export interface CreatePlanInput {
  buyerId: string
  scheduleId?: string | null
  projectId?: string | null
  title: string
  description?: string | null
  startDate?: Date | null
  targetEndDate?: Date | null
}

export async function createProcurementPlan(input: CreatePlanInput) {
  const plan = await prisma.procurementPlan.create({
    data: {
      buyerId: input.buyerId,
      scheduleId: input.scheduleId ?? undefined,
      projectId: input.projectId ?? undefined,
      title: input.title,
      description: input.description ?? undefined,
      startDate: input.startDate ?? undefined,
      targetEndDate: input.targetEndDate ?? undefined,
      tasks: {
        create: DEFAULT_TASK_SEQUENCE.map((t, i) => ({
          kind: t.kind,
          title: t.title,
          description: t.description ?? undefined,
          position: i,
        })),
      },
    },
    include: { tasks: { orderBy: { position: "asc" } } },
  })

  if (input.scheduleId) {
    const schedule = await prisma.materialSchedule.findUnique({ where: { id: input.scheduleId } })
    if (schedule?.grandTotalTzs) {
      await prisma.procurementPlan.update({
        where: { id: plan.id },
        data: {
          totalBudgetTzs: schedule.grandTotalTzs,
          totalBudgetUsd: schedule.grandTotalUsd ?? undefined,
        },
      })
    }
  }

  return plan
}

export async function advanceTask(taskId: string, status: ProcurementTaskKind extends string ? "PENDING" | "IN_PROGRESS" | "BLOCKED" | "COMPLETE" | "SKIPPED" : never, notes?: string) {
  return prisma.procurementTask.update({
    where: { id: taskId },
    data: {
      status,
      startedAt: status === "IN_PROGRESS" ? new Date() : undefined,
      completedAt: status === "COMPLETE" || status === "SKIPPED" ? new Date() : undefined,
      notes: notes ?? undefined,
    },
  })
}

export async function listPlansForBuyer(buyerId: string) {
  return prisma.procurementPlan.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: { orderBy: { position: "asc" } },
      schedule: { select: { id: true, title: true, regionId: true, grandTotalTzs: true } },
    },
  })
}
