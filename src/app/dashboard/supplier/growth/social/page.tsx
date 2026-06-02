"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Share2, Sparkles, Loader2, Calendar, CheckCircle, Edit3
} from "lucide-react"
import type { SocialCalendar, SocialPost } from "@/lib/ai-growth/types"

const platformIcons: Record<string, string> = { facebook: "FB", instagram: "IG", linkedin: "LI" }
const platformColors: Record<string, string> = { facebook: "bg-blue-100 text-blue-700", instagram: "bg-pink-100 text-pink-700", linkedin: "bg-blue-100 text-blue-700" }

export default function SocialContentPage() {
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState("")
  const [weeks, setWeeks] = useState("1")
  const [campaign, setCampaign] = useState("")
  const [loading, setLoading] = useState(false)
  const [calendars, setCalendars] = useState<SocialCalendar[] | null>(null)

  async function handleGenerate() {
    if (!companyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai-growth/social", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, products: products.split("\n").filter(l => l.trim()), weeks: parseInt(weeks) || 1, campaign }),
      })
      const data = await res.json()
      setCalendars(data.calendars)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">AI Social Media Content Generator</h2><p className="text-sm text-gray-500">Generate engaging social media content for Facebook, Instagram, and LinkedIn.</p></div>

      {!calendars ? (
        <Card><CardContent className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Name *" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your company name" />
            <Select label="Content Duration" options={[{ value: "1", label: "1 Week" }, { value: "2", label: "2 Weeks" }, { value: "4", label: "1 Month" }]} value={weeks} onChange={e => setWeeks(e.target.value)} />
          </div>
          <Input label="Campaign Theme (optional)" value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="e.g. New Product Launch, Ramadan Promotion" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Products/Services</label><textarea rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="List your products..." value={products} onChange={e => setProducts(e.target.value)} /></div>
          <Button onClick={handleGenerate} disabled={!companyName || loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Content Calendar</>}</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {calendars.map((cal, wi) => (
            <Card key={wi}><CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-zanzibar-600" /><h3 className="font-semibold text-sm text-gray-900">Week of {cal.weekStart}</h3><Badge variant="secondary" className="text-xs">{cal.theme}</Badge></div>
                <Badge variant="success" className="text-xs"><CheckCircle className="mr-1 h-3 w-3" /> {cal.posts.length} posts</Badge>
              </div>
              <div className="space-y-2">
                {cal.posts.map((post, pi) => (
                  <div key={pi} className="flex items-start gap-3 rounded-lg border p-3">
                    <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${platformColors[post.platform]}`}>{platformIcons[post.platform]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-900">{post.title}</p><Badge variant="secondary" className="text-[10px]">{post.type}</Badge></div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                      {post.hashtags.length > 0 && <p className="text-xs text-zanzibar-600 mt-1">{post.hashtags.map(h => `#${h}`).join(" ")}</p>}
                      <p className="text-xs text-gray-400 mt-1">Scheduled: {post.scheduledDate} · Status: <span className="capitalize">{post.status}</span></p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-7"><Edit3 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          ))}
          <Button variant="outline" onClick={() => setCalendars(null)} className="w-full"><Sparkles className="mr-1.5 h-4 w-4" /> Generate New Calendar</Button>
        </div>
      )}
    </div>
  )
}
