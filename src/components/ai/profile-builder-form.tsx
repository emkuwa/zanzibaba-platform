"use client"

import { useState } from "react"
import { Globe, Loader2, Building2, Tags, Mail, Phone, Camera } from "lucide-react"

export function ProfileBuilderForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  async function extractProfile() {
    if (!url.trim()) return
    setLoading(true)
    setError("")
    setData(null)

    try {
      const res = await fetch("/api/ai/profile-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const result = await res.json()
      if (result.data) setData(result.data)
      else setError(result.error || "Failed to extract")
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL (e.g. https://yourcompany.com)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-400"
            onKeyDown={(e) => e.key === "Enter" && extractProfile()}
          />
        </div>
        <button
          onClick={extractProfile}
          disabled={loading || !url.trim()}
          className="bg-zanzibar-600 hover:bg-zanzibar-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {data && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
          <div className="flex items-center gap-2 text-sm font-medium text-zanzibar-700">
            <Camera className="h-4 w-4" />
            Logo {data.logoUrl && <span className="text-green-600">found</span>}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Building2 className="h-4 w-4" />
              Description
            </div>
            <p className="text-sm text-gray-600">{data.description || "Not found"}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Tags className="h-4 w-4" />
              Categories
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(data.categories || []).map((c: string) => (
                <span key={c} className="bg-zanzibar-50 text-zanzibar-700 text-xs px-2.5 py-1 rounded-full border border-zanzibar-200">{c}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="text-sm text-gray-600">{data.email || "Not found"}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4" />
                Phone
              </div>
              <p className="text-sm text-gray-600">{data.phone || "Not found"}</p>
            </div>
          </div>

          <button className="w-full bg-zanzibar-600 hover:bg-zanzibar-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
            Apply to Profile
          </button>
        </div>
      )}
    </div>
  )
}
