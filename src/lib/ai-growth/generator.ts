import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import { categorizeByKeywords } from "@/lib/agents/core"
import type { ProfileDraft } from "./types"

const CATEGORIES: Record<string, string> = {
  "building-materials": "Building Materials",
  "furniture": "Furniture", "kitchens": "Kitchens", "sanitary": "Sanitary & Plumbing",
  "lighting": "Lighting", "doors-windows": "Doors & Windows", "electrical": "Electrical",
  "hvac": "HVAC", "finishes": "Finishes & Tiles", "prefab-houses": "Prefab Structures",
  "hospitality-equipment": "Hospitality Equipment", "landscaping": "Landscaping",
  "tools": "Tools & Equipment", "security": "Security Systems", "paints": "Paints & Coatings",
  "steel": "Steel & Reinforcement", "roofing": "Roofing", "aggregates": "Aggregates & Concrete",
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function detectCategories(desc: string, products: string[]): { slug: string; name: string }[] {
  const text = [desc, ...products].join(" ")
  const slugs = categorizeByKeywords(text, "")
  return slugs.length > 0
    ? slugs.map((s) => ({ slug: s, name: CATEGORIES[s] || s }))
    : [{ slug: "building-materials", name: "Building Materials" }]
}

export function generateFallbackProfile(
  companyName: string, website: string, whatsapp: string,
  products: string[], location: string
): ProfileDraft {
  const productStr = products.slice(0, 5).join(", ") || "quality building materials"
  const catObjs = detectCategories(productStr, products)
  const tagline = `Trusted ${catObjs[0]?.name || "Building Materials"} Supplier in ${location || "Zanzibar"}`
  return {
    companyName,
    companyOverview: `${companyName} is a premier supplier of ${productStr} serving ${location || "Zanzibar"}. Committed to quality, competitive pricing, and reliable delivery for construction projects of all sizes.`,
    aboutUs: `${companyName} has established itself as a trusted name in the construction supply industry. We provide high-quality ${productStr} to contractors, developers, and homeowners. Our team is dedicated to ensuring every customer finds the right materials for their project.`,
    mission: `To be ${location || "Zanzibar"}'s most reliable building materials supplier, delivering quality products and exceptional service that help our customers build better.`,
    seoDescription: `${companyName} | ${tagline}. Supplier of ${productStr} in ${location || "Zanzibar"}. Competitive prices, quality assured, reliable delivery. Contact us for your construction needs.`.substring(0, 160),
    categories: catObjs,
    keywords: [companyName, ...catObjs.map(c => c.name), location, "Zanzibar", "construction", "building materials", "supplier", ...products.slice(0, 3)].filter(Boolean),
    profileSummary: `${companyName} is a ${catObjs[0]?.name || "building materials"} supplier based in ${location || "Zanzibar"}, specializing in ${productStr}. We serve contractors, developers, and homeowners with quality products and reliable service.`,
    tagline,
  }
}

export async function generateProfile(input: {
  companyName: string; website: string; whatsapp: string
  products: string[]; location: string; description?: string
}): Promise<ProfileDraft> {
  if (isAIEnabled()) {
    const result = await generateJSON<ProfileDraft>(PROFILE_SYSTEM, `Generate a supplier profile for:
Company: ${input.companyName}
Website: ${input.website || "N/A"}
Products: ${input.products.join(", ")}
Location: ${input.location}
Description: ${input.description || ""}

Return JSON with: companyOverview, aboutUs, mission, seoDescription (≤160 chars), categories (array of {slug, name}), keywords (array), profileSummary, tagline`)
    if (result) return result
  }
  return generateFallbackProfile(input.companyName, input.website, input.whatsapp, input.products, input.location)
}

const PROFILE_SYSTEM = "You are a Zanzibaba supplier profile specialist. Generate professional building materials supplier profiles for the East African market."
