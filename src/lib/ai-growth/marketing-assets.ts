import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { MarketingAsset } from "./types"

const TYPES = ["profile", "brochure", "flyer", "sales-sheet", "capability-statement"] as const

function generateFallbackAsset(type: MarketingAsset["type"], companyName: string, products: string[]): MarketingAsset {
  const productItems = products.slice(0, 6).map(p => ({ name: p, description: `High-quality ${p.toLowerCase()} for construction projects.` }))
  const base = {
    title: type === "profile" ? `Company Profile: ${companyName}` : type === "brochure" ? `${companyName} Product Brochure` : type === "flyer" ? `${companyName} — Quality Building Materials` : type === "sales-sheet" ? `${companyName} Sales Sheet` : `${companyName} Capability Statement`,
    headline: `${companyName} — Your Trusted Building Materials Partner`,
    about: `${companyName} is a premier supplier of building materials in Zanzibar, serving contractors, developers, and homeowners with quality products and reliable service.`,
    products: productItems,
    achievements: ["500+ successful deliveries", "50+ construction projects supplied", "100% customer satisfaction", "Fast delivery across Zanzibar"],
    contact: { phone: "", email: "", website: "" },
    cta: "Contact us today for competitive pricing and reliable delivery.",
  }
  if (type === "flyer") base.about = `Premium building materials from ${companyName}. Quality assured, competitive prices, fast delivery.`
  if (type === "sales-sheet") base.achievements = ["Direct manufacturer pricing", "Quality guaranteed", "Fast delivery", "Bulk discounts available"]
  return { ...base, type }
}

export async function generateMarketingAsset(
  type: MarketingAsset["type"], companyName: string, products: string[],
  location: string, description: string
): Promise<MarketingAsset> {
  if (isAIEnabled()) {
    const result = await generateJSON<MarketingAsset>(MARKETING_SYSTEM, `Generate a ${type} marketing asset for:
Company: ${companyName}
Products: ${products.join(", ")}
Location: ${location}
Description: ${description}

Return JSON with: type, title, headline, about, products (array of {name, description}), achievements (array of strings), contact ({phone, email, website}), cta`)
    if (result) return result
  }
  return generateFallbackAsset(type, companyName, products)
}

const MARKETING_SYSTEM = "You are a Zanzibaba marketing designer. Create professional marketing assets for East African construction suppliers."
