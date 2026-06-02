"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Activity,
  FileText,
  UserPlus,
  Eye,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AnalyticsSummary {
  totalEvents: number
  uniqueEvents: number
  rfqsSubmitted: number
  supplierSignups: number
  profileViews: number
  leadConversions: number
  eventsByDay: { date: string; count: number }[]
  eventsByType: { event: string; count: number }[]
}

interface Event {
  id: string
  event: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, any>
  timestamp: string
}

const eventColorMap: Record<string, string> = {
  rfq_submitted: "bg-blue-500",
  supplier_signup: "bg-green-500",
  profile_view: "bg-amber-500",
  lead_conversion: "bg-purple-500",
  page_view: "bg-gray-500",
  quote_requested: "bg-orange-500",
  order_placed: "bg-teal-500",
}

const eventLabelMap: Record<string, string> = {
  rfq_submitted: "RFQs Submitted",
  supplier_signup: "Supplier Signups",
  profile_view: "Profile Views",
  lead_conversion: "Lead Conversions",
  page_view: "Page Views",
  quote_requested: "Quote Requests",
  order_placed: "Orders Placed",
}

const kpis = [
  { key: "totalEvents", label: "Total Events", icon: Activity, color: "text-blue-600 bg-blue-50" },
  { key: "uniqueEvents", label: "Unique Events", icon: BarChart3, color: "text-indigo-600 bg-indigo-50" },
  { key: "rfqsSubmitted", label: "RFQs Submitted", icon: FileText, color: "text-zanzibar-600 bg-zanzibar-50" },
  { key: "supplierSignups", label: "Supplier Signups", icon: UserPlus, color: "text-green-600 bg-green-50" },
  { key: "profileViews", label: "Profile Views", icon: Eye, color: "text-amber-600 bg-amber-50" },
  { key: "leadConversions", label: "Lead Conversions", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
]

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<"7d" | "14d" | "30d">("14d")

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const res = await fetch("/api/analytics?events=true")
      const data = await res.json()
      setSummary(data.summary)
      setRecentEvents(data.events)
    } catch {
      /* ignore */
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const chartData = summary?.eventsByDay || []
  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  const filteredChartData = dateRange === "7d" ? chartData.slice(-7) : dateRange === "30d" ? chartData : chartData

  const eventTypeData = summary?.eventsByType || []

  async function handleExport() {
    const json = JSON.stringify({ summary, events: recentEvents }, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zanzibaba-analytics-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Marketplace performance and event tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-gray-200">
            {(["7d", "14d", "30d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  dateRange === range ? "bg-zanzibar-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {loading && !summary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <Card key={kpi.key}>
              <CardContent className="p-5">
                <div className="h-20 animate-pulse rounded bg-gray-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            const value = summary ? (summary[kpi.key as keyof AnalyticsSummary] as number) : 0
            return (
              <Card key={kpi.key}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", kpi.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events Over Time</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-5">
            {filteredChartData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                No event data yet
              </div>
            ) : (
              <div className="flex items-end gap-1.5" style={{ height: 180 }}>
                {filteredChartData.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-500">{d.count}</span>
                    <div
                      className="w-full rounded-t bg-zanzibar-500 transition-all"
                      style={{
                        height: `${Math.max((d.count / maxCount) * 140, 4)}px`,
                      }}
                    />
                    <span className="text-[10px] text-gray-400">{formatDateLabel(d.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Type Breakdown</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-5">
            {eventTypeData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                No event data yet
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className="h-4 w-full overflow-hidden rounded-full"
                  style={{
                    background: eventTypeData
                      .map(
                        (d, i) =>
                          `${eventColorMap[d.event] || "bg-gray-300"} ${eventTypeData
                            .slice(0, i)
                            .reduce((sum, e) => sum + (e.count / eventTypeData.reduce((s, e) => s + e.count, 0)) * 100, 0)}% ${eventTypeData
                            .slice(0, i + 1)
                            .reduce((sum, e) => sum + (e.count / eventTypeData.reduce((s, e) => s + e.count, 0)) * 100, 0)}%`
                      )
                      .join(", "),
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: `conic-gradient(${eventTypeData
                        .map((d, i) => {
                          const total = eventTypeData.reduce((s, e) => s + e.count, 0)
                          const pct = (d.count / total) * 100
                          const start = eventTypeData.slice(0, i).reduce((s, e) => s + (e.count / total) * 100, 0)
                          return `${eventColorMap[d.event] || "#d1d5db"} ${start}% ${start + pct}%`
                        })
                        .join(", ")})`,
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {eventTypeData.map((d) => {
                    const total = eventTypeData.reduce((s, e) => s + e.count, 0)
                    const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : "0"
                    return (
                      <div key={d.event} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-3 w-3 rounded-full", eventColorMap[d.event] || "bg-gray-300")} />
                          <span className="text-gray-700">{eventLabelMap[d.event] || d.event}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {d.count} ({pct}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {recentEvents.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-400">
              No events recorded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Event</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Entity</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEvents.slice(0, 20).map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Badge variant="secondary">{evt.event}</Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {evt.entityType ? `${evt.entityType}${evt.entityId ? ` #${evt.entityId.slice(0, 8)}` : ""}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{formatTimestamp(evt.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
