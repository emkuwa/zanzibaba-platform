"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  PenTool, Sparkles, Loader2, CheckCircle, Download, FileText,
  Image, FileSpreadsheet, Copy, Check
} from "lucide-react"
import type { MarketingAsset } from "@/lib/ai-growth/types"

const assetTypes = [
  { value: "profile", label: "Company Profile" },
  { value: "brochure", label: "Product Brochure" },
  { value: "flyer", label: "Product Flyer" },
  { value: "sales-sheet", label: "Sales Sheet" },
  { value: "capability-statement", label: "Capability Statement" },
]

export default function MarketingAssetsPage() {
  const [assetType, setAssetType] = useState("profile")
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [asset, setAsset] = useState<MarketingAsset | null>(null)

  async function handleGenerate() {
    if (!companyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/marketing", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: assetType, companyName, products: products.split("\n").filter(l => l.trim()), location, description }),
      })
      const data = await res.json()
      setAsset(data.asset)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">AI Marketing Assets Generator</h2><p className="text-sm text-gray-500">Create professional brochures, flyers, and sales sheets for your business.</p></div>

      {!asset ? (
        <Card><CardContent className="p-5 space-y-4">
          <Select label="Asset Type" options={assetTypes} value={assetType} onChange={e => setAssetType(e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Name *" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Products/Services</label><textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="List products..." value={products} onChange={e => setProducts(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" value={description} onChange={e => setDescription(e.target.value)} /></div>
          <Button onClick={handleGenerate} disabled={!companyName || loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><PenTool className="mr-2 h-4 w-4" /> Generate {assetTypes.find(t => t.value === assetType)?.label || "Asset"}</>}</Button>
        </CardContent></Card>
      ) : (
        <Card className="border-zanzibar-200"><CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><h3 className="font-semibold text-gray-900">{asset.title}</h3></div>
            <Badge variant="warning" className="text-xs capitalize">{asset.type} <Sparkles className="ml-1 h-3 w-3" /></Badge>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-white border p-5">
            <p className="text-xl font-bold text-gray-900 mb-2">{asset.headline}</p>
            <Separator className="my-3" />
            <p className="text-sm text-gray-700 mb-4">{asset.about}</p>

            {asset.products.length > 0 && (
              <div className="mb-4"><p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Products & Services</p>
                <div className="grid gap-2 sm:grid-cols-2">{asset.products.map((p, i) => <div key={i} className="rounded-lg border bg-white p-2.5"><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.description}</p></div>)}</div>
              </div>
            )}

            {asset.achievements.length > 0 && (
              <div className="mb-4"><p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Key Achievements</p>
                <div className="flex flex-wrap gap-2">{asset.achievements.map((a, i) => <span key={i} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">✓ {a}</span>)}</div>
              </div>
            )}

            <Separator className="my-3" />
            <p className="text-sm font-semibold text-zanzibar-600">{asset.cta}</p>
          </div>

          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setAsset(null)}><Sparkles className="mr-1.5 h-4 w-4" /> New Asset</Button>
            <Button variant="outline" size="sm"><FileText className="mr-1.5 h-4 w-4" /> Export PDF</Button>
            <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export DOCX</Button>
            <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white ml-auto"><Download className="mr-1.5 h-4 w-4" /> Download</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  )
}
