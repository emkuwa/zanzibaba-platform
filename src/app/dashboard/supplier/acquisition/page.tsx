"use client"

import { useState } from "react"
import {
  Radar, Play, RefreshCw, CheckCircle, AlertCircle, Clock,
  Users, TrendingUp, Target, Mail, Database, Loader2,
  Package, CheckSquare, MapPin, Building2, Globe, Briefcase,
  BarChart3, Flag
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RunResult {
  runId: string
  status: "running" | "completed" | "failed"
  stages: Record<string, any>
  startedAt: string
  completedAt?: string
  duration: number
}

interface Stats {
  totalDiscovered: number
  darSuppliers: number
  zanzibarContractors: number
  zanzibarProfessionals: number
  internationalPartners: number
  totalEnriched: number
  totalProfilesBuilt: number
  totalProductsExtracted: number
  totalInReview: number
  totalApproved: number
  totalRejected: number
  claimReadyProfiles: number
  outreachPrepared: number
  todayDiscovered: number
  todayEnriched: number
}

const TARGETS = {
  darSuppliers: 300,
  zanzibarContractors: 100,
  zanzibarProfessionals: 50,
  internationalPartners: 30,
}

export default function AcquisitionPage() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/acquisition/run")
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error("Failed to fetch stats", e)
    }
    setLoading(false)
  }

  const runPipeline = async () => {
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch("/api/acquisition/run", { method: "POST" })
      const data = await res.json()
      setResult(data)
      fetchStats()
    } catch (e) {
      console.error("Pipeline failed", e)
    }
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radar className="h-6 w-6 text-zanzibar-600" />
            Acquisition Engine
          </h1>
          <p className="text-gray-500 mt-1">
            Dar es Salaam suppliers (70%) · Zanzibar pros (20%) · International partners (10%)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Stats
          </Button>
          <Button onClick={runPipeline} disabled={running} className="bg-zanzibar-600 hover:bg-zanzibar-700">
            {running ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running...</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Run Pipeline</>
            )}
          </Button>
        </div>
      </div>

      {/* Market Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-600 uppercase">Primary · 70%</span>
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.darSuppliers ?? 0}</div>
            <div className="text-xs text-gray-500">Dar es Salaam Suppliers</div>
            <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ((stats?.darSuppliers ?? 0) / TARGETS.darSuppliers) * 100)}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Target: {TARGETS.darSuppliers}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-green-600 uppercase">Secondary · 20%</span>
              <Building2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.zanzibarContractors ?? 0}</div>
            <div className="text-xs text-gray-500">Zanzibar Contractors</div>
            <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, ((stats?.zanzibarContractors ?? 0) / TARGETS.zanzibarContractors) * 100)}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Target: {TARGETS.zanzibarContractors}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-purple-600 uppercase">Secondary</span>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.zanzibarProfessionals ?? 0}</div>
            <div className="text-xs text-gray-500">Zanzibar Professionals</div>
            <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, ((stats?.zanzibarProfessionals ?? 0) / TARGETS.zanzibarProfessionals) * 100)}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Target: {TARGETS.zanzibarProfessionals}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-amber-600 uppercase">Strategic · 10%</span>
              <Globe className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.internationalPartners ?? 0}</div>
            <div className="text-xs text-gray-500">International Partners</div>
            <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, ((stats?.internationalPartners ?? 0) / TARGETS.internationalPartners) * 100)}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Target: {TARGETS.internationalPartners}</div>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-4 w-4 mx-auto text-blue-500 mb-1" />
            <div className="text-lg font-bold">{stats?.totalDiscovered ?? 0}</div>
            <div className="text-[10px] text-gray-500">Total Found</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Database className="h-4 w-4 mx-auto text-green-500 mb-1" />
            <div className="text-lg font-bold">{stats?.totalEnriched ?? 0}</div>
            <div className="text-[10px] text-gray-500">Enriched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
            <div className="text-lg font-bold">{stats?.totalApproved ?? 0}</div>
            <div className="text-[10px] text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Flag className="h-4 w-4 mx-auto text-purple-600 mb-1" />
            <div className="text-lg font-bold">{stats?.claimReadyProfiles ?? 0}</div>
            <div className="text-[10px] text-gray-500">Claim-Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Mail className="h-4 w-4 mx-auto text-orange-500 mb-1" />
            <div className="text-lg font-bold">{stats?.outreachPrepared ?? 0}</div>
            <div className="text-[10px] text-gray-500">Outreach Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Target className="h-4 w-4 mx-auto text-red-500 mb-1" />
            <div className="text-lg font-bold">{stats?.totalInReview ?? 0}</div>
            <div className="text-[10px] text-gray-500">In Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Discovered Today</div>
              <div className="text-xl font-bold">{stats?.todayDiscovered ?? 0}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Enriched Today</div>
              <div className="text-xl font-bold">{stats?.todayEnriched ?? 0}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Result */}
      {running && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-zanzibar-600 mb-3" />
            <p className="text-gray-600">Discovering Dar suppliers, Zanzibar professionals, and international partners...</p>
            <p className="text-sm text-gray-400 mt-1">This may take a minute</p>
          </CardContent>
        </Card>
      )}

      {result && !running && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {result.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Pipeline {result.status === "completed" ? "Completed" : "Failed"}
              </h2>
              <Badge variant={result.status === "completed" ? "default" : "danger"}>
                {result.duration}s
              </Badge>
            </div>

            <div className="space-y-2">
              {Object.entries(result.stages).map(([name, stage]: [string, any]) => (
                <div key={name} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {stage.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : stage.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium capitalize">{name.replace(/([A-Z])/g, " $1")}</span>
                    {stage.errors && <span className="text-xs text-red-500 ml-2">{stage.errors}</span>}
                  </div>
                  <div className="flex gap-2 text-sm text-gray-500">
                    {stage.found != null && <span>{stage.found} found</span>}
                    {stage.darSuppliers != null && <Badge variant="outline" className="text-[10px]">{stage.darSuppliers} Dar</Badge>}
                    {stage.zanzibarContractors != null && <Badge variant="outline" className="text-[10px]">{stage.zanzibarContractors} Z'bar Ctr</Badge>}
                    {stage.zanzibarProfessionals != null && <Badge variant="outline" className="text-[10px]">{stage.zanzibarProfessionals} Z'bar Pro</Badge>}
                    {stage.internationalPartners != null && <Badge variant="outline" className="text-[10px]">{stage.internationalPartners} Intl</Badge>}
                    {stage.enriched != null && `${stage.enriched} enriched`}
                    {stage.profilesBuilt != null && `${stage.profilesBuilt} profiles`}
                    {stage.claimReady != null && <Badge variant="outline" className="text-[10px] bg-purple-50">{stage.claimReady} claim-ready</Badge>}
                    {stage.productsExtracted != null && `${stage.productsExtracted} products`}
                    {stage.inReview != null && `${stage.inReview} in review`}
                    {stage.approved != null && `${stage.approved} approved`}
                    {stage.rejected != null && `${stage.rejected} rejected`}
                    {stage.messagesGenerated != null && `${stage.messagesGenerated} messages`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Acquisition Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-blue-700">
                <MapPin className="h-4 w-4" /> PRIMARY · Dar es Salaam (70%)
              </div>
              <p className="text-blue-600/80">Building Materials, Tiles, Sanitary Ware, Aluminium, Roofing, Furniture, Kitchens, Lighting, Electrical, Paint, Hotel Equipment, Hospitality</p>
              <div className="text-blue-500 text-xs">12 categories · 50 directory entries · Priority discovery</div>
            </div>
            <div className="space-y-2 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <Building2 className="h-4 w-4" /> SECONDARY · Zanzibar (20%)
              </div>
              <p className="text-green-600/80">Contractors, Architects, Engineers, Surveyors, Hardware Stores, Hospitality Services, Interior Designers, Landscaping</p>
              <div className="text-green-500 text-xs">8 professional types · 25 directory entries · Project ecosystem</div>
            </div>
            <div className="space-y-2 p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-amber-700">
                <Globe className="h-4 w-4" /> STRATEGIC · International (10%)
              </div>
              <p className="text-amber-600/80">Building Materials, Hospitality Solutions, Prefab Buildings, Hotel Furniture, Commercial Kitchens</p>
              <div className="text-amber-500 text-xs">China · Turkey · UAE · India · Partnership records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Automated Schedule</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Discovery Run</span><span className="font-mono text-xs">02:00 daily</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Enrichment Run</span><span className="font-mono text-xs">08:00 daily</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Second Discovery</span><span className="font-mono text-xs">14:00 daily</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Outreach Prep</span><span className="font-mono text-xs">18:00 daily</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Flag className="h-4 w-4" /> 30-Day Targets</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dar Suppliers</span>
                <span className="font-semibold">{stats?.darSuppliers ?? 0} / {TARGETS.darSuppliers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zanzibar Contractors</span>
                <span className="font-semibold">{stats?.zanzibarContractors ?? 0} / {TARGETS.zanzibarContractors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zanzibar Professionals</span>
                <span className="font-semibold">{stats?.zanzibarProfessionals ?? 0} / {TARGETS.zanzibarProfessionals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">International Partners</span>
                <span className="font-semibold">{stats?.internationalPartners ?? 0} / {TARGETS.internationalPartners}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
