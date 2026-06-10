"use client"

import { useState } from "react"
import { Sparkles, Loader2, Check, Copy } from "lucide-react"
import type { ImprovedProfileData } from "@/lib/ai/improve-profile"

interface ImproveProfileButtonProps {
  companyName: string
  currentDescription?: string | null
  website?: string | null
  country?: string | null
}

export function ImproveProfileButton({
  companyName,
  currentDescription,
  website,
  country,
}: ImproveProfileButtonProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImprovedProfileData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/improve-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, description: currentDescription, website, country }),
      })
      const data = await res.json()
      setResult(data.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-medium text-zanzibar-700 bg-zanzibar-50 hover:bg-zanzibar-100 border border-zanzibar-200 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Improve My Profile with AI
      </button>

      {result && (
        <div className="bg-gradient-to-br from-zanzibar-50 to-purple-50 rounded-xl p-4 border border-zanzibar-200 space-y-3">
          <Section label="Tagline" text={result.tagline} onCopy={() => copy(result.tagline, "tagline")} copied={copied === "tagline"} />
          <Section label="SEO Description" text={result.seoDescription} onCopy={() => copy(result.seoDescription, "seo")} copied={copied === "seo"} />
          <Section label="Company Description" text={result.companyDescription} onCopy={() => copy(result.companyDescription, "desc")} copied={copied === "desc"} />
          <div>
            <Label>Keywords</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.keywords.map((k) => (
                <span key={k} className="bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <Label>Services</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.services.map((s) => (
                <span key={s} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <Label>Suggested Categories</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.suggestedCategories.map((c) => (
                <span key={c} className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full border border-purple-200">{c}</span>
              ))}
            </div>
          </div>
          <button className="w-full bg-zanzibar-600 hover:bg-zanzibar-700 text-white py-2 rounded-xl text-sm font-medium transition-colors">
            Apply All to Profile
          </button>
        </div>
      )}
    </div>
  )
}

function Label({ children }: { children: string }) {
  return <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{children}</p>
}

function Section({ label, text, onCopy, copied }: { label: string; text: string; onCopy: () => void; copied: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-start gap-2 mt-1">
        <p className="text-sm text-gray-700 flex-1">{text}</p>
        <button onClick={onCopy} className="p-1 hover:bg-white rounded shrink-0 mt-0.5">
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
        </button>
      </div>
    </div>
  )
}
