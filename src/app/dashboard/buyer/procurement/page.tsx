/**
 * Buyer dashboard — procurement tracker
 * /dashboard/buyer/procurement
 *
 * Shows the buyer's procurement plans + their task lifecycle.
 */

import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import { CreatePlanForm } from "./create-plan-form"

const formatN = (v: number | string | { toString(): string } | null | undefined) =>
  v ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(v)) : "—"

const TASK_ICON = {
  PENDING: Circle,
  IN_PROGRESS: Clock,
  BLOCKED: AlertTriangle,
  COMPLETE: CheckCircle2,
  SKIPPED: Circle,
}
const TASK_COLOR = {
  PENDING: "text-slate-400",
  IN_PROGRESS: "text-blue-600",
  BLOCKED: "text-red-600",
  COMPLETE: "text-emerald-600",
  SKIPPED: "text-slate-400",
}

export default async function ProcurementPage(props: { searchParams: Promise<{ scheduleId?: string }> }) {
  const session = await auth().catch(() => null)
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/dashboard/buyer/procurement")

  const sp = await props.searchParams
  const buyerId = session.user.id

  const plans = await prisma.procurementPlan.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: { orderBy: { position: "asc" } },
      schedule: { select: { id: true, title: true, regionId: true, grandTotalTzs: true, grandTotalUsd: true } },
    },
  })

  let preselectSchedule = null
  if (sp.scheduleId) {
    preselectSchedule = await prisma.materialSchedule.findFirst({
      where: { id: sp.scheduleId, buyerId },
      include: { region: true },
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Procurement Tracker</h1>
          <p className="mt-2 text-slate-600">
            Manage RFQs → POs → deliveries for every project. Each plan has a 9-step lifecycle from award to sign-off.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Create a new plan</h2>
            <CreatePlanForm preselectSchedule={preselectSchedule ? {
              id: preselectSchedule.id,
              title: preselectSchedule.title ?? "Schedule",
              region: preselectSchedule.region.name,
            } : null} />
          </CardContent>
        </Card>

        {plans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            <p className="text-sm">No procurement plans yet. Create one from a priced schedule.</p>
            <Link href="/dashboard/buyer/boq" className="mt-3 inline-block text-sm text-amber-700 hover:underline">
              Upload a BOQ →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                      {plan.description && <p className="mt-1 text-sm text-slate-600">{plan.description}</p>}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <Badge variant={plan.status === "ACTIVE" ? "default" : "secondary"}>{plan.status}</Badge>
                        {plan.schedule && (
                          <Badge variant="outline">
                            Linked schedule: {plan.schedule.title ?? plan.schedule.id.slice(0,8)}
                          </Badge>
                        )}
                        {plan.totalBudgetTzs && (
                          <Badge variant="outline">Budget TZS {formatN(plan.totalBudgetTzs)}</Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/buyer/procurement/${plan.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        Open <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>

                  <ol className="mt-5 flex flex-wrap gap-2">
                    {plan.tasks.map((t) => {
                      const Icon = TASK_ICON[t.status] ?? Circle
                      const colour = TASK_COLOR[t.status] ?? "text-slate-400"
                      return (
                        <li
                          key={t.id}
                          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                            t.status === "COMPLETE"
                              ? "border-emerald-200 bg-emerald-50"
                              : t.status === "IN_PROGRESS"
                              ? "border-blue-200 bg-blue-50"
                              : t.status === "BLOCKED"
                              ? "border-red-200 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                          title={t.description ?? undefined}
                        >
                          <Icon className={`h-3 w-3 ${colour}`} />
                          <span className="text-slate-700">{t.title}</span>
                        </li>
                      )
                    })}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
