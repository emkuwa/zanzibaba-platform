"use client"

import { useState, useCallback } from "react"
import {
  Mail, Eye, Send, Search, Filter, ChevronDown, Check, Copy, X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { emailTemplateMeta } from "@/lib/email/templates"

const categoryColors: Record<string, "default" | "success" | "warning" | "danger"> = {
  Supplier: "default",
  Buyer: "success",
  Contractor: "warning",
}

const sampleParams: Record<string, Record<string, string>> = {
  supplierWelcome: { name: "John", email: "john@example.com", dashboardLink: "/dashboard/supplier" },
  supplierProfileReminder: { name: "John", daysSinceSignup: "3", profileLink: "/dashboard/supplier/profile" },
  supplierVerificationInvite: { name: "John", verificationLink: "/dashboard/supplier/verification" },
  supplierMembershipUpgrade: { name: "John", currentPlan: "Free", upgradeLink: "/dashboard/supplier/membership" },
  buyerRFQConfirmation: { name: "Sarah", rfqTitle: "Cement Supply for Resort", rfqId: "RFQ-2024-0050" },
  buyerQuoteReceived: { name: "Sarah", rfqTitle: "Cement Supply for Resort", quoteCount: "3", dashboardLink: "/dashboard/buyer/quotes" },
  buyerSupplierRecommendation: { name: "Sarah", category: "Cement & Binders", supplierCount: "12", supplierLink: "/suppliers" },
  contractorWelcome: { name: "David", dashboardLink: "/dashboard/contractor" },
  contractorVerificationInvite: { name: "David", verificationLink: "/dashboard/contractor/verification" },
  contractorLeadNotification: { name: "David", projectTitle: "Villa Construction - Stone Town", budget: "$120,000 - $150,000", leadLink: "/dashboard/contractor/leads" },
}

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const [sending, setSending] = useState<string | null>(null)
  const [sendEmail, setSendEmail] = useState("")
  const [sendResult, setSendResult] = useState<{ template: string; success: boolean } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const entries = Object.entries(emailTemplateMeta)
    .filter(([key]) => {
      if (search && !key.toLowerCase().includes(search.toLowerCase()) &&
          !emailTemplateMeta[key].name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && emailTemplateMeta[key].category !== categoryFilter) return false
      return true
    })

  const handlePreview = useCallback((key: string) => {
    setPreviewTemplate(key)
    setPreviewHtml("Loading...")
    const params = sampleParams[key] || {}
      import("@/lib/email/templates").then((mod) => {
      const fn = (mod as unknown as Record<string, Function>)[key]
      if (fn) {
        setPreviewHtml(fn(params))
      } else {
        setPreviewHtml("<p>Template function not found</p>")
      }
    })
  }, [])

  const handleSendTest = useCallback(async (key: string) => {
    if (!sendEmail) return
    setSending(key)
    setSendResult(null)
    try {
      const params = sampleParams[key] || {}
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: sendEmail, template: key, params }),
      })
      const data = await res.json()
      setSendResult({ template: key, success: data.success })
    } catch {
      setSendResult({ template: key, success: false })
    } finally {
      setSending(null)
    }
  }, [sendEmail])

  const handleCopyParams = useCallback((key: string) => {
    const meta = emailTemplateMeta[key]
    const paramsList = meta.params.map((p) => `  ${p}: "value"`).join(",\n")
    const code = `{\n${paramsList}\n}`
    navigator.clipboard.writeText(code)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-gray-500">Manage and preview email notification templates</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
              value={categoryFilter || ""}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
            >
              <option value="">All Categories</option>
              <option value="Supplier">Supplier</option>
              <option value="Buyer">Buyer</option>
              <option value="Contractor">Contractor</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Your email to test..."
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, meta]) => (
          <Card key={key} className="group transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{meta.name}</CardTitle>
                  <p className="text-sm text-gray-500">{meta.description}</p>
                </div>
                <Badge variant={categoryColors[meta.category] || "default"}>
                  {meta.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Separator />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {meta.params.map((p) => (
                    <code key={p} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 font-mono">
                      {`{${p}}`}
                    </code>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 flex-1"
                  onClick={() => handlePreview(key)}
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 flex-1"
                  onClick={() => handleCopyParams(key)}
                >
                  {copied === key ? (
                    <><Check className="h-3.5 w-3.5 text-green-600" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Params</>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 flex-1"
                  disabled={!sendEmail || sending === key}
                  onClick={() => handleSendTest(key)}
                >
                  <Send className="h-3.5 w-3.5" />
                  {sending === key ? "Sending..." : "Send Test"}
                </Button>
              </div>
              {sendResult && sendResult.template === key && (
                <p className={cn("text-xs", sendResult.success ? "text-green-600" : "text-red-600")}>
                  {sendResult.success ? "✓ Test email sent" : "✗ Failed to send"}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Mail className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium">No templates found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {emailTemplateMeta[previewTemplate]?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {emailTemplateMeta[previewTemplate]?.category} template preview
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewTemplate(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <iframe
                srcDoc={previewHtml}
                className="w-full rounded-lg border border-gray-200"
                style={{ height: "600px" }}
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
