import type { DiscoveryV2Lead, DiscoverySourceV2 } from "../types"
import { getCategoryLabel, exportEvidenceKeywords, manufacturerKeywords } from "../types"

const PLACES_API_BASE = "https://places.googleapis.com/v1/places:searchText"

function getApiKey(): string | null {
  return process.env.GOOGLE_MAPS_API_KEY || null
}

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

interface GooglePlaceV1 {
  displayName?: { text: string }
  formattedAddress?: string
  websiteUri?: string
  nationalPhoneNumber?: string
  rating?: number
  userRatingCount?: number
  businessStatus?: string
  editorialSummary?: { text: string }
  regularOpeningHours?: { openNow?: boolean }
  plusCode?: { compoundCode?: string }
  addressComponents?: Array<{ longText: string; shortText: string; types: string[] }>
  internationalPhoneNumber?: string
}

function placeToLead(
  place: GooglePlaceV1,
  country: string,
  category: string,
  source: DiscoverySourceV2
): DiscoveryV2Lead | null {
  const name = place.displayName?.text?.trim()
  if (!name) return null

  const city = (place.addressComponents || [])
    .filter((c) => c?.types?.includes("locality"))
    .map((c) => c?.longText || "")
    .join(", ") || ""

  const description = [
    place.editorialSummary?.text,
    place.businessStatus === "OPERATIONAL" ? "Active business" : undefined,
    place.rating ? `Rating: ${place.rating}/5 (${place.userRatingCount || 0} reviews)` : undefined,
  ]
    .filter(Boolean)
    .join(". ")

  const hasWebsite = !!place.websiteUri
  const hasEmail = false
  const exportEv = hasExportEvidence(name, description)
  const mfrEv = hasManufacturerEvidence(name, description)

  const lead: DiscoveryV2Lead = {
    companyName: name,
    website: place.websiteUri || undefined,
    phone: place.nationalPhoneNumber || place.internationalPhoneNumber || undefined,
    country,
    city: city || country,
    description: description || `${name} — supplier in ${city || country}`,
    category,
    categoryLabel: getCategoryLabel(category),
    source,
    trustScore: place.rating ? Math.round(Math.min(place.rating * 20, 100)) : 50,
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

const FIELDS_MASK = [
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.editorialSummary",
  "places.addressComponents",
  "places.plusCode",
].join(",")

export async function discoverViaGooglePlaces(
  queries: string[],
  country: string,
  category: string
): Promise<DiscoveryV2Lead[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn("[V2 Google Places] No API key configured")
    return []
  }

  const allLeads: DiscoveryV2Lead[] = []
  const seen = new Set<string>()

  for (const query of queries) {
    const fullQuery = `${query} in ${country}`

    try {
      const res = await fetch(PLACES_API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELDS_MASK,
        },
        body: JSON.stringify({
          textQuery: fullQuery,
          maxResultCount: 10,
        }),
      })

      if (!res.ok) {
        const errBody = await res.text().catch(() => "")
        console.warn(`[V2 Google Places] HTTP ${res.status} for "${fullQuery}": ${errBody.slice(0, 200)}`)
        continue
      }

      const data = await res.json()
      const places: GooglePlaceV1[] = data.places || []

      for (const place of places) {
        const lead = placeToLead(place, country, category, "google-places")
        if (!lead) continue
        const key = lead.companyName.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          allLeads.push(lead)
        }
      }
    } catch (err) {
      console.warn(`[V2 Google Places] Error for "${fullQuery}":`, err)
    }

    await new Promise((r) => setTimeout(r, 200))
  }

  return allLeads
}
