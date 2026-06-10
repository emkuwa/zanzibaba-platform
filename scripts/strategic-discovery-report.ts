import { prisma } from "../src/lib/prisma"

async function main() {
  const agent = await prisma.growthAgent.findFirst({
    where: { name: "Strategic International Discovery" },
  })
  if (!agent) {
    console.log("Strategic discovery agent not found. Run import-strategic-suppliers.ts first.")
    process.exit(1)
  }

  const aid = agent.id
  const HR = "=".repeat(68)

  // ──────────────────────────────────────
  // REPORT 1: Suppliers by country
  // ──────────────────────────────────────
  console.log(`\n${HR}`)
  console.log("  REPORT 1: SUPPLIERS BY COUNTRY")
  console.log(`${HR}\n`)

  const byCountry = await prisma.discoveredLead.groupBy({
    by: ["country"],
    where: { agentId: aid, country: { not: null } },
    _count: true,
  })

  let grandTotal = 0
  for (const row of byCountry.sort((a, b) => b._count - a._count)) {
    console.log(`  ${(row.country || "Unknown").padEnd(20)} ${row._count}`)
    grandTotal += row._count
  }
  console.log(`  ${"─".repeat(20)} ─────`)
  console.log(`  ${"TOTAL".padEnd(20)} ${grandTotal}`)

  // ──────────────────────────────────────
  // REPORT 2: Suppliers by category
  // ──────────────────────────────────────
  console.log(`\n${HR}`)
  console.log("  REPORT 2: SUPPLIERS BY CATEGORY")
  console.log(`${HR}\n`)

  const allLeads = await prisma.discoveredLead.findMany({
    where: { agentId: aid },
    select: { categoryLabels: true },
  })

  const byCategory: Record<string, number> = {}
  for (const lead of allLeads) {
    const labels = lead.categoryLabels
    if (Array.isArray(labels)) {
      for (const cat of labels as string[]) {
        byCategory[cat] = (byCategory[cat] || 0) + 1
      }
    }
  }

  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(28)} ${count}`)
  }

  // ──────────────────────────────────────
  // REPORT 3: Top 100 Strategic Suppliers
  // ──────────────────────────────────────
  console.log(`\n${HR}`)
  console.log("  REPORT 3: TOP 100 STRATEGIC SUPPLIERS")
  console.log(`${HR}\n`)

  const top100 = await prisma.discoveredLead.findMany({
    where: { agentId: aid },
    orderBy: { trustScore: "desc" },
    take: 100,
    select: {
      companyName: true,
      country: true,
      website: true,
      email: true,
      phone: true,
      city: true,
      categoryLabels: true,
      trustScore: true,
      claimToken: true,
    },
  })

  console.log(`  ${"#".padEnd(3)} ${"Company".padEnd(32)} ${"Country".padEnd(14)} ${"Email".padEnd(36)} ${"Score".padEnd(5)}`)
  console.log(`  ${"─".repeat(3)} ${"─".repeat(32)} ${"─".repeat(14)} ${"─".repeat(36)} ${"─".repeat(5)}`)
  top100.forEach((lead, i) => {
    const email = lead.email ? lead.email.substring(0, 34).padEnd(36) : "—".padEnd(36)
    console.log(`  ${(i + 1).toString().padEnd(3)} ${(lead.companyName || "N/A").substring(0, 30).padEnd(32)} ${(lead.country || "").substring(0, 12).padEnd(14)} ${email} ${(lead.trustScore || 0).toString().padEnd(5)}`)
  })

  // ──────────────────────────────────────
  // REPORT 4: Email Reachability Report
  // ──────────────────────────────────────
  console.log(`\n${HR}`)
  console.log("  REPORT 4: EMAIL REACHABILITY REPORT")
  console.log(`${HR}\n`)

  const total = await prisma.discoveredLead.count({ where: { agentId: aid } })
  const withEmail = await prisma.discoveredLead.count({ where: { agentId: aid, email: { not: null } } })
  const withPhone = await prisma.discoveredLead.count({ where: { agentId: aid, phone: { not: null } } })
  const withWebsite = await prisma.discoveredLead.count({ where: { agentId: aid, website: { not: null } } })
  const withClaimToken = await prisma.discoveredLead.count({ where: { agentId: aid, claimToken: { not: null } } })

  console.log(`  ${"Metric".padEnd(30)} ${"Count".padEnd(8)} ${"Rate".padEnd(8)}`)
  console.log(`  ${"─".repeat(30)} ${"─".repeat(8)} ${"─".repeat(8)}`)
  console.log(`  ${"Total suppliers".padEnd(30)} ${total.toString().padEnd(8)} ${"100%".padEnd(8)}`)
  console.log(`  ${"Email reachable".padEnd(30)} ${withEmail.toString().padEnd(8)} ${(withEmail / total * 100).toFixed(0) + "%".padEnd(8)}`)
  console.log(`  ${"Phone reachable".padEnd(30)} ${withPhone.toString().padEnd(8)} ${(withPhone / total * 100).toFixed(0) + "%".padEnd(8)}`)
  console.log(`  ${"Website available".padEnd(30)} ${withWebsite.toString().padEnd(8)} ${(withWebsite / total * 100).toFixed(0) + "%".padEnd(8)}`)
  console.log(`  ${"Claim token generated".padEnd(30)} ${withClaimToken.toString().padEnd(8)} ${(withClaimToken / total * 100).toFixed(0) + "%".padEnd(8)}`)

  // Email breakdown by country
  console.log(`\n  Email reachability by country:\n`)
  const emailByCountry = await prisma.discoveredLead.groupBy({
    by: ["country"],
    where: { agentId: aid, country: { not: null } },
    _count: true,
    _sum: { trustScore: true },
  })
  console.log(`  ${"Country".padEnd(16)} ${"Total".padEnd(8)} ${"Email".padEnd(8)} ${"Reach %".padEnd(8)} ${"Avg Trust".padEnd(8)}`)
  console.log(`  ${"─".repeat(16)} ${"─".repeat(8)} ${"─".repeat(8)} ${"─".repeat(8)} ${"─".repeat(8)}`)

  for (const row of emailByCountry.sort((a, b) => b._count - a._count)) {
    const c = row.country || "Unknown"
    const countryEmail = await prisma.discoveredLead.count({
      where: { agentId: aid, country: c, email: { not: null } },
    })
    const reachPct = row._count > 0 ? ((countryEmail / row._count) * 100).toFixed(0) : "0"
    const avgTrust = row._count > 0 ? Math.round((row._sum.trustScore || 0) / row._count).toString() : "0"
    console.log(`  ${c.padEnd(16)} ${row._count.toString().padEnd(8)} ${countryEmail.toString().padEnd(8)} ${(reachPct + "%").padEnd(8)} ${avgTrust.padEnd(8)}`)
  }

  console.log(`\n${HR}\n`)
}

main()
  .catch((e) => {
    console.error("Report failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
