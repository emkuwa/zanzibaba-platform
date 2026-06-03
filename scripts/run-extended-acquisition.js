/**
 * Continuous acquisition orchestrator.
 *
 * Ingests the EXTENDED_SUPPLIER_CATALOG (5 regions × 15 categories),
 * runs through dedup → enrich → score → promote → claim → WhatsApp →
 * founding-invite, and reports aggregate stats. Designed to be invoked
 * repeatedly (overnight cron or manual).
 *
 * Safe to re-run: every operation upserts or dedupes by composite key.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const crypto = require("node:crypto")
const fs = require("node:fs")
const path = require("node:path")

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes("?") ? "&" : "?") + "connection_limit=10&pool_timeout=30",
})

// Load the catalog from the compiled bundle if available, otherwise from the TS source via simple parse.
function loadCatalog() {
  const tsSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "acquisition", "seeds", "extended-catalog.ts"), "utf8")
  const regions = [
    { region: "Dar es Salaam", marker: "const DAR_ES_SALAAM" },
    { region: "Zanzibar", marker: "const ZANZIBAR" },
    { region: "Arusha", marker: "const ARUSHA" },
    { region: "Dodoma", marker: "const DODOMA" },
    { region: "Mwanza", marker: "const MWANZA" },
  ]
  function extract(marker) {
    const idx = tsSrc.indexOf(marker)
    if (idx === -1) throw new Error("missing " + marker)
    const eq = tsSrc.indexOf("=", idx)
    const start = tsSrc.indexOf("[", eq)
    let depth = 0, end = -1, inStr = false, ch = ""
    for (let i = start; i < tsSrc.length; i++) {
      const c = tsSrc[i]; const prev = tsSrc[i - 1]
      if (inStr) { if (c === ch && prev !== "\\") inStr = false; continue }
      if (c === '"' || c === "'" || c === "`") { inStr = true; ch = c; continue }
      if (c === "[") depth++
      else if (c === "]") { depth--; if (depth === 0) { end = i + 1; break } }
    }
    let s = tsSrc.slice(start, end)
    s = s.replace(/\/\/[^\n]*/g, "")
    s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    s = s.replace(/,(\s*[}\]])/g, "$1")
    return JSON.parse(s)
  }
  const catalog = regions.map((r) => ({ region: r.region, entries: extract(r.marker) }))
  return catalog
}

const TARGET_CATEGORIES = [
  "rebars", "brc", "cement", "concrete-plants", "aggregates",
  "quarry-operators", "blocks", "bricks", "timber",
  "furniture", "kitchen-cabinets", "aluminium", "glass",
  "logistics-truck", "equipment-rental",
]

// --- helpers (ported from src/lib/acquisition/discovery-agent.ts & review-queue.ts) ---

function computeChecks(lead) {
  const phoneClean = (lead.phone || "").replace(/[\s\-()]/g, "")
  const numCategories = (lead.categoryLabels || []).length
  return {
    websiteExists: !!lead.website,
    googleMapsPresence: false,
    whatsappAvailable: !!lead.phone && /^(\+?255|0)[67]\d{8}$/.test(phoneClean),
    emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email),
    phoneReachable: !!lead.phone && /^\+?\d{7,15}$/.test(phoneClean),
    multiCategory: numCategories >= 2,
    socialPresence: !!(lead.socialProfiles && Object.keys(lead.socialProfiles).length > 0),
    businessRegistration: !!(lead.description && /(registered|ltd|limited|company|enterprise|co\.)/i.test(lead.description)),
  }
}

function scoreLead(lead) {
  const checks = computeChecks(lead)
  const weights = {
    websiteExists: 15, googleMapsPresence: 10, whatsappAvailable: 15,
    emailDeliverable: 10, phoneReachable: 10, multiCategory: 10,
    socialPresence: 10, businessRegistration: 10,
  }
  let total = 0, max = 0
  for (const [k, w] of Object.entries(weights)) { max += w; if (checks[k]) total += w }
  const score = Math.round((total / max) * 100)
  const level = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW"
  return { score, level, checks }
}

function autoReviewStatus(lead) {
  let score = 0
  if (lead.website) score += 15
  const phone = (lead.phone || "").replace(/[\s\-()]/g, "")
  if (phone && /^(\+?255|0)[67]\d{8}$/.test(phone)) score += 15
  if (lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) score += 10
  if (lead.phone && /^\+?\d{7,15}$/.test(phone)) score += 5
  const numCats = (lead.categoryLabels || []).length
  if (numCats >= 3) score += 10
  else if (numCats >= 2) score += 5
  if (lead.description && lead.description.length > 30) score += 5
  if (lead.companyName) score += 5
  if (lead.sourcePlatform && lead.sourcePlatform !== "Unknown") score += 5
  if (score >= 55) return "APPROVED"
  if (score >= 25) return "REVIEW_PENDING"
  return "REJECTED"
}

function buildDescription(name, cats, addr, region) {
  const catLabels = cats.map((c) => c.replace(/-/g, " ")).join(", ")
  return `${name} — ${catLabels} supplier serving ${region}, Tanzania. Trusted business with competitive pricing for construction and procurement projects. Listed in the Zanzibaba marketplace network.`
}

function generateClaimToken() {
  return crypto.randomBytes(24).toString("hex")
}

function buildClaimUrl(token) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.zanzibaba.com"
  return `${baseUrl}/claim/${token}`
}

function buildWhatsAppContent(companyName, contactName, categoryLabels, claimUrl, region) {
  const name = contactName || companyName || "there"
  const cats = Array.isArray(categoryLabels) ? categoryLabels.slice(0, 3).map((c) => String(c).replace(/-/g, " ")).join(", ") : "building supplies"
  return `Hi ${name}! 👋

Great news — Zanzibaba has built a free business profile for ${companyName || "your company"} on our procurement marketplace.

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

function buildFoundingInvite(companyName, region) {
  return `Subject: Founding Supplier Cohort — invitation for ${companyName}

You're invited to join Zanzibaba's Founding Supplier Program for the ${region} region.

The first 100 suppliers across our 5 target regions get:
• Free verification badge for 12 months
• Priority placement on /prices/[material] landing pages (high organic traffic)
• Featured "Founding Supplier" badge on every listing
• Direct access to RFQs from verified hotel & construction buyers
• Quarterly market-position report for your category

To accept: claim your profile via the link in our WhatsApp / email, then complete verification (license + tax ID upload). Takes <10 minutes.

Limited to 100 per region. Founding cohort closes 90 days after your invite.

— The Zanzibaba Team`
}

// --- main ---

async function ensureAgent() {
  let agent = await prisma.growthAgent.findFirst({
    where: { name: "Extended Supplier Acquisition Engine" },
  })
  if (!agent) {
    agent = await prisma.growthAgent.create({
      data: {
        name: "Extended Supplier Acquisition Engine",
        type: "SUPPLIER",
        description: "5 regions × 15 categories: Steel/Rebar, BRC, Cement, Concrete Plants, Aggregates, Quarry, Blocks, Bricks, Wood, Furniture, Kitchen, Aluminium, Glass, Truck, Equipment Rental — across Dar es Salaam, Zanzibar, Arusha, Dodoma, Mwanza.",
        config: {
          regions: ["Dar es Salaam", "Zanzibar", "Arusha", "Dodoma", "Mwanza"],
          categories: TARGET_CATEGORIES,
        },
        isActive: true,
      },
    })
  }
  return agent
}

async function createRun(agentId) {
  return prisma.scoutRun.create({
    data: { agentId, status: "running", startedAt: new Date(), log: "Continuous acquisition started" },
  })
}

async function completeRun(runId, recordsFound, recordsScored, log) {
  const run = await prisma.scoutRun.findUnique({ where: { id: runId } })
  if (!run) return
  const duration = Math.round((Date.now() - run.startedAt.getTime()) / 1000)
  await prisma.scoutRun.update({
    where: { id: runId },
    data: { status: "completed", completedAt: new Date(), recordsFound, recordsScored, log, duration },
  })
}

async function main() {
  const startTime = Date.now()
  const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

  log("=== EXTENDED ACQUISITION ORCHESTRATOR ===")
  const agent = await ensureAgent()
  log(`Agent: ${agent.name} (${agent.id})`)
  const run = await createRun(agent.id)
  log(`Run: ${run.id}`)

  // 1. Load catalog
  const catalog = loadCatalog()
  let totalEntries = 0
  for (const rc of catalog) totalEntries += rc.entries.length
  log(`Catalog loaded: ${catalog.length} regions, ${totalEntries} entries`)

  // 2. Insert leads with dedup
  log("→ stage 1: discovery + dedup")
  let inserted = 0, duplicate = 0, byRegion = {}, byCategory = {}
  for (const rc of catalog) {
    byRegion[rc.region] = byRegion[rc.region] || { total: 0, new: 0 }
    for (const entry of rc.entries) {
      byRegion[rc.region].total++
      const lead = {
        leadType: entry.cats.includes("logistics-truck") || entry.cats.includes("equipment-rental") ? "service" : "supplier",
        companyName: entry.name,
        website: entry.website || null,
        phone: entry.phone || null,
        email: entry.email || null,
        city: entry.addr.split(",")[0].trim(),
        country: "Tanzania",
        location: entry.addr,
        description: buildDescription(entry.name, entry.cats, entry.addr, rc.region),
        categorySlug: entry.cats[0],
        categoryLabels: entry.cats,
        sourcePlatform: `${rc.region} Extended Catalog`,
        sourceUrl: entry.website || null,
      }
      const { score, level } = scoreLead(lead)
      const reviewStatus = autoReviewStatus(lead)
      const status = reviewStatus

      // dedup by companyName OR website OR phone
      const dup = await prisma.discoveredLead.findFirst({
        where: {
          OR: [
            { companyName: lead.companyName },
            ...(lead.website ? [{ website: lead.website }] : []),
            ...(lead.phone ? [{ phone: lead.phone }] : []),
          ],
        },
      })
      if (dup) {
        duplicate++
        // ensure tier/score upgrades propagate
        if ((dup.trustScore || 0) < score) {
          await prisma.discoveredLead.update({
            where: { id: dup.id },
            data: {
              trustScore: score,
              trustLevel: level,
              status: ["DISCOVERED", "REVIEW_PENDING"].includes(dup.status) ? status : dup.status,
              categoryLabels: lead.categoryLabels,
              description: dup.description ?? lead.description,
              phone: dup.phone ?? lead.phone,
              website: dup.website ?? lead.website,
            },
          })
        }
        continue
      }
      await prisma.discoveredLead.create({
        data: {
          agentId: agent.id,
          scoutRunId: run.id,
          leadType: lead.leadType,
          companyName: lead.companyName,
          phone: lead.phone,
          website: lead.website,
          email: lead.email,
          location: lead.location,
          country: lead.country,
          city: lead.city,
          description: lead.description,
          categorySlug: lead.categorySlug,
          categoryLabels: lead.categoryLabels,
          sourcePlatform: lead.sourcePlatform,
          sourceUrl: lead.sourceUrl,
          trustScore: score,
          trustLevel: level,
          status,
        },
      })
      inserted++
      byRegion[rc.region].new++
      for (const c of entry.cats) byCategory[c] = (byCategory[c] || 0) + 1
    }
    log(`   ${rc.region}: ${byRegion[rc.region].new}/${byRegion[rc.region].total} new (${byRegion[rc.region].total - byRegion[rc.region].new} dedup)`)
  }
  log(`Stage 1: inserted ${inserted}, dedup ${duplicate}`)

  // 3. Promote APPROVED → IMPORTED (claim-ready)
  log("→ stage 2: promote APPROVED → IMPORTED")
  const promoteRes = await prisma.discoveredLead.updateMany({
    where: { status: "APPROVED", importedAt: null },
    data: { status: "IMPORTED", importedAt: new Date() },
  })
  log(`Promoted ${promoteRes.count} leads to IMPORTED`)

  // 4. Generate claim tokens for IMPORTED leads
  log("→ stage 3: generate claim tokens")
  const toClaim = await prisma.discoveredLead.findMany({
    where: { status: "IMPORTED", activationStatus: "NONE", claimToken: null },
  })
  log(`${toClaim.length} leads need claim tokens`)
  let claimTokens = 0
  const BATCH = 8
  for (let i = 0; i < toClaim.length; i += BATCH) {
    const chunk = toClaim.slice(i, i + BATCH)
    await Promise.all(chunk.map(async (lead) => {
      const token = generateClaimToken()
      await prisma.discoveredLead.update({
        where: { id: lead.id },
        data: {
          claimToken: token,
          activationStatus: "UNCLAIMED",
          claimLinkSentAt: new Date(),
        },
      })
      claimTokens++
    }))
    process.stdout.write(`   ${Math.min(i + BATCH, toClaim.length)}/${toClaim.length}\r`)
  }
  if (toClaim.length) process.stdout.write("\n")
  log(`Stage 3: ${claimTokens} claim tokens generated`)

  // 5. Prepare WhatsApp activation messages for UNCLAIMED leads with phones
  log("→ stage 4: prepare WhatsApp activation messages")
  const waLeads = await prisma.discoveredLead.findMany({
    where: { activationStatus: "UNCLAIMED", phone: { not: null }, claimToken: { not: null } },
  })
  log(`${waLeads.length} candidates for WhatsApp message`)
  let waPrepared = 0, waSkipped = 0
  for (let i = 0; i < waLeads.length; i += BATCH) {
    const chunk = waLeads.slice(i, i + BATCH)
    await Promise.all(chunk.map(async (lead) => {
      const existing = await prisma.whatsAppMessage.findFirst({
        where: { leadId: lead.id, messageType: "activation" },
      })
      if (existing) { waSkipped++; return }
      const region = lead.city || "Tanzania"
      const claimUrl = buildClaimUrl(lead.claimToken)
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
      waPrepared++
    }))
    process.stdout.write(`   ${Math.min(i + BATCH, waLeads.length)}/${waLeads.length}\r`)
  }
  if (waLeads.length) process.stdout.write("\n")
  log(`Stage 4: ${waPrepared} WhatsApp messages prepared, ${waSkipped} skipped (already exist)`)

  // 6. Create founding supplier invitations
  log("→ stage 5: founding supplier invitations")
  const foundingCandidates = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: { in: ["UNCLAIMED", "CLAIMED"] },
      foundingEntry: null,
      trustScore: { gte: 40 },
    },
    orderBy: { trustScore: "desc" },
  })
  log(`${foundingCandidates.length} qualified for founding cohort (trust ≥ 40)`)
  let foundingInvited = 0
  for (let i = 0; i < foundingCandidates.length; i += BATCH) {
    const chunk = foundingCandidates.slice(i, i + BATCH)
    await Promise.all(chunk.map(async (lead) => {
      const exists = await prisma.foundingSupplier.findUnique({ where: { leadId: lead.id } })
      if (exists) return
      const region = lead.city || "Tanzania"
      const inviteText = buildFoundingInvite(lead.companyName, region)
      await prisma.foundingSupplier.create({
        data: {
          leadId: lead.id,
          stage: "INVITED",
          campaign: "founding-extended-overnight",
          notes: inviteText,
        },
      })
      foundingInvited++
    }))
    process.stdout.write(`   ${Math.min(i + BATCH, foundingCandidates.length)}/${foundingCandidates.length}\r`)
  }
  if (foundingCandidates.length) process.stdout.write("\n")
  log(`Stage 5: ${foundingInvited} founding invitations created`)

  // 7. Aggregate stats
  log("→ stage 6: aggregate stats")
  const [
    totalLeads, byRegionCount, byStatus, totalApproved, totalImported,
    totalClaimReady, totalClaimed, totalWhatsApp, totalFounding,
    todayDiscovered,
  ] = await Promise.all([
    prisma.discoveredLead.count(),
    prisma.discoveredLead.groupBy({ by: ["city"], _count: { _all: true } }),
    prisma.discoveredLead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.discoveredLead.count({ where: { status: { in: ["APPROVED", "IMPORTED"] } } }),
    prisma.discoveredLead.count({ where: { status: "IMPORTED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "CLAIMED" } }),
    prisma.whatsAppMessage.count({ where: { messageType: "activation" } }),
    prisma.foundingSupplier.count(),
    prisma.discoveredLead.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ])

  // Top opportunities = HIGH trust + claim-ready
  const topOpps = await prisma.discoveredLead.findMany({
    where: { activationStatus: "UNCLAIMED", trustScore: { gte: 50 } },
    orderBy: [{ trustScore: "desc" }, { createdAt: "desc" }],
    take: 25,
    select: {
      companyName: true, city: true, phone: true, website: true,
      categoryLabels: true, trustScore: true, trustLevel: true, claimToken: true,
    },
  })

  const duration = Math.round((Date.now() - startTime) / 1000)
  await completeRun(run.id, inserted, claimTokens, `inserted=${inserted} dedup=${duplicate} imported=${promoteRes.count} claimTokens=${claimTokens} whatsapp=${waPrepared} founding=${foundingInvited}`)

  // Final report
  log("")
  log("=== ACQUISITION RUN REPORT ===")
  log(`Duration: ${duration}s`)
  log(`Total leads in DB: ${totalLeads}`)
  log(`Last 24h discovered: ${todayDiscovered}`)
  log("")
  log("By status:")
  for (const s of byStatus) log(`  ${s.status.padEnd(20)} ${s._count._all}`)
  log("")
  log(`Approved / Imported: ${totalApproved}`)
  log(`Claim-ready (UNCLAIMED): ${totalClaimReady}`)
  log(`Claimed: ${totalClaimed}`)
  log(`WhatsApp messages prepared: ${totalWhatsApp}`)
  log(`Founding supplier invitations: ${totalFounding}`)
  log("")
  log("Top opportunities (top 25 unclaimed by trust):")
  for (const o of topOpps.slice(0, 25)) {
    const cats = Array.isArray(o.categoryLabels) ? o.categoryLabels.slice(0, 2).join(",") : ""
    log(`  ${String(o.trustScore).padEnd(3)} ${(o.trustLevel || "").padEnd(7)} ${o.companyName.padEnd(45)} ${(o.city || "").padEnd(20)} ${cats}`)
  }

  // Persist report to file
  const reportFile = path.join(__dirname, "..", "..", "docs", "ACQUISITION-RUN-LATEST.json")
  fs.writeFileSync(reportFile, JSON.stringify({
    runId: run.id,
    runAt: new Date().toISOString(),
    duration,
    counts: {
      totalLeads, inserted, duplicate,
      promotedToImported: promoteRes.count,
      claimTokensGenerated: claimTokens,
      whatsappPrepared: waPrepared,
      foundingInvited,
      todayDiscovered,
      totalApproved, totalClaimReady, totalClaimed, totalWhatsApp, totalFounding,
    },
    byStatus,
    byRegionInsertion: byRegion,
    byCategoryInsertion: byCategory,
    topOpportunities: topOpps,
  }, null, 2))
  log(`\nReport JSON saved: ${reportFile}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
