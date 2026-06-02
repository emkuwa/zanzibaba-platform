"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  UserCircle, Sparkles, Check, CheckCircle, Copy, Eye, FileText,
  Target, Tags, Building2, Award, Rocket, Loader2, Globe, MessageCircle
} from "lucide-react"
import type { ProfileDraft } from "@/lib/ai-growth/types"

export default function ProfileGeneratorPage() {
  const [companyName, setCompanyName] = useState("")
  const [website, setWebsite] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [products, setProducts] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<ProfileDraft | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!companyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, website, whatsapp,
          products: products.split("\n").filter(l => l.trim()),
          location, description
        }),
      })
      const data = await res.json()
      setDraft(data.profile)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">AI Supplier Profile Generator</h2>
        <p className="text-sm text-gray-500">Enter your company details and get a complete marketplace-ready profile with SEO, keywords, and categories.</p>
      </div>

      {!draft ? (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Company Name *" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Zanzibar Building Supplies Ltd" />
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Stone Town, Zanzibar" />
              <Input label="Website URL" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" />
              <Input label="WhatsApp Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+255 7XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services (one per line)</label>
              <textarea rows={4} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Portland Cement 42.5N&#10;Steel Rebar 16mm&#10;Ceramic Floor Tiles" value={products} onChange={e => setProducts(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Tell us about your company, what makes you different..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={!companyName || loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Profile</>}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zanzibar-200">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><h3 className="font-semibold text-gray-900">Profile Generated</h3></div>
              <Badge variant="success" className="text-xs"><Sparkles className="mr-1 h-3 w-3" /> AI Generated</Badge>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Company</p>
              <p className="text-lg font-bold text-gray-900">{draft.companyName}</p>
              <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 mt-1">{draft.tagline}</span>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1"><FileText className="inline h-3 w-3 mr-1" /> Company Overview</p>
              <p className="text-sm text-gray-700">{draft.companyOverview}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1"><Building2 className="inline h-3 w-3 mr-1" /> About Us</p>
              <p className="text-sm text-gray-700">{draft.aboutUs}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1"><Award className="inline h-3 w-3 mr-1" /> Our Mission</p>
              <p className="text-sm text-gray-700">{draft.mission}</p>
            </div>

            <div className="rounded-lg bg-zanzibar-50 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-zanzibar-700">SEO Meta Description</p>
                <button onClick={() => { navigator.clipboard.writeText(draft.seoDescription); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="text-xs text-zanzibar-600 hover:text-zanzibar-800">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}</button>
              </div>
              <p className="text-sm text-zanzibar-800">{draft.seoDescription}</p>
              <p className="mt-1 text-xs text-zanzibar-500">{draft.seoDescription.length} / 160 chars</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5"><Tags className="inline h-3 w-3 mr-1" /> Categories</p>
              <div className="flex flex-wrap gap-1.5">{draft.categories.map(c => <Badge key={c.slug} variant="secondary" className="text-xs">{c.name}</Badge>)}</div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5"><Target className="inline h-3 w-3 mr-1" /> Keywords ({draft.keywords.length})</p>
              <div className="flex flex-wrap gap-1.5">{draft.keywords.map(k => <span key={k} className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{k}</span>)}</div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1"><UserCircle className="inline h-3 w-3 mr-1" /> Profile Summary</p>
              <p className="text-sm text-gray-700">{draft.profileSummary}</p>
            </div>

            <Separator />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => setDraft(null)}><Sparkles className="mr-1.5 h-4 w-4" /> Regenerate</Button>
              <Button size="sm"><Eye className="mr-1.5 h-4 w-4" /> Preview Profile</Button>
              <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white"><Rocket className="mr-1.5 h-4 w-4" /> Publish Profile</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
