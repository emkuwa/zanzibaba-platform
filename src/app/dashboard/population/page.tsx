"use client"

import { useState } from "react"
import {
  Users,
  Building2,
  HardHat,
  Briefcase,
  Package,
  ShieldCheck,
  Target,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  getPopulationTargets,
  getPopulationEvents,
  getPopulationProgress,
  getPopulationSummary,
} from "@/lib/population/store"

const typeIcons: Record<string, React.ElementType> = {
  suppliers: Building2,
  contractors: HardHat,
  architects: Briefcase,
  engineers: Briefcase,
  products: Package,
  "verified-members": ShieldCheck,
}

const typeColors: Record<string, string> = {
  suppliers: "text-blue-600 bg-blue-50",
  contractors: "text-orange-600 bg-orange-50",
  architects: "text-purple-600 bg-purple-50",
  engineers: "text-purple-600 bg-purple-50",
  products: "text-teal-600 bg-teal-50",
  "verified-members": "text-amber-600 bg-amber-50",
}

export default function PopulationDashboard() {
  const [targets] = useState(getPopulationTargets())
  const [progress] = useState(getPopulationProgress())
  const [events] = useState(getPopulationEvents(10))
  const [summary] = useState(getPopulationSummary())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace Population</h1>
            <Badge variant="outline" className="text-xs font-normal">Tracking</Badge>
          </div>
          <p className="text-sm text-gray-500">{summary}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {targets.map((t) => {
          const Icon = typeIcons[t.type] || Target
          const pct = Math.round((t.current / t.target) * 100)
          const remaining = t.target - t.current
          return (
            <Card key={t.type}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{t.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{t.current}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Target: {t.target}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-zanzibar-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {t.dailyRate}/day
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" /> {remaining} remaining
                      </span>
                    </div>
                  </div>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", typeColors[t.type] || "bg-gray-50 text-gray-600")}>
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Population Progress</CardTitle>
          <CardDescription>Detailed completion estimates</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Progress</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Remaining</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Est. Completion</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p) => {
                const target = targets.find((t) => t.type === p.type)
                return (
                  <tr key={p.type} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3.5 px-6 text-sm font-medium text-gray-900 capitalize">{target?.label || p.type}</td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-zanzibar-500" style={{ width: `${p.percentage}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{p.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-700">{p.remaining}</td>
                    <td className="py-3.5 px-6 text-sm">
                      <Badge variant="default" className="text-xs">{p.estCompletion}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Population Events</CardTitle>
          <CardDescription>Latest additions to the marketplace</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {events.map((event) => {
              const Icon = typeIcons[event.type] || Users
              return (
                <div key={event.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", typeColors[event.type] || "bg-gray-100")}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {event.source === "csv-import" && "📄 CSV Import:"}
                      {event.source === "manual-seed" && "🌱 Manual Seed:"}
                      {event.source === "self-registration" && "📝 Self-Registered:"}
                      {event.source === "admin-create" && "👤 Admin Created:"}{" "}
                      <span className="font-medium text-gray-900">{event.entityName}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" /> {event.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {event.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
