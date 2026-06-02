export interface AcquisitionRunResult {
  runId: string
  agentId: string
  status: "running" | "completed" | "failed"
  stages: {
    discovery: { status: string; found: number; darSuppliers?: number; zanzibarContractors?: number; zanzibarProfessionals?: number; internationalPartners?: number; errors?: string }
    enrichment: { status: string; enriched: number; errors?: string }
    profileBuilder: { status: string; profilesBuilt: number; claimReady?: number; errors?: string }
    productBuilder: { status: string; productsExtracted: number; errors?: string }
    review: { status: string; inReview: number; approved?: number; rejected?: number; errors?: string }
    outreach: { status: string; messagesGenerated: number; errors?: string }
  }
  startedAt: string
  completedAt?: string
  duration: number
}

export interface AcquisitionStats {
  totalDiscovered: number
  darSuppliers: number
  zanzibarContractors: number
  zanzibarProfessionals: number
  internationalPartners: number
  totalEnriched: number
  totalProfilesBuilt: number
  totalProductsExtracted: number
  totalInReview: number
  totalApproved: number
  totalRejected: number
  claimReadyProfiles: number
  outreachPrepared: number
  todayDiscovered: number
  todayEnriched: number
}

export const ACQUISITION_CATEGORIES = {
  DAR_SUPPLIERS: [
    "building-materials", "tiles", "sanitary-ware", "aluminium",
    "roofing", "furniture", "kitchen-cabinets", "lighting",
    "electrical", "paint", "hotel-equipment", "hospitality",
  ],
  ZANZIBAR_PROFESSIONALS: [
    "contractor", "architect", "engineer", "surveyor",
    "hardware-store", "hospitality-service", "interior-designer",
    "landscaping",
  ],
  INTERNATIONAL_CATEGORIES: [
    "building-materials", "hospitality-solutions", "prefab-buildings",
    "hotel-furniture", "commercial-kitchens",
  ],
} as const

export type LeadMarket = "dar-supplier" | "zanzibar-contractor" | "zanzibar-professional" | "international-partner"

export const MARKET_LABELS: Record<LeadMarket, string> = {
  "dar-supplier": "Dar es Salaam Supplier",
  "zanzibar-contractor": "Zanzibar Contractor",
  "zanzibar-professional": "Zanzibar Professional",
  "international-partner": "International Partner",
}
