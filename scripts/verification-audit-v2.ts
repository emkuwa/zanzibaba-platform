import { prisma } from "../src/lib/prisma"

const GENERIC_NAMES = [
  "top", "best", "list of", "leading", "comprehensive", "ultimate", "guide",
  "review", "comparison", "manufacturers & suppliers", "companies in",
  "export", "import", "market", "industry", "directory", "suppliers of",
  "manufacturer & supplier", "manufacturer and supplier", "exporters",
  "supplier & distributor", "approved supplier", "wholesale",
  "all you need to know", "everything about", "rising popularity",
  "future of", "new era", "how", "what", "why", "are there",
  "prefab homes prices", "prefab modular homes", "prefabricated houses",
  "top 10", "top 14", "top 19", "top 9", "top 8", "top 5", "top 17",
  "steel & plastic", "about us –", "leading peb",
]

async function isGenericSearchResult(name: string, description: string): Promise<boolean> {
  const lower = `${name} ${description || ""}`.toLowerCase()
  return GENERIC_NAMES.some((g) => lower.startsWith(g) || lower.includes(g))
}

async function checkWebsite(url: string): Promise<{ works: boolean; html: string }> {
  try {
    const fetchUrl = url.startsWith("http") ? url : `https://${url}`
    const res = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ZanzibabaVerification/1.0)" },
    })
    const html = await res.text()
    return { works: res.ok, html }
  } catch {
    return { works: false, html: "" }
  }
}

function companyInHtml(name: string, html: string): boolean {
  const parts = name.toLowerCase().split(/\s+/).filter((p) => p.length > 2)
  if (parts.length < 2) return false
  const lowerHtml = html.toLowerCase()
  const matchCount = parts.filter((p) => lowerHtml.includes(p)).length
  return matchCount >= Math.max(1, Math.floor(parts.length * 0.5))
}

function countryInHtml(country: string | null, html: string): boolean {
  if (!country) return false
  return html.toLowerCase().includes(country.toLowerCase())
}

async function main() {
  console.log("=".repeat(70))
  console.log("  SUPPLIER VERIFICATION AUDIT (v2 — using existing tier field)")
  console.log("=".repeat(70))

  const leads = await prisma.discoveredLead.findMany({
    where: {
      OR: [{ tier: null }, { tier: "" }],
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
    },
    orderBy: { trustScore: "desc" },
  })

  console.log(`\n  Unclassified suppliers: ${leads.length}\n`)

  let a = 0, b = 0, c = 0, d = 0

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const name = lead.companyName || "Unknown"
    const desc = lead.description || ""

    process.stdout.write(`  [${i + 1}/${leads.length}] ${name.substring(0, 40).padEnd(42)} `)

    // Quick heuristic check for search snippets
    const generic = await isGenericSearchResult(name, desc)
    if (generic) {
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "D" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "D" } })
      console.log("🅳 REMOVE (search snippet)")
      d++
      continue
    }

    if (!lead.website) {
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "D" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "D" } })
      console.log("🅳 REMOVE (no website)")
      d++
      continue
    }

    const { works, html } = await checkWebsite(lead.website)
    if (!works || html.length < 100) {
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "D" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "D" } })
      console.log("🅳 REMOVE (dead website)")
      d++
      continue
    }

    const companyFound = companyInHtml(name, html)
    const countryFound = countryInHtml(lead.country, html)

    if (companyFound && countryFound) {
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "A" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "A" } })
      console.log("🅰 FULLY VERIFIED")
      a++
    } else if (companyFound) {
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "B" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "B" } })
      console.log("🅱 WEBSITE OK")
      b++
    } else {
      // Website works but company not found - needs manual review
      await prisma.discoveredLead.update({ where: { id: lead.id }, data: { tier: "C" } })
      await prisma.directoryEntity.updateMany({ where: { discoveredLeadId: lead.id }, data: { tier: "C" } })
      console.log("🅲 NEEDS REVIEW")
      c++
    }

    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 100))
  }

  const total = a + b + c + d
  const visible = a + b
  const confidence = total > 0 ? Math.round(((a * 1 + b * 0.7 + c * 0.3) / total) * 100) : 0

  console.log("\n" + "=".repeat(70))
  console.log("  VERIFICATION AUDIT COMPLETE")
  console.log("=".repeat(70))
  console.log(`  Total processed:   ${total}`)
  console.log(`  TIER_A (verified): ${a} (${total > 0 ? Math.round((a / total) * 100) : 0}%)`)
  console.log(`  TIER_B (website):  ${b} (${total > 0 ? Math.round((b / total) * 100) : 0}%)`)
  console.log(`  TIER_C (review):   ${c} (${total > 0 ? Math.round((c / total) * 100) : 0}%)`)
  console.log(`  TIER_D (remove):   ${d} (${total > 0 ? Math.round((d / total) * 100) : 0}%)`)
  console.log(`\n  Visible (A+B):     ${visible} (${total > 0 ? Math.round((visible / total) * 100) : 0}%)`)
  console.log(`  Confidence score:  ${confidence}%`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Audit failed:", e)
  process.exit(1)
})
