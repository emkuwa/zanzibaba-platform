import type { DiscoveredLeadInput } from "@/lib/agents/core"

export interface ReviewedLead extends DiscoveredLeadInput {
  reviewStatus: "APPROVED" | "REJECTED" | "REVIEW_PENDING"
  reviewReason: string
  confidenceScore: number
}

function autoScoreLead(lead: DiscoveredLeadInput): { status: "APPROVED" | "REJECTED" | "REVIEW_PENDING"; reason: string; confidenceScore: number } {
  let score = 0

  if (lead.website) score += 15
  if (lead.sourcePlatform === "Google Maps" || lead.sourceUrl?.includes("maps.google")) score += 10

  const phone = lead.phone?.replace(/[\s\-()]/g, "") || ""
  if (phone && /^(\+?255|0)[67]\d{8}$/.test(phone)) score += 15

  if (lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) score += 10
  if (lead.phone && /^\+?\d{7,15}$/.test(phone)) score += 5

  const numCats = lead.categoryLabels?.length || 0
  if (numCats >= 3) score += 10
  else if (numCats >= 2) score += 5

  if (lead.description && lead.description.length > 30) score += 5
  if (lead.products && lead.products.length > 0) score += 5
  if (lead.companyName) score += 5

  if (lead.socialProfiles && Object.keys(lead.socialProfiles).length > 0) score += 5
  if (lead.sourcePlatform && lead.sourcePlatform !== "Unknown") score += 5

  const isInternational = lead.country && !["Tanzania", "Zanzibar"].includes(lead.country)
  if (isInternational) score += 10

  if ((lead.leadType as string) === "partner" && lead.website) score = Math.max(score, 70)

  if (score >= 65) return { status: "APPROVED", reason: `Qualified (score: ${score}/100)`, confidenceScore: score }
  if (score >= 30) return { status: "REVIEW_PENDING", reason: `Needs manual review (score: ${score}/100)`, confidenceScore: score }
  return { status: "REJECTED", reason: `Insufficient data (score: ${score}/100)`, confidenceScore: score }
}

export async function reviewLeads(
  leads: DiscoveredLeadInput[],
  runId: string
): Promise<{
  inReview: number
  decisions: { approved: number; rejected: number; flagged: number }
  leads: ReviewedLead[]
}> {
  const resultLeads: ReviewedLead[] = []
  let approved = 0; let rejected = 0; let flagged = 0

  for (const lead of leads) {
    const decision = autoScoreLead(lead)

    if (decision.status === "APPROVED") approved++
    else if (decision.status === "REJECTED") rejected++
    else flagged++

    resultLeads.push({
      ...lead,
      reviewStatus: decision.status,
      reviewReason: decision.reason,
      confidenceScore: decision.confidenceScore,
    })
  }

  return {
    inReview: flagged,
    decisions: { approved, rejected, flagged },
    leads: resultLeads,
  }
}
