import { generateJSON, isAIEnabled } from "./provider"
import { categorizeByKeywords } from "@/lib/agents/core"

export interface CompanyInfo {
  companyName: string
  businessType: string
  yearEstablished: string
  location: string
  city: string
  country: string
  contactName: string
  email: string
  phone: string
  website: string
  description: string
  productCategories: string[]
  productList: { name: string; description: string }[]
  certifications: string[]
  targetMarkets: string[]
}

export interface SupplierProfileDraft {
  companyName: string
  slug: string
  shortDescription: string
  seoDescription: string
  categories: { slug: string; name: string }[]
  keywords: string[]
  companySummary: string
  products: { name: string; description: string; category?: string }[]
  suggestedVerificationScore: number
}

const businessTypeOptions = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Importer",
  "Exporter",
  "Contractor",
  "Service Provider",
]

const marketOptions = [
  "Zanzibar",
  "Tanzania Mainland",
  "East Africa",
  "Africa",
  "Middle East",
  "International",
]

export function getBusinessTypeOptions(): string[] {
  return businessTypeOptions
}

export function getMarketOptions(): string[] {
  return marketOptions
}

const CATEGORY_MAP: Record<string, string> = {
  "building-materials": "Building Materials",
  "furniture": "Furniture",
  "kitchens": "Kitchens",
  "sanitary": "Sanitary & Plumbing",
  "lighting": "Lighting",
  "doors-windows": "Doors & Windows",
  "electrical": "Electrical",
  "hvac": "HVAC",
  "finishes": "Finishes & Tiles",
  "prefab-houses": "Prefab Structures",
  "hospitality-equipment": "Hospitality Equipment",
  "landscaping": "Landscaping",
  "tools": "Tools & Equipment",
  "security": "Security Systems",
  "paints": "Paints & Coatings",
  "steel": "Steel & Reinforcement",
  "roofing": "Roofing",
  "aggregates": "Aggregates & Concrete",
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function detectCategories(info: CompanyInfo): string[] {
  const slugs = categorizeByKeywords(info.description, info.companyName)
  for (const cat of info.productCategories) {
    const found = Object.entries(CATEGORY_MAP).find(
      ([, name]) => name.toLowerCase() === cat.toLowerCase()
    )
    if (found && !slugs.includes(found[0])) slugs.push(found[0])
  }
  return slugs.length > 0 ? slugs : ["building-materials"]
}

function generateFallbackDescription(info: CompanyInfo): string {
  const products =
    info.productList.length > 0
      ? info.productList.map((p) => p.name).join(", ")
      : "building materials and construction supplies"
  const years = info.yearEstablished
    ? `Established in ${info.yearEstablished}, `
    : ""
  return `${info.companyName} is a leading ${info.businessType.toLowerCase()} of ${products}. ${years}based in ${info.city || info.location}, serving the ${info.targetMarkets.join(", ")} market${info.targetMarkets.length > 1 ? "s" : ""}. We are committed to quality and reliable supply for the construction industry.`
}

function generateFallbackSEO(description: string, categories: string[]): string {
  const catNames = categories.map((s) => CATEGORY_MAP[s] || s).join(", ")
  return `${description.substring(0, 120)} Trusted supplier of ${catNames} in Zanzibar. Contact us for competitive pricing and reliable delivery.`
}

function generateFallbackKeywords(info: CompanyInfo, categories: string[]): string[] {
  const keywords = new Set<string>()
  keywords.add(info.companyName)
  keywords.add(info.businessType)
  keywords.add(info.city || info.location)
  keywords.add(info.country)
  for (const cat of categories) {
    keywords.add(CATEGORY_MAP[cat] || cat)
  }
  for (const market of info.targetMarkets) {
    keywords.add(market)
  }
  keywords.add("construction")
  keywords.add("building materials")
  keywords.add("Zanzibar")
  keywords.add("supplier")
  if (info.productList.length > 0) {
    info.productList.slice(0, 3).forEach((p) => keywords.add(p.name))
  }
  return Array.from(keywords).filter(Boolean)
}

function generateFallbackSummary(info: CompanyInfo): string {
  const years = info.yearEstablished
    ? `With experience since ${info.yearEstablished}, `
    : ""
  const products =
    info.productList.length > 0
      ? `specializing in ${info.productList.map((p) => p.name).join(", ")}`
      : "specializing in construction supply"
  return `${info.companyName} is a ${info.businessType.toLowerCase()} ${products}. ${years}We serve the ${info.targetMarkets.join(", ")} market${info.targetMarkets.length > 1 ? "s" : ""} from our base in ${info.city || info.location}. Our commitment to quality, competitive pricing, and reliable delivery makes us a trusted partner for builders, contractors, and developers.`
}

function calculateFallbackScore(info: CompanyInfo): number {
  let score = 0
  if (info.website) score += 15
  if (info.email) score += 20
  if (info.phone) score += 15
  if (info.yearEstablished) score += 5
  if (info.certifications.length > 0) score += 15
  if (info.description.length > 50) score += 10
  if (info.productList.length > 0) score += 10
  if (info.productCategories.length > 0) score += 10
  return Math.min(score, 100)
}

export async function generateProfileDraft(
  info: CompanyInfo
): Promise<SupplierProfileDraft> {
  const categories = detectCategories(info)
  const categoryObjects = categories.map((slug) => ({
    slug,
    name: CATEGORY_MAP[slug] || slug,
  }))

  if (isAIEnabled()) {
    const systemPrompt = `You are a Zanzibaba supplier profile specialist. Generate a professional supplier profile for a building materials marketplace.`
    const prompt = `Generate a supplier profile draft in JSON format based on this company info:
Company: ${info.companyName}
Type: ${info.businessType}
Established: ${info.yearEstablished}
Location: ${info.city}, ${info.country}
Contact: ${info.contactName}
Description: ${info.description}
Products: ${info.productList.map((p) => `${p.name}: ${p.description}`).join("; ")}
Certifications: ${info.certifications.join(", ")}
Target Markets: ${info.targetMarkets.join(", ")}
Suggested Categories: ${categories.map((c) => CATEGORY_MAP[c] || c).join(", ")}

Return JSON with fields:
- shortDescription (1-2 sentences)
- seoDescription (max 160 chars)
- keywords (array of 8-15 relevant keywords)
- companySummary (2-3 paragraph company overview)
- suggestedVerificationScore (0-100)`

    const aiResult = await generateJSON<{
      shortDescription: string
      seoDescription: string
      keywords: string[]
      companySummary: string
      suggestedVerificationScore: number
    }>(systemPrompt, prompt)

    if (aiResult) {
      return {
        companyName: info.companyName,
        slug: slugify(info.companyName),
        shortDescription: aiResult.shortDescription,
        seoDescription: aiResult.seoDescription.substring(0, 160),
        categories: categoryObjects,
        keywords: aiResult.keywords.slice(0, 15),
        companySummary: aiResult.companySummary,
        products: info.productList.map((p) => ({
          ...p,
          category: categories[0],
        })),
        suggestedVerificationScore: Math.min(aiResult.suggestedVerificationScore, 100),
      }
    }
  }

  const description = generateFallbackDescription(info)
  return {
    companyName: info.companyName,
    slug: slugify(info.companyName),
    shortDescription: description,
    seoDescription: generateFallbackSEO(description, categories).substring(0, 160),
    categories: categoryObjects,
    keywords: generateFallbackKeywords(info, categories),
    companySummary: generateFallbackSummary(info),
    products: info.productList.map((p) => ({
      ...p,
      category: categories[0],
    })),
    suggestedVerificationScore: calculateFallbackScore(info),
  }
}
