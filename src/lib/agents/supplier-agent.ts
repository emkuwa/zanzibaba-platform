import { calculateTrustScore, detectDuplicate, categorizeByKeywords, estimateYearsInBusiness, type DiscoveredLeadInput } from "./core"
import { discoverViaGoogleMaps } from "./google-places-client"
import { incrementDuplicateCount } from "./lead-store"

export async function discoverSuppliers(): Promise<DiscoveredLeadInput[]> {
  const discovered = await discoverViaGoogleMaps()
  const allLeads: DiscoveredLeadInput[] = []

  for (const lead of discovered) {
    const duplicate = detectDuplicate(lead, allLeads)
    if (duplicate.isDuplicate) {
      incrementDuplicateCount()
      continue
    }
    allLeads.push(lead)
  }

  const scored = allLeads.map(lead => {
    const years = estimateYearsInBusiness(lead.description || "")
    const phoneClean = lead.phone?.replace(/[\s\-()]/g, "") || ""
    const checks = {
      websiteExists: !!lead.website,
      websiteProfessional: lead.website
        ? !lead.website.includes("wordpress") &&
          !lead.website.includes("blogspot") &&
          !lead.website.includes("weebly") &&
          !lead.website.includes("wixsite")
        : false,
      emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) && !lead.email.includes("example"),
      phoneReachable: !!lead.phone && /^\+?\d{7,15}$/.test(phoneClean),
      socialPresence: !!(lead.socialProfiles && Object.keys(lead.socialProfiles).length > 0),
      businessRegistration: !!(lead.description?.toLowerCase().includes("registered") || lead.description?.toLowerCase().includes("ltd") || lead.description?.toLowerCase().includes("limited")),
      onlineReviews: false,
      yearsInBusiness: years !== undefined && years >= 3,
    }
    const slug = categorizeByKeywords(lead.description || "", lead.companyName || "")
    return { ...lead, categorySlug: slug[0], verificationData: checks, ...calculateTrustScore(checks) }
  })

  return scored.sort((a, b) => (b as any).score - (a as any).score)
}
