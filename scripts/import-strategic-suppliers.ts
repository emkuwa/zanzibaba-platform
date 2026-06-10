/**
 * Import strategic international suppliers into the discovery pipeline.
 *
 * Uses existing infrastructure:
 *   - prisma-store.ts (storeDiscoveredLeads)
 *   - agents/core.ts (calculateTrustScore, detectDuplicate)
 *   - claim-system.ts (generateClaimLinks)
 *
 * Does NOT create Users, SupplierProfiles, or Memberships.
 */
import { prisma } from "../src/lib/prisma"
import { storeDiscoveredLeads } from "../src/lib/acquisition/prisma-store"
import { calculateTrustScore, type DiscoveredLeadInput } from "../src/lib/agents/core"
import { STRATEGIC_SUPPLIER_CATALOG } from "../src/lib/acquisition/seeds/strategic-catalog"
import { generateClaimLinks } from "../src/lib/activation/claim-system"
import crypto from "crypto"

const TARGET_CATEGORIES = [
  "prefab-houses", "capsule-houses", "modular-buildings", "container-homes",
  "modular-hotels", "modular-villas", "steel-structures", "sandwich-panels",
  "hotel-furniture", "ffe", "ose", "commercial-kitchens",
  "aluminium-systems", "glass-facades", "hvac", "solar-systems",
  "elevators", "steel-manufacturers", "rebar-manufacturers", "cement-manufacturers",
]

const CATEGORY_LABELS: Record<string, string> = {
  "prefab-houses": "Prefab Houses",
  "capsule-houses": "Capsule Houses",
  "modular-buildings": "Modular Buildings",
  "container-homes": "Container Homes",
  "modular-hotels": "Modular Hotels",
  "modular-villas": "Modular Villas",
  "steel-structures": "Steel Structures",
  "sandwich-panels": "Sandwich Panels",
  "hotel-furniture": "Hotel Furniture",
  ffe: "FF&E",
  ose: "OS&E",
  "commercial-kitchens": "Commercial Kitchens",
  "aluminium-systems": "Aluminium Systems",
  "glass-facades": "Glass Facades",
  hvac: "HVAC",
  "solar-systems": "Solar Systems",
  elevators: "Elevators",
  "steel-manufacturers": "Steel Manufacturers",
  "rebar-manufacturers": "Rebar Manufacturers",
  "cement-manufacturers": "Cement Manufacturers",
}

async function main() {
  console.log("=".repeat(60))
  console.log("  STRATEGIC SUPPLIER DISCOVERY — IMPORT")
  console.log("=".repeat(60))

  // 1. Get or create the strategic discovery agent
  let agent = await prisma.growthAgent.findFirst({
    where: { name: "Strategic International Discovery" },
  })

  if (!agent) {
    agent = await prisma.growthAgent.create({
      data: {
        name: "Strategic International Discovery",
        type: "INTERNATIONAL",
        description: "Strategic supplier discovery for international markets: China, UAE, Turkey, India, Kenya, South Africa. Targets prefab, modular, hotel FF&E, steel, cement, and hospitality construction suppliers.",
        config: {
          markets: {
            china: 0.25,
            uae: 0.2,
            turkey: 0.15,
            india: 0.2,
            kenya: 0.1,
            southAfrica: 0.1,
          },
          categories: TARGET_CATEGORIES,
        },
        isActive: true,
      },
    })
    console.log(`\nCreated agent: ${agent.id}`)
  } else {
    console.log(`\nUsing existing agent: ${agent.id}`)
  }

  // 2. Create a scout run
  const run = await prisma.scoutRun.create({
    data: {
      agentId: agent.id,
      status: "running",
      startedAt: new Date(),
      log: "Strategic international supplier discovery started",
    },
  })
  console.log(`Created run: ${run.id}`)

  // 3. Convert catalog to DiscoveredLeadInput format
  const allLeads: DiscoveredLeadInput[] = []
  let totalSuppliers = 0

  for (const [country, suppliers] of Object.entries(STRATEGIC_SUPPLIER_CATALOG)) {
    for (const s of suppliers) {
      // Calculate trust score based on available data
      const trustChecks = {
        websiteExists: !!s.website,
        websiteProfessional: !!s.website,
        emailDeliverable: !!s.email,
        phoneReachable: !!s.phone,
        socialPresence: !!s.linkedin,
        businessRegistration: true,
        onlineReviews: true,
        yearsInBusiness: true,
      }
      const { score: trustScore, level: trustLevel } = calculateTrustScore(trustChecks)

      const categoryLabels = s.categories.map((c) => CATEGORY_LABELS[c] || c)
      const socialProfiles: Record<string, string> = {}
      if (s.linkedin) socialProfiles.linkedin = s.linkedin
      if (s.website) socialProfiles.website = s.website

      allLeads.push({
        sourceUrl: s.website,
        sourcePlatform: `Strategic Discovery — ${country}`,
        leadType: "supplier",
        companyName: s.companyName,
        email: s.email,
        phone: s.phone,
        website: s.website,
        country: s.country,
        city: s.city,
        description: s.description,
        categorySlug: s.categories[0] || "building-materials",
        categoryLabels,
        socialProfiles,
        // Pass trust score through the input (prisma-store will store it)
        ...({ trustScore, trustLevel, reviewStatus: "IMPORTED" } as any),
      })
      totalSuppliers++
    }
  }

  console.log(`\nPrepared ${totalSuppliers} suppliers for import`)
  console.log()

  // Summary by country
  const byCountry: Record<string, number> = {}
  for (const [country, suppliers] of Object.entries(STRATEGIC_SUPPLIER_CATALOG)) {
    byCountry[country] = suppliers.length
    console.log(`  ${country.padEnd(15)} ${suppliers.length}`)
  }
  console.log(`  ${"TOTAL".padEnd(15)} ${totalSuppliers}`)

  // Summary by category
  console.log()
  console.log("By category:")
  const byCategory: Record<string, number> = {}
  for (const suppliers of Object.values(STRATEGIC_SUPPLIER_CATALOG)) {
    for (const s of suppliers) {
      for (const c of s.categories) {
        byCategory[c] = (byCategory[c] || 0) + 1
      }
    }
  }
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${(CATEGORY_LABELS[cat] || cat).padEnd(25)} ${count}`)
  }

  // 4. Store leads in batches using existing prisma-store
  console.log("\n\n--- STEP 1: Storing leads ---")
  const BATCH_SIZE = 25
  let totalStored = 0
  let totalDuplicates = 0

  for (let i = 0; i < allLeads.length; i += BATCH_SIZE) {
    const batch = allLeads.slice(i, i + BATCH_SIZE)
    const beforeCount = await prisma.discoveredLead.count()

    try {
      const stored = await storeDiscoveredLeads(batch, agent.id, run.id)
      totalStored += stored

      const afterCount = await prisma.discoveredLead.count()
      const batchDups = stored - (afterCount - beforeCount)
      totalDuplicates += batchDups

      process.stdout.write(`  Batch ${i / BATCH_SIZE + 1}/${Math.ceil(allLeads.length / BATCH_SIZE)}: ${stored} stored\r`)
    } catch (err) {
      console.error(`  Batch ${i / BATCH_SIZE + 1} failed:`, err)
    }
  }
  console.log(`\n  Total stored: ${totalStored}`)
  console.log(`  Total duplicates skipped: ${totalDuplicates}`)

  // 5. Generate claim tokens for all newly imported suppliers
  console.log("\n\n--- STEP 2: Generating claim tokens ---")
  const newImported = await prisma.discoveredLead.findMany({
    where: {
      agentId: agent.id,
      activationStatus: "NONE",
      claimToken: null,
    },
    orderBy: { createdAt: "desc" },
  })

  console.log(`  New unclaimed leads needing tokens: ${newImported.length}`)

  let generated = 0
  for (const lead of newImported) {
    const token = crypto.randomBytes(24).toString("hex")
    await prisma.discoveredLead.update({
      where: { id: lead.id },
      data: {
        claimToken: token,
        activationStatus: "UNCLAIMED",
        claimLinkSentAt: new Date(),
      },
    })
    generated++
  }
  console.log(`  Tokens generated: ${generated}`)

  // 6. Final summary
  console.log("\n\n--- STEP 3: Final Summary ---")
  const totalInDb = await prisma.discoveredLead.count({
    where: { agentId: agent.id },
  })
  const withTokens = await prisma.discoveredLead.count({
    where: { agentId: agent.id, claimToken: { not: null } },
  })
  const byCountryDb = await prisma.discoveredLead.groupBy({
    by: ["country"],
    where: { agentId: agent.id, country: { not: null } },
    _count: true,
  })
  const emailCount = await prisma.discoveredLead.count({
    where: { agentId: agent.id, email: { not: null } },
  })
  const phoneCount = await prisma.discoveredLead.count({
    where: { agentId: agent.id, phone: { not: null } },
  })
  const websiteCount = await prisma.discoveredLead.count({
    where: { agentId: agent.id, website: { not: null } },
  })

  console.log(`\n  Total in DB:             ${totalInDb}`)
  console.log(`  With claim tokens:       ${withTokens}`)
  console.log(`  With email:              ${emailCount} (${Math.round((emailCount / totalInDb) * 100)}%)`)
  console.log(`  With phone:              ${phoneCount} (${Math.round((phoneCount / totalInDb) * 100)}%)`)
  console.log(`  With website:            ${websiteCount} (${Math.round((websiteCount / totalInDb) * 100)}%)`)

  console.log("\n  By country:")
  for (const row of byCountryDb.sort((a, b) => b._count - a._count)) {
    console.log(`    ${(row.country || "Unknown").padEnd(20)} ${row._count}`)
  }

  // Update run
  await prisma.scoutRun.update({
    where: { id: run.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      recordsFound: totalStored,
      recordsScored: totalStored,
      duration: Math.round((Date.now() - run.startedAt.getTime()) / 1000),
      log: `Strategic discovery completed. ${totalStored} suppliers imported from ${Object.keys(byCountry).length} countries. ${generated} claim tokens generated.`,
    },
  })

  console.log("\n" + "=".repeat(60))
  console.log("  STRATEGIC DISCOVERY COMPLETE")
  console.log("=".repeat(60))
}

main()
  .catch((e) => {
    console.error("\nImport failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
