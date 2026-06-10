import type { DiscoveryV2Request, DiscoveryV2Lead, DiscoveryV2Result, DiscoverySourceV2 } from "./types"
import { discoverViaGooglePlaces } from "./sources/google-places"
import { discoverViaApifyMaps } from "./sources/apify-maps"
import { discoverViaApifyWeb } from "./sources/apify-web"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

function deduplicateLeads(leads: DiscoveryV2Lead[]): DiscoveryV2Lead[] {
  const seen = new Map<string, DiscoveryV2Lead>()

  for (const lead of leads) {
    const nameKey = lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
    const domainKey = lead.website
      ? lead.website.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").toLowerCase()
      : ""
    const emailKey = (lead.email || "").toLowerCase().trim()

    let matchKey = nameKey
    let existing = seen.get(nameKey)

    if (!existing && domainKey) {
      existing = seen.get(`domain:${domainKey}`)
      if (existing) matchKey = `domain:${domainKey}`
    }
    if (!existing && emailKey) {
      existing = seen.get(`email:${emailKey}`)
      if (existing) matchKey = `email:${emailKey}`
    }

    if (existing) {
      if (lead.website && !existing.website) existing.website = lead.website
      if (lead.email && !existing.email) existing.email = lead.email
      if (lead.phone && !existing.phone) existing.phone = lead.phone
      if (lead.valueScore > existing.valueScore) existing.valueScore = lead.valueScore
      if (lead.trustScore > existing.trustScore) existing.trustScore = lead.trustScore
      existing.hasEmail = existing.hasEmail || lead.hasEmail
      existing.hasWebsite = existing.hasWebsite || lead.hasWebsite
      existing.hasExportEvidence = existing.hasExportEvidence || lead.hasExportEvidence
      existing.isManufacturer = existing.isManufacturer || lead.isManufacturer
    } else {
      seen.set(matchKey, { ...lead })
      if (domainKey) seen.set(`domain:${domainKey}`, lead)
      if (emailKey) seen.set(`email:${emailKey}`, lead)
    }
  }

  return Array.from(seen.values()).filter(
    (l) => !l.companyName.startsWith("domain:") && !l.companyName.startsWith("email:")
  )
}

function generateClaimToken(): string {
  return crypto.randomBytes(24).toString("hex")
}

export async function runDiscoveryV2(request: DiscoveryV2Request): Promise<DiscoveryV2Result> {
  const startTime = Date.now()
  const { queries, sources, country, category } = request

  const sourceRunners: Record<DiscoverySourceV2, (q: string[], c: string, cat: string) => Promise<DiscoveryV2Lead[]>> = {
    "google-places": discoverViaGooglePlaces,
    "apify-maps": discoverViaApifyMaps,
    "apify-web": discoverViaApifyWeb,
  }

  const allLeads: DiscoveryV2Lead[] = []

  for (const source of sources) {
    const runner = sourceRunners[source]
    if (!runner) continue
    try {
      const leads = await runner(queries, country, category)
      allLeads.push(...leads)
      console.log(`[V2 Runner] ${source}: ${leads.length} leads found`)
    } catch (err) {
      console.error(`[V2 Runner] ${source} failed:`, err)
    }
  }

  const deduped = deduplicateLeads(allLeads)

  const stats = {
    total: deduped.length,
    withWebsite: deduped.filter((l) => l.hasWebsite).length,
    withEmail: deduped.filter((l) => l.hasEmail).length,
    withPhone: deduped.filter((l) => l.phone).length,
  }

  return {
    leads: deduped.sort((a, b) => b.valueScore - a.valueScore),
    stats,
    duration: Math.round((Date.now() - startTime) / 1000),
  }
}

export async function importDiscoveryLeads(leads: DiscoveryV2Lead[]): Promise<{
  imported: number
  tokensGenerated: number
  errors: string[]
}> {
  let imported = 0
  let tokensGenerated = 0
  const errors: string[] = []

  const existingAgent = await prisma.growthAgent.findFirst({
    where: { name: "Discovery Engine V2" },
  })

  let agentId: string
  if (existingAgent) {
    agentId = existingAgent.id
  } else {
    const agent = await prisma.growthAgent.create({
      data: {
        name: "Discovery Engine V2",
        type: "SUPPLIER",
        description: "Configurable strategic discovery engine. Supports Google Places, Apify Maps, Apify Web. Custom queries across 7 countries and 12 categories.",
        config: {
          sources: ["google-places", "apify-maps", "apify-web"],
          countries: ["Tanzania", "Kenya", "UAE", "Turkey", "India", "China", "South Africa"],
          categories: ["steel-manufacturers", "rebar-manufacturers", "cement-manufacturers", "building-materials", "hotel-furniture", "ffe", "commercial-kitchens", "prefab-houses", "modular-buildings", "aluminium-systems", "hvac", "solar-systems"],
          version: 2,
        },
        isActive: true,
      },
    })
    agentId = agent.id
  }

  const scoutRun = await prisma.scoutRun.create({
    data: {
      agentId,
      status: "running",
      startedAt: new Date(),
      log: "V2 discovery import started",
    },
  })

  for (const lead of leads) {
    try {
      const dupCheck = await prisma.discoveredLead.findFirst({
        where: {
          OR: [
            ...(lead.email ? [{ email: lead.email }] : []),
            ...(lead.website ? [{ website: lead.website }] : []),
            ...(lead.companyName ? [{ companyName: lead.companyName }] : []),
          ],
        },
      })

      if (dupCheck) {
        await prisma.discoveredLead.update({
          where: { id: dupCheck.id },
          data: {
            trustScore: Math.max(lead.trustScore, dupCheck.trustScore),
            email: lead.email || dupCheck.email,
            phone: lead.phone || dupCheck.phone,
            website: lead.website || dupCheck.website,
          },
        })
        continue
      }

      const token = generateClaimToken()

      await prisma.discoveredLead.create({
        data: {
          agentId,
          scoutRunId: scoutRun.id,
          leadType: "supplier",
          companyName: lead.companyName,
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          country: lead.country || "Tanzania",
          city: lead.city || "",
          description: lead.description,
          categorySlug: lead.category,
          categoryLabels: [lead.categoryLabel],
          sourcePlatform: `V2 Discovery — ${lead.country}`,
          sourceUrl: lead.website,
          trustScore: lead.trustScore,
          trustLevel: lead.trustScore >= 70 ? "HIGH" : lead.trustScore >= 40 ? "MEDIUM" : "LOW",
          status: "DISCOVERED",
          activationStatus: "UNCLAIMED",
          claimToken: token,
          claimLinkSentAt: new Date(),
        },
      })

      imported++
      tokensGenerated++
    } catch (err: any) {
      errors.push(`${lead.companyName}: ${err.message || String(err)}`)
    }
  }

  await prisma.scoutRun.update({
    where: { id: scoutRun.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      recordsFound: leads.length,
      recordsScored: leads.length,
      log: `V2 discovery import completed. Imported: ${imported}, Tokens: ${tokensGenerated}, Errors: ${errors.length}`,
      duration: Math.round((Date.now() - scoutRun.startedAt.getTime()) / 1000),
    },
  })

  return { imported, tokensGenerated, errors }
}
