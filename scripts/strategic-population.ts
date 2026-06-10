import { runDiscoveryV2, importDiscoveryLeads } from "../src/lib/discovery-v2/runner"
import type { DiscoverySourceV2, TargetCountry, DiscoveryV2Lead } from "../src/lib/discovery-v2/types"
import { prisma } from "../src/lib/prisma"

const SOURCE: DiscoverySourceV2[] = ["apify-web"]

const PRIORITY_CATEGORIES = [
  "steel-manufacturers",
  "prefab-houses",
  "hotel-furniture",
  "building-materials",
  "hvac",
  "solar-systems",
]

const CATEGORY_QUOTA: Record<string, { min: number; label: string }> = {
  "steel-manufacturers": { min: 35, label: "Steel Manufacturers" },
  "prefab-houses": { min: 30, label: "Prefab Houses" },
  "hotel-furniture": { min: 25, label: "Hotel Furniture" },
  "building-materials": { min: 20, label: "Building Materials" },
  hvac: { min: 20, label: "HVAC" },
  "solar-systems": { min: 20, label: "Solar Systems" },
}

const CATEGORY_QUERIES: Record<string, string[]> = {
  "steel-manufacturers": ["steel manufacturers", "steel suppliers"],
  "prefab-houses": ["prefabricated houses manufacturers", "modular home manufacturers"],
  "hotel-furniture": ["hotel furniture manufacturers", "hospitality furniture"],
  "building-materials": ["building materials suppliers", "construction materials"],
  hvac: ["HVAC manufacturers", "commercial HVAC"],
  "solar-systems": ["solar panel manufacturers", "solar energy suppliers"],
}

const TARGET_COUNTRIES = ["Tanzania", "Kenya", "UAE", "India", "China", "Turkey", "South Africa"]

const TARGET_MIN = 150

function computeValueScore(lead: DiscoveryV2Lead): number {
  let score = 0
  if (lead.hasWebsite) score += 25
  if (lead.hasEmail) score += 25
  if (lead.hasExportEvidence) score += 20
  if (lead.isManufacturer) score += 15
  if (lead.isStrategicCategory) score += 15
  return Math.min(score, 100)
}

function hasRequiredFields(lead: DiscoveryV2Lead): boolean {
  return !!(lead.companyName && lead.website && lead.country && lead.category)
}

async function main() {
  const startTime = Date.now()
  console.log("=".repeat(70))
  console.log("  STRATEGIC SUPPLIER POPULATION — FULL BATCH")
  console.log("=".repeat(70))
  console.log(`  Source: Apify Web`)
  console.log(`  Categories: ${PRIORITY_CATEGORIES.length}`)
  console.log(`  Countries: ${TARGET_COUNTRIES.length}`)
  console.log(`  Target: ${TARGET_MIN} suppliers\n`)

  // Phase 1: Discovery (Apify Web only)
  console.log("─".repeat(70))
  console.log("  PHASE 1: DISCOVERY")
  console.log("─".repeat(70))

  const allLeads: DiscoveryV2Lead[] = []
  let totalRaw = 0
  const errors: string[] = []

  for (const country of TARGET_COUNTRIES) {
    console.log(`\n  --- ${country} ---`)
    for (const slug of PRIORITY_CATEGORIES) {
      const queries = CATEGORY_QUERIES[slug]
      try {
        process.stdout.write(`    ${CATEGORY_QUOTA[slug].label.padEnd(25)} `)
        const result = await runDiscoveryV2({
          queries,
          sources: SOURCE,
          country: country as TargetCountry,
          category: slug,
          preview: true,
        })
        const qualified = result.leads.filter(hasRequiredFields)
        totalRaw += result.leads.length
        allLeads.push(...qualified)
        console.log(`${result.leads.length} found, ${qualified.length} qualified`)
        await new Promise((r) => setTimeout(r, 300))
      } catch (err: any) {
        errors.push(`${country}/${slug}: ${err.message || String(err)}`)
        console.log(`ERROR: ${err.message}`)
      }
    }
  }

  // Phase 2: Dedup + Score
  console.log(`\n\n${"─".repeat(70)}`)
  console.log("  PHASE 2: DEDUP & SCORING")
  console.log("─".repeat(70))

  const seen = new Map<string, DiscoveryV2Lead>()
  for (const lead of allLeads) {
    const key = lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
    const domainKey = lead.website
      ? lead.website.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").toLowerCase()
      : ""
    let existing = seen.get(key)
    if (!existing && domainKey) existing = seen.get(`d:${domainKey}`)
    if (existing) {
      if (lead.website && !existing.website) existing.website = lead.website
      if (lead.email && !existing.email) existing.email = lead.email
      if (lead.trustScore > existing.trustScore) existing.trustScore = lead.trustScore
      existing.hasEmail = existing.hasEmail || lead.hasEmail
      existing.hasWebsite = existing.hasWebsite || lead.hasWebsite
      existing.hasExportEvidence = existing.hasExportEvidence || lead.hasExportEvidence
      existing.isManufacturer = existing.isManufacturer || lead.isManufacturer
      existing.valueScore = Math.max(existing.valueScore, computeValueScore(existing))
    } else {
      lead.valueScore = computeValueScore(lead)
      seen.set(key, lead)
      if (domainKey) seen.set(`d:${domainKey}`, lead)
    }
  }

  const deduped = Array.from(seen.values()).filter(hasRequiredFields)
  deduped.sort((a, b) => (b.valueScore || computeValueScore(b)) - (a.valueScore || computeValueScore(a)))

  console.log(`\n  Raw leads:     ${totalRaw}`)
  console.log(`  Qualified:     ${allLeads.length}`)
  console.log(`  After dedup:   ${deduped.length}`)
  console.log(`  Dup rate:      ${totalRaw > 0 ? Math.round(((totalRaw - deduped.length) / totalRaw) * 100) : 0}%`)

  // Phase 3: Fill quotas
  console.log(`\n\n${"─".repeat(70)}`)
  console.log("  PHASE 3: QUOTA FILL")
  console.log("─".repeat(70))

  const byCategory: Record<string, DiscoveryV2Lead[]> = {}
  for (const lead of deduped) {
    if (!byCategory[lead.category]) byCategory[lead.category] = []
    byCategory[lead.category].push(lead)
  }

  const selected: DiscoveryV2Lead[] = []
  const catCounts: Record<string, number> = {}

  for (const [cat, quota] of Object.entries(CATEGORY_QUOTA)) {
    const leads = (byCategory[cat] || []).sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0))
    const take = Math.min(leads.length, quota.min)
    selected.push(...leads.slice(0, take))
    catCounts[cat] = take
    console.log(`  ${quota.label.padEnd(25)} ${take}/${quota.min} (${leads.length} available)`)
  }

  let remaining = TARGET_MIN - selected.length
  if (remaining > 0) {
    const pool = deduped.filter((l) => !selected.find((t) => t.companyName === l.companyName))
    const extras = pool.slice(0, remaining)
    selected.push(...extras)
    for (const lead of extras) {
      catCounts[lead.category] = (catCounts[lead.category] || 0) + 1
    }
    console.log(`\n  Extra: ${extras.length} to reach ${TARGET_MIN}`)
  } else if (remaining < 0) {
    console.log(`\n  Trimming: ${Math.abs(remaining)} excess (keeping top ${TARGET_MIN})`)
    selected.length = TARGET_MIN
  }

  console.log(`  Total selected: ${selected.length}`)

  // Phase 4: Import
  console.log(`\n\n${"─".repeat(70)}`)
  console.log("  PHASE 4: IMPORT")
  console.log("─".repeat(70))

  const importResult = await importDiscoveryLeads(selected)
  console.log(`  Imported:  ${importResult.imported}`)
  console.log(`  Tokens:    ${importResult.tokensGenerated}`)
  if (importResult.errors.length > 0) {
    console.log(`  Errors:    ${importResult.errors.length}`)
    importResult.errors.slice(0, 5).forEach((e) => console.log(`    - ${e}`))
  }

  // Phase 5: Report
  const duration = Math.round((Date.now() - startTime) / 1000)
  const allImported = await prisma.discoveredLead.findMany({
    where: { sourcePlatform: { contains: "V2 Discovery" } },
    orderBy: { trustScore: "desc" },
  })

  const reportCountry: Record<string, number> = {}
  const reportCategory: Record<string, number> = {}
  let w = 0, e = 0, p = 0
  for (const l of allImported) {
    const c = l.country || "Unknown"
    const cat = l.categorySlug || "unknown"
    reportCountry[c] = (reportCountry[c] || 0) + 1
    reportCategory[cat] = (reportCategory[cat] || 0) + 1
    if (l.website) w++
    if (l.email) e++
    if (l.phone) p++
  }

  console.log("\n\n" + "=".repeat(70))
  console.log("  POPULATION REPORT")
  console.log("=".repeat(70))
  console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`)
  console.log(`  Total imported: ${importResult.imported}`)
  console.log(`  Total in DB (all V2): ${allImported.length}`)
  console.log(`\n  BY COUNTRY:`)
  for (const [c, n] of Object.entries(reportCountry).sort((a, b) => b[1] - a[1])) console.log(`    ${c.padEnd(15)} ${n}`)
  console.log(`\n  BY CATEGORY:`)
  for (const [c, n] of Object.entries(reportCategory).sort((a, b) => b[1] - a[1])) console.log(`    ${c.padEnd(25)} ${n}`)
  console.log(`\n  COVERAGE:`)
  console.log(`    Website: ${w}/${allImported.length} (${Math.round((w / allImported.length) * 100)}%)`)
  console.log(`    Email:   ${e}/${allImported.length} (${Math.round((e / allImported.length) * 100)}%)`)
  console.log(`    Phone:   ${p}/${allImported.length} (${Math.round((p / allImported.length) * 100)}%)`)

  // Create enrichment records
  console.log(`\n  Creating enrichment records...`)
  let enriched = 0
  for (const l of allImported) {
    try {
      await prisma.supplierEnrichment.create({
        data: {
          discoveredLeadId: l.id,
          enrichmentStatus: "pending",
          country: l.country || undefined,
          companyDescription: l.description || undefined,
        },
      })
      enriched++
    } catch (_) {}
  }
  console.log(`  Enrichment records: ${enriched}`)

  await prisma.$disconnect()
  console.log("\n" + "=".repeat(70))
  console.log("  POPULATION COMPLETE")
  console.log("=".repeat(70))
}

main().catch((e) => {
  console.error("Population failed:", e)
  process.exit(1)
})
