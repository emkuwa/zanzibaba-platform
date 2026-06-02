"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Globe, Sparkles, CheckCircle, Loader2, ExternalLink, Smartphone,
  Monitor, Check, Rocket
} from "lucide-react"
import type { MiniWebsite } from "@/lib/ai-growth/types"

export default function WebsiteGeneratorPage() {
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [site, setSite] = useState<MiniWebsite | null>(null)
  const [published, setPublished] = useState(false)

  async function handleGenerate() {
    if (!companyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/website", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, products: products.split("\n").filter(l => l.trim()), location, description }),
      })
      const data = await res.json()
      setSite(data.site)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">AI Mini Website Generator</h2>
        <p className="text-sm text-gray-500">Generate a complete 5-page supplier website — mobile-first, professional, and industry-specific.</p>
      </div>

      {!site ? (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Company Name *" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your company name" />
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Zanzibar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services (one per line)</label>
              <textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Portland Cement&#10;Steel Rebar&#10;Ceramic Tiles" value={products} onChange={e => setProducts(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Describe your company..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={!companyName || loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Website...</> : <><Globe className="mr-2 h-4 w-4" /> Generate Website</>}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-zanzibar-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><h3 className="font-semibold text-gray-900">{site.companyName} Website</h3></div>
                <Badge variant="warning" className="text-xs"><Sparkles className="mr-1 h-3 w-3" /> AI Generated</Badge>
              </div>

              {/* URL Preview */}
              <div className="rounded-lg bg-gray-50 p-3 mb-4">
                <p className="text-xs text-gray-400 mb-1">Your website URL</p>
                <p className="text-sm font-mono text-zanzibar-600">{site.slug}.zanzibaba.com</p>
              </div>

              {/* Pages Preview */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">🏠 Home</p>
                  <p className="text-xs text-gray-500">{site.pages.home.headline}</p>
                  <p className="text-xs text-gray-400 mt-1">{site.pages.home.subheadline?.substring(0, 60)}...</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">👥 About</p>
                  <p className="text-xs text-gray-500">{site.pages.about.content?.substring(0, 80)}...</p>
                  {site.pages.about.values?.length > 0 && <p className="text-xs text-gray-400 mt-1">{site.pages.about.values.length} core values</p>}
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">📦 Products</p>
                  <p className="text-xs text-gray-500">{site.pages.products.items.length} products listed</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">🔨 Projects</p>
                  <p className="text-xs text-gray-500">{site.pages.projects.items.length} projects showcased</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">📞 Contact</p>
                  <p className="text-xs text-gray-500">{site.pages.contact.address || "Contact info ready"}</p>
                </div>
              </div>

              {/* SEO Metadata */}
              <div className="mt-4 rounded-lg bg-zanzibar-50 p-3">
                <p className="text-xs font-medium text-zanzibar-700 mb-1">SEO Metadata</p>
                <p className="text-sm text-zanzibar-800">Title: {site.seo.title}</p>
                <p className="text-sm text-zanzibar-700">Description: {site.seo.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-4 border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => setSite(null)}><Sparkles className="mr-1.5 h-4 w-4" /> Regenerate</Button>
                <Button variant="outline" size="sm"><Monitor className="mr-1.5 h-4 w-4" /> Preview</Button>
                {published ? (
                  <Badge variant="success" className="text-xs"><Check className="mr-1 h-3 w-3" /> Published at {site.slug}.zanzibaba.com</Badge>
                ) : (
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white" onClick={() => { setPublished(true); setTimeout(() => setPublished(false), 3000) }}>
                    <Rocket className="mr-1.5 h-4 w-4" /> Publish Website
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
