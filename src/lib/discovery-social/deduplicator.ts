import type { SocialLead, DiscoverySource, SourceAttribution } from "./types"

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim()
}

function normalizeUrl(url: string): string {
  if (!url) return ""
  const cleaned = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").toLowerCase().trim()
  return cleaned
}

function extractDomain(url?: string): string {
  if (!url) return ""
  return normalizeUrl(url).split("/")[0] || ""
}

interface MergeResult {
  merged: SocialLead[]
  deduplicated: number
  newCount: number
  mergedCount: number
}

function findMatch(lead: SocialLead, existing: SocialLead[]): SocialLead | null {
  const leadName = normalizeName(lead.companyName)
  const leadDomain = extractDomain(lead.website)
  const leadEmail = (lead.email || "").toLowerCase().trim()

  for (const existingLead of existing) {
    const existingName = normalizeName(existingLead.companyName)
    const existingDomain = extractDomain(existingLead.website)
    const existingEmail = (existingLead.email || "").toLowerCase().trim()

    if (leadName && existingName && leadName === existingName) return existingLead
    if (leadDomain && existingDomain && leadDomain === existingDomain) return existingLead
    if (leadEmail && existingEmail && leadEmail === existingEmail) return existingLead
  }
  return null
}

function mergeAttributions(
  existing: SourceAttribution[],
  incoming: SourceAttribution[]
): SourceAttribution[] {
  const map = new Map<string, SourceAttribution>()
  for (const attr of [...existing, ...incoming]) {
    const key = `${attr.source}::${attr.profileUrl || ""}`
    if (!map.has(key)) {
      map.set(key, attr)
    }
  }
  return Array.from(map.values())
}

export function deduplicateLeads(
  incoming: SocialLead[],
  existing: SocialLead[]
): MergeResult {
  const merged: SocialLead[] = []
  let deduplicated = 0
  let newCount = 0
  let mergedCount = 0

  for (const lead of incoming) {
    const match = findMatch(lead, merged)
    if (match) {
      match.sourceAttributions = mergeAttributions(
        match.sourceAttributions,
        lead.sourceAttributions
      )
      if (lead.instagramUrl && !match.instagramUrl) match.instagramUrl = lead.instagramUrl
      if (lead.facebookUrl && !match.facebookUrl) match.facebookUrl = lead.facebookUrl
      if (lead.linkedinUrl && !match.linkedinUrl) match.linkedinUrl = lead.linkedinUrl
      if (lead.website && !match.website) match.website = lead.website
      if (lead.email && !match.email) match.email = lead.email
      if (lead.phone && !match.phone) match.phone = lead.phone
      if (lead.followers && (!match.followers || lead.followers > match.followers))
        match.followers = lead.followers
      deduplicated++
      mergedCount++
    } else {
      merged.push({ ...lead })
      newCount++
    }
  }

  return { merged, deduplicated, newCount, mergedCount }
}

export function deduplicateWithExisting(
  socialLeads: SocialLead[],
  existingLeads: { companyName?: string | null; website?: string | null; email?: string | null }[]
): { socialLeads: SocialLead[]; matchedExisting: number } {
  const matchedExisting: SocialLead[] = []
  const unmatched: SocialLead[] = []

  for (const lead of socialLeads) {
    const leadName = normalizeName(lead.companyName)
    const leadDomain = extractDomain(lead.website)
    const leadEmail = (lead.email || "").toLowerCase().trim()

    let found = false
    for (const existing of existingLeads) {
      const existingName = normalizeName(existing.companyName || "")
      const existingDomain = extractDomain(existing.website || "")
      const existingEmail = (existing.email || "").toLowerCase().trim()

      if (
        (leadName && existingName && leadName === existingName) ||
        (leadDomain && existingDomain && leadDomain === existingDomain) ||
        (leadEmail && existingEmail && leadEmail === existingEmail)
      ) {
        found = true
        break
      }
    }

    if (found) {
      matchedExisting.push(lead)
    } else {
      unmatched.push(lead)
    }
  }

  return { socialLeads: unmatched, matchedExisting: matchedExisting.length }
}
