import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { MiniWebsite } from "./types"

const THEMES = ["modern", "classic", "minimal", "industrial", "tropical"]

const INDUSTRY_SECTIONS: Record<string, { hero: string; value1: string; value2: string }> = {
  "building-materials": { hero: "Quality Building Materials for Every Project", value1: "Trusted by Tanzania's top contractors", value2: "Direct from manufacturer pricing" },
  "furniture": { hero: "Exquisite Furniture for Hotels & Homes", value1: "Bespoke designs for hospitality", value2: "Commercial-grade durability" },
  "hospitality-equipment": { hero: "Complete Hospitality Supply Solutions", value1: "FF&E for hotels & resorts", value2: "Turnkey project delivery" },
}

function detectIndustry(products: string[], description: string): string {
  const text = [description, ...products].join(" ").toLowerCase()
  if (text.includes("hotel") || text.includes("resort") || text.includes("hospitality")) return "hospitality-equipment"
  if (text.includes("furniture") || text.includes("sofa") || text.includes("chair")) return "furniture"
  return "building-materials"
}

export function generateFallbackWebsite(
  companyName: string, products: string[], location: string, description: string
): MiniWebsite {
  const industry = detectIndustry(products, description)
  const section = INDUSTRY_SECTIONS[industry] || INDUSTRY_SECTIONS["building-materials"]
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const productItems = (products.length > 0 ? products : ["Building Materials"]).map((p) => ({
    name: p, description: `High-quality ${p.toLowerCase()} for construction projects. Competitive pricing and reliable supply.`, cta: "Request Quote"
  }))
  return {
    slug, companyName, tagline: section.hero, industry,
    theme: "modern",
    pages: {
      home: {
        headline: section.hero, subheadline: `${companyName} — ${location || "Zanzibar"}'s trusted supplier. ${section.value1}.`,
        content: `Welcome to ${companyName}. We provide premium building materials and construction supplies to projects across ${location || "Zanzibar"} and East Africa.`,
        heroCta: "Get a Quote",
        sections: [
          { type: "value-props", content: `${section.value1}|${section.value2}|Fast delivery across Zanzibar` },
          { type: "cta", content: `Ready to start your project? Contact ${companyName} today.` },
        ],
      },
      about: {
        headline: `About ${companyName}`, content: description || `${companyName} is a leading supplier based in ${location || "Zanzibar"}. We are committed to providing quality products and exceptional service to the construction industry.`,
        mission: "To deliver quality building materials that help our customers build better, faster, and more sustainably.", values: ["Quality First", "Reliable Delivery", "Customer Focus", "Competitive Pricing"],
      },
      products: { headline: "Our Products", items: productItems },
      projects: { headline: "Our Projects", items: [{ name: "Hotel Development", description: "Complete building materials supply for a 50-room hotel project in Zanzibar" }, { name: "Residential Complex", description: "Material supply for a 24-unit luxury apartment development" }] },
      contact: { headline: "Get In Touch", phone: "", email: "", address: location || "Zanzibar", cta: "Contact Us Today" },
    },
    seo: { title: `${companyName} | Building Materials Supplier ${location || "Zanzibar"}`, description: `${companyName} supplies ${products.join(", ")} in ${location || "Zanzibar"}. Quality materials, competitive prices, reliable delivery. Contact us today.`.substring(0, 160), keywords: [companyName, "building materials", location, "Zanzibar", "construction supplier"].filter(Boolean) },
    published: false,
  }
}

export async function generateWebsite(input: {
  companyName: string; products: string[]; location: string; description: string
  phone?: string; email?: string; website?: string
}): Promise<MiniWebsite> {
  if (isAIEnabled()) {
    const result = await generateJSON<MiniWebsite>(WEBSITE_SYSTEM, `Generate a mini supplier website for a building materials company:
Company: ${input.companyName}
Products: ${input.products.join(", ")}
Location: ${input.location}
Description: ${input.description || ""}
Industry: building-materials/construction

Return JSON with complete website structure matching the MiniWebsite type. Include: slug, companyName, tagline, industry, theme, pages (home with sections, about with values, products with items, projects with items, contact), seo metadata, published: false`)
    if (result) return result
  }
  return generateFallbackWebsite(input.companyName, input.products, input.location, input.description)
}

const WEBSITE_SYSTEM = "You are a Zanzibaba website designer. Generate professional mobile-first mini websites for building materials suppliers in East Africa."
