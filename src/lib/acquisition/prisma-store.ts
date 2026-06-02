import { prisma } from "@/lib/prisma"
import type { DiscoveredLeadInput } from "@/lib/agents/core"

export async function ensureAcquisitionAgent(): Promise<string> {
  const existing = await prisma.growthAgent.findFirst({
    where: { type: "SUPPLIER", isActive: true },
  })
  if (existing) return existing.id

  const agent = await prisma.growthAgent.create({
    data: {
      name: "Zanzibaba Supplier Acquisition Engine",
      type: "SUPPLIER",
      description: "Focused acquisition engine: Dar es Salaam suppliers (70%), Zanzibar contractors & professionals (20%), International strategic partners (10%). Generates claim-ready profiles for all approved leads.",
      config: {
        markets: { darSuppliers: 0.7, zanzibarProfessionals: 0.2, international: 0.1 },
        stages: ["discovery", "enrichment", "profile-builder", "product-builder", "review", "outreach"],
      },
      isActive: true,
    },
  })
  return agent.id
}

export async function createRun(agentId: string): Promise<string> {
  const run = await prisma.scoutRun.create({
    data: { agentId, status: "running", startedAt: new Date(), log: "Pipeline started" },
  })
  return run.id
}

export async function completeRun(
  runId: string, recordsFound: number, recordsScored: number,
  log: string, errors?: string
): Promise<void> {
  const run = await prisma.scoutRun.findUnique({ where: { id: runId } })
  if (!run) return
  const duration = Math.round((Date.now() - run.startedAt.getTime()) / 1000)
  await prisma.scoutRun.update({
    where: { id: runId },
    data: {
      status: errors ? "failed" : "completed",
      completedAt: new Date(),
      recordsFound, recordsScored, log,
      errors: errors ? { message: errors } : undefined,
      duration,
    },
  })
}

export async function updateRunLog(runId: string, logEntry: string): Promise<void> {
  const run = await prisma.scoutRun.findUnique({ where: { id: runId } })
  if (!run) return
  const existingLog = run.log || ""
  await prisma.scoutRun.update({
    where: { id: runId },
    data: { log: `${existingLog}\n${logEntry}` },
  })
}

export async function storeDiscoveredLeads(
  leads: DiscoveredLeadInput[], agentId: string, runId: string
): Promise<number> {
  let stored = 0
  for (const lead of leads) {
    const slug = lead.categorySlug || "building-materials"

    const dupCheck = await prisma.discoveredLead.findFirst({
      where: {
        OR: [
          ...(lead.email ? [{ email: lead.email }] : []),
          ...(lead.website ? [{ website: lead.website }] : []),
          ...(lead.companyName ? [{ companyName: lead.companyName }] : []),
        ],
      },
    })

    await prisma.discoveredLead.create({
      data: {
        agentId,
        scoutRunId: runId,
        leadType: lead.leadType || "supplier",
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        location: lead.location,
        country: lead.country || "Tanzania",
        city: lead.city,
        description: lead.description,
        categorySlug: slug,
        categoryLabels: lead.categoryLabels ? JSON.parse(JSON.stringify(lead.categoryLabels)) : undefined,
        products: lead.products ? JSON.parse(JSON.stringify(lead.products)) : undefined,
        socialProfiles: lead.socialProfiles ? JSON.parse(JSON.stringify(lead.socialProfiles)) : undefined,
        sourceUrl: lead.sourceUrl,
        sourcePlatform: lead.sourcePlatform || "Unknown",
        trustScore: (lead as any).trustScore || 0,
        trustLevel: (lead as any).trustLevel || "LOW",
        status: (lead as any).reviewStatus || (dupCheck ? "MERGED" : "DISCOVERED"),
        duplicateOf: dupCheck?.id || undefined,
        duplicateScore: dupCheck ? 100 : undefined,
      },
    })
    stored++
  }
  return stored
}

export async function getLeadsByStatus(status: string, limit = 100, offset = 0) {
  return prisma.discoveredLead.findMany({
    where: { status: status as any },
    orderBy: { trustScore: "desc" },
    take: limit, skip: offset,
    include: { agent: { select: { name: true } } },
  })
}

export async function updateLeadStatus(
  id: string, status: string, reviewedBy?: string, reviewNotes?: string
) {
  const data: any = { status, updatedAt: new Date() }
  if (reviewedBy) data.reviewedBy = reviewedBy
  if (reviewNotes) data.reviewNotes = reviewNotes
  if (status === "APPROVED" || status === "REJECTED") data.reviewedAt = new Date()
  await prisma.discoveredLead.update({ where: { id }, data })
}

export async function getAcquisitionStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nonDiscovered: any = ["DISCOVERED", "VERIFIED", "REVIEW_PENDING", "APPROVED", "IMPORTED"]

  const [
    totalDiscovered, darSuppliers, zanzibarContractors,
    zanzibarProfessionals, internationalPartners, totalEnriched,
    totalProfilesBuilt, totalProductsExtracted, totalInReview,
    totalApproved, totalRejected, claimReadyProfiles,
    outreachPrepared, todayDiscovered, todayEnriched,
  ] = await Promise.all([
    prisma.discoveredLead.count({ where: { status: { in: nonDiscovered } } }),
    prisma.discoveredLead.count({ where: { status: { in: nonDiscovered }, leadType: "supplier", OR: [
      { city: { contains: "Dar es Salaam", mode: "insensitive" } },
      { city: { in: ["Kariakoo", "Mikocheni", "Mwenge", "Kisutu", "Ubungo", "Upanga", "Masaki", "Oyster Bay", "Tabata", "Kijitonyama", "Mbezi", "Kigamboni", "Vingunguti"] } },
      { sourcePlatform: { contains: "Dar es Salaam", mode: "insensitive" } },
    ] } }),
    prisma.discoveredLead.count({ where: { status: { in: nonDiscovered }, leadType: "contractor" } }),
    prisma.discoveredLead.count({ where: { status: { in: nonDiscovered }, leadType: { in: ["architect", "engineer", "surveyor", "interior-designer", "landscaper", "hardware-store", "hospitality-service"] } } }),
    prisma.discoveredLead.count({ where: { status: { in: nonDiscovered }, leadType: "partner" } }),
    prisma.discoveredLead.count({ where: { description: { not: null } } }),
    prisma.discoveredLead.count({ where: { description: { not: null as any }, categoryLabels: { not: null as any } } }),
    prisma.discoveredLead.count({ where: { products: { not: null as any } } }),
    prisma.discoveredLead.count({ where: { status: "REVIEW_PENDING" } }),
    prisma.discoveredLead.count({ where: { status: { in: ["APPROVED", "IMPORTED"] } } }),
    prisma.discoveredLead.count({ where: { status: "REJECTED" } }),
    prisma.discoveredLead.count({ where: { status: "IMPORTED" } }),
    prisma.discoveredLead.count({ where: { status: "IMPORTED" } }),
    prisma.discoveredLead.count({ where: { createdAt: { gte: today } } }),
    prisma.discoveredLead.count({ where: { createdAt: { gte: today }, description: { not: null } } }),
  ])

  return {
    totalDiscovered, darSuppliers, zanzibarContractors, zanzibarProfessionals,
    internationalPartners, totalEnriched, totalProfilesBuilt, totalProductsExtracted,
    totalInReview, totalApproved, totalRejected, claimReadyProfiles,
    outreachPrepared, todayDiscovered, todayEnriched,
  }
}

export async function markLeadsOutreach(runId: string): Promise<number> {
  const result = await prisma.discoveredLead.updateMany({
    where: { scoutRunId: runId, status: "APPROVED" },
    data: { status: "IMPORTED", importedAt: new Date() },
  })
  return result.count
}

export async function getLeadById(id: string) {
  return prisma.discoveredLead.findUnique({
    where: { id },
    include: { agent: { select: { name: true } } },
  })
}
