import { generateJSON } from "./provider"

export interface ImprovedProfileData {
  companyDescription: string
  seoDescription: string
  tagline: string
  keywords: string[]
  services: string[]
  suggestedCategories: string[]
}

export async function improveProfile(existing: {
  companyName: string
  description?: string | null
  website?: string | null
  category?: string | null
  country?: string | null
  tags?: string[]
}): Promise<ImprovedProfileData | null> {
  const system = `You are a professional business profile optimizer for Zanzibaba, a construction and development marketplace.
Given a supplier's current profile information, generate optimized content.
Return ONLY valid JSON with:
- companyDescription: Professional 2-3 paragraph company description highlighting expertise, experience, and value proposition (max 500 chars)
- seoDescription: Meta description for search engines (max 160 chars)
- tagline: Short catchy business tagline (max 60 chars)
- keywords: Array of 10-15 relevant SEO keywords
- services: Array of specific services offered (max 10)
- suggestedCategories: Array of Zanzibaba category slugs this supplier should list under`

  const prompt = `Optimize this supplier profile for Zanzibaba marketplace:
Company Name: ${existing.companyName}
Current Description: ${existing.description || "Not provided"}
Website: ${existing.website || "Not provided"}
Category: ${existing.category || "Not specified"}
Country: ${existing.country || "Not specified"}
Current Tags: ${(existing.tags || []).join(", ") || "None"}

Generate optimized professional content for this supplier.`

  return generateJSON<ImprovedProfileData>(system, prompt)
}
