'use client'

import { useState, useEffect, useMemo } from "react"
import {
  Plus, Search, Download, ChevronDown, Building2, User, Mail, Phone,
  DollarSign, CalendarDays, Clock, Filter, X, TrendingUp, Users,
  MessageSquare, CheckCircle2, AlertCircle, Target, BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import { cn, formatPrice, formatDate, getInitials } from "@/lib/utils"
import {
  addLead, getLeads, getLead, updateLeadStatus, addFollowUp, getCRMStats, updateLead, getStaffList, exportCRMCSV,
} from "@/lib/crm/store"
import type { CRMLead } from "@/lib/crm/store"

const statusLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  proposal: "Proposal", negotiation: "Negotiation", converted: "Converted", lost: "Lost",
}

const statusVariants: Record<string, "default" | "secondary" | "success" | "warning" | "danger" | "outline"> = {
  new: "secondary", contacted: "default", qualified: "warning",
  proposal: "default", negotiation: "warning", converted: "success", lost: "danger",
}

const typeLabels: Record<string, string> = {
  supplier: "Supplier", contractor: "Contractor", professional: "Professional", buyer: "Buyer",
}

const typeVariants: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
  supplier: "default", contractor: "warning", professional: "secondary", buyer: "success",
}

const sourceLabels: Record<string, string> = {
  website: "Website", referral: "Referral", "direct-outreach": "Direct Outreach",
  whatsapp: "WhatsApp", "email-campaign": "Email Campaign", "trade-show": "Trade Show",
  "google-ads": "Google Ads", "facebook-ads": "Facebook Ads",
}

const staffOptions = ["Ali Hassan", "Fatima Mwinyi", "Juma Salum", "Aisha Kombo", "James Mushi", "Zainab Omar"]

const initialFormState = {
  companyName: "", contactName: "", email: "", phone: "",
  type: "" as string, source: "" as string, assignedTo: "",
  categoryInterest: "", estimatedValue: 0, notes: "", followUpDate: "",
}

export default function CRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [stats, setStats] = useState({ total: 0, byStatus: {} as Record<string, number>, byType: {} as Record<string, number>, bySource: {} as Record<string, number>, totalValue: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [showNewLead, setShowNewLead] = useState(false)
  const [showDetail, setShowDetail] = useState<string | null>(null)
  const [detailLead, setDetailLead] = useState<CRMLead | null>(null)
  const [leadForm, setLeadForm] = useState(initialFormState)
  const [followUpForm, setFollowUpForm] = useState({ action: "", notes: "" })
  const [statusUpdate, setStatusUpdate] = useState({ status: "", notes: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  function refresh() {
    setLeads([...getLeads()])
    setStats({ ...getCRMStats() })
  }

  useEffect(() => {
    refresh()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (showDetail) {
      setDetailLead(getLead(showDetail) || null)
    }
  }, [showDetail, leads])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterStatus !== "all" && l.status !== filterStatus) return false
      if (filterType !== "all" && l.type !== filterType) return false
      if (filterSource !== "all" && l.source !== filterSource) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        l.companyName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      )
    })
  }, [leads, filterStatus, filterType, filterSource, search])

  function validateForm() {
    const errors: Record<string, string> = {}
    if (!leadForm.companyName.trim()) errors.companyName = "Required"
    if (!leadForm.contactName.trim()) errors.contactName = "Required"
    if (!leadForm.email.trim()) errors.email = "Required"
    if (!leadForm.type) errors.type = "Required"
    if (!leadForm.source) errors.source = "Required"
    if (!leadForm.assignedTo) errors.assignedTo = "Required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleCreateLead() {
    if (!validateForm()) return
    addLead({
      companyName: leadForm.companyName,
      contactName: leadForm.contactName,
      email: leadForm.email,
      phone: leadForm.phone,
      type: leadForm.type as CRMLead['type'],
      source: leadForm.source as CRMLead['source'],
      status: 'new',
      assignedTo: leadForm.assignedTo,
      categoryInterest: leadForm.categoryInterest || undefined,
      estimatedValue: leadForm.estimatedValue,
      notes: leadForm.notes,
      followUpDate: leadForm.followUpDate ? new Date(leadForm.followUpDate) : undefined,
    })
    setLeadForm(initialFormState)
    setShowNewLead(false)
    refresh()
  }

  function handleStatusUpdate() {
    if (!showDetail || !statusUpdate.status || !statusUpdate.notes.trim()) return
    updateLeadStatus(showDetail, statusUpdate.status, "Current Staff", statusUpdate.notes)
    setStatusUpdate({ status: "", notes: "" })
    refresh()
  }

  function handleAddFollowUp() {
    if (!showDetail || !followUpForm.action.trim() || !followUpForm.notes.trim()) return
    addFollowUp(showDetail, followUpForm.action, "Current Staff", followUpForm.notes)
    setFollowUpForm({ action: "", notes: "" })
    refresh()
  }

  function handleAssign(leadId: string, staff: string) {
    updateLead(leadId, { assignedTo: staff })
    refresh()
  }

  function handleExport() {
    const csv = exportCRMCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "zanzibaba-crm-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management CRM</h1>
          <p className="text-sm text-gray-500">Track and manage all marketplace leads</p>
        </div>
        <Button onClick={() => setShowNewLead(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Lead
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-zanzibar-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <StatCard label="New" value={stats.byStatus["new"] || 0} icon={<AlertCircle className="h-4 w-4 text-blue-600" />} />
        <StatCard label="Contacted" value={stats.byStatus["contacted"] || 0} icon={<MessageSquare className="h-4 w-4 text-zanzibar-600" />} />
        <StatCard label="Qualified" value={stats.byStatus["qualified"] || 0} icon={<Target className="h-4 w-4 text-amber-600" />} />
        <StatCard label="Converted" value={stats.byStatus["converted"] || 0} icon={<CheckCircle2 className="h-4 w-4 text-green-600" />} />
        <StatCard label="Lost" value={stats.byStatus["lost"] || 0} icon={<X className="h-4 w-4 text-red-600" />} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatPrice(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Select
                options={[
                  { value: "all", label: "All Statuses" },
                  ...Object.entries(statusLabels).map(([k, v]) => ({ value: k, label: v })),
                ]}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-36"
              />
              <Select
                options={[
                  { value: "all", label: "All Types" },
                  ...Object.entries(typeLabels).map(([k, v]) => ({ value: k, label: v })),
                ]}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-36"
              />
              <Select
                options={[
                  { value: "all", label: "All Sources" },
                  ...Object.entries(sourceLabels).map(([k, v]) => ({ value: k, label: v })),
                ]}
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search company or contact..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Target className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No CRM leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || filterStatus !== "all" || filterType !== "all" || filterSource !== "all"
                  ? "Try adjusting filters."
                  : "Add your first lead to start tracking."}
              </p>
              <Button className="mt-4" onClick={() => setShowNewLead(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Lead
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Contact</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Source</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Value</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Assigned To</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Follow-up</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zanzibar-100">
                            <Building2 className="h-4 w-4 text-zanzibar-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.companyName}</div>
                            <div className="text-xs text-gray-400">{lead.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-gray-900">
                            <User className="h-3 w-3 text-gray-400" /> {lead.contactName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                            <Mail className="h-3 w-3 text-gray-400" /> {lead.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={typeVariants[lead.type]}>{typeLabels[lead.type]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{sourceLabels[lead.source]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariants[lead.status]}>{statusLabels[lead.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {lead.estimatedValue > 0 ? formatPrice(lead.estimatedValue) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.assignedTo}
                          onChange={(e) => handleAssign(lead.id, e.target.value)}
                          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-zanzibar-500"
                        >
                          {staffOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {lead.followUpDate ? (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(lead.followUpDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDetail(lead.id)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLeadForm({
                                companyName: lead.companyName,
                                contactName: lead.contactName,
                                email: lead.email,
                                phone: lead.phone,
                                type: lead.type,
                                source: lead.source,
                                assignedTo: lead.assignedTo,
                                categoryInterest: lead.categoryInterest || "",
                                estimatedValue: lead.estimatedValue,
                                notes: lead.notes,
                                followUpDate: lead.followUpDate ? lead.followUpDate.toISOString().split("T")[0] : "",
                              })
                              setShowNewLead(true)
                            }}
                          >
                            Edit
                          </Button>
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

      <Dialog open={showNewLead} onClose={() => { setShowNewLead(false); setFormErrors({}) }}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company Name"
              value={leadForm.companyName}
              onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
              error={formErrors.companyName}
            />
            <Input
              label="Contact Name"
              value={leadForm.contactName}
              onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
              error={formErrors.contactName}
            />
            <Input
              label="Email"
              type="email"
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              error={formErrors.email}
            />
            <Input
              label="Phone"
              value={leadForm.phone}
              onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Type"
              options={[
                { value: "", label: "Select type..." },
                ...Object.entries(typeLabels).map(([k, v]) => ({ value: k, label: v })),
              ]}
              value={leadForm.type}
              onChange={(e) => setLeadForm({ ...leadForm, type: e.target.value })}
              error={formErrors.type}
            />
            <Select
              label="Source"
              options={[
                { value: "", label: "Select source..." },
                ...Object.entries(sourceLabels).map(([k, v]) => ({ value: k, label: v })),
              ]}
              value={leadForm.source}
              onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
              error={formErrors.source}
            />
            <Select
              label="Assigned To"
              options={[
                { value: "", label: "Assign staff..." },
                ...staffOptions.map((s) => ({ value: s, label: s })),
              ]}
              value={leadForm.assignedTo}
              onChange={(e) => setLeadForm({ ...leadForm, assignedTo: e.target.value })}
              error={formErrors.assignedTo}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Category Interest"
              placeholder="e.g., Cement, Roofing, Plumbing"
              value={leadForm.categoryInterest}
              onChange={(e) => setLeadForm({ ...leadForm, categoryInterest: e.target.value })}
            />
            <Input
              label="Estimated Value ($)"
              type="number"
              value={leadForm.estimatedValue || ""}
              onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: Number(e.target.value) || 0 })}
            />
          </div>
          <Input
            label="Notes"
            value={leadForm.notes}
            onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
          />
          <Input
            label="Follow-up Date"
            type="date"
            value={leadForm.followUpDate}
            onChange={(e) => setLeadForm({ ...leadForm, followUpDate: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setShowNewLead(false); setFormErrors({}) }}>Cancel</Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!showDetail} onClose={() => { setShowDetail(null); setDetailLead(null) }}>
        {detailLead && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{detailLead.companyName}</h2>
                  <Badge variant={statusVariants[detailLead.status]}>
                    {statusLabels[detailLead.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{detailLead.id}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4 text-gray-400" /> {detailLead.contactName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" /> {detailLead.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" /> {detailLead.phone || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" /> {detailLead.companyName}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Lead Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <Badge variant={typeVariants[detailLead.type]}>{typeLabels[detailLead.type]}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source</span>
                    <Badge variant="outline">{sourceLabels[detailLead.source]}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Value</span>
                    <span className="font-medium">{formatPrice(detailLead.estimatedValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned To</span>
                    <span>{detailLead.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span>{formatDate(detailLead.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {detailLead.categoryInterest && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Category Interest</h3>
                <p className="text-sm text-gray-600">{detailLead.categoryInterest}</p>
              </div>
            )}

            {detailLead.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
                <p className="text-sm text-gray-600">{detailLead.notes}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Update Status</h3>
              <div className="flex gap-2">
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                >
                  <option value="">Select status...</option>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <Input
                  placeholder="Notes..."
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  className="flex-[2]"
                />
                <Button size="sm" onClick={handleStatusUpdate}>Update</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Add Follow-up</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Action (e.g., Called, Emailed, Met)"
                  value={followUpForm.action}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, action: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Notes..."
                  value={followUpForm.notes}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                  className="flex-[2]"
                />
                <Button size="sm" onClick={handleAddFollowUp}>Add</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Follow-up History</h3>
              {detailLead.followUpHistory.length === 0 ? (
                <p className="text-sm text-gray-400">No follow-up history yet.</p>
              ) : (
                <div className="space-y-3">
                  {[...detailLead.followUpHistory].reverse().map((entry, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zanzibar-100">
                        <Clock className="h-4 w-4 text-zanzibar-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                          <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{entry.notes}</p>
                        <p className="text-xs text-gray-400 mt-0.5">by {entry.staff}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
