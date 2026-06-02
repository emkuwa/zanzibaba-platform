"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  FileText, Sparkles, Loader2, CheckCircle, Download, Send,
  Copy, Check, DollarSign, Calendar, User
} from "lucide-react"
import type { QuoteDraft } from "@/lib/ai-growth/types"

export default function QuoteAssistantPage() {
  const [supplierName, setSupplierName] = useState("")
  const [clientName, setClientName] = useState("")
  const [rfqText, setRfqText] = useState("")
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<QuoteDraft | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!supplierName || !rfqText) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/quotes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqText, supplierName, clientName }),
      })
      const data = await res.json()
      setQuote(data.quote)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">AI Quote Assistant</h2><p className="text-sm text-gray-500">Create professional quotations, proposals, and cover letters from RFQs and BOQs.</p></div>

      {!quote ? (
        <Card><CardContent className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Your Company Name *" value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Your company" />
            <Input label="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client company" />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">RFQ / BOQ / Requirements *</label><textarea rows={6} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="Paste the RFQ, BOQ, or project requirements here...&#10;&#10;Example:&#10;500 bags Portland Cement 42.5N&#10;100 lengths Steel Rebar 16mm&#10;200 sqm Ceramic Floor Tiles 60x60" value={rfqText} onChange={e => setRfqText(e.target.value)} /></div>
          <Button onClick={handleGenerate} disabled={!supplierName || !rfqText || loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quote...</> : <><FileText className="mr-2 h-4 w-4" /> Generate Quote</>}</Button>
        </CardContent></Card>
      ) : (
        <Card className="border-zanzibar-200"><CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><h3 className="font-semibold text-gray-900">Quote{quote.quoteNumber ? ` #${quote.quoteNumber}` : ""}</h3></div><Badge variant="warning" className="text-xs"><Sparkles className="mr-1 h-3 w-3" /> AI Draft</Badge></div>

          <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-gray-400">Supplier</p><p className="font-medium">{quote.supplierName}</p></div><div><p className="text-xs text-gray-400">Client</p><p className="font-medium">{quote.clientName}</p></div><div><p className="text-xs text-gray-400">Date</p><p>{quote.date}</p></div><div><p className="text-xs text-gray-400">Valid Until</p><p>{quote.validUntil}</p></div></div>

          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Cover Letter</p>
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-sm text-gray-700 whitespace-pre-line">{quote.coverLetter}</p></div>
          </div>

          {quote.items.length > 0 && (
            <div><p className="text-xs text-gray-500 font-medium mb-2">Line Items</p>
              <div className="overflow-x-auto rounded-lg border"><table className="w-full text-sm"><thead><tr className="border-b bg-gray-50"><th className="px-3 py-2 text-left font-medium text-gray-500">Item</th><th className="px-3 py-2 text-right font-medium text-gray-500">Qty</th><th className="px-3 py-2 text-right font-medium text-gray-500">Unit Price</th><th className="px-3 py-2 text-right font-medium text-gray-500">Total</th></tr></thead><tbody className="divide-y">{quote.items.map((item, i) => <tr key={i}><td className="px-3 py-2 text-gray-900">{item.description}</td><td className="px-3 py-2 text-right">{item.quantity}</td><td className="px-3 py-2 text-right">{quote.currency} {item.unitPrice.toLocaleString()}</td><td className="px-3 py-2 text-right font-medium">{quote.currency} {item.total.toLocaleString()}</td></tr>)}</tbody></table></div>
            </div>
          )}

          <div className="flex justify-end border-t pt-3"><div className="text-right"><p className="text-sm text-gray-500">Subtotal: {quote.currency} {quote.subtotal.toLocaleString()}</p><p className="text-sm text-gray-500">Tax (18%): {quote.currency} {quote.tax.toLocaleString()}</p><p className="text-lg font-bold text-gray-900">Total: {quote.currency} {quote.total.toLocaleString()}</p></div></div>

          <div><p className="text-xs text-gray-500 font-medium mb-1">Terms</p><p className="text-sm text-gray-700">{quote.terms}</p></div>
          <div><p className="text-xs text-gray-500 font-medium mb-1">Delivery</p><p className="text-sm text-gray-700">{quote.deliveryInfo}</p></div>

          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setQuote(null)}><Sparkles className="mr-1.5 h-4 w-4" /> New Quote</Button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Download PDF</Button>
            <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white ml-auto"><Send className="mr-1.5 h-4 w-4" /> Send to Client</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  )
}
