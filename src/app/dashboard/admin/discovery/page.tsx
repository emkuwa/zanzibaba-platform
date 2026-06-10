'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Compass, TrendingUp, Users, CheckCircle2, XCircle, Copy,
  BarChart3, Download, RefreshCw, Globe, Map, Briefcase, FileText,
  Target, ArrowUp, ArrowDown, Minus, Calendar, Clock, Search,
  Play, Save, AlertCircle, Loader2, Eye, Database, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DISCOVERY_SOURCES = [
  { id: "google-places", label: "Google Places API", icon: "🗺️" },
  { id: "apify-maps", label: "Apify Google Maps", icon: "📍" },
  { id: "apify-web", label: "Apify Web Scraper", icon: "🌐" },
]

const TARGET_COUNTRIES = [
  "Tanzania", "Kenya", "UAE", "Turkey", "India", "China", "South Africa",
]

const SEARCH_TEMPLATES = [
  { id: "steel", label: "Steel", query: "steel manufacturers" },
  { id: "rebar", label: "Rebar", query: "rebar manufacturers" },
  { id: "cement", label: "Cement", query: "cement manufacturers" },
  { id: "building-materials", label: "Building Materials", query: "building materials suppliers" },
  { id: "hotel-furniture", label: "Hotel Furniture", query: "hotel furniture manufacturers" },
  { id: "ffe", label: "FF&E", query: "hotel FF&E suppliers" },
  { id: "commercial-kitchens", label: "Commercial Kitchens", query: "commercial kitchen equipment" },
  { id: "prefab-houses", label: "Prefab Houses", query: "prefabricated houses manufacturers" },
  { id: "modular-buildings", label: "Modular Buildings", query: "modular building manufacturers" },
  { id: "aluminium-systems", label: "Aluminium Systems", query: "aluminium facade systems" },
  { id: "hvac", label: "HVAC", query: "commercial HVAC manufacturers" },
  { id: "solar", label: "Solar", query: "solar panel manufacturers" },
]

interface LeadResult {
  companyName: string
  website?: string
  email?: string
  phone?: string
  country: string
  city?: string
  description?: string
  category: string
  categoryLabel: string
  source: string
  trustScore: number
  valueScore: number
  hasWebsite: boolean
  hasEmail: boolean
  hasExportEvidence: boolean
  isManufacturer: boolean
  isStrategicCategory: boolean
}

interface DiscoveryStats {
  today: number
  thisWeek: number
  approved: number
  rejected: number
  duplicates: number
  totalDiscovered: number
  avgTrustScore: number
  bySource: { source: string; count: number }[]
  trends: { date: string; count: number }[]
  dailyReports: {
    date: string
    discovered: number
    approved: number
    rejected: number
    avgScore: number
    bySource: { source: string; count: number }[]
  }[]
}

const sourceColors: Record<string, string> = {
  "Google Maps": "bg-emerald-500",
  "Company Websites": "bg-blue-500",
  "Trade Directories": "bg-amber-500",
  "Manual Import": "bg-purple-500",
  "Strategic Discovery": "bg-orange-500",
  Unknown: "bg-gray-400",
}

const sourceIcons: Record<string, React.ElementType> = {
  "Google Maps": Map,
  "Company Websites": Globe,
  "Trade Directories": Briefcase,
  "Manual Import": FileText,
  "Strategic Discovery": Target,
}

function TrendArrow({ value }: { value: number }) {
  if (value > 0) return <ArrowUp className="h-3 w-3 text-emerald-500" />
  if (value < 0) return <ArrowDown className="h-3 w-3 text-red-500" />
  return <Minus className="h-3 w-3 text-gray-400" />
}

function ValueScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", color)}>
      {score}
    </span>
  )
}

export default function DiscoveryDashboardPage() {
  const [stats, setStats] = useState<DiscoveryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [queries, setQueries] = useState("")
  const [selectedSources, setSelectedSources] = useState<string[]>(["google-places", "apify-maps"])
  const [selectedCountry, setSelectedCountry] = useState("Tanzania")
  const [selectedCategory, setSelectedCategory] = useState("building-materials")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const [discoveryRunning, setDiscoveryRunning] = useState(false)
  const [discoveryResults, setDiscoveryResults] = useState<LeadResult[] | null>(null)
  const [discoveryStats, setDiscoveryStats] = useState<{ total: number; withWebsite: number; withEmail: number; withPhone: number } | null>(null)
  const [discoveryDuration, setDiscoveryDuration] = useState(0)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; tokensGenerated: number; errors: string[] } | null>(null)
  const [discoveryMode, setDiscoveryMode] = useState<"preview" | "import">("preview")

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

  function applyTemplate(templateId: string) {
    const template = SEARCH_TEMPLATES.find(t => t.id === templateId)
    if (!template) return
    setSelectedTemplate(templateId)
    setQueries(template.query)
    setSelectedCategory(templateId)
  }

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function runDiscovery(preview: boolean) {
    const queryList = queries.split('\n').map(q => q.trim()).filter(Boolean)
    if (queryList.length === 0) return
    if (selectedSources.length === 0) return

    setDiscoveryRunning(true)
    setDiscoveryResults(null)
    setDiscoveryStats(null)
    setImportResult(null)
    setDiscoveryMode(preview ? "preview" : "import")
    setError(null)

    try {
      const res = await fetch('/api/admin/discovery/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: queryList,
          sources: selectedSources,
          country: selectedCountry,
          category: selectedCategory,
          preview,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      const data = await res.json()

      if (data.mode === 'preview') {
        setDiscoveryResults(data.discovery.leads || [])
        setDiscoveryStats(data.discovery.stats)
        setDiscoveryDuration(data.discovery.duration)
      } else if (data.mode === 'import') {
        setDiscoveryResults(data.discovery.leads || [])
        setDiscoveryStats(data.discovery.stats)
        setDiscoveryDuration(data.discovery.duration)
        setImportResult(data.import)
        await loadStats()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Discovery run failed')
    } finally {
      setDiscoveryRunning(false)
    }
  }

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

  function exportResults() {
    if (!discoveryResults || discoveryResults.length === 0) return
    const headers = ['Company', 'Country', 'Website', 'Email', 'Phone', 'Category', 'Trust Score', 'Value Score']
    const rows = discoveryResults.map(l => [
      l.companyName,
      l.country,
      l.website || '',
      l.email || '',
      l.phone || '',
      l.categoryLabel,
      l.trustScore,
      l.valueScore,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `discovery-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discovery Engine V2</h1>
          <p className="text-gray-500">Configurable strategic supplier discovery</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs gap-1">
            <Zap className="h-3 w-3" /> V2
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
          <CardContent className="p-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* Discovery Controls */}
      <Card className="border-zanzibar-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-zanzibar-600" />
            Strategic Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Templates */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Search Templates</label>
            <div className="flex flex-wrap gap-1.5">
              {SEARCH_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    selectedTemplate === t.id
                      ? "bg-zanzibar-100 text-zanzibar-700 ring-1 ring-zanzibar-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Query Input */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
              Search Queries <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal normal-case ml-2">(one per line)</span>
            </label>
            <textarea
              value={queries}
              onChange={(e) => setQueries(e.target.value)}
              placeholder={`steel manufacturers\nrebar manufacturers\nbuilding materials suppliers`}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-transparent"
            />
          </div>

          {/* Source, Country, Category */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Source Selection */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                Discovery Sources <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1.5">
                {DISCOVERY_SOURCES.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(s.id)}
                      onChange={() => toggleSource(s.id)}
                      className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500"
                    />
                    <span className="text-sm text-gray-700">{s.icon} {s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                Target Country <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-transparent"
              >
                {TARGET_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                Target Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-transparent"
              >
                {SEARCH_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => runDiscovery(true)}
              disabled={discoveryRunning || !queries.trim() || selectedSources.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-zanzibar-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zanzibar-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {discoveryRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {discoveryRunning ? 'Discovering...' : 'Preview Discovery'}
            </button>
            <button
              onClick={() => runDiscovery(false)}
              disabled={discoveryRunning || !queries.trim() || selectedSources.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {discoveryRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {discoveryRunning ? 'Importing...' : 'Discover & Import'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Discovery Results */}
      {discoveryStats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                {discoveryMode === "preview" ? (
                  <Eye className="h-4 w-4 text-blue-500" />
                ) : (
                  <Database className="h-4 w-4 text-emerald-500" />
                )}
                {discoveryMode === "preview" ? "Preview Results" : "Import Results"}
                <Badge variant="secondary" className="text-[10px]">
                  {discoveryDuration}s
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  <strong className="text-gray-900">{discoveryStats.total}</strong> suppliers
                </span>
                <span className="text-xs text-blue-500">
                  <strong>{discoveryStats.withWebsite}</strong> websites
                </span>
                <span className="text-xs text-green-500">
                  <strong>{discoveryStats.withEmail}</strong> emails
                </span>
                <span className="text-xs text-amber-500">
                  <strong>{discoveryStats.withPhone}</strong> phones
                </span>
                {discoveryMode === "preview" && (
                  <button
                    onClick={exportResults}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Download className="h-3 w-3" /> CSV
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Import Result Banner */}
            {importResult && (
              <div className={cn(
                "mx-4 mb-3 rounded-lg p-3 text-sm",
                importResult.errors.length > 0
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-emerald-50 border border-emerald-200"
              )}>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className={cn("h-4 w-4", importResult.errors.length > 0 ? "text-amber-500" : "text-emerald-500")} />
                  Imported {importResult.imported} suppliers • {importResult.tokensGenerated} claim tokens generated
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-1 text-xs text-red-600">
                    {importResult.errors.length} errors: {importResult.errors.slice(0, 3).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Company</th>
                    <th className="py-3 px-4 font-medium">Country</th>
                    <th className="py-3 px-4 font-medium">Website</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium">Phone</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Trust</th>
                    <th className="py-3 px-4 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {discoveryResults && discoveryResults.length > 0 ? (
                    discoveryResults.slice(0, 50).map((lead, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 px-4 font-medium text-gray-900 max-w-[200px] truncate" title={lead.companyName}>
                          {lead.companyName}
                        </td>
                        <td className="py-2.5 px-4 text-gray-600 text-xs">{lead.country}</td>
                        <td className="py-2.5 px-4">
                          {lead.website ? (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs truncate block max-w-[180px]"
                              title={lead.website}>
                              {lead.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {lead.email ? (
                            <span className="text-xs text-gray-600 truncate block max-w-[160px]" title={lead.email}>
                              {lead.email}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {lead.phone ? (
                            <span className="text-xs text-gray-600">{lead.phone}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <Badge variant="secondary" className="text-[9px]">{lead.categoryLabel}</Badge>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-10 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  lead.trustScore >= 70 ? "bg-emerald-500" :
                                  lead.trustScore >= 40 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${lead.trustScore}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500">{lead.trustScore}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <ValueScoreBadge score={lead.valueScore} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                        <Compass className="mx-auto h-6 w-6 text-gray-300 mb-1" />
                        No suppliers found. Try different queries or sources.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {discoveryResults && discoveryResults.length > 50 && (
              <div className="p-3 text-center text-xs text-gray-400 border-t">
                Showing 50 of {discoveryResults.length} results. Export CSV for full data.
              </div>
            )}
          </CardContent>
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

      {/* Trends + Source Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                  <p className="text-xs text-gray-400 mt-0.5">Run a discovery to see trends</p>
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
                    const prevDay = stats.dailyReports.find(r => r.date < report.date)
                    const trend = prevDay ? report.discovered - prevDay.discovered : 0
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
                                  s.source === "Strategic Discovery" ? "bg-orange-50 text-orange-700" :
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
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          Strategic Discovery
        </div>
      </div>
    </div>
  )
}
