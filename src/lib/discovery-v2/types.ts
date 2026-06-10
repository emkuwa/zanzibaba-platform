import type { DiscoveredLeadInput } from "@/lib/agents/core"

export type DiscoverySourceV2 = "google-places" | "apify-maps" | "apify-web"

export const DISCOVERY_SOURCES: DiscoverySourceV2[] = ["google-places", "apify-maps", "apify-web"]

export const DISCOVERY_SOURCE_LABELS: Record<DiscoverySourceV2, string> = {
  "google-places": "Google Places API",
  "apify-maps": "Apify Google Maps",
  "apify-web": "Apify Web Scraper",
}

export const TARGET_COUNTRIES = [
  "Tanzania", "Kenya", "UAE", "Turkey", "India", "China", "South Africa",
] as const

export type TargetCountry = (typeof TARGET_COUNTRIES)[number]

export interface SearchTemplate {
  id: string
  label: string
  queries: string[]
  categorySlug: string
}

export const SEARCH_TEMPLATES: SearchTemplate[] = [
  { id: "steel", label: "Steel", queries: ["steel manufacturers", "steel suppliers", "steel products", "structural steel"], categorySlug: "steel-manufacturers" },
  { id: "rebar", label: "Rebar", queries: ["rebar manufacturers", "steel reinforcement", "rebar suppliers", "construction steel"], categorySlug: "rebar-manufacturers" },
  { id: "cement", label: "Cement", queries: ["cement manufacturers", "cement suppliers", "cement distributors", "cement plant"], categorySlug: "cement-manufacturers" },
  { id: "building-materials", label: "Building Materials", queries: ["building materials suppliers", "construction materials", "building supply wholesale", "construction supply company"], categorySlug: "building-materials" },
  { id: "hotel-furniture", label: "Hotel Furniture", queries: ["hotel furniture manufacturers", "hotel furniture suppliers", "hospitality furniture", "hotel room furniture"], categorySlug: "hotel-furniture" },
  { id: "ffe", label: "FF&E", queries: ["hotel FF&E suppliers", "hotel furnishings", "hospitality FF&E", "hotel interior suppliers"], categorySlug: "ffe" },
  { id: "ose", label: "OS&E", queries: ["hotel OS&E suppliers", "operating supplies equipment hospitality", "hotel amenities suppliers", "hotel linen supplies"], categorySlug: "ose" },
  { id: "commercial-kitchens", label: "Commercial Kitchens", queries: ["commercial kitchen equipment", "restaurant kitchen suppliers", "hotel kitchen equipment", "commercial kitchen manufacturers"], categorySlug: "commercial-kitchens" },
  { id: "glass-facade", label: "Glass & Facade", queries: ["glass facade systems", "curtain wall manufacturers", "glass suppliers construction", "architectural glass systems"], categorySlug: "glass-facade" },
  { id: "prefab-houses", label: "Prefab Houses", queries: ["prefabricated houses manufacturers", "prefab home suppliers", "prefab house exporters", "modular home manufacturers"], categorySlug: "prefab-houses" },
  { id: "modular-buildings", label: "Modular Buildings", queries: ["modular building manufacturers", "modular construction companies", "modular hotel suppliers", "prefab commercial buildings"], categorySlug: "modular-buildings" },
  { id: "capsule-houses", label: "Capsule Houses", queries: ["capsule house manufacturers", "prefab capsule rooms", "capsule hotel suppliers", "modular capsule homes"], categorySlug: "capsule-houses" },
  { id: "aluminium-systems", label: "Aluminium Systems", queries: ["aluminium facade systems", "aluminium windows doors manufacturers", "curtain wall suppliers", "aluminium cladding systems"], categorySlug: "aluminium-systems" },
  { id: "hvac", label: "HVAC", queries: ["HVAC manufacturers", "commercial HVAC suppliers", "air conditioning manufacturers", "HVAC systems exporters"], categorySlug: "hvac" },
  { id: "solar", label: "Solar", queries: ["solar panel manufacturers", "solar energy suppliers", "solar system installers", "solar PV manufacturers"], categorySlug: "solar-systems" },
]

export interface DiscoveryV2Request {
  queries: string[]
  sources: DiscoverySourceV2[]
  country: TargetCountry
  category: string
  preview: boolean
}

export interface DiscoveryV2Lead {
  companyName: string
  website?: string
  email?: string
  phone?: string
  country: string
  city?: string
  description?: string
  category: string
  categoryLabel: string
  source: DiscoverySourceV2
  trustScore: number
  valueScore: number
  hasWebsite: boolean
  hasEmail: boolean
  hasExportEvidence: boolean
  isManufacturer: boolean
  isStrategicCategory: boolean
}

export interface DiscoveryV2Result {
  leads: DiscoveryV2Lead[]
  stats: {
    total: number
    withWebsite: number
    withEmail: number
    withPhone: number
  }
  duration: number
}

export interface DiscoveryImportResult {
  imported: number
  tokensGenerated: number
  errors: string[]
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
  "steel-manufacturers": "Steel Manufacturers",
  "rebar-manufacturers": "Rebar Manufacturers",
  "cement-manufacturers": "Cement Manufacturers",
  "building-materials": "Building Materials",
  "hotel-furniture": "Hotel Furniture",
  ffe: "FF&E",
  ose: "OS&E",
  "commercial-kitchens": "Commercial Kitchens",
  "glass-facade": "Glass & Facade Systems",
  "prefab-houses": "Prefab Houses",
  "modular-buildings": "Modular Buildings",
  "capsule-houses": "Capsule Houses",
  "aluminium-systems": "Aluminium Systems",
  hvac: "HVAC",
  "solar-systems": "Solar Systems",
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABEL_MAP[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function exportEvidenceKeywords(): string[] {
  return ["export", "international", "global", "worldwide", "overseas", "shipping", "freight", "exporter", "africa", "middle east", "europe", "asia"]
}

export function manufacturerKeywords(): string[] {
  return ["manufacturer", "factory", "plant", "production", "manufacturing", "producer", "industrial", "made in"]
}
