import { generateJSON } from "./provider"

export interface OpportunityMatch {
  matchedProjects: {
    projectId: string
    title: string
    slug: string
    category: string | null
    location: string | null
    budget: number | null
    matchScore: number
    matchReason: string
  }[]
  matchedRFQs: {
    rfqId: string
    title: string
    category: string
    description: string | null
    budgetMin: number | null
    budgetMax: number | null
    deliveryLocation: string | null
    matchScore: number
    matchReason: string
  }[]
  summary: string
}

export async function findMatchingOpportunities(supplier: {
  id: string
  categories: string[]
  country: string | null
  tags: string[]
  website?: string | null
}): Promise<OpportunityMatch | null> {
  const system = `You are an AI opportunity matcher for Zanzibaba marketplace.
Match a supplier with relevant projects and RFQs from the platform.
Use the supplier's categories, country, and tags to find the best opportunities.
Return ONLY valid JSON with:
- matchedProjects: Array of matched projects with matchScore (0-100) and matchReason
- matchedRFQs: Array of matched RFQs with matchScore (0-100) and matchReason
- summary: A brief summary of the best opportunities found`

  const prompt = `Find matching opportunities for this supplier:
Categories: ${supplier.categories.join(", ")}
Country: ${supplier.country || "Any"}
Tags: ${supplier.tags.join(", ") || "None"}
Website: ${supplier.website || "None"}

Return the top opportunity matches. Since we are checking against the database in a separate step, provide the matching criteria for what types of projects and RFQs would be ideal for this supplier.`

  return generateJSON<OpportunityMatch>(system, prompt)
}
