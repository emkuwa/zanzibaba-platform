"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Building2, HardHat, Briefcase, Package, FileText, ShoppingCart,
  DollarSign, Target, TrendingUp, Users, CheckCircle2, XCircle,
  AlertTriangle, RefreshCw, FileSpreadsheet, Clock, Calendar,
  ArrowUpRight, Zap, BarChart3, Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  label: string
  target: number
  current: number
  unit: string
  category: "population" | "activation" | "revenue"
  description: string
}

interface DailyLog {
  date: string
  entries: Record<string, number>
  note: string
}

interface LaunchData {
  items: ChecklistItem[]
  dailyLogs: DailyLog[]
  lastUpdated: string
}

const itemIcons: Record<string, React.ElementType> = {
  suppliers: Building2,
  contractors: HardHat,
  architects: Briefcase,
  engineers: Briefcase,
  products: Package,
  rfqs: FileText,
  "verified-sold": ShoppingCart,
  revenue: DollarSign,
}

function getStatus(progress: number): { color: string; label: string; bar: string } {
  if (progress >= 80) return { color: "green", label: "On Track", bar: "bg-emerald-500" }
  if (progress >= 40) return { color: "yellow", label: "Needs Push", bar: "bg-amber-500" }
  return { color: "red", label: "Critical", bar: "bg-red-500" }
}

function getStatusBg(status: string): string {
  if (status === "green") return "bg-emerald-50 border-emerald-200"
  if (status === "yellow") return "bg-amber-50 border-amber-200"
  return "bg-red-50 border-red-200"
}

function getStatusIcon(status: string): React.ElementType {
  if (status === "green") return CheckCircle2
  if (status === "yellow") return AlertTriangle
  return XCircle
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export default function LaunchChecklistPage() {
  const [data, setData] = useState<LaunchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [dailyNote, setDailyNote] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/launch/checklist")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function updateItem(id: string, value: number) {
    await fetch("/api/launch/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", itemId: id, value }),
    })
    setEditingId(null)
    loadData()
  }

  async function logDaily() {
    await fetch("/api/launch/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "log-daily", note: dailyNote }),
    })
    setDailyNote("")
    setShowSummary(true)
    loadData()
    loadSummary()
  }

  async function loadSummary() {
    setSummaryLoading(true)
    try {
      const res = await fetch("/api/launch/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summary" }),
      })
      const data = await res.json()
      setSummary(data.summary)
    } finally {
      setSummaryLoading(false)
    }
  }

  const overallProgress = data
    ? Math.round(
        (data.items.reduce((s, i) => s + i.current, 0) /
          data.items.reduce((s, i) => s + i.target, 0)) *
          100
      )
    : 0

  const overallStatus = getStatus(overallProgress)
  const StatusIcon = getStatusIcon(overallStatus.color)
  const completedItems = data?.items.filter(i => i.current >= i.target).length || 0

  function handleStartEdit(item: ChecklistItem) {
    setEditingId(item.id)
    setEditValue(String(item.current))
  }

  function handleSaveEdit(item: ChecklistItem) {
    const val = parseInt(editValue)
    if (!isNaN(val) && val >= 0) {
      updateItem(item.id, val)
    } else {
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Launch Checklist</h1>
            <Badge variant="outline" className="text-xs font-normal">Execution Phase</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Population · Activation · Revenue
            {data && <span className="ml-2 text-gray-400">— Updated {formatDate(data.lastUpdated)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Overall Progress */}
      <Card className={cn("border-2", getStatusBg(overallStatus.color))}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn(
                  "h-5 w-5",
                  overallStatus.color === "green" ? "text-emerald-600" :
                  overallStatus.color === "yellow" ? "text-amber-600" : "text-red-600"
                )} />
                <h2 className="text-lg font-bold text-gray-900">
                  {overallProgress}% Complete
                </h2>
                <Badge variant={overallStatus.color === "green" ? "success" : overallStatus.color === "yellow" ? "warning" : "danger"}>
                  {overallStatus.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {completedItems}/{data?.items.length || 0} targets met · {data?.items.reduce((s, i) => s + i.current, 0) || 0}/
                {data?.items.reduce((s, i) => s + i.target, 0) || 0} total units
              </p>
              <div className="mt-3 h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", overallStatus.bar)}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-gray-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-6">
        {/* Population */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            <Users className="h-4 w-4" /> Population
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data?.items.filter(i => i.category === "population").map(item => {
              const pct = Math.round((item.current / item.target) * 100)
              const status = getStatus(pct)
              const Icon = itemIcons[item.id] || Target
              const SI = getStatusIcon(status.color)
              return (
                <Card key={item.id} className={cn("border-l-4 transition-all hover:shadow-md", {
                  "border-l-emerald-500": status.color === "green",
                  "border-l-amber-500": status.color === "yellow",
                  "border-l-red-500": status.color === "red",
                })}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <SI className={cn(
                        "h-4 w-4",
                        status.color === "green" ? "text-emerald-500" :
                        status.color === "yellow" ? "text-amber-500" : "text-red-500"
                      )} />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={item.target}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSaveEdit(item)}
                            className="w-16 h-8 rounded border border-gray-300 px-2 text-sm font-bold text-gray-900"
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(item)} className="text-xs text-zanzibar-600 font-medium">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-900">{item.current}</span>
                          <span className="text-sm text-gray-500">/ {item.target}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{pct}%</span>
                        <span className="capitalize">{status.label}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", status.bar)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="mt-3 text-[11px] font-medium text-zanzibar-600 hover:text-zanzibar-700 transition-colors"
                    >
                      Update count →
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Activation */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            <Zap className="h-4 w-4" /> Activation
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.filter(i => i.category === "activation").map(item => {
              const pct = Math.round((item.current / item.target) * 100)
              const status = getStatus(pct)
              const Icon = itemIcons[item.id] || Target
              const SI = getStatusIcon(status.color)
              return (
                <Card key={item.id} className={cn("border-l-4 transition-all hover:shadow-md", {
                  "border-l-emerald-500": status.color === "green",
                  "border-l-amber-500": status.color === "yellow",
                  "border-l-red-500": status.color === "red",
                })}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <SI className={cn(
                        "h-4 w-4",
                        status.color === "green" ? "text-emerald-500" :
                        status.color === "yellow" ? "text-amber-500" : "text-red-500"
                      )} />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={item.target}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSaveEdit(item)}
                            className="w-16 h-8 rounded border border-gray-300 px-2 text-sm font-bold text-gray-900"
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(item)} className="text-xs text-zanzibar-600 font-medium">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-900">{item.current}</span>
                          <span className="text-sm text-gray-500">/ {item.target}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{pct}%</span>
                        <span className="capitalize">{status.label}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", status.bar)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="mt-3 text-[11px] font-medium text-zanzibar-600 hover:text-zanzibar-700 transition-colors"
                    >
                      Update count →
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Revenue */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            <DollarSign className="h-4 w-4" /> Revenue
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.filter(i => i.category === "revenue").map(item => {
              const pct = Math.round((item.current / item.target) * 100)
              const status = getStatus(pct)
              const Icon = itemIcons[item.id] || Target
              const SI = getStatusIcon(status.color)
              return (
                <Card key={item.id} className={cn("border-l-4 transition-all hover:shadow-md", {
                  "border-l-emerald-500": status.color === "green",
                  "border-l-amber-500": status.color === "yellow",
                  "border-l-red-500": status.color === "red",
                })}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <SI className={cn(
                        "h-4 w-4",
                        status.color === "green" ? "text-emerald-500" :
                        status.color === "yellow" ? "text-amber-500" : "text-red-500"
                      )} />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={item.target}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSaveEdit(item)}
                            className="w-16 h-8 rounded border border-gray-300 px-2 text-sm font-bold text-gray-900"
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(item)} className="text-xs text-zanzibar-600 font-medium">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            {item.current >= 1 ? "🎉 YES" : "—"}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{item.current >= 1 ? "100%" : "0%"}</span>
                        <span className="capitalize">{item.current >= 1 ? "ACHIEVED" : "PENDING"}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", item.current >= 1 ? "bg-emerald-500" : "bg-red-500")}
                          style={{ width: item.current >= 1 ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="mt-3 text-[11px] font-medium text-zanzibar-600 hover:text-zanzibar-700 transition-colors"
                    >
                      {item.current >= 1 ? "Mark as closed" : "Mark first customer →"}
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Daily Log & Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Daily Check-In
            </CardTitle>
            <CardDescription>Log today's progress and generate founder summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <textarea
                placeholder="What happened today? (e.g., Onboarded 3 suppliers, 2 RFQs received)"
                value={dailyNote}
                onChange={e => setDailyNote(e.target.value)}
                className="w-full h-24 rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 resize-none"
              />
              <Button onClick={logDaily} disabled={loading} className="w-full">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Log Today & Generate Summary
              </Button>
              {showSummary && data?.dailyLogs && data.dailyLogs.length > 0 && (
                <div className="text-xs text-gray-400">
                  Last logged: {data.dailyLogs[0].date} — {data.dailyLogs[0].note || "(no note)"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Founder Daily Summary
            </CardTitle>
            <CardDescription>Click &quot;Log Today&quot; above to generate</CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Generating...
              </div>
            ) : summary ? (
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                {summary}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                <div className="text-center">
                  <FileSpreadsheet className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2">No summary yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Log today&apos;s progress to generate</p>
                </div>
              </div>
            )}
            {summary && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  const blob = new Blob([summary], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `founder-summary-${new Date().toISOString().split("T")[0]}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Download Summary
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {data?.dailyLogs && data.dailyLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Daily Log History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Date</th>
                    {data.items.map(i => (
                      <th key={i.id} className="py-3 px-4 font-medium text-xs">{i.label}</th>
                    ))}
                    <th className="py-3 px-4 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dailyLogs.map(log => (
                    <tr key={log.date} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{log.date}</td>
                      {data.items.map(i => (
                        <td key={i.id} className="py-3 px-4 text-sm text-gray-600">
                          {log.entries[i.id] ?? "—"}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                        {log.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
