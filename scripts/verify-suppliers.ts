import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface LeadCheck {
  id: string
  companyName: string | null
  website: string | null
  country: string | null
  categorySlug: string | null
  trustScore: number
}

interface VerifyResult {
  leadId: string
  companyName: string
  website: string
  verifiedWebsite: boolean
  verifiedCompany: boolean
  verifiedExporter: boolean
  verificationScore: number
  tier: string
  notes: string
}

const TIMEOUT = 15000
const CONCURRENCY = 10

const EXPORT_KEYWORDS = [
  "export", "international", "global", "worldwide", "world-wide",
  "ship worldwide", "ship globally", "international shipping",
  "we export", "our global", "serving.*countries", "over.*countries",
  "multinational", "cross-border", "internationally",
]

const SKIP_COMPANIES = new Set(["", "unknown", "not available", "n/a"])

function normalizeUrl(url: string): string | null {
  if (!url || url.trim() === "") return null
  let u = url.trim().toLowerCase()
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    u = "https://" + u
  }
  try {
    const parsed = new URL(u)
    return parsed.toString()
  } catch {
    return null
  }
}

function companyNameMatch(companyName: string, pageText: string): boolean {
  const name = companyName.toLowerCase().trim()
  if (name.length < 3) return false

  if (pageText.includes(name)) return true

  const parts = name.split(/[\s&,/]+/).filter((p: string) => p.length > 3)
  const matched = parts.filter((p: string) => pageText.includes(p)).length
  return parts.length > 0 && matched >= Math.ceil(parts.length / 2)
}

function urlMatchesCompany(companyName: string, url: string): boolean {
  const name = companyName.toLowerCase().trim()
  const hostname = new URL(url).hostname.replace("www.", "")
  const nameSlug = name.replace(/[^a-z0-9]/g, "")
  const hostSlug = hostname.replace(/[^a-z0-9]/g, "")
  return hostSlug.includes(nameSlug) || nameSlug.includes(hostSlug)
}

function detectExportCapability(pageText: string, categorySlug: string | null): boolean {
  const text = pageText.toLowerCase()

  for (const kw of EXPORT_KEYWORDS) {
    const re = new RegExp(kw, "i")
    if (re.test(text)) return true
  }

  if (categorySlug === "solar-systems" || categorySlug === "hvac" || categorySlug === "elevators" || categorySlug === "steel-structures" || categorySlug === "steel-manufacturers") {
    return true
  }

  return false
}

async function checkWebsite(lead: LeadCheck): Promise<VerifyResult> {
  const noteParts: string[] = []
  let verifiedWebsite = false
  let verifiedCompany = false
  let verifiedExporter = false
  let score = 0

  const companyName = lead.companyName || ""
  const rawUrl = lead.website || ""

  const url = normalizeUrl(rawUrl)

  if (!url || SKIP_COMPANIES.has(companyName.toLowerCase())) {
    return {
      leadId: lead.id,
      companyName,
      website: rawUrl,
      verifiedWebsite: false,
      verifiedCompany: false,
      verifiedExporter: false,
      verificationScore: 0,
      tier: "C",
      notes: "No valid URL or company name",
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Zanzibaba-Verification/1.0" },
      redirect: "follow",
    })
    clearTimeout(timeout)

    if (response.ok) {
      verifiedWebsite = true
      score += 25
      noteParts.push("website reachable")

      const pageText = await response.text()

      if (companyNameMatch(companyName, pageText)) {
        verifiedCompany = true
        score += 30
        noteParts.push("company name found on page")
      } else if (urlMatchesCompany(companyName, url)) {
        verifiedCompany = true
        score += 20
        noteParts.push("company name matches URL domain")
      } else {
        score += 5
        noteParts.push("company name not found on page")
      }

      if (detectExportCapability(pageText, lead.categorySlug)) {
        verifiedExporter = true
        score += 25
        noteParts.push("export capability confirmed")
      } else {
        noteParts.push("export capability not detected")
      }
    } else {
      noteParts.push(`HTTP ${response.status}`)
      score += 5
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      noteParts.push("timeout")
    } else {
      noteParts.push(`connection error: ${err.message?.slice(0, 60) || "unknown"}`)
    }
    score += 2
  }

  if (lead.trustScore >= 70) {
    score += 10
    noteParts.push("high trust score")
  }

  if (url.startsWith("https")) {
    score += 5
  }

  score = Math.min(score, 100)

  let tier = "C"
  if (score >= 75) tier = "A"
  else if (score >= 45) tier = "B"

  return {
    leadId: lead.id,
    companyName,
    website: rawUrl,
    verifiedWebsite,
    verifiedCompany,
    verifiedExporter,
    verificationScore: score,
    tier,
    notes: noteParts.join("; "),
  }
}

async function processBatch(leads: LeadCheck[]): Promise<VerifyResult[]> {
  const results: VerifyResult[] = []
  for (let i = 0; i < leads.length; i += CONCURRENCY) {
    const batch = leads.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(checkWebsite))
    results.push(...batchResults)

    const done = Math.min(i + CONCURRENCY, leads.length)
    process.stdout.write(`\r  Verified ${done}/${leads.length} leads (${Math.round(done / leads.length * 100)}%)`)
  }
  process.stdout.write("\n")
  return results
}

async function main() {
  console.log("=== STRATEGIC SUPPLIER VERIFICATION ===\n")

  const leads = await prisma.discoveredLead.findMany({
    where: {
      dataClassification: { in: ["STRATEGIC_VERIFIED", "DISCOVERED_VERIFIED", "CLAIMED"] },
      website: { not: null },
    },
    select: {
      id: true,
      companyName: true,
      website: true,
      country: true,
      categorySlug: true,
      trustScore: true,
    },
    orderBy: [{ trustScore: "desc" }, { companyName: "asc" }],
  })

  console.log(`Total leads to verify: ${leads.length}`)
  console.log(`  STRATEGIC_VERIFIED: ${leads.filter(l => l.trustScore >= 70).length}`)
  console.log(`  DISCOVERED_VERIFIED: ${leads.filter(l => l.trustScore < 70).length}\n`)

  console.log("Processing website verification...")
  const results = await processBatch(leads)

  const fs = await import("fs")
  const reportPath = "scripts/verification-results.json"
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`\nResults saved to ${reportPath}`)

  console.log("\n=== UPDATING DATABASE ===\n")

  const BATCH_SIZE = 50
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    const batch = results.slice(i, i + BATCH_SIZE)
    const now = new Date()

    for (const r of batch) {
      await prisma.discoveredLead.update({
        where: { id: r.leadId },
        data: {
          verifiedWebsite: r.verifiedWebsite,
          verifiedCompany: r.verifiedCompany,
          verifiedExporter: r.verifiedExporter,
          verificationScore: r.verificationScore,
          tier: r.tier,
          verificationNotes: r.notes,
          verifiedBy: "system-verification-sprint",
          verifiedDate: now,
        },
      })
    }

    const progress = Math.min(i + BATCH_SIZE, results.length)
    process.stdout.write(`\r  DB update: ${progress}/${results.length}`)
  }
  process.stdout.write("\n")

  await syncDirectoryEntities(results)

  console.log("\n=== VERIFICATION REPORT ===\n")

  const tierA = results.filter(r => r.tier === "A")
  const tierB = results.filter(r => r.tier === "B")
  const tierC = results.filter(r => r.tier === "C")

  console.log(`Tier A (Score >= 75, Fully Verified): ${tierA.length}`)
  console.log(`Tier B (Score 45-74, Partially Verified): ${tierB.length}`)
  console.log(`Tier C (Score < 45, Needs Review): ${tierC.length}`)
  console.log("")

  const withWebsite = results.filter(r => r.verifiedWebsite).length
  const withCompany = results.filter(r => r.verifiedCompany).length
  const withExporter = results.filter(r => r.verifiedExporter).length

  console.log("Verification Level Breakdown:")
  console.log(`  Verified Website:  ${withWebsite}/${results.length}`)
  console.log(`  Verified Company:  ${withCompany}/${results.length}`)
  console.log(`  Verified Exporter: ${withExporter}/${results.length}`)
  console.log("")

  const avgScore = Math.round(results.reduce((s, r) => s + r.verificationScore, 0) / results.length)
  console.log(`Average Verification Score: ${avgScore}/100`)
  console.log("")

  console.log("=== OUTREACH PRIORITY LISTS ===\n")

  console.log("--- TIER A: Top Priority (Fully Verified) ---")
  tierA.slice(0, 20).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.companyName} | Score: ${r.verificationScore} | Web: ${r.verifiedWebsite} | Co: ${r.verifiedCompany} | Exp: ${r.verifiedExporter}`)
  })

  console.log(`\n--- TIER B: Secondary (Partially Verified) ---`)
  console.log(`  ${tierB.length} suppliers ready for outreach`)
  tierB.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.companyName} | Score: ${r.verificationScore} | ${r.notes}`)
  })

  console.log(`\n--- TIER C: Needs Further Review ---`)
  console.log(`  ${tierC.length} suppliers need manual review`)

  const ts = new Date().toISOString()
  console.log(`\n\nVerification completed at: ${ts}`)
}

async function syncDirectoryEntities(results: VerifyResult[]) {
  const leadIds = results.map(r => r.leadId)
  const entities = await prisma.directoryEntity.findMany({
    where: { discoveredLeadId: { in: leadIds } },
    select: { id: true, discoveredLeadId: true },
  })

  const resultMap = new Map(results.map(r => [r.leadId, r]))

  for (const entity of entities) {
    const r = resultMap.get(entity.discoveredLeadId!)
    if (!r) continue
    await prisma.directoryEntity.update({
      where: { id: entity.id },
      data: {
        verifiedWebsite: r.verifiedWebsite,
        verifiedCompany: r.verifiedCompany,
        verifiedExporter: r.verifiedExporter,
        verificationScore: r.verificationScore,
        tier: r.tier,
      },
    })
  }

  console.log(`Synced ${entities.length} DirectoryEntity records`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
