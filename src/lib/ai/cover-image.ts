import { generateJSON } from "./provider"

export interface CoverImagePrompt {
  title: string
  prompt: string
  style: string
  orientation: string
  suggestedColors: string[]
}

const CATEGORY_TEMPLATES: Record<string, string> = {
  "steel-manufacturers": "A modern steel manufacturing facility with molten metal, industrial architecture, dramatic lighting, high-tech machinery",
  "prefab-houses": "Modern prefabricated houses being assembled, clean lines, contemporary architecture, bright daylight, green surroundings",
  "hotel-furniture": "Elegant hotel room with luxury furniture, warm lighting, sophisticated interior design, premium finishes",
  "building-materials": "Stacked construction materials, cement bags, bricks, steel rods, industrial warehouse setting, organized display",
  hvac: "Modern HVAC systems, air conditioning units, ventilation ducts, rooftop installation, blue sky background",
  "solar-systems": "Solar panels installation on rooftop, renewable energy, blue sky, sunlight reflection, modern clean energy",
  "general": "Professional business facility, corporate branding, modern office or factory, clean professional aesthetic",
}

export async function generateCoverImagePrompt(
  categorySlug: string,
  companyName: string
): Promise<CoverImagePrompt | null> {
  const system = `You are an AI that generates image generation prompts for supplier cover images on Zanzibaba marketplace.
Given a supplier's category and company name, generate a professional cover image prompt.
Return ONLY valid JSON with:
- title: A short title for the image
- prompt: Detailed image generation prompt (max 200 chars)
- style: Art style (e.g. "photorealistic", "corporate", "industrial", "modern")
- orientation: "landscape" or "wide"
- suggestedColors: Array of 3-5 hex color codes that match the theme`

  const basePrompt = CATEGORY_TEMPLATES[categorySlug] || CATEGORY_TEMPLATES["general"]
  const prompt = `Company: ${companyName}
Category: ${categorySlug}
Base Theme: ${basePrompt}

Generate a cover image prompt suitable for this supplier's profile banner (1200x400px).`

  return generateJSON<CoverImagePrompt>(system, prompt)
}

export function getCategoryPromptTemplate(categorySlug: string): string {
  return CATEGORY_TEMPLATES[categorySlug] || CATEGORY_TEMPLATES["general"]
}

export const CATEGORY_COLORS: Record<string, string[]> = {
  "steel-manufacturers": ["#374151", "#1f2937", "#e5e7eb", "#ef4444"],
  "prefab-houses": ["#059669", "#10b981", "#fef3c7", "#d1fae5"],
  "hotel-furniture": ["#7c3aed", "#8b5cf6", "#fdf4ff", "#ede9fe"],
  "building-materials": ["#b45309", "#d97706", "#fef3c7", "#fff7ed"],
  hvac: ["#0284c7", "#38bdf8", "#f0f9ff", "#e0f2fe"],
  "solar-systems": ["#ca8a04", "#eab308", "#fefce8", "#fef9c3"],
}
