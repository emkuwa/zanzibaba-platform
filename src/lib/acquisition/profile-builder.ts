import type { DiscoveredLeadInput } from "@/lib/agents/core"
import { generateJSON, isAIEnabled } from "@/lib/ai/provider"

const PROFILE_SYSTEM = `You are a profile builder for Zanzibaba, a Zanzibar construction marketplace. Return ONLY valid JSON.`

interface ProfileFields {
  shortDescription: string
  seoDescription: string
  keywords: string[]
  companySummary: string
  claimReady: boolean
}

function generateFallbackProfile(lead: DiscoveredLeadInput): ProfileFields {
  const cats = (lead.categoryLabels || []).join(", ") || "building materials"
  const isProfessional = ["contractor", "architect", "engineer", "surveyor", "interior-designer", "landscaper"].includes(lead.leadType)
  const isInternational = lead.country && !["Tanzania", "Zanzibar"].includes(lead.country)
  const location = lead.city || (isInternational ? lead.country || "International" : "Zanzibar")

  if (isProfessional) {
    return {
      shortDescription: `${lead.companyName} — Professional ${lead.leadType} serving ${location} and surrounding areas.`,
      seoDescription: `${lead.companyName} is a trusted ${lead.leadType} in ${location}. Professional services for construction projects on Zanzibar. Contact for ${lead.leadType} services.`,
      keywords: [lead.companyName || "", lead.leadType, location, "Zanzibar", "construction", "building", "Tanzania"].filter(Boolean),
      companySummary: `${lead.companyName} is a professional ${lead.leadType} based in ${location}. We provide quality services for construction and development projects across Zanzibar and Tanzania. Contact us to discuss your project needs.`,
      claimReady: true,
    }
  }

  if (isInternational) {
    return {
      shortDescription: `${lead.companyName} — International supplier of ${cats} for Zanzibar projects. Based in ${location}.`,
      seoDescription: `${lead.companyName} supplies ${cats} to Zanzibar from ${location}. Strategic partner for hotel, resort, and commercial projects in Zanzibar and East Africa.`,
      keywords: [lead.companyName || "", ...(lead.categoryLabels || []), location, "Zanzibar", "international supplier", "export", "Tanzania"].filter(Boolean),
      companySummary: `${lead.companyName} is an international supplier of ${cats} based in ${location}. We partner with Zanzibar developers, contractors, and hospitality projects to deliver quality products. Contact us for partnership opportunities.`,
      claimReady: true,
    }
  }

  return {
    shortDescription: `${lead.companyName} — ${cats} supplier in ${location}, Tanzania. Quality products for construction projects.`,
    seoDescription: `${lead.companyName} supplies ${cats} in ${location}. Serving Zanzibar construction projects with quality materials, competitive pricing, and reliable delivery. Contact for pricing.`,
    keywords: [lead.companyName || "", ...(lead.categoryLabels || []), location, "Zanzibar", "construction supplier", "building materials", "Dar es Salaam"].filter(Boolean),
    companySummary: `${lead.companyName} is a supplier of ${cats} based in ${location}, Tanzania. We serve construction projects across Zanzibar with quality products and reliable delivery. Contact us for your project material needs.`,
    claimReady: true,
  }
}

export async function buildProfiles(
  leads: DiscoveredLeadInput[],
  runId: string
): Promise<{ profilesBuilt: number; claimReady: number; leads: DiscoveredLeadInput[] }> {
  const resultLeads: DiscoveredLeadInput[] = []
  let claimReadyCount = 0

  for (const lead of leads) {
    let profile: ProfileFields

    if (isAIEnabled()) {
      try {
        const prompt = `Create a claim-ready supplier profile for Zanzibaba marketplace:

Company: ${lead.companyName}
Location: ${lead.city || lead.location || "Zanzibar, Tanzania"}
Type: ${lead.leadType}
Categories: ${(lead.categoryLabels || []).join(", ")}
Description: ${lead.description || ""}

The profile should be ready for a "Claim Your Profile" workflow. All content will be reviewed and approved by the business owner when they claim it.

Return JSON:
- shortDescription: 1 sentence (max 120 chars)
- seoDescription: 2 sentences for SEO (max 250 chars)
- keywords: 8-12 relevant SEO keywords
- companySummary: 2-4 sentence company summary
- claimReady: true`
        profile = (await generateJSON<ProfileFields>(PROFILE_SYSTEM, prompt)) || generateFallbackProfile(lead)
      } catch {
        profile = generateFallbackProfile(lead)
      }
    } else {
      profile = generateFallbackProfile(lead)
    }

    if (profile.claimReady) claimReadyCount++

    resultLeads.push({
      ...lead,
      description: profile.companySummary || lead.description,
    })
  }

  return { profilesBuilt: resultLeads.filter((l) => l.description).length, claimReady: claimReadyCount, leads: resultLeads }
}
