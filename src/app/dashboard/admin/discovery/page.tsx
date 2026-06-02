'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Compass, TrendingUp, Users, CheckCircle2, XCircle, Copy,
  BarChart3, Download, RefreshCw, Globe, Map, Briefcase, FileText,
  Target, ArrowUp, ArrowDown, Minus, Calendar, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyCount {
  date: string
  count: number
}

interface SourceBreakdown {
  source: string
  count: number
}

interface DailyReport {
  date: string
  discovered: number
  approved: number
  rejected: number
  avgScore: number
  bySource: { source: string; count: number }[]
}

interface DiscoveryStats {
  today: number
  thisWeek: number
  approved: number
  rejected: number
  duplicates: number
  totalDiscovered: number
  avgTrustScore: number
  bySource: SourceBreakdown[]
  trends: DailyCount[]
  dailyReports: DailyReport[]
}

const sourceColors: Record<string, string> = {
  "Google Maps": "bg-emerald-500",
  "Company Websites": "bg-blue-500",
  "Trade Directories": "bg-amber-500",
  "Manual Import": "bg-purple-500",
  Unknown: "bg-gray-400",
}

const sourceIcons: Record<string, React.ElementType> = {
  "Google Maps": Map,
  "Company Websites": Globe,
  "Trade Directories": Briefcase,
  "Manual Import": FileText,
}

function TrendArrow({ value }: { value: number }) {
  if (value > 0) return <ArrowUp className="h-3 w-3 text-emerald-500" />
  if (value < 0) return <ArrowDown className="h-3 w-3 text-red-500" />
  return <Minus className="h-3 w-3 text-gray-400" />
}

export default function DiscoveryDashboardPage() {
  const [stats, setStats] = useState<DiscoveryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadStats() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/discovery/stats')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const maxTrend = stats?.trends ? Math.max(...stats.trends.map(t => t.count), 1) : 1
  const maxSource = stats?.bySource ? Math.max(...stats.bySource.map(s => s.count), 1) : 1

  function exportCSV() {
    if (!stats) return
    const headers = ['Date', 'Discovered', 'Approved', 'Rejected', 'Avg Score', 'Source Breakdown']
    const rows = stats.dailyReports.map(r => [
      r.date,
      r.discovered,
      r.approved,
      r.rejected,
      r.avgScore,
      r.bySource.map(s => `${s.source}:${s.count}`).join('; '),
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `discovery-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discovery Metrics</h1>
          <p className="text-gray-500">Automated supplier discovery performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs gap-1">
            <Compass className="h-3 w-3" /> Growth Agents
          </Badge>
          <button
            onClick={loadStats}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={!stats}
            className="inline-flex items-center gap-2 rounded-lg bg-zanzibar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-zanzibar-700 disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : stats?.today || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">suppliers discovered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">This Week</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : stats?.thisWeek || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">suppliers discovered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{loading ? '—' : stats?.approved || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">suppliers approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{loading ? '—' : stats?.rejected || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">suppliers rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Copy className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Duplicates</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{loading ? '—' : stats?.duplicates || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">duplicates found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Avg Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : stats?.avgTrustScore || 0}</p>
              <div className="h-1.5 w-12 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    (stats?.avgTrustScore || 0) >= 70 ? "bg-emerald-500" :
                    (stats?.avgTrustScore || 0) >= 40 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${stats?.avgTrustScore || 0}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">trust score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Discovery Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              14-Day Discovery Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading...</div>
            ) : !stats?.trends?.length ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                <div className="text-center">
                  <Compass className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2">No discovery data yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Run an agent to see trends</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-end gap-1 h-48" style={{ padding: '0 4px' }}>
                  {stats.trends.map((day) => {
                    const height = day.count > 0 ? Math.max((day.count / maxTrend) * 100, 8) : 4
                    const isToday = day.date === new Date().toISOString().split('T')[0]
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1" title={`${day.date}: ${day.count} discovered`}>
                        <span className="text-[9px] text-gray-400 font-medium">{day.count || ''}</span>
                        <div
                          className={cn(
                            "w-full rounded-sm transition-all hover:opacity-80",
                            isToday ? "bg-zanzibar-500" : "bg-zanzibar-200"
                          )}
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <span className="text-[8px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                          {day.date.slice(5)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>{stats.trends[0]?.date || ''}</span>
                  <span>{stats.trends[stats.trends.length - 1]?.date || ''}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Discovery Source Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading...</div>
            ) : !stats?.bySource?.length ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                <div className="text-center">
                  <Map className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2">No sources yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.bySource.map((src) => {
                  const Icon = sourceIcons[src.source] || Globe
                  const pct = Math.round((src.count / Math.max(...stats.bySource.map(s => s.count))) * 100)
                  return (
                    <div key={src.source}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{src.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{src.count}</span>
                          <span className="text-[10px] text-gray-400">
                            {stats.totalDiscovered > 0
                              ? `${Math.round((src.count / stats.totalDiscovered) * 100)}%`
                              : ''}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", sourceColors[src.source] || 'bg-gray-400')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <span>Total</span>
                  <span className="font-semibold text-gray-900">{stats.totalDiscovered}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Daily Discovery Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">Loading...</div>
          ) : !stats?.dailyReports?.length ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">No reports yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Discovered</th>
                    <th className="py-3 px-4 font-medium">Approved</th>
                    <th className="py-3 px-4 font-medium">Rejected</th>
                    <th className="py-3 px-4 font-medium">Avg Score</th>
                    <th className="py-3 px-4 font-medium">Sources</th>
                    <th className="py-3 px-4 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.dailyReports.map((report) => {
                    const prevDay = stats.dailyReports.find(
                      r => r.date < report.date
                    )
                    const trend = prevDay
                      ? report.discovered - prevDay.discovered
                      : 0
                    return (
                      <tr key={report.date} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{report.date}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{report.discovered}</span>
                        </td>
                        <td className="py-3 px-4">
                          {report.approved > 0 ? (
                            <span className="text-emerald-600 font-medium">{report.approved}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {report.rejected > 0 ? (
                            <span className="text-red-600 font-medium">{report.rejected}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  report.avgScore >= 70 ? "bg-emerald-500" :
                                  report.avgScore >= 40 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${report.avgScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{report.avgScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {report.bySource.map(s => (
                              <span
                                key={s.source}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium",
                                  s.source === "Google Maps" ? "bg-emerald-50 text-emerald-700" :
                                  s.source === "Company Websites" ? "bg-blue-50 text-blue-700" :
                                  s.source === "Trade Directories" ? "bg-amber-50 text-amber-700" :
                                  s.source === "Manual Import" ? "bg-purple-50 text-purple-700" :
                                  "bg-gray-50 text-gray-600"
                                )}
                              >
                                {s.source} {s.count}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {trend !== 0 && (
                            <div className="flex items-center gap-1">
                              <TrendArrow value={trend} />
                              <span className={cn(
                                "text-xs font-medium",
                                trend > 0 ? "text-emerald-600" :
                                trend < 0 ? "text-red-600" : "text-gray-400"
                              )}>
                                {Math.abs(trend)}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          Google Maps
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Company Websites
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          Trade Directories
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          Manual Import
        </div>
      </div>
    </div>
  )
}
