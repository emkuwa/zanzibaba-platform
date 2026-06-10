import { runDiscoveryV2, importDiscoveryLeads } from "../src/lib/discovery-v2/runner"
import { prisma } from "../src/lib/prisma"

const SOURCES = ["google-places", "apify-web"]
const CATEGORY_QUERIES: Record<string, { queries: string[] }> = {
  "steel-manufacturers": { queries: ["steel manufacturers", "steel suppliers"] },
  "building-materials": { queries: ["building materials suppliers", "construction materials"] },
  "hotel-furniture": { queries: ["hotel furniture manufacturers", "hotel furnishings"] },
  "prefab-houses": { queries: ["prefabricated houses manufacturers", "modular building manufacturers"] },
}
const COUNTRIES = ["Tanzania", "Kenya", "UAE"]

async function main() {
  const start = Date.now()
  console.log("=== FAST VALIDATION PILOT ===\n")

  const allLeads: any[] = []
  for (const country of COUNTRIES) {
    for (const [slug, cat] of Object.entries(CATEGORY_QUERIES)) {
      try {
        process.stdout.write(`${country} / ${slug}... `)
        const result = await runDiscoveryV2({ queries: cat.queries, sources: SOURCES, country, category: slug, preview: true })
        const qualified = result.leads.filter((l: any) => l.companyName && l.website && l.country && l.category)
        allLeads.push(...qualified)
        console.log(`${result.leads.length} found, ${qualified.length} qualified`)
        await new Promise((r) => setTimeout(r, 500))
      } catch (e: any) {
        console.log(`ERROR: ${e.message}`)
      }
    }
  }

  const seen = new Map<string, any>()
  for (const lead of allLeads) {
    const key = lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (!seen.has(key)) {
      lead.valueScore = (lead.hasWebsite ? 25 : 0) + (lead.hasEmail ? 25 : 0) + (lead.hasExportEvidence ? 20 : 0) + (lead.isManufacturer ? 15 : 0) + 15
      seen.set(key, lead)
    }
  }
  const deduped = [...seen.values()].filter((l: any) => l.companyName && l.website && l.country && l.category)
  deduped.sort((a: any, b: any) => b.valueScore - a.valueScore)
  const selected = deduped.slice(0, 50)

  const dupRate = allLeads.length > 0 ? Math.round((1 - deduped.length / allLeads.length) * 100) : 0
  console.log(`\nDiscovered: ${allLeads.length} | Deduped: ${deduped.length} | Selected: ${selected.length} | Dup rate: ${dupRate}%`)

  console.log("\n=== Importing ===")
  const result = await importDiscoveryLeads(selected)
  console.log(`Imported: ${result.imported} | Tokens: ${result.tokensGenerated}`)

  const imported = await prisma.discoveredLead.findMany({
    where: { sourcePlatform: { contains: "V2 Discovery" } },
    orderBy: { trustScore: "desc" },
    take: 50,
  })

  const byCountry: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  let web = 0, email = 0, phone = 0
  for (const l of imported) {
    byCountry[l.country || "?"] = (byCountry[l.country || "?"] || 0) + 1
    const cat = (Array.isArray(l.categoryLabels) ? l.categoryLabels[0] : l.categorySlug) || "?"
    byCategory[cat] = (byCategory[cat] || 0) + 1
    if (l.website) web++
    if (l.email) email++
    if (l.phone) phone++
  }

  const duration = Math.round((Date.now() - start) / 1000)
  console.log("\n" + "=".repeat(60))
  console.log("  VALIDATION REPORT")
  console.log("=".repeat(60))
  console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`)
  console.log(`  Total discovered: ${allLeads.length}`)
  console.log(`  Total imported: ${result.imported}`)
  console.log(`  Duplicate rate: ${dupRate}%`)
  console.log(`  Website: ${web}/${imported.length} (${Math.round((web / imported.length) * 100)}%)`)
  console.log(`  Email: ${email}/${imported.length} (${Math.round((email / imported.length) * 100)}%)`)
  console.log(`  Phone: ${phone}/${imported.length} (${Math.round((phone / imported.length) * 100)}%)`)
  console.log(`\n  By country:`)
  for (const [c, n] of Object.entries(byCountry).sort((a, b) => b[1] - a[1])) console.log(`    ${c}: ${n}`)
  console.log(`\n  By category:`)
  for (const [c, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) console.log(`    ${c}: ${n}`)
  console.log(`\n  Top 20:`)
  imported.slice(0, 20).forEach((l, i) => {
    const cat = (Array.isArray(l.categoryLabels) ? l.categoryLabels[0] : l.categorySlug) || ""
    console.log(`  ${(i + 1).toString().padStart(2)}. ${(l.companyName || "").padEnd(38)} ${(l.country || "").padEnd(12)} ${cat.padEnd(20)} score:${l.trustScore} ${l.website ? "✓" : "✗"}${l.email ? "✓" : "✗"}`)
  })
  console.log()
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("FAILED:", e)
  process.exit(1)
})
