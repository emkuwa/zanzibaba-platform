import { runDiscoveryV2, importDiscoveryLeads } from "../src/lib/discovery-v2/runner"
import type { DiscoverySourceV2, TargetCountry, DiscoveryV2Lead } from "../src/lib/discovery-v2/types"
import { prisma } from "../src/lib/prisma"

const VALIDATION_COUNTRIES = ["Tanzania", "Kenya", "UAE"] as const

const VALIDATION_CATEGORIES: Record<string, { slug: string; queries: string[] }> = {
  "steel-manufacturers": {
    slug: "steel-manufacturers",
    queries: [
      "steel manufacturers",
      "steel suppliers",
      "structural steel",
      "steel products",
    ],
  },
  "rebar-manufacturers": {
    slug: "rebar-manufacturers",
    queries: [
      "rebar manufacturers",
      "steel reinforcement",
      "rebar suppliers",
      "construction steel",
    ],
  },
  "building-materials": {
    slug: "building-materials",
    queries: [
      "building materials suppliers",
      "construction materials",
      "building supply wholesale",
      "building material distributors",
    ],
  },
  "cement-manufacturers": {
    slug: "cement-manufacturers",
    queries: [
      "cement manufacturers",
      "cement suppliers",
      "cement distributors",
    ],
  },
  "hotel-furniture": {
    slug: "hotel-furniture",
    queries: [
      "hotel furniture manufacturers",
      "hotel furniture suppliers",
      "hospitality furniture",
      "hotel room furniture",
    ],
  },
  ffe: {
    slug: "ffe",
    queries: [
      "hotel FF&E suppliers",
      "hotel furnishings",
      "hospitality FF&E",
      "hotel interior suppliers",
    ],
  },
  "prefab-houses": {
    slug: "prefab-houses",
    queries: [
      "prefabricated houses manufacturers",
      "prefab home suppliers",
      "prefab house exporters",
      "modular homes",
    ],
  },
  "modular-buildings": {
    slug: "modular-buildings",
    queries: [
      "modular building manufacturers",
      "modular construction companies",
      "prefab commercial buildings",
      "modular building suppliers",
    ],
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  "steel-manufacturers": "Steel",
  "rebar-manufacturers": "Steel (Rebar)",
  "building-materials": "Building Materials",
  "cement-manufacturers": "Building Materials (Cement)",
  "hotel-furniture": "Hotel Furniture",
  ffe: "Hotel Furniture (FF&E)",
  "prefab-houses": "Prefab / Modular",
  "modular-buildings": "Prefab / Modular (Commercial)",
}

const COUNTRY_CATEGORY_MAP: Record<string, string[]> = {
  Tanzania: [
    "steel-manufacturers",
    "rebar-manufacturers",
    "building-materials",
    "cement-manufacturers",
    "hotel-furniture",
    "ffe",
    "prefab-houses",
    "modular-buildings",
  ],
  Kenya: [
    "steel-manufacturers",
    "rebar-manufacturers",
    "building-materials",
    "cement-manufacturers",
    "hotel-furniture",
    "ffe",
  ],
  UAE: [
    "steel-manufacturers",
    "rebar-manufacturers",
    "building-materials",
    "cement-manufacturers",
    "hotel-furniture",
    "ffe",
    "prefab-houses",
    "modular-buildings",
  ],
}

const TARGET_MIN = 30
const TARGET_MAX = 50
const SOURCES: DiscoverySourceV2[] = ["google-places", "apify-maps", "apify-web"]

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
  console.log("  VALIDATION PILOT — Strategic Supplier Discovery")
  console.log("=".repeat(70))
  console.log(`\n  Countries: ${VALIDATION_COUNTRIES.join(", ")}`)
  console.log(`  Categories: Steel, Building Materials, Hotel Furniture, Prefab/Modular`)
  console.log(`  Target: ${TARGET_MIN}–${TARGET_MAX} suppliers\n`)

  // Phase 1: Discovery
  console.log("─".repeat(70))
  console.log("  PHASE 1: DISCOVERY")
  console.log("─".repeat(70))

  const allLeads: DiscoveryV2Lead[] = []
  let totalRaw = 0
  const errors: string[] = []

  for (const country of VALIDATION_COUNTRIES) {
    const categorySlugs = COUNTRY_CATEGORY_MAP[country]
    console.log(`\n  --- ${country} (${categorySlugs.length} category groups) ---`)

    for (const slug of categorySlugs) {
      const cat = VALIDATION_CATEGORIES[slug]
      if (!cat) continue

      try {
        process.stdout.write(`    ${CATEGORY_LABELS[slug]}... `)
        const result = await runDiscoveryV2({
          queries: cat.queries,
          sources: SOURCES,
          country: country as TargetCountry,
          category: slug,
          preview: true,
        })

        const qualified = result.leads.filter(hasRequiredFields)
        totalRaw += result.leads.length
        allLeads.push(...qualified)
        console.log(`${result.leads.length} found, ${qualified.length} qualified (${result.duration}s)`)

        await new Promise((r) => setTimeout(r, 1000))
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

  const dupRate = allLeads.length > 0
    ? Math.round(((allLeads.length - deduped.length) / allLeads.length) * 100)
    : 0

  console.log(`\n  Raw leads:           ${allLeads.length}`)
  console.log(`  Deduped leads:       ${deduped.length}`)
  console.log(`  Duplicate rate:      ${dupRate}%`)

  // Phase 3: Select top N (target 30–50)
  console.log(`\n\n${"─".repeat(70)}`)
  console.log("  PHASE 3: SELECTION (value-based)")
  console.log("─".repeat(70))

  const target = Math.min(deduped.length, TARGET_MAX)
  const selected = deduped.slice(0, target)

  console.log(`\n  Selected: ${selected.length} suppliers (target ${TARGET_MIN}–${TARGET_MAX})`)

  // Phase 4: Import
  console.log(`\n\n${"─".repeat(70)}`)
  console.log("  PHASE 4: IMPORT TO DATABASE")
  console.log("─".repeat(70))

  const importResult = await importDiscoveryLeads(selected)
  console.log(`\n  Imported:            ${importResult.imported}`)
  console.log(`  Tokens generated:    ${importResult.tokensGenerated}`)
  if (importResult.errors.length > 0) {
    console.log(`  Errors:              ${importResult.errors.length}`)
    importResult.errors.slice(0, 5).forEach((e) => console.log(`    - ${e}`))
  }

  // Phase 5: Validation Report
  const duration = Math.round((Date.now() - startTime) / 1000)

  const allImported = await prisma.discoveredLead.findMany({
    where: { sourcePlatform: { contains: "V2 Discovery" } },
    orderBy: { trustScore: "desc" },
  })

  const reportByCountry: Record<string, number> = {}
  const reportByCategory: Record<string, number> = {}
  let withWebsite = 0
  let withEmail = 0
  let withPhone = 0

  for (const lead of allImported) {
    const c = lead.country || "Unknown"
    const cats = lead.categoryLabels as string[]
    const primaryCat = Array.isArray(cats) && cats.length > 0 ? cats[0] : lead.categorySlug || "unknown"
    reportByCountry[c] = (reportByCountry[c] || 0) + 1
    reportByCategory[primaryCat] = (reportByCategory[primaryCat] || 0) + 1
    if (lead.website) withWebsite++
    if (lead.email) withEmail++
    if (lead.phone) withPhone++
  }

  const top20 = allImported.slice(0, 20)

  console.log("\n\n" + "=".repeat(70))
  console.log("  VALIDATION REPORT")
  console.log("=".repeat(70))

  console.log(`\n  DURATION: ${Math.floor(duration / 60)}m ${duration % 60}s`)
  console.log(`  ERRORS: ${errors.length}`)

  console.log(`\n  ┌─────────────────────────────────────────────┬──────────┐`)
  console.log(`  │ METRIC                                     │ VALUE    │`)
  console.log(`  ├─────────────────────────────────────────────┼──────────┤`)
  console.log(`  │ Total discovered (raw)                     │ ${String(totalRaw).padStart(8)} │`)
  console.log(`  │ Total qualified (has website + name + cat) │ ${String(allLeads.length).padStart(8)} │`)
  console.log(`  │ After dedup                                │ ${String(deduped.length).padStart(8)} │`)
  console.log(`  │ Total imported                             │ ${String(importResult.imported).padStart(8)} │`)
  console.log(`  │ Duplicate rate                             │ ${String(dupRate + "%").padStart(8)} │`)
  console.log(`  │ Website coverage                           │ ${String(Math.round((withWebsite / allImported.length) * 100) + "% (" + withWebsite + "/" + allImported.length + ")").padStart(8)} │`)
  console.log(`  │ Email coverage                             │ ${String(Math.round((withEmail / allImported.length) * 100) + "% (" + withEmail + "/" + allImported.length + ")").padStart(8)} │`)
  console.log(`  │ Phone coverage                             │ ${String(Math.round((withPhone / allImported.length) * 100) + "% (" + withPhone + "/" + allImported.length + ")").padStart(8)} │`)
  console.log(`  └─────────────────────────────────────────────┴──────────┘`)

  console.log(`\n  ┌──────────────────────┬──────────┐`)
  console.log(`  │ COUNTRY              │ COUNT    │`)
  console.log(`  ├──────────────────────┼──────────┤`)
  for (const [country, count] of Object.entries(reportByCountry).sort((a, b) => b[1] - a[1])) {
    console.log(`  │ ${country.padEnd(20)} │ ${String(count).padStart(8)} │`)
  }
  console.log(`  └──────────────────────┴──────────┘`)

  console.log(`\n  ┌──────────────────────────────────┬──────────┐`)
  console.log(`  │ CATEGORY GROUP                   │ COUNT    │`)
  console.log(`  ├──────────────────────────────────┼──────────┤`)
  for (const [cat, count] of Object.entries(reportByCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  │ ${cat.padEnd(32)} │ ${String(count).padStart(8)} │`)
  }
  console.log(`  └──────────────────────────────────┴──────────┘`)

  console.log(`\n  ┌─────┬──────────────────────────────────┬──────────────┬──────────────────────────────────┬───────┐`)
  console.log(`  │  #  │ COMPANY                          │ COUNTRY      │ CATEGORY                         │ SCORE │`)
  console.log(`  ├─────┼──────────────────────────────────┼──────────────┼──────────────────────────────────┼───────┤`)
  top20.forEach((lead, i) => {
    const cat = Array.isArray(lead.categoryLabels) ? (lead.categoryLabels as string[])[0] || "" : ""
    console.log(`  │ ${String(i + 1).padStart(3)} │ ${(lead.companyName || "").substring(0, 32).padEnd(32)} │ ${(lead.country || "").substring(0, 12).padEnd(12)} │ ${cat.substring(0, 32).padEnd(32)} │ ${(lead.trustScore || 0).toString().padStart(5)} │`)
  })
  console.log(`  └─────┴──────────────────────────────────┴──────────────┴──────────────────────────────────┴───────┘`)

  console.log(`\n  TOP 20 — FULL DETAILS (for manual verification):\n`)
  top20.forEach((lead, i) => {
    const cats = Array.isArray(lead.categoryLabels) ? (lead.categoryLabels as string[]).join(", ") : lead.categorySlug || ""
    console.log(`  ${i + 1}. ${lead.companyName}`)
    console.log(`     Website:  ${lead.website || "—"}`)
    console.log(`     Email:    ${lead.email || "—"}`)
    console.log(`     Phone:    ${lead.phone || "—"}`)
    console.log(`     Country:  ${lead.country}`)
    console.log(`     Category: ${cats}`)
    console.log(`     Score:    ${lead.trustScore}`)
    console.log()
  })

  console.log("\n" + "=".repeat(70))
  console.log("  VALIDATION PILOT COMPLETE")
  console.log("=".repeat(70))

  // Return top20 for manual verification
  return top20.map((l) => ({
    name: l.companyName,
    website: l.website,
    email: l.email,
    country: l.country,
    category: Array.isArray(l.categoryLabels) ? (l.categoryLabels as string[])[0] || l.categorySlug : l.categorySlug,
    score: l.trustScore,
  }))

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Validation pilot failed:", e)
  process.exit(1)
})
