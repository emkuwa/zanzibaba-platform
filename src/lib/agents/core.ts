export type LeadType = "supplier" | "contractor" | "professional" | "product" | "project"
export type TrustLevel = "LOW" | "MEDIUM" | "HIGH"
export type LeadStatus = "DISCOVERED" | "VERIFIED" | "REVIEW_PENDING" | "APPROVED" | "REJECTED" | "IMPORTED" | "MERGED"

export interface DiscoveredLeadInput {
  sourceUrl?: string
  sourcePlatform?: string
  leadType: LeadType
  companyName?: string
  contactName?: string
  email?: string
  phone?: string
  website?: string
  location?: string
  country?: string
  city?: string
  description?: string
  categorySlug?: string
  categoryLabels?: string[]
  products?: ProductRecord[]
  socialProfiles?: Record<string, string>
}

export interface ProductRecord {
  name: string
  description?: string
  price?: number
  currency?: string
  category?: string
  unit?: string
  moq?: number
}

export interface VerificationResult {
  score: number
  level: TrustLevel
  checks: TrustCheck[]
}

export interface TrustCheck {
  name: string
  passed: boolean
  score: number
  maxScore: number
  detail?: string
}

export interface ScoutConfig {
  id: string
  name: string
  type: string
  config: Record<string, unknown>
}

export interface DuplicateCheck {
  isDuplicate: boolean
  score: number
  matchedField?: string
  matchedValue?: string
  existingId?: string
}

export interface OutreachMessage {
  channel: "email" | "whatsapp"
  subject?: string
  body: string
  personalizedFields: Record<string, string>
}

const TRUST_WEIGHTS = {
  websiteExists: { weight: 15, label: "Website Active" },
  websiteProfessional: { weight: 10, label: "Website Professional" },
  emailDeliverable: { weight: 20, label: "Email Deliverable" },
  phoneReachable: { weight: 15, label: "Phone Reachable" },
  socialPresence: { weight: 10, label: "Social Media Presence" },
  businessRegistration: { weight: 15, label: "Business Registration" },
  onlineReviews: { weight: 10, label: "Online Reviews" },
  yearsInBusiness: { weight: 5, label: "Years in Business" },
}

export function calculateTrustScore(checks: Partial<Record<keyof typeof TRUST_WEIGHTS, boolean>>): VerificationResult {
  const results: TrustCheck[] = []
  let totalScore = 0
  let totalMax = 0

  for (const [key, config] of Object.entries(TRUST_WEIGHTS)) {
    const passed = checks[key as keyof typeof checks] ?? false
    results.push({
      name: config.label,
      passed,
      score: passed ? config.weight : 0,
      maxScore: config.weight,
      detail: passed ? "Verified" : "Not verified",
    })
    totalScore += passed ? config.weight : 0
    totalMax += config.weight
  }

  const normalizedScore = Math.round((totalScore / totalMax) * 100)
  const level: TrustLevel = normalizedScore >= 70 ? "HIGH" : normalizedScore >= 40 ? "MEDIUM" : "LOW"

  return { score: normalizedScore, level, checks: results }
}

export function detectDuplicate(lead: DiscoveredLeadInput, existing: DiscoveredLeadInput[]): DuplicateCheck {
  for (const existingLead of existing) {
    if (lead.email && existingLead.email && lead.email.toLowerCase() === existingLead.email.toLowerCase()) {
      return { isDuplicate: true, score: 100, matchedField: "email", matchedValue: lead.email }
    }
    if (lead.phone && existingLead.phone && lead.phone.replace(/\D/g, "") === existingLead.phone.replace(/\D/g, "")) {
      return { isDuplicate: true, score: 90, matchedField: "phone", matchedValue: lead.phone }
    }
    if (lead.website && existingLead.website) {
      const d1 = new URL(lead.website.startsWith("http") ? lead.website : `https://${lead.website}`).hostname.replace("www.", "")
      const d2 = new URL(existingLead.website.startsWith("http") ? existingLead.website : `https://${existingLead.website}`).hostname.replace("www.", "")
      if (d1 === d2) {
        return { isDuplicate: true, score: 80, matchedField: "website", matchedValue: lead.website }
      }
    }
    if (lead.companyName && existingLead.companyName) {
      const similarity = levenshteinSimilarity(lead.companyName.toLowerCase(), existingLead.companyName.toLowerCase())
      if (similarity > 0.85) {
        return { isDuplicate: true, score: Math.round(similarity * 70), matchedField: "companyName", matchedValue: lead.companyName }
      }
    }
  }
  return { isDuplicate: false, score: 0 }
}

export function levenshteinSimilarity(a: string, b: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
    }
  }
  const maxLen = Math.max(a.length, b.length)
  return maxLen === 0 ? 1 : (maxLen - matrix[b.length][a.length]) / maxLen
}

export function extractDomain(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "")
  } catch {
    return null
  }
}

export function generateOutreachMessages(lead: DiscoveredLeadInput): OutreachMessage[] {
  const name = lead.contactName || lead.companyName || "there"
  const messages: OutreachMessage[] = []

  messages.push({
    channel: "email",
    subject: `Join Zanzibaba — Zanzibar's Premier Building Marketplace`,
    body: `Hi ${name},

I came across ${lead.companyName || "your company"} while researching suppliers in the building and construction sector in ${lead.city || lead.country || "East Africa"}.

I'm writing to invite you to join Zanzibaba — the premier marketplace connecting verified suppliers with buyers, contractors, and developers across Zanzibar and East Africa.

Why list your products on Zanzibaba?
• Reach active buyers searching for ${lead.categoryLabels?.join(", ") || "building materials"}
• Receive RFQs from verified projects and developers
• Free to list — pay only when you win orders
• Verified supplier badge builds trust with buyers

Get started in under 5 minutes:
→ https://zanzibaba.com/auth/register/supplier

Would you be open to a quick call to learn more?

Best regards,
The Zanzibaba Team`,
    personalizedFields: { name, company: lead.companyName || "", location: lead.city || lead.country || "", categories: lead.categoryLabels?.join(", ") || "" },
  })

  messages.push({
    channel: "whatsapp",
    body: `Hi ${name}! 👋

I found ${lead.companyName || "your company"} and wanted to invite you to Zanzibaba — the marketplace connecting building suppliers with buyers in Zanzibar.

✅ Free to list your products
✅ Get RFQs from real projects
✅ Reach verified buyers

Join here: https://zanzibaba.com/auth/register/supplier

Would love to have you onboard!`,
    personalizedFields: { name, company: lead.companyName || "" },
  })

  return messages
}

export function categorizeByKeywords(description: string, name: string): string[] {
  const text = `${name} ${description}`.toLowerCase()
  const categories: string[] = []
  const rules = [
    { keywords: ["cement", "concrete", "aggregate", "brick", "block", "steel", "timber", "roofing"], slug: "building-materials" },
    { keywords: ["furniture", "sofa", "chair", "table", "bed", "cabinet", "wardrobe"], slug: "furniture" },
    { keywords: ["kitchen", "cabinet", "countertop", "cooker", "oven", "sink"], slug: "kitchens" },
    { keywords: ["plumbing", "pipe", "faucet", "tap", "toilet", "shower", "bath", "sanitary"], slug: "sanitary" },
    { keywords: ["light", "lamp", "chandelier", "led", "bulb"], slug: "lighting" },
    { keywords: ["door", "window", "frame", "shutter"], slug: "doors-windows" },
    { keywords: ["electrical", "cable", "wire", "switch", "socket", "panel", "solar"], slug: "electrical" },
    { keywords: ["hvac", "air conditioner", "ac", "ventilation", "cooling", "heating"], slug: "hvac" },
    { keywords: ["tile", "ceramic", "porcelain", "marble", "granite", "flooring", "finish"], slug: "finishes" },
    { keywords: ["prefab", "modular", "container", "prefabricated"], slug: "prefab-houses" },
    { keywords: ["hospitality", "hotel", "resort", "ff&e", "os&e"], slug: "hospitality-equipment" },
    { keywords: ["paint", "coating", "varnish", "wallpaper"], slug: "finishes" },
    { keywords: ["landscaping", "garden", "outdoor", "pool"], slug: "landscaping" },
  ]

  for (const rule of rules) {
    if (rule.keywords.some(kw => text.includes(kw)) && !categories.includes(rule.slug)) {
      categories.push(rule.slug)
    }
  }

  return categories.length > 0 ? categories : ["building-materials"]
}

export function estimateYearsInBusiness(description: string): number | undefined {
  const text = description.toLowerCase()
  const patterns = [
    /est\.?\s*(\d{4})/i,
    /established\s*(?:in\s*)?(\d{4})/i,
    /founded\s*(?:in\s*)?(\d{4})/i,
    /since\s*(\d{4})/i,
    /(\d{4})\s*-\s*present/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return new Date().getFullYear() - parseInt(match[1])
    }
  }
  return undefined
}
