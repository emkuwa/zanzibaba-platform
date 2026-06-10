import type { DiscoveryV2Lead, DiscoverySourceV2 } from "../types"
import { getCategoryLabel, exportEvidenceKeywords, manufacturerKeywords } from "../types"
import { isApifyEnabled, runApifyActor } from "@/lib/discovery-social/apify-client"

const GOOGLE_SEARCH_ACTOR = "apify~google-search-scraper"

function computeValueScore(lead: Partial<DiscoveryV2Lead>): number {
  let score = 0
  if (lead.hasWebsite) score += 25
  if (lead.hasEmail) score += 25
  if (lead.hasExportEvidence) score += 20
  if (lead.isManufacturer) score += 15
  if (lead.isStrategicCategory) score += 15
  return score
}

function hasExportEvidence(name: string, description: string): boolean {
  const text = `${name} ${description}`.toLowerCase()
  return exportEvidenceKeywords().some((kw) => text.includes(kw))
}

function hasManufacturerEvidence(name: string, description: string): boolean {
  const text = `${name} ${description}`.toLowerCase()
  return manufacturerKeywords().some((kw) => text.includes(kw))
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match ? match[0] : undefined
}

function resultToLead(
  result: any,
  country: string,
  category: string
): DiscoveryV2Lead | null {
  const name = result.title || result.name || ""
  if (!name) return null

  const snippet = result.description || result.snippet || ""
  const link = result.url || result.link || ""

  const hasWebsite = !!link
  const email = result.email || extractEmail(snippet)
  const hasEmail = !!email
  const exportEv = hasExportEvidence(name, snippet)
  const mfrEv = hasManufacturerEvidence(name, snippet)

  const lead: DiscoveryV2Lead = {
    companyName: name.replace(/\s*\|\s*.*$/, "").replace(/\s*-\s*.*$/, "").trim(),
    website: link || undefined,
    email: email || undefined,
    phone: result.phone || undefined,
    country,
    city: result.city || "",
    description: snippet || `${name} — discovered via web search`,
    category,
    categoryLabel: getCategoryLabel(category),
    source: "apify-web",
    trustScore: 50,
    valueScore: 0,
    hasWebsite,
    hasEmail,
    hasExportEvidence: exportEv,
    isManufacturer: mfrEv,
    isStrategicCategory: true,
  }
  lead.valueScore = computeValueScore(lead)
  return lead
}

export async function discoverViaApifyWeb(
  queries: string[],
  country: string,
  category: string
): Promise<DiscoveryV2Lead[]> {
  if (!isApifyEnabled()) {
    console.warn("[V2 Apify Web] Apify not configured")
    return []
  }

  const allLeads: DiscoveryV2Lead[] = []
  const seen = new Set<string>()

  for (const query of queries) {
    const searchQuery = `${query} in ${country}`

    try {
      const results: any[] = await runApifyActor(GOOGLE_SEARCH_ACTOR, {
        queries: searchQuery,
        maxPagesPerQuery: 1,
        resultsPerPage: 10,
      })

      for (const result of results) {
        const organicResults = result.organicResults || result.organic || []
        for (const item of organicResults) {
          const lead = resultToLead(item, country, category)
          if (!lead) continue
          const key = lead.companyName.toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            allLeads.push(lead)
          }
        }
      }
    } catch (err) {
      console.warn(`[V2 Apify Web] Error for "${searchQuery}":`, err)
    }
  }

  return allLeads
}
