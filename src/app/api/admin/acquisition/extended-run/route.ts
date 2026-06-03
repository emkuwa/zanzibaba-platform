/**
 * Extended supplier acquisition orchestrator — runs the full pipeline
 * server-side (Vercel → Neon) so a misbehaving local Postgres connection
 * doesn't block the overnight cycle.
 *
 *   POST /api/admin/acquisition/extended-run
 *     Header: x-admin-token: <ADMIN_TOKEN env var, default = AUTH_SECRET hash>
 *     Body  : { dryRun?: boolean }
 *
 *   GET  /api/admin/acquisition/extended-run
 *     Returns latest stats + top opportunities (no auth — read-only).
 *
 * Stages: ingest → dedup → score → promote → claim tokens →
 *         WhatsApp prep → founding invites → aggregate report.
 *
 * Designed to fit Vercel Hobby 60s timeout via batched parallelism.
 */

import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { prisma } from "@/lib/prisma"
import type { TrustLevel, LeadStatus } from "@prisma/client"
import {
  EXTENDED_SUPPLIER_CATALOG,
  TARGET_CATEGORIES,
  type SeedSupplier,
} from "@/lib/acquisition/seeds/extended-catalog"

export const runtime = "nodejs"
export const maxDuration = 60

const ADMIN_TOKEN_HEADER = "x-admin-token"

function expectedAdminToken(): string {
  const explicit = process.env.ADMIN_ACQUISITION_TOKEN
  if (explicit) return explicit
  // Derive from AUTH_SECRET so we don't need a new env var.
  const secret = process.env.AUTH_SECRET || "fallback-not-secure-please-set-AUTH_SECRET"
  return crypto.createHash("sha256").update(`acquisition::${secret}`).digest("hex").slice(0, 32)
}

function ipAddressOf(req: Request): string {
  const xf = req.headers.get("x-forwarded-for")
  return xf?.split(",")[0]?.trim() || "unknown"
}

interface LeadCandidate {
  leadType: "supplier" | "service"
  companyName: string
  website: string | null
  phone: string | null
  email: string | null
  city: string
  country: string
  location: string
  description: string
  categorySlug: string
  categoryLabels: string[]
  sourcePlatform: string
  sourceUrl: string | null
}

function computeChecks(lead: LeadCandidate): Record<string, boolean> {
  const phoneClean = (lead.phone ?? "").replace(/[\s\-()]/g, "")
  const numCategories = lead.categoryLabels.length
  return {
    websiteExists: !!lead.website,
    googleMapsPresence: false,
    whatsappAvailable: !!lead.phone && /^(\+?255|0)[67]\d{8}$/.test(phoneClean),
    emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email),
    phoneReachable: !!lead.phone && /^\+?\d{7,15}$/.test(phoneClean),
    multiCategory: numCategories >= 2,
    socialPresence: false,
    businessRegistration: !!(lead.description && /(registered|ltd|limited|company|enterprise|co\.)/i.test(lead.description)),
  }
}

function scoreLead(lead: LeadCandidate): { score: number; level: TrustLevel } {
  const checks = computeChecks(lead)
  const weights: Record<string, number> = {
    websiteExists: 15, googleMapsPresence: 10, whatsappAvailable: 15,
    emailDeliverable: 10, phoneReachable: 10, multiCategory: 10,
    socialPresence: 10, businessRegistration: 10,
  }
  let total = 0
  let max = 0
  for (const [k, w] of Object.entries(weights)) {
    max += w
    if (checks[k]) total += w
  }
  const score = Math.round((total / max) * 100)
  const level: TrustLevel = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW"
  return { score, level }
}

function autoReviewStatus(lead: LeadCandidate): LeadStatus {
  let score = 0
  if (lead.website) score += 15
  const phone = (lead.phone ?? "").replace(/[\s\-()]/g, "")
  if (phone && /^(\+?255|0)[67]\d{8}$/.test(phone)) score += 15
  if (lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) score += 10
  if (lead.phone && /^\+?\d{7,15}$/.test(phone)) score += 5
  const numCats = lead.categoryLabels.length
  if (numCats >= 3) score += 10
  else if (numCats >= 2) score += 5
  if (lead.description && lead.description.length > 30) score += 5
  if (lead.companyName) score += 5
  if (lead.sourcePlatform && lead.sourcePlatform !== "Unknown") score += 5

  // Reachability boost: any lead with a valid Tanzanian mobile is
  // outreachable via WhatsApp — fast-track it to APPROVED so claim
  // links + WhatsApp activation messages can be generated.
  const reachable = !!phone && /^(\+?255|0)[67]\d{8}$/.test(phone)

  if (score >= 50 || (reachable && score >= 35)) return "APPROVED"
  if (score >= 20) return "REVIEW_PENDING"
  return "REJECTED"
}

function buildDescription(name: string, cats: string[], region: string): string {
  const catLabels = cats.map((c) => c.replace(/-/g, " ")).join(", ")
  return `${name} — ${catLabels} supplier serving ${region}, Tanzania. Trusted business with competitive pricing for construction and procurement projects. Listed in the Zanzibaba marketplace network.`
}

function entryToCandidate(entry: SeedSupplier, region: string): LeadCandidate {
  return {
    leadType:
      entry.cats.includes("logistics-truck") || entry.cats.includes("equipment-rental")
        ? "service"
        : "supplier",
    companyName: entry.name,
    website: entry.website ?? null,
    phone: entry.phone ?? null,
    email: entry.email ?? null,
    city: entry.addr.split(",")[0].trim(),
    country: "Tanzania",
    location: entry.addr,
    description: buildDescription(entry.name, entry.cats, region),
    categorySlug: entry.cats[0],
    categoryLabels: entry.cats,
    sourcePlatform: `${region} Extended Catalog`,
    sourceUrl: entry.website ?? null,
  }
}

function generateClaimToken(): string {
  return crypto.randomBytes(24).toString("hex")
}

function buildClaimUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.zanzibaba.com"
  return `${baseUrl}/claim/${token}`
}

function buildWhatsAppContent(
  companyName: string | null,
  contactName: string | null,
  categoryLabels: unknown,
  claimUrl: string,
  region: string
): string {
  const name = contactName || companyName || "there"
  const cats = Array.isArray(categoryLabels)
    ? categoryLabels.slice(0, 3).map((c) => String(c).replace(/-/g, " ")).join(", ")
    : "building supplies"
  return `Hi ${name}! 👋

Great news — Zanzibaba has built a free business profile for ${companyName ?? "your company"} on our procurement marketplace.

Zanzibaba connects verified suppliers with buyers across ${region} and the rest of East Africa — hotels, resorts, contractors, government tenders.

Your profile is ready:
✅ ${cats}
✅ Reach project buyers actively sourcing materials
✅ Free to claim. Free to list.

Claim your profile here: ${claimUrl}

This link is unique to your business. Click → review → go live in 2 minutes.

Founding-cohort suppliers get priority listing + free verification badge — closing soon.

— The Zanzibaba Team`
}

function buildFoundingInviteNotes(companyName: string | null, region: string): string {
  return `Founding Supplier Cohort invitation for ${companyName ?? "this supplier"} (region: ${region}).

Benefits:
• Free verification badge for 12 months
• Priority placement on /prices/[material] landing pages
• Featured "Founding Supplier" badge
• Direct access to RFQs from verified buyers
• Quarterly market-position report

Limited to 100 per region. Cohort closes 90 days after invite.`
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency = 6
): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency)
    const results = await Promise.all(chunk.map(worker))
    out.push(...results)
  }
  return out
}

async function ensureAgent() {
  const existing = await prisma.growthAgent.findFirst({
    where: { name: "Extended Supplier Acquisition Engine" },
  })
  if (existing) return existing
  return prisma.growthAgent.create({
    data: {
      name: "Extended Supplier Acquisition Engine",
      type: "SUPPLIER",
      description:
        "5 regions × 15 categories: Steel/Rebar, BRC, Cement, Concrete Plants, Aggregates, Quarry, Blocks, Bricks, Wood, Furniture, Kitchen, Aluminium, Glass, Truck, Equipment Rental — across Dar es Salaam, Zanzibar, Arusha, Dodoma, Mwanza.",
      config: {
        regions: ["Dar es Salaam", "Zanzibar", "Arusha", "Dodoma", "Mwanza"],
        categories: [...TARGET_CATEGORIES],
      },
      isActive: true,
    },
  })
}

export async function POST(req: Request) {
  const token = req.headers.get(ADMIN_TOKEN_HEADER)
  if (!token || token !== expectedAdminToken()) {
    return NextResponse.json({ error: "unauthorized", hint: "set header x-admin-token" }, { status: 401 })
  }

  let body: { dryRun?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    /* empty body OK */
  }
  const dryRun = body.dryRun === true

  const startedAt = new Date()
  const startMs = Date.now()
  const summary: Record<string, unknown> = {
    startedAt: startedAt.toISOString(),
    dryRun,
    ip: ipAddressOf(req),
  }

  const agent = await ensureAgent()
  const run = await prisma.scoutRun.create({
    data: {
      agentId: agent.id,
      status: "running",
      startedAt,
      log: "Extended acquisition run started",
    },
  })
  summary.runId = run.id

  // --- Stage 1: ingest with dedup ---
  let inserted = 0
  let duplicateCount = 0
  let scoreSum = 0
  const byRegion: Record<string, { totalSeed: number; inserted: number; duplicate: number }> = {}
  const byCategory: Record<string, number> = {}

  for (const rc of EXTENDED_SUPPLIER_CATALOG) {
    byRegion[rc.region] = { totalSeed: rc.entries.length, inserted: 0, duplicate: 0 }
    await runWithConcurrency(
      rc.entries,
      async (entry) => {
        const cand = entryToCandidate(entry, rc.region)
        const { score, level } = scoreLead(cand)
        const status = autoReviewStatus(cand)

        const dup = await prisma.discoveredLead.findFirst({
          where: {
            OR: [
              { companyName: cand.companyName },
              ...(cand.website ? [{ website: cand.website }] : []),
              ...(cand.phone ? [{ phone: cand.phone }] : []),
            ],
          },
          select: { id: true, trustScore: true, status: true, description: true, phone: true, website: true },
        })

        if (dup) {
          duplicateCount++
          byRegion[rc.region].duplicate++
          if (!dryRun && (dup.trustScore ?? 0) < score) {
            await prisma.discoveredLead.update({
              where: { id: dup.id },
              data: {
                trustScore: score,
                trustLevel: level,
                status: ["DISCOVERED", "REVIEW_PENDING"].includes(dup.status) ? status : dup.status,
                description: dup.description ?? cand.description,
                phone: dup.phone ?? cand.phone,
                website: dup.website ?? cand.website,
                categoryLabels: cand.categoryLabels,
              },
            })
          }
          return
        }

        if (!dryRun) {
          await prisma.discoveredLead.create({
            data: {
              agentId: agent.id,
              scoutRunId: run.id,
              leadType: cand.leadType,
              companyName: cand.companyName,
              phone: cand.phone,
              website: cand.website,
              email: cand.email,
              location: cand.location,
              country: cand.country,
              city: cand.city,
              description: cand.description,
              categorySlug: cand.categorySlug,
              categoryLabels: cand.categoryLabels,
              sourcePlatform: cand.sourcePlatform,
              sourceUrl: cand.sourceUrl,
              trustScore: score,
              trustLevel: level,
              status,
            },
          })
        }
        inserted++
        scoreSum += score
        byRegion[rc.region].inserted++
        for (const c of entry.cats) byCategory[c] = (byCategory[c] ?? 0) + 1
      },
      6
    )
  }
  summary.stage1 = { inserted, duplicateCount, byRegion, byCategory, avgScore: inserted ? Math.round(scoreSum / inserted) : 0 }

  // --- Stage 2: promote APPROVED → IMPORTED, plus re-evaluate
  // existing REVIEW_PENDING leads in case threshold changed. ---
  let promoted = 0
  let promotedFromReview = 0
  if (!dryRun) {
    const r = await prisma.discoveredLead.updateMany({
      where: { status: "APPROVED", importedAt: null },
      data: { status: "IMPORTED", importedAt: new Date() },
    })
    promoted = r.count
    // Re-score REVIEW_PENDING leads (use the same logic with reachability boost):
    // any lead with a valid Tanzanian mobile + reasonable score is fast-tracked.
    const pendingLeads = await prisma.discoveredLead.findMany({
      where: { status: "REVIEW_PENDING" },
      select: {
        id: true, website: true, phone: true, email: true,
        categoryLabels: true, description: true, companyName: true, sourcePlatform: true,
      },
    })
    await runWithConcurrency(
      pendingLeads,
      async (lead) => {
        const labels = Array.isArray(lead.categoryLabels) ? (lead.categoryLabels as string[]) : []
        const cand: LeadCandidate = {
          leadType: "supplier",
          companyName: lead.companyName ?? "",
          website: lead.website,
          phone: lead.phone,
          email: lead.email,
          city: "",
          country: "Tanzania",
          location: "",
          description: lead.description ?? "",
          categorySlug: labels[0] ?? "",
          categoryLabels: labels,
          sourcePlatform: lead.sourcePlatform ?? "",
          sourceUrl: null,
        }
        const newStatus = autoReviewStatus(cand)
        if (newStatus === "APPROVED") {
          await prisma.discoveredLead.update({
            where: { id: lead.id },
            data: { status: "IMPORTED", importedAt: new Date() },
          })
          promotedFromReview++
        }
      },
      6
    )
  }
  summary.stage2 = { promoted, promotedFromReview }

  // --- Stage 3: claim tokens ---
  let claimTokensGenerated = 0
  if (!dryRun) {
    const toClaim = await prisma.discoveredLead.findMany({
      where: { status: "IMPORTED", activationStatus: "NONE", claimToken: null },
      select: { id: true },
    })
    await runWithConcurrency(
      toClaim,
      async (lead) => {
        const token = generateClaimToken()
        await prisma.discoveredLead.update({
          where: { id: lead.id },
          data: {
            claimToken: token,
            activationStatus: "UNCLAIMED",
            claimLinkSentAt: new Date(),
          },
        })
        claimTokensGenerated++
      },
      6
    )
  }
  summary.stage3 = { claimTokensGenerated }

  // --- Stage 4: WhatsApp messages ---
  let whatsappPrepared = 0
  let whatsappSkipped = 0
  if (!dryRun) {
    const waLeads = await prisma.discoveredLead.findMany({
      where: {
        activationStatus: "UNCLAIMED",
        phone: { not: null },
        claimToken: { not: null },
      },
      select: { id: true, companyName: true, contactName: true, categoryLabels: true, city: true, claimToken: true },
    })
    await runWithConcurrency(
      waLeads,
      async (lead) => {
        const exists = await prisma.whatsAppMessage.findFirst({
          where: { leadId: lead.id, messageType: "activation" },
          select: { id: true },
        })
        if (exists) {
          whatsappSkipped++
          return
        }
        const region = lead.city ?? "Tanzania"
        const claimUrl = buildClaimUrl(lead.claimToken!)
        const content = buildWhatsAppContent(lead.companyName, lead.contactName, lead.categoryLabels, claimUrl, region)
        await prisma.whatsAppMessage.create({
          data: {
            leadId: lead.id,
            channel: "whatsapp",
            messageType: "activation",
            status: "PENDING",
            claimLink: claimUrl,
            content,
          },
        })
        whatsappPrepared++
      },
      6
    )
  }
  summary.stage4 = { whatsappPrepared, whatsappSkipped }

  // --- Stage 5: founding supplier invitations ---
  let foundingInvited = 0
  if (!dryRun) {
    const candidates = await prisma.discoveredLead.findMany({
      where: {
        activationStatus: { in: ["UNCLAIMED", "CLAIMED"] },
        foundingEntry: null,
        trustScore: { gte: 40 },
      },
      orderBy: { trustScore: "desc" },
      select: { id: true, companyName: true, city: true },
    })
    await runWithConcurrency(
      candidates,
      async (lead) => {
        const exists = await prisma.foundingSupplier.findUnique({
          where: { leadId: lead.id },
          select: { id: true },
        })
        if (exists) return
        const region = lead.city ?? "Tanzania"
        const notes = buildFoundingInviteNotes(lead.companyName, region)
        await prisma.foundingSupplier.create({
          data: {
            leadId: lead.id,
            stage: "INVITED",
            campaign: "founding-extended-overnight",
            notes,
          },
        })
        foundingInvited++
      },
      6
    )
  }
  summary.stage5 = { foundingInvited }

  // --- Stage 6: aggregate report ---
  const [
    totalLeads, byStatusGroups, totalApproved, totalImported,
    totalClaimReady, totalClaimed, totalWhatsApp, totalFounding,
    last24h,
  ] = await Promise.all([
    prisma.discoveredLead.count(),
    prisma.discoveredLead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.discoveredLead.count({ where: { status: { in: ["APPROVED", "IMPORTED"] } } }),
    prisma.discoveredLead.count({ where: { status: "IMPORTED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "CLAIMED" } }),
    prisma.whatsAppMessage.count({ where: { messageType: "activation" } }),
    prisma.foundingSupplier.count(),
    prisma.discoveredLead.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ])

  const topOpps = await prisma.discoveredLead.findMany({
    where: { activationStatus: "UNCLAIMED", trustScore: { gte: 40 } },
    orderBy: [{ trustScore: "desc" }, { createdAt: "desc" }],
    take: 30,
    select: {
      id: true, companyName: true, city: true, phone: true, website: true,
      categoryLabels: true, trustScore: true, trustLevel: true, claimToken: true,
    },
  })

  const durationSec = Math.round((Date.now() - startMs) / 1000)
  summary.stage6 = {
    totalLeads, totalApproved, totalImported, totalClaimReady, totalClaimed,
    totalWhatsApp, totalFounding, last24h,
    byStatus: byStatusGroups,
  }
  summary.topOpportunities = topOpps
  summary.durationSec = durationSec
  summary.completedAt = new Date().toISOString()

  await prisma.scoutRun.update({
    where: { id: run.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      recordsFound: inserted,
      recordsScored: claimTokensGenerated,
      duration: durationSec,
      log: `Extended run: inserted=${inserted} dup=${duplicateCount} promoted=${promoted} claimTokens=${claimTokensGenerated} whatsapp=${whatsappPrepared} founding=${foundingInvited}`,
    },
  })

  return NextResponse.json(summary)
}

export async function GET() {
  const [
    totalLeads, byStatus, totalImported, totalClaimReady, totalClaimed,
    totalWhatsApp, totalFounding, last24h,
  ] = await Promise.all([
    prisma.discoveredLead.count(),
    prisma.discoveredLead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.discoveredLead.count({ where: { status: "IMPORTED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "CLAIMED" } }),
    prisma.whatsAppMessage.count({ where: { messageType: "activation" } }),
    prisma.foundingSupplier.count(),
    prisma.discoveredLead.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ])

  const topOpps = await prisma.discoveredLead.findMany({
    where: { activationStatus: "UNCLAIMED", trustScore: { gte: 40 } },
    orderBy: [{ trustScore: "desc" }, { createdAt: "desc" }],
    take: 30,
    select: {
      id: true, companyName: true, city: true, phone: true, website: true,
      categoryLabels: true, trustScore: true, trustLevel: true,
    },
  })

  const byRegion = await prisma.discoveredLead.groupBy({
    by: ["city"],
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
    take: 25,
  })

  return NextResponse.json({
    totalLeads,
    last24hDiscovered: last24h,
    importedClaimReady: totalClaimReady,
    claimed: totalClaimed,
    totalImported,
    whatsappPrepared: totalWhatsApp,
    foundingInvited: totalFounding,
    byStatus,
    byRegion,
    topOpportunities: topOpps,
  })
}
