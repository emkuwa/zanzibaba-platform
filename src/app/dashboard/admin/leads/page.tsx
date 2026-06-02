"use client"

import { useState, useEffect, useMemo } from "react"
import { Download, Search, Mail, Phone, User, ExternalLink, Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Lead {
  id: string
  type: "rfq" | "contact" | "supplier-inquiry" | "quote-request"
  source: string
  data: Record<string, any>
  contact: { name?: string; email?: string; phone?: string }
  createdAt: string
}

const typeLabels: Record<string, string> = {
  rfq: "RFQ",
  contact: "Contact",
  "supplier-inquiry": "Supplier Inquiry",
  "quote-request": "Quote Request",
}

const typeVariants: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
  rfq: "default",
  contact: "secondary",
  "supplier-inquiry": "success",
  "quote-request": "warning",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const stored = sessionStorage.getItem("zanzibaba_leads")
    if (stored) {
      try {
        setLeads(JSON.parse(stored))
      } catch {
        /* ignore */
      }
    }
    setLoading(false)

    const poll = setInterval(() => {
      const s = sessionStorage.getItem("zanzibaba_leads")
      if (s) {
        try {
          setLeads(JSON.parse(s))
        } catch {
          /* ignore */
        }
      }
    }, 2000)
    return () => clearInterval(poll)
  }, [])

  useEffect(() => {
    if (leads.length > 0) {
      sessionStorage.setItem("zanzibaba_leads", JSON.stringify(leads))
    }
  }, [leads])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (activeFilter !== "all" && l.type !== activeFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        l.contact.name?.toLowerCase().includes(q) ||
        l.contact.email?.toLowerCase().includes(q) ||
        l.contact.phone?.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        JSON.stringify(l.data).toLowerCase().includes(q)
      )
    })
  }, [leads, activeFilter, search])

  async function handleExportCSV() {
    try {
      const res = await fetch("/api/leads/export")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "zanzibaba-leads.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // fallback: generate client-side
      const headers = ["ID", "Type", "Source", "Contact Name", "Contact Email", "Contact Phone", "Data", "Created At"]
      const rows = leads.map((l) =>
        [l.id, l.type, l.source, l.contact.name || "", l.contact.email || "", l.contact.phone || "", JSON.stringify(l.data), l.createdAt].join(",")
      )
      const csv = [headers.join(","), ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "zanzibaba-leads.csv"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const tabs = [
    {
      id: "all",
      label: `All (${leads.length})`,
      content: null,
    },
    {
      id: "rfq",
      label: `RFQ (${leads.filter((l) => l.type === "rfq").length})`,
      content: null,
    },
    {
      id: "contact",
      label: `Contact (${leads.filter((l) => l.type === "contact").length})`,
      content: null,
    },
    {
      id: "supplier-inquiry",
      label: `Supplier Inquiry (${leads.filter((l) => l.type === "supplier-inquiry").length})`,
      content: null,
    },
    {
      id: "quote-request",
      label: `Quote Request (${leads.filter((l) => l.type === "quote-request").length})`,
      content: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-sm text-gray-500">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} captured
          </p>
        </div>
        <Button onClick={handleExportCSV} disabled={leads.length === 0}>
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={tabs}
              defaultTab="all"
              onChange={(id) => setActiveFilter(id)}
            />
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
                <Inbox className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || activeFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "Leads will appear here once they are captured from your marketplace."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Source</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Contact</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Data</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5">
                        <Badge variant={typeVariants[lead.type] || "default"}>
                          {typeLabels[lead.type] || lead.type}
                        </Badge>
                      </td>
                      <td className="max-w-[200px] truncate px-5 py-3.5 text-gray-600">
                        <a
                          href={lead.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zanzibar-600 hover:underline"
                        >
                          {lead.source.replace(/^https?:\/\//, "").slice(0, 40)}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          {lead.contact.name && (
                            <span className="inline-flex items-center gap-1 text-gray-900">
                              <User className="h-3 w-3 text-gray-400" /> {lead.contact.name}
                            </span>
                          )}
                          {lead.contact.email && (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              <Mail className="h-3 w-3 text-gray-400" /> {lead.contact.email}
                            </span>
                          )}
                          {lead.contact.phone && (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              <Phone className="h-3 w-3 text-gray-400" /> {lead.contact.phone}
                            </span>
                          )}
                          {!lead.contact.name && !lead.contact.email && !lead.contact.phone && (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="max-w-[180px] truncate px-5 py-3.5 text-gray-600">
                        {Object.keys(lead.data).length > 0
                          ? Object.entries(lead.data)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-gray-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(lead, null, 2))
                          }}
                        >
                          Copy
                        </Button>
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
