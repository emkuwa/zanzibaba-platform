import type { SocialLead, DiscoverySource } from "./types"

const SOURCE_WEIGHTS: Record<DiscoverySource, number> = {
  "Google Maps": 30,
  Instagram: 10,
  Facebook: 10,
  LinkedIn: 10,
  Website: 25,
}

const BONUS_WEIGHTS = {
  hasWhatsApp: 15,
  hasEmail: 5,
  hasPhone: 5,
  hasMultipleCategories: 5,
  hasDescription: 5,
  followersOver1000: 5,
  followersOver5000: 10,
}

export function computeSocialTrustScore(lead: SocialLead): {
  score: number
  breakdown: { label: string; points: number }[]
} {
  const breakdown: { label: string; points: number }[] = []
  let total = 0

  const seenSources = new Set<DiscoverySource>()
  for (const attr of lead.sourceAttributions) {
    if (!seenSources.has(attr.source)) {
      seenSources.add(attr.source)
      const points = SOURCE_WEIGHTS[attr.source] || 0
      breakdown.push({ label: attr.source, points })
      total += points
    }
  }

  const phone = lead.phone || lead.whatsapp || ""
  const hasWhatsApp = phone.includes("+255") || /^(\+?255|0)[67]\d{8}$/.test(phone.replace(/\s/g, ""))
  if (hasWhatsApp) {
    breakdown.push({ label: "WhatsApp", points: BONUS_WEIGHTS.hasWhatsApp })
    total += BONUS_WEIGHTS.hasWhatsApp
  }

  if (lead.email) {
    breakdown.push({ label: "Email", points: BONUS_WEIGHTS.hasEmail })
    total += BONUS_WEIGHTS.hasEmail
  }

  if (phone && !lead.phone?.includes("+255")) {
    breakdown.push({ label: "Phone", points: BONUS_WEIGHTS.hasPhone })
    total += BONUS_WEIGHTS.hasPhone
  }

  if (lead.description) {
    breakdown.push({ label: "Has Description", points: BONUS_WEIGHTS.hasDescription })
    total += BONUS_WEIGHTS.hasDescription
  }

  const followers = lead.followers || 0
  if (followers > 5000) {
    breakdown.push({ label: `High Followers (${followers})`, points: BONUS_WEIGHTS.followersOver5000 })
    total += BONUS_WEIGHTS.followersOver5000
  } else if (followers > 1000) {
    breakdown.push({ label: `Medium Followers (${followers})`, points: BONUS_WEIGHTS.followersOver1000 })
    total += BONUS_WEIGHTS.followersOver1000
  }

  return { score: Math.min(total, 100), breakdown }
}

export function determineTrustLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score >= 70) return "HIGH"
  if (score >= 40) return "MEDIUM"
  return "LOW"
}
