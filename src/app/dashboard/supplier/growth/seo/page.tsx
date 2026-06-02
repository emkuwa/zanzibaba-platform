"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import {
  Search, Sparkles, Loader2, CheckCircle, FileText, HelpCircle,
  Lightbulb, Copy, Check
} from "lucide-react"
import type { SEOContent } from "@/lib/ai-growth/types"

export default function SEOAssistantPage() {
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [seo, setSeo] = useState<SEOContent | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  async function handleGenerate() {
    if (!companyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/seo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, products: products.split("\n").filter(l => l.trim()), location, description }),
      })
      setSeo(await res.json())
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">AI SEO Growth Assistant</h2><p className="text-sm text-gray-500">Generate SEO-optimized content to help your business rank on Google.</p></div>

      {!seo ? (
        <Card><CardContent className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Name *" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Zanzibar" />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Products/Services</label><textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="List your products..." value={products} onChange={e => setProducts(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={2} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" value={description} onChange={e => setDescription(e.target.value)} /></div>
          <Button onClick={handleGenerate} disabled={!companyName || loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Search className="mr-2 h-4 w-4" /> Generate SEO Content</>}</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><h3 className="font-semibold text-gray-900">SEO Content Generated</h3></div>
            <Button variant="outline" size="sm" onClick={() => setSeo(null)}><Sparkles className="mr-1.5 h-4 w-4" /> New</Button>
          </div>

          <Tabs tabs={[
            { id: "cat-pages", label: `Category Pages (${seo.categoryPages.length})`, content: <div className="space-y-2 pt-2">{seo.categoryPages.map((p, i) => <Card key={i}><CardContent className="p-4"><p className="font-semibold text-gray-900 text-sm">{p.title}</p><p className="text-xs text-gray-600 mt-1">{p.content?.substring(0, 120)}...</p><p className="text-xs text-zanzibar-600 mt-1">/{p.slug} · meta: {p.metaDescription?.substring(0, 60)}...</p></CardContent></Card>)}</div> },
            { id: "blog", label: `Blog (${seo.blogArticles.length})`, content: <div className="space-y-2 pt-2">{seo.blogArticles.map((a, i) => <Card key={i}><CardContent className="p-4"><p className="font-semibold text-gray-900 text-sm">{a.title}</p><p className="text-xs text-gray-500 mt-1">{a.excerpt}</p><p className="text-xs text-gray-400 mt-1">/{a.slug} · Keywords: {a.keywords?.join(", ")}</p></CardContent></Card>)}</div> },
            { id: "faqs", label: `FAQs (${seo.faqs.length})`, content: <div className="space-y-2 pt-2">{seo.faqs.map((f, i) => <details key={i} className="rounded-lg border"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-900">{f.question}</summary><div className="border-t px-4 py-3 text-sm text-gray-600">{f.answer}</div></details>)}</div> },
            { id: "keywords", label: `Keywords (${seo.keywordSuggestions.length})`, content: <div className="pt-2 grid gap-2 sm:grid-cols-2">{seo.keywordSuggestions.map((k, i) => <Card key={i}><CardContent className="p-3 flex items-center justify-between"><div><p className="font-medium text-sm text-gray-900">{k.keyword}</p><p className="text-xs text-gray-500">Vol: {k.volume} · Diff: {k.difficulty}</p></div><Lightbulb className="h-4 w-4 text-yellow-500" /></CardContent></Card>)}</div> },
          ]} />
        </div>
      )}
    </div>
  )
}
