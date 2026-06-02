'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Play, RefreshCw, Store, HardHat, Package, Globe, FolderOpen,
  Shield, TrendingUp, Users, CheckCircle2, XCircle, Clock,
  AlertTriangle, Search, Loader2, Download, FileText, BarChart3
} from 'lucide-react'

interface Lead {
  id: string
  companyName?: string
  contactName?: string
  leadType: string
  email?: string
  phone?: string
  website?: string
  city?: string
  country?: string
  score: number
  level: string
  status: string
  agentType: string
  discoveredAt: string
  description?: string
  categoryLabels?: string[]
  sourcePlatform?: string
  sourceUrl?: string
}

interface Stats {
  total: number
  byStatus: Record<string, number>
  byAgent: Record<string, number>
  byTrustLevel: Record<string, number>
}

const agentConfigs = [
  { type: 'supplier', label: 'Supplier Scout', icon: Store, color: 'bg-zanzibar-100 text-zanzibar-700' },
  { type: 'contractor', label: 'Contractor Scout', icon: HardHat, color: 'bg-blue-100 text-blue-700' },
  { type: 'product', label: 'Product Scout', icon: Package, color: 'bg-emerald-100 text-emerald-700' },
  { type: 'project', label: 'Project Scout', icon: FolderOpen, color: 'bg-purple-100 text-purple-700' },
  { type: 'international', label: 'International Scout', icon: Globe, color: 'bg-amber-100 text-amber-700' },
]

export default function AgentsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [runningAgent, setRunningAgent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  async function loadData() {
    const res = await fetch('/api/admin/agents')
    const data = await res.json()
    setLeads(data.leads || [])
    setStats(data.stats || null)
  }

  useEffect(() => { loadData() }, [])

  async function runAgent(type: string) {
    setRunningAgent(type)
    setLoading(true)
    try {
      await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-agent', agentType: type }),
      })
      await loadData()
    } finally {
      setRunningAgent(null)
      setLoading(false)
    }
  }

  async function runAll() {
    setLoading(true)
    try {
      await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-all' }),
      })
      await loadData()
    } finally {
      setLoading(false)
    }
  }

  async function updateLeadStatus(leadId: string, status: string) {
    await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update-status', leadId, status }),
    })
    await loadData()
  }

  function getLevelBadge(level: string) {
    switch (level) {
      case 'HIGH': return <Badge variant="success" className="text-[10px]">High Trust</Badge>
      case 'MEDIUM': return <Badge variant="warning" className="text-[10px]">Medium</Badge>
      case 'LOW': return <Badge variant="danger" className="text-[10px]">Low Trust</Badge>
      default: return null
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'DISCOVERED': return <Badge variant="secondary" className="text-[10px]">Discovered</Badge>
      case 'VERIFIED': return <Badge variant="default" className="text-[10px] bg-blue-100 text-blue-700">Verified</Badge>
      case 'REVIEW_PENDING': return <Badge variant="warning" className="text-[10px]">Review Pending</Badge>
      case 'APPROVED': return <Badge variant="success" className="text-[10px]">Approved</Badge>
      case 'REJECTED': return <Badge variant="danger" className="text-[10px]">Rejected</Badge>
      case 'IMPORTED': return <Badge variant="success" className="text-[10px] bg-emerald-100 text-emerald-700">Imported</Badge>
      case 'MERGED': return <Badge variant="default" className="text-[10px] bg-purple-100 text-purple-700">Merged</Badge>
      default: return null
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (activeTab !== 'all' && lead.status !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        lead.companyName?.toLowerCase().includes(q) ||
        lead.contactName?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.city?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Growth Agents</h1>
          <p className="text-gray-500">Automated discovery, verification, and outreach system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={runAll} disabled={loading}>
            <Play className="mr-2 h-4 w-4" /> Run All Agents
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            <p className="text-xs text-gray-500">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats?.byStatus.REVIEW_PENDING || 0}</p>
            <p className="text-xs text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.byStatus.APPROVED || 0}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats?.byStatus.REJECTED || 0}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-zanzibar-600">{stats?.byTrustLevel.HIGH || 0}</p>
            <p className="text-xs text-gray-500">High Trust</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats?.byTrustLevel.LOW || 0}</p>
            <p className="text-xs text-gray-500">Low Trust</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {agentConfigs.map((agent) => {
          const Icon = agent.icon
          const count = stats?.byAgent[agent.type] || 0
          return (
            <Card key={agent.type} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", agent.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{count}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{agent.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{agent.type} leads</p>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => runAgent(agent.type)}
                  disabled={loading && runningAgent === agent.type}
                >
                  {runningAgent === agent.type ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-3 w-3" />
                  )}
                  Run Scout
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Review Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Queue</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-9 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                />
              </div>
              <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
                {['all', 'REVIEW_PENDING', 'DISCOVERED', 'APPROVED', 'REJECTED'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab === 'all' ? 'All' : tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Users className="h-12 w-12 text-gray-300" />
              <p className="mt-4 font-medium text-gray-500">No leads found</p>
              <p className="text-sm text-gray-400">Run an agent to discover leads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Company</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Contact</th>
                    <th className="py-3 px-4 font-medium">Location</th>
                    <th className="py-3 px-4 font-medium">Trust</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Source</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{lead.companyName || lead.contactName || '—'}</p>
                        {lead.website && <p className="text-[10px] text-gray-400 mt-0.5">{lead.website}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          {lead.leadType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {lead.email && <p className="text-xs">{lead.email}</p>}
                        {lead.phone && <p className="text-[10px] text-gray-400">{lead.phone}</p>}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {[lead.city, lead.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-gray-200 overflow-hidden">
                            <div className={cn(
                              "h-full rounded-full",
                              lead.score >= 70 ? "bg-emerald-500" : lead.score >= 40 ? "bg-amber-500" : "bg-red-500"
                            )} style={{ width: `${lead.score}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{lead.score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {lead.sourcePlatform || lead.agentType}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {lead.status === 'DISCOVERED' || lead.status === 'REVIEW_PENDING' ? (
                            <>
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'APPROVED')}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'REJECTED')}
                                className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">
                              {lead.status === 'APPROVED' ? '✔ Approved' : lead.status === 'REJECTED' ? '✘ Rejected' : lead.status}
                            </span>
                          )}
                        </div>
                      </td>
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
