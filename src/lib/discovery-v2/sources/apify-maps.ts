import type { DiscoveryV2Lead, DiscoverySourceV2 } from "../types"
import { getCategoryLabel, exportEvidenceKeywords, manufacturerKeywords } from "../types"
import { isApifyEnabled, runApifyActor } from "@/lib/discovery-social/apify-client"

const GOOGLE_MAPS_ACTOR = "apify~google-maps-scraper"

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

function resultToLead(
  result: any,
  country: string,
  category: string
): DiscoveryV2Lead | null {
  const name = result.companyName || result.name || result.title || ""
  if (!name) return null

  const description = result.description || result.about || result.category || ""
  const hasWebsite = !!(result.website || result.domain)
  const hasEmail = !!result.email
  const exportEv = hasExportEvidence(name, description + " " + (result.category || ""))
  const mfrEv = hasManufacturerEvidence(name, description + " " + (result.category || ""))
  const phone = result.phone || result.phoneNumber || result.telephone || undefined
  const website = result.website || result.domain || undefined
  const city = result.city || result.address?.split(",")[0]?.trim() || result.locality || ""

  const lead: DiscoveryV2Lead = {
    companyName: name,
    website,
    email: result.email || undefined,
    phone,
    country,
    city: city || country,
    description: description || `${name} — supplier in ${country}`,
    category,
    categoryLabel: getCategoryLabel(category),
    source: "apify-maps",
    trustScore: result.totalScore || result.trustScore || result.rating ? Math.round(Math.min((result.rating || 0) * 20, 100)) : 50,
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

export async function discoverViaApifyMaps(
  queries: string[],
  country: string,
  category: string
): Promise<DiscoveryV2Lead[]> {
  if (!isApifyEnabled()) {
    console.warn("[V2 Apify Maps] Apify not configured")
    return []
  }

  const allLeads: DiscoveryV2Lead[] = []
  const seen = new Set<string>()

  for (const query of queries) {
    const searchString = `${query} ${country}`

    try {
      const results: any[] = await runApifyActor(GOOGLE_MAPS_ACTOR, {
        searchStrings: [searchString],
        maxCrawledPlaces: 10,
        maxResults: 10,
      })

      for (const result of results) {
        const lead = resultToLead(result, country, category)
        if (!lead) continue
        const key = lead.companyName.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          allLeads.push(lead)
        }
      }
    } catch (err) {
      console.warn(`[V2 Apify Maps] Error for "${searchString}":`, err)
    }
  }

  return allLeads
}
