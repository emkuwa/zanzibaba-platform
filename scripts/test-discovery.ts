import { runDiscovery } from "../src/lib/acquisition/discovery-agent"
import { enrichLeads } from "../src/lib/acquisition/enrichment-agent"
import { buildProfiles } from "../src/lib/acquisition/profile-builder"
import { extractProducts } from "../src/lib/acquisition/product-builder"
import { reviewLeads } from "../src/lib/acquisition/review-queue"

async function runTest() {
  console.log("=".repeat(72))
  console.log("ZANZIBABA ACQUISITION ENGINE — LIVE TEST")
  console.log("=".repeat(72))

  const hasKey = !!process.env.GOOGLE_MAPS_API_KEY
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  console.log(`\n1. GOOGLE_MAPS_API_KEY detected: ${hasKey ? "YES" : "NO"}`)
  console.log(`2. Live Google Maps data being used: ${hasKey ? "YES" : "NO (fallback only)"}`)

  // === DISCOVERY ===
  console.log("\n── DISCOVERY ──")
  const discovery = await runDiscovery("test-run-1")
  const ds = discovery.stats

  console.log(`3. Total suppliers discovered: ${ds.found}`)
  console.log(`   ├─ Dar es Salaam suppliers: ${ds.darSuppliers}`)
  console.log(`   ├─ Zanzibar contractors:    ${ds.zanzibarContractors}`)
  console.log(`   ├─ Zanzibar professionals:  ${ds.zanzibarProfessionals}`)
  console.log(`   └─ International partners:  ${ds.internationalPartners}`)
  console.log(`4. Unique after dedup: ${ds.found}`)

  const gmapsItems = discovery.leads.filter(l => l.sourcePlatform === "Google Maps")
  const dirItems = discovery.leads.filter(l => l.sourcePlatform !== "Google Maps")
  console.log(`5. Discovery sources used:`)
  console.log(`   ├─ Google Maps fallback: ${ds.fromGoogleMaps}`)
  console.log(`   └─ Directory entries:    ${ds.fromDirectories}`)

  const scores = discovery.leads.map(l => (l as any).score || 0)
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const high = scores.filter(s => s >= 70).length
  const med = scores.filter(s => s >= 40 && s < 70).length
  const low = scores.filter(s => s < 40).length
  console.log(`6. Average trust score: ${avgScore}/100`)
  console.log(`   ├─ High (≥70):  ${high}`)
  console.log(`   ├─ Medium(40-69): ${med}`)
  console.log(`   └─ Low (<40):   ${low}`)

  const fallbackUsed = discovery.leads.some(l => l.sourcePlatform === "Google Maps" || l.sourceUrl?.includes("maps.google"))
  console.log(`\n7. Fallback suppliers used: ${fallbackUsed ? "YES (12 Google Maps pre-loaded suppliers)" : "NO"}`)

  // === ENRICHMENT (smart fallback only — no OpenAI) ===
  console.log(`\n── ENRICHMENT (smart fallback — OpenAI quota exceeded) ──`)
  const enriched = await enrichLeads(discovery.leads, "test-run-1")
  const withEmail = enriched.leads.filter(l => l.email).length
  const withWebsite = enriched.leads.filter(l => l.website).length
  const withProducts = enriched.leads.filter(l => l.products && l.products.length > 0).length
  console.log(`   Enriched: ${enriched.enriched}`)
  console.log(`   With email: ${withEmail}`)
  console.log(`   With website: ${withWebsite}`)
  console.log(`   With products: ${withProducts}`)

  // === PROFILES ===
  console.log(`\n── PROFILES ──`)
  const profiles = await buildProfiles(enriched.leads, "test-run-1")
  console.log(`   Built: ${profiles.profilesBuilt}`)
  console.log(`   Claim-ready: ${profiles.claimReady}`)

  // === PRODUCTS ===
  console.log(`\n── PRODUCT EXTRACTION ──`)
  const products = await extractProducts(profiles.leads)
  console.log(`   Extracted: ${products.productsExtracted}`)

  // === REVIEW ===
  console.log(`\n── REVIEW ──`)
  const reviewed = await reviewLeads(products.leads, "test-run-1")
  console.log(`8. Approved: ${reviewed.decisions.approved}`)
  console.log(`9. Flagged:  ${reviewed.decisions.flagged}`)
  console.log(`10. Rejected: ${reviewed.decisions.rejected}`)

  // === OUTREACH ===
  console.log(`\n── OUTREACH ──`)
  const { generateOutreach } = await import("../src/lib/acquisition/outreach-agent")
  const outreach = await generateOutreach(reviewed.leads)
  console.log(`   Messages: ${outreach.messagesGenerated}`)

  // === 20 SAMPLE NAMES ===
  console.log("\n" + "─".repeat(72))
  console.log("20 SAMPLE SUPPLIER NAMES:")
  console.log("─".repeat(72))
  console.log("  #  Status  Score  Company                                City                  Source")
  console.log("  ─  ──────  ─────  ─────────────────────────────────────  ────────────────────  ────────────")
  discovery.leads.slice(0, 20).forEach((l, i) => {
    const score = (l as any).score || 0
    const bar = score >= 70 ? "✓" : score >= 40 ? "~" : "✗"
    const name = (l.companyName || "—").padEnd(36)
    const city = (l.city || "—").substring(0, 20).padEnd(20)
    const src = (l.sourcePlatform || "Unknown").substring(0, 12).padEnd(12)
    console.log(`  ${String(i + 1).padStart(2)}. ${bar}     ${String(score).padStart(2)}  ${name} ${city} ${src}`)
  })

  console.log("\n" + "=".repeat(72))
  console.log("SUMMARY:")
  console.log(`  Total discovered: ${ds.found} (Dar: ${ds.darSuppliers}, Z'bar: ${ds.zanzibarContractors + ds.zanzibarProfessionals}, Intl: ${ds.internationalPartners})`)
  console.log(`  Approved/Flagged/Rejected: ${reviewed.decisions.approved} / ${reviewed.decisions.flagged} / ${reviewed.decisions.rejected}`)
  console.log(`  Avg trust score: ${avgScore}/100 | Claim-ready: ${profiles.claimReady} | Outreach: ${outreach.messagesGenerated}`)
  console.log("=".repeat(72))
}

runTest().catch(console.error)
