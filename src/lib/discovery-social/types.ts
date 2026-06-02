export type DiscoverySource = "Google Maps" | "Instagram" | "Facebook" | "LinkedIn" | "Website"

export interface SourceAttribution {
  source: DiscoverySource
  foundAt: string
  profileUrl?: string
  followers?: number
  verified?: boolean
}

export interface SocialLead {
  companyName: string
  category?: string
  categorySlug?: string
  website?: string
  phone?: string
  whatsapp?: string
  email?: string
  instagramUrl?: string
  facebookUrl?: string
  linkedinUrl?: string
  followers?: number
  city?: string
  country?: string
  description?: string
  sourceAttributions: SourceAttribution[]
  trustScore: number
}

export interface SocialDiscoveryResult {
  totalFound: number
  bySource: Record<DiscoverySource, number>
  leads: SocialLead[]
  duration: number
  deduplicated: number
  newLeads: number
  mergedLeads: number
}

export const SOCIAL_QUERIES = {
  "Dar es Salaam": {
    suppliers: [
      "dar es salaam building materials", "dar es salaam construction supplies",
      "dar es salaam furniture", "dar es salaam tiles", "dar es salaam sanitary ware",
      "dar es salaam kitchen cabinets", "dar es salaam lighting", "dar es salaam paint",
      "dar es salaam hardware store", "dar es salaam electrical supplies",
      "dar es salaam roofing", "dar es salaam aluminium windows",
      "dar es salaam hotel supplies", "dar es salaam hospitality equipment",
    ],
  },
  Zanzibar: {
    suppliers: [
      "zanzibar building materials", "zanzibar construction",
      "zanzibar furniture", "zanzibar tiles",
      "zanzibar kitchen", "zanzibar hotel supplies",
      "zanzibar hardware", "zanzibar paints",
    ],
  },
  Hospitality: {
    suppliers: [
      "hotel supplies tanzania", "hospitality equipment tanzania",
      "hotel furniture tanzania", "restaurant supplies tanzania",
      "resort supplies zanzibar", "hotel linen tanzania",
    ],
  },
  "Building Materials": {
    suppliers: [
      "cement supplier tanzania", "steel supplier tanzania",
      "roofing materials tanzania", "building materials tanzania",
      "construction materials dar es salaam",
    ],
  },
  Furniture: {
    suppliers: [
      "furniture dar es salaam", "furniture store tanzania",
      "office furniture tanzania", "home furniture tanzania",
      "custom furniture dar es salaam",
    ],
  },
  Kitchen: {
    suppliers: [
      "kitchen cabinets dar es salaam", "kitchen design tanzania",
      "kitchen appliances tanzania", "kitchen fittings tanzania",
      "cabinet maker dar es salaam",
    ],
  },
} as const

export function getAllSearchQueries(): string[] {
  const all: string[] = []
  for (const group of Object.values(SOCIAL_QUERIES)) {
    all.push(...group.suppliers)
  }
  return [...new Set(all)]
}
