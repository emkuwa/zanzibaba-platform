"use client"

import { useState } from "react"
import { Target, Loader2, ExternalLink, FileText, ArrowRight } from "lucide-react"

interface OpportunityMatchingSectionProps {
  supplierId: string
  companyName: string
}

export function OpportunityMatchingSection({ supplierId, companyName }: OpportunityMatchingSectionProps) {
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<any>(null)

  async function findOpportunities() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/opportunity-matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId }),
      })
      const data = await res.json()
      setMatches(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={findOpportunities}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-medium text-zanzibar-700 bg-zanzibar-50 hover:bg-zanzibar-100 border border-zanzibar-200 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
        Find Matching Opportunities
      </button>

      {matches && (
        <div className="space-y-3">
          {matches.matches?.summary && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-800">{matches.matches.summary}</p>
            </div>
          )}

          {(matches.projects || []).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Matching Projects ({matches.projects.length})
              </h4>
              <div className="space-y-2">
                {matches.projects.map((p: any) => (
                  <a
                    key={p.projectId || p.id}
                    href={`/projects/${p.slug}`}
                    className="block bg-white rounded-xl p-3 border border-gray-200 hover:border-zanzibar-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {p.category} {p.location && `• ${p.location}`} {p.budget && `• $${p.budget}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        {p.matchScore}% match
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{p.matchReason}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {(matches.matches?.matchedRFQs || []).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Matching RFQs
              </h4>
              <div className="space-y-2">
                {matches.matches.matchedRFQs.map((rfq: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{rfq.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {rfq.category} {rfq.deliveryLocation && `• ${rfq.deliveryLocation}`}
                    </p>
                    <p className="text-xs mt-1">{rfq.matchReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!matches.projects?.length && !matches.matches?.matchedRFQs?.length) && (
            <p className="text-sm text-gray-500 text-center py-4">
              No matching opportunities found yet. Check back as new projects and RFQs are posted.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
