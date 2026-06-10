import { generateJSON } from "./provider"

export interface WebsiteExtractedData {
  logoUrl: string | null
  description: string
  categories: string[]
  email: string | null
  phone: string | null
  whatsapp: string | null
  socialLinks: {
    linkedin: string | null
    facebook: string | null
    instagram: string | null
    youtube: string | null
    twitter: string | null
  }
  address: string | null
  tags: string[]
}

export async function extractFromWebsite(url: string): Promise<WebsiteExtractedData | null> {
  try {
    const fetchUrl = url.startsWith("http") ? url : `https://${url}`
    const res = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ZanzibabaBot/1.0)" },
    })
    if (!res.ok) return null

    const html = await res.text()

    const system = `You are a business profile extraction AI. Extract structured data from a company website homepage HTML.
Return ONLY valid JSON with these fields:
- logoUrl: URL of logo image (look for <img> with logo class/id, or null)
- description: Company description (from meta description or visible text, max 300 chars)
- categories: Array of business category slugs this company belongs to (e.g. ["steel-manufacturers", "building-materials"])
- email: Contact email found on the page (or null)
- phone: Contact phone found on the page (or null)
- whatsapp: WhatsApp number found (or null)
- socialLinks: Object with linkedin, facebook, instagram, youtube, twitter URLs (or null)
- address: Physical address found (or null)
- tags: Array of SEO-relevant tags/keywords (max 10)`

    const prompt = `Extract business profile data from this HTML homepage content:\n\n${html.slice(0, 8000)}`

    return generateJSON<WebsiteExtractedData>(system, prompt)
  } catch {
    return null
  }
}
