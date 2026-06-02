import { generateJSON, isAIEnabled } from "./provider"
import { categorizeByKeywords } from "@/lib/agents/core"

export interface ImportSource {
  type: "url" | "pdf" | "text"
  content: string
  fileName?: string
}

export interface ImportedProduct {
  name: string
  description: string
  category: string
  categorySlug: string
  price: number
  currency: string
  unit: string
  moq: number
  brand?: string
  imageUrl?: string
  sku?: string
}

export interface ProductImportResult {
  products: ImportedProduct[]
  suggestedCategory: string
  suggestedCategorySlug: string
  totalEstimatedValue: number
  source: string
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

function extractProductsFromText(text: string): ImportedProduct[] {
  const lines = text.split("\n").filter((l) => l.trim())
  const products: ImportedProduct[] = []
  const productPatterns = [
    /(?:\d+[.)]\s*)?(.+?)\s*(?:-|–|\$|TSh|KES|EUR)\s*\$?([\d,]+(?:\.\d{1,2})?)\s*(?:\/|\sper\s)?(\w+)?/i,
    /(?:\d+[.)]\s*)?(.+?)\s*(?:-|–)\s*(.+?)\s*(?:-|–)\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
  ]

  for (const line of lines) {
    for (const pattern of productPatterns) {
      const match = line.match(pattern)
      if (match) {
        const name = match[1].trim()
        const price = parseFloat(match[2].replace(/,/g, ""))
        const unit = match[3] || "piece"
        if (name && name.length > 2 && !isNaN(price)) {
          products.push({
            name,
            description: name,
            category: "",
            categorySlug: "",
            price: price,
            currency: "USD",
            unit: unit.toLowerCase(),
            moq: 1,
            sku: `IMP-${slugify(name).substring(0, 20)}`,
          })
        }
        break
      }
    }
  }

  if (products.length === 0) {
    lines.forEach((line, i) => {
      const trimmed = line.replace(/^[-•*\d.)\s]+/, "").trim()
      if (trimmed.length > 5 && trimmed.length < 200 && !trimmed.match(/^(price|total|item|description|product|qty|quantity)/i)) {
        products.push({
          name: trimmed,
          description: trimmed,
          category: "",
          categorySlug: "",
          price: 0,
          currency: "USD",
          unit: "piece",
          moq: 1,
          sku: `IMP-${slugify(trimmed).substring(0, 20)}`,
        })
      }
    })
  }

  return products.slice(0, 50)
}

function generateFallbackDescription(name: string): string {
  return `High-quality ${name.toLowerCase()} suitable for construction and building projects in Zanzibar and East Africa. Competitive pricing and reliable supply.`
}

function determineMainCategory(text: string, products: ImportedProduct[]): { slug: string; name: string } {
  const descs = [text, ...products.map((p) => p.name)].join(" ")
  const slugs = categorizeByKeywords(descs, "")
  const slug = slugs[0] || "building-materials"
  return { slug, name: CATEGORY_MAP[slug] || slug }
}

export async function importProducts(source: ImportSource): Promise<ProductImportResult> {
  const textContent = source.content
  let extracted: ImportedProduct[] = extractProductsFromText(textContent)
  const mainCategory = determineMainCategory(textContent, extracted)

  if (isAIEnabled() && textContent.trim().length > 50) {
    const systemPrompt = `You are a Zanzibaba product catalog specialist. Extract structured product data from catalogs and listings.`
    const prompt = `Extract product information from this catalog content. Return JSON only.

Catalog content:
${textContent.substring(0, 5000)}

Source type: ${source.type}
File name: ${source.fileName || "N/A"}

Return JSON with fields:
- products (array of {name, description, category (human-readable), categorySlug (from: building-materials, furniture, kitchens, sanitary, lighting, doors-windows, electrical, hvac, finishes, prefab-houses, hospitality-equipment, landscaping, tools, security, paints, steel, roofing, aggregates), price (number), currency (USD/TZS/EUR), unit, moq (number), brand (optional), sku (optional)})
- suggestedCategory (human-readable)
- suggestedCategorySlug (slug)
- totalEstimatedValue (sum of all prices, number)`

    const aiResult = await generateJSON<{
      products: ImportedProduct[]
      suggestedCategory: string
      suggestedCategorySlug: string
      totalEstimatedValue: number
    }>(systemPrompt, prompt)

    if (aiResult && aiResult.products && aiResult.products.length > 0) {
      return {
        products: aiResult.products.map((p) => ({
          ...p,
          description: p.description || generateFallbackDescription(p.name),
          categorySlug: p.categorySlug || mainCategory.slug,
          category: p.category || mainCategory.name,
        })),
        suggestedCategory: aiResult.suggestedCategory || mainCategory.name,
        suggestedCategorySlug: aiResult.suggestedCategorySlug || mainCategory.slug,
        totalEstimatedValue: aiResult.totalEstimatedValue || 0,
        source: source.fileName || source.type,
      }
    }
  }

  const total = extracted.reduce((sum, p) => sum + p.price, 0)

  return {
    products: extracted.map((p) => ({
      ...p,
      category: mainCategory.name,
      categorySlug: mainCategory.slug,
      description: p.description || generateFallbackDescription(p.name),
    })),
    suggestedCategory: mainCategory.name,
    suggestedCategorySlug: mainCategory.slug,
    totalEstimatedValue: total,
    source: source.fileName || source.type,
  }
}
