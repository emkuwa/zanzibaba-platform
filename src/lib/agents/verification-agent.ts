import { calculateTrustScore, extractDomain, type DiscoveredLeadInput, type VerificationResult } from "./core"

const verificationStore: Map<string, VerificationResult> = new Map()

export function getVerification(leadId: string): VerificationResult | undefined {
  return verificationStore.get(leadId)
}

export function verifyLead(lead: DiscoveredLeadInput): VerificationResult {
  const domain = extractDomain(lead.website)

  const checks = {
    websiteExists: !!lead.website && !!domain,
    websiteProfessional: domain ? !domain.includes("wordpress") && !domain.includes("blogspot") && !domain.includes("weebly") : false,
    emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) && !lead.email.includes("example.com") && !lead.email.includes("test.com"),
    phoneReachable: !!lead.phone && /^\+?[\d\s\-()]{7,15}$/.test(lead.phone),
    socialPresence: !!(lead.socialProfiles && Object.keys(lead.socialProfiles).length > 0),
    businessRegistration: !!(lead.description?.toLowerCase().includes("registered") || lead.description?.toLowerCase().includes("ltd") || lead.description?.toLowerCase().includes("limited")),
    onlineReviews: false,
    yearsInBusiness: false,
  }

  const result = calculateTrustScore(checks)
  return result
}

export function verifyBatch(leads: DiscoveredLeadInput[]): Map<number, VerificationResult> {
  const results = new Map<number, VerificationResult>()
  for (let i = 0; i < leads.length; i++) {
    results.set(i, verifyLead(leads[i]))
  }
  return results
}
