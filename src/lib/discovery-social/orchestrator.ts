import type { SocialLead, DiscoverySource, SocialDiscoveryResult } from "./types"
import { discoverInstagram } from "./sources/instagram-source"
import { discoverFacebook } from "./sources/facebook-source"
import { discoverLinkedIn } from "./sources/linkedin-source"
import { discoverWebsites } from "./sources/web-source"
import { discoverGoogleMaps } from "./sources/google-maps-source"
import { computeSocialTrustScore, determineTrustLevel } from "./unified-scorer"
import { deduplicateLeads, deduplicateWithExisting } from "./deduplicator"
import { prisma } from "@/lib/prisma"

export async function runSocialDiscovery(): Promise<SocialDiscoveryResult> {
  const startTime = Date.now()
  const sources: { name: DiscoverySource; discover: () => Promise<SocialLead[]> }[] = [
    { name: "Instagram", discover: discoverInstagram },
    { name: "Facebook", discover: discoverFacebook },
    { name: "LinkedIn", discover: discoverLinkedIn },
    { name: "Website", discover: discoverWebsites },
    { name: "Google Maps", discover: discoverGoogleMaps },
  ]

  const sourceResults: Record<DiscoverySource, SocialLead[]> = {
    "Google Maps": [],
    Instagram: [],
    Facebook: [],
    LinkedIn: [],
    Website: [],
  }

  for (const source of sources) {
    try {
      sourceResults[source.name] = await source.discover()
    } catch {
      sourceResults[source.name] = []
    }
  }

  let allLeads: SocialLead[] = []
  for (const source of sources) {
    allLeads.push(...sourceResults[source.name])
  }

  const deduped = deduplicateLeads(allLeads, [])
  allLeads = deduped.merged

  for (const lead of allLeads) {
    const { score } = computeSocialTrustScore(lead)
    lead.trustScore = score
  }

  allLeads.sort((a, b) => b.trustScore - a.trustScore)

  const existingDb = await prisma.discoveredLead.findMany({
    where: { status: { in: ["DISCOVERED", "IMPORTED"] } },
    select: { companyName: true, website: true, email: true },
  })

  const { socialLeads: newLeads, matchedExisting } = deduplicateWithExisting(allLeads, existingDb)

  let stored = 0
  let merged = 0
  for (const lead of newLeads) {
    const { score: trustScore } = computeSocialTrustScore(lead)

    const existingMatch = await prisma.discoveredLead.findFirst({
      where: {
        OR: [
          ...(lead.website ? [{ website: lead.website }] : []),
          ...(lead.email ? [{ email: lead.email }] : []),
          ...(lead.companyName ? [{ companyName: lead.companyName }] : []),
        ],
      },
    })

    if (existingMatch) {
      await prisma.discoveredLead.update({
        where: { id: existingMatch.id },
        data: {
          instagramUrl: lead.instagramUrl || existingMatch.instagramUrl,
          facebookUrl: lead.facebookUrl || existingMatch.facebookUrl,
          linkedinUrl: lead.linkedinUrl || existingMatch.linkedinUrl,
          followers: lead.followers || existingMatch.followers,
          sources: lead.sourceAttributions as any,
          phone: lead.phone || existingMatch.phone,
          email: lead.email || existingMatch.email,
          website: lead.website || existingMatch.website,
          trustScore: Math.max(trustScore, existingMatch.trustScore),
          trustLevel: determineTrustLevel(Math.max(trustScore, existingMatch.trustScore)),
        },
      })
      merged++
    } else {
      const agentId = await ensureSocialAgent()
      const slug = lead.categorySlug || lead.category || "building-materials"

      const sourcesSanitized = lead.sourceAttributions.map((s) => ({
        source: s.source,
        foundAt: s.foundAt,
        profileUrl: s.profileUrl || null,
        followers: s.followers || null,
      }))

      await prisma.discoveredLead.create({
        data: {
          agentId,
          leadType: "supplier",
          companyName: lead.companyName,
          email: lead.email,
          phone: lead.phone || lead.whatsapp,
          website: lead.website,
          city: lead.city || "",
          country: lead.country || "Tanzania",
          description: lead.description,
          categorySlug: slug,
          categoryLabels: lead.category ? [lead.category] : undefined,
          instagramUrl: lead.instagramUrl,
          facebookUrl: lead.facebookUrl,
          linkedinUrl: lead.linkedinUrl,
          followers: lead.followers || null,
          sources: sourcesSanitized as any,
          trustScore,
          trustLevel: determineTrustLevel(trustScore),
          status: "DISCOVERED",
        },
      })
      stored++
    }
  }

  // Mark matched existing leads with updated social data
  const bySource: Record<string, number> = {}
  for (const [source, leads] of Object.entries(sourceResults)) {
    bySource[source] = leads.length
  }

  return {
    totalFound: allLeads.length,
    bySource: bySource as Record<DiscoverySource, number>,
    leads: allLeads,
    duration: Math.round((Date.now() - startTime) / 1000),
    deduplicated: deduped.deduplicated,
    newLeads: stored,
    mergedLeads: merged + matchedExisting,
  }
}

async function ensureSocialAgent(): Promise<string> {
  const existing = await prisma.growthAgent.findFirst({
    where: { type: "SUPPLIER", name: "Social Discovery Engine" },
  })
  if (existing) return existing.id

  const agent = await prisma.growthAgent.create({
    data: {
      name: "Social Discovery Engine",
      type: "SUPPLIER",
      description: "Multi-source social discovery: Instagram, Facebook, LinkedIn, Websites, Google Maps",
      config: {
        sources: ["Instagram", "Facebook", "LinkedIn", "Website", "Google Maps"],
        scoring: { googleMaps: 30, website: 25, whatsapp: 15, instagram: 10, facebook: 10, linkedin: 10 },
      },
      isActive: true,
    },
  })
  return agent.id
}
