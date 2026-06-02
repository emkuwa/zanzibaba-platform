import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import { categorizeByKeywords } from "@/lib/agents/core"
import type { CatalogProduct, CatalogResult } from "./types"

const CAT_MAP: Record<string, string> = {
  "building-materials": "Building Materials", "furniture": "Furniture",
  "kitchens": "Kitchens", "sanitary": "Sanitary & Plumbing",
  "lighting": "Lighting", "electrical": "Electrical",
  "hvac": "HVAC", "finishes": "Finishes & Tiles",
  "roofing": "Roofing", "steel": "Steel & Reinforcement",
  "tools": "Tools & Equipment", "hospitality-equipment": "Hospitality Equipment",
}

function extractFromText(text: string): CatalogProduct[] {
  const lines = text.split("\n").filter(l => l.trim())
  const products: CatalogProduct[] = []
  const pricePattern = /(?:\d+[.)]\s*)?(.+?)\s*(?:\$|TSh|KES)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:\/|\sper\s)?(\w+)?/i
  for (const line of lines) {
    const match = line.match(pricePattern)
    if (match) {
      const name = match[1].trim()
      const price = parseFloat(match[2].replace(/,/g, ""))
      if (name.length > 2 && !isNaN(price)) {
        const slugs = categorizeByKeywords(name, name)
        products.push({
          name, description: `High-quality ${name.toLowerCase()} for construction projects.`,
          category: CAT_MAP[slugs[0]] || "Building Materials",
          categorySlug: slugs[0] || "building-materials",
          specifications: [], seoTitle: name, seoDescription: `Buy ${name.toLowerCase()} online. Competitive prices, quality assured.`,
          price, currency: "USD", unit: match[3]?.toLowerCase() || "piece", moq: 1,
        })
      }
    }
  }
  if (products.length === 0) {
    lines.forEach(line => {
      const name = line.replace(/^[-•*\d.)\s]+/, "").trim()
      if (name.length > 5 && name.length < 200 && !/^(price|total|item)/i.test(name)) {
        const slugs = categorizeByKeywords(name, name)
        products.push({
          name, description: `Premium ${name.toLowerCase()} for construction. Quality assured.`,
          category: CAT_MAP[slugs[0]] || "Building Materials",
          categorySlug: slugs[0] || "building-materials",
          specifications: [], seoTitle: name, seoDescription: `Buy ${name.toLowerCase()} at competitive prices.`,
          price: 0, moq: 1,
        })
      }
    })
  }
  return products.slice(0, 100)
}

export async function generateCatalog(text: string, source: string): Promise<CatalogResult> {
  let products = extractFromText(text)
  if (isAIEnabled() && text.length > 50) {
    const result = await generateJSON<{ products: CatalogProduct[] }>(CATALOG_SYSTEM, `Extract products from this catalog content. Return JSON with products array (name, description, category, categorySlug, specifications array of {label, value}, seoTitle, seoDescription, price, currency, unit, moq, brand).

Content: ${text.substring(0, 6000)}`)
    if (result?.products?.length) products = result.products
  }
  return { products, totalProducts: products.length, source }
}

const CATALOG_SYSTEM = "You are a Zanzibaba catalog specialist. Extract and enhance product data for the East African building materials market."
