import { prisma } from "../src/lib/prisma"

const GENERIC_NAMES = [
  "top", "best", "list of", "leading", "comprehensive", "ultimate", "guide",
  "review", "comparison", "manufacturers & suppliers", "companies in",
  "export", "import", "market", "industry", "directory", "suppliers of",
  "manufacturer & supplier", "manufacturer and supplier", "exporters",
  "supplier & distributor", "approved supplier", "wholesale",
  "all you need to know", "everything about", "rising popularity",
  "future of", "new era", "how", "what", "why", "are there",
]

const KNOWN_SEARCH_SNIPPETS = [
  "mordorintelligence.com", "export.gov", "trade.gov", "kompass.com",
  "aliexpress.com", "made-in-china.com", "indiamart.com", "tradeindia.com",
  "europages.com", "zauba.com", "constructionreviewonline.com",
  "click.in", "businesslist.co.tz", "yellowpages", "cybo.com",
]

function isGenericSearchResult(name: string, website: string, description: string): boolean {
  const lower = `${name} ${description}`.toLowerCase()
  if (GENERIC_NAMES.some((g) => lower.startsWith(g) || lower.includes(g))) return true
  if (KNOWN_SEARCH_SNIPPETS.some((s) => website.includes(s))) return true
  if (description.length > 300 && !name.includes(" ") && description.includes("top")) return true
  return false
}

function extractCompanyNameFromHtml(html: string, url: string): string[] {
  const names: string[] = []

  // Title tag
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
  if (titleMatch) names.push(titleMatch[1].trim())

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
  if (descMatch) names.push(descMatch[1].trim())

  // H1
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i)
  if (h1Match) names.push(h1Match[1].trim())

  // OG site name
  const ogMatch = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/i)
  if (ogMatch) names.push(ogMatch[1].trim())

  return names
}

function companyNameAppearsInHtml(companyName: string, html: string): boolean {
  const parts = companyName.toLowerCase().split(/\s+/)
  if (parts.length < 2) return false
  const lowerHtml = html.toLowerCase()
  const significant = parts.filter((p) => p.length > 2)
  if (significant.length === 0) return false
  const matchCount = significant.filter((p) => lowerHtml.includes(p)).length
  return matchCount >= Math.max(1, Math.floor(significant.length * 0.5))
}

function countryMentionsInHtml(country: string | null, html: string): boolean {
  if (!country) return false
  const lowerHtml = html.toLowerCase()
  const lowerCountry = country.toLowerCase()
  return lowerHtml.includes(lowerCountry) || lowerHtml.includes(`in ${lowerCountry}`)
}

function categoryMentionsInHtml(categorySlug: string | null, html: string): boolean {
  if (!categorySlug) return false
  const lowerHtml = html.toLowerCase()
  const keywords: Record<string, string[]> = {
    "steel-manufacturers": ["steel", "iron", "metal", "alloy"],
    "prefab-houses": ["prefab", "prefabricated", "modular home", "container home"],
    "hotel-furniture": ["hotel furniture", "hospitality", "hotel supplies", "furniture"],
    "building-materials": ["building material", "construction material", "cement", "brick"],
    "hvac": ["hvac", "air conditioning", "ventilation", "heating", "cooling"],
    "solar-systems": ["solar", "photovoltaic", "renewable energy", "solar panel"],
  }
  const words = keywords[categorySlug] || [categorySlug.replace(/-/g, " ")]
  return words.some((w) => lowerHtml.includes(w))
}

function validateEmail(email: string | null): boolean {
  if (!email) return false
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!re.test(email)) return false
  const blocked = ["example.com", "domain.com", "yourcompany.com", "name@", "user@", "swiper@", "%20"]
  if (blocked.some((b) => email.toLowerCase().includes(b))) return false
  return true
}

function validatePhone(phone: string | null): boolean {
  if (!phone) return false
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 7 || digits.length > 15) return false
  const badPatterns = ["000000", "111111", "123456", "20100101", "1000000000"]
  if (badPatterns.some((p) => digits.includes(p))) return false
  return true
}

interface AuditResult {
  tier: "TIER_A_FULLY_VERIFIED" | "TIER_B_WEBSITE_VERIFIED" | "TIER_C_NEEDS_REVIEW" | "TIER_D_REMOVE"
  reasons: string[]
  websiteWorks: boolean
  companyOnWebsite: boolean
  countryMatches: boolean
  categoryMatches: boolean
  isValidEmail: boolean
  isValidPhone: boolean
  isSearchSnippet: boolean
}

async function auditSupplier(
  companyName: string,
  website: string | null,
  country: string | null,
  categorySlug: string | null,
  email: string | null,
  phone: string | null,
  description: string
): Promise<AuditResult> {
  const reasons: string[] = []

  if (!website) {
    return {
      tier: "TIER_D_REMOVE",
      reasons: ["No website"],
      websiteWorks: false, companyOnWebsite: false, countryMatches: false,
      categoryMatches: false, isValidEmail: false, isValidPhone: false,
      isSearchSnippet: isGenericSearchResult(companyName, "", description),
    }
  }

  const isSearchSnippet = isGenericSearchResult(companyName, website, description)
  if (isSearchSnippet) reasons.push("Appears to be search result snippet, not real company")

  const url = website.startsWith("http") ? website : `https://${website}`

  let websiteWorks = false
  let companyOnWebsite = false
  let countryMatches = false
  let categoryMatches = false
  let html = ""

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ZanzibabaVerification/1.0)" },
    })
    websiteWorks = res.ok
    if (websiteWorks) reasons.push("Website loads")
    else {
      reasons.push(`Website returned ${res.status}`)
      // Check for contact page
    }
    html = await res.text()
  } catch {
    reasons.push("Website unreachable")
  }

  if (websiteWorks && html.length > 100) {
    companyOnWebsite = companyNameAppearsInHtml(companyName, html)
    if (companyOnWebsite) reasons.push("Company name found on website")
    else reasons.push("Company name NOT found on website content")

    countryMatches = countryMentionsInHtml(country, html)
    if (countryMatches) reasons.push(`Country "${country}" found on website`)
    else if (country) reasons.push(`Country "${country}" NOT found on website`)

    categoryMatches = categoryMentionsInHtml(categorySlug, html)
    if (categoryMatches) reasons.push("Category keywords found on website")
    else if (categorySlug) reasons.push("Category keywords NOT found on website")
  }

  const isValidEmail = validateEmail(email)
  if (isValidEmail) reasons.push("Valid email")
  else if (email) reasons.push("Email appears invalid or generic")

  const isValidPhone = validatePhone(phone)
  if (isValidPhone) reasons.push("Valid phone")
  else if (phone) reasons.push("Phone appears invalid")

  // Tier decision
  if (isSearchSnippet && !websiteWorks) {
    return { tier: "TIER_D_REMOVE", reasons, websiteWorks, companyOnWebsite, countryMatches, categoryMatches, isValidEmail, isValidPhone, isSearchSnippet }
  }

  if (websiteWorks && companyOnWebsite && countryMatches) {
    return { tier: "TIER_A_FULLY_VERIFIED", reasons, websiteWorks, companyOnWebsite, countryMatches, categoryMatches, isValidEmail, isValidPhone, isSearchSnippet }
  }

  if (websiteWorks && (companyOnWebsite || countryMatches || (isValidEmail || isValidPhone))) {
    return { tier: "TIER_B_WEBSITE_VERIFIED", reasons, websiteWorks, companyOnWebsite, countryMatches, categoryMatches, isValidEmail, isValidPhone, isSearchSnippet }
  }

  if (websiteWorks) {
    return { tier: "TIER_C_NEEDS_REVIEW", reasons, websiteWorks, companyOnWebsite, countryMatches, categoryMatches, isValidEmail, isValidPhone, isSearchSnippet }
  }

  return { tier: "TIER_D_REMOVE", reasons, websiteWorks, companyOnWebsite, countryMatches, categoryMatches, isValidEmail, isValidPhone, isSearchSnippet }
}

async function main() {
  console.log("=".repeat(70))
  console.log("  STRATEGIC SUPPLIER VERIFICATION AUDIT")
  console.log("=".repeat(70))

  const leads = await prisma.discoveredLead.findMany({
    where: {
      verificationTier: null,
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
    },
    orderBy: { trustScore: "desc" },
  })

  console.log(`\n  Suppliers to audit: ${leads.length}\n`)

  const results: { lead: typeof leads[0]; audit: AuditResult }[] = []
  let aCount = 0, bCount = 0, cCount = 0, dCount = 0

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const name = lead.companyName || "Unknown"
    const desc = lead.description || ""
    const slug = lead.categorySlug || ""

    process.stdout.write(`  [${i + 1}/${leads.length}] ${name.substring(0, 40).padEnd(42)} `)

    const audit = await auditSupplier(
      name,
      lead.website,
      lead.country,
      slug,
      lead.email,
      lead.phone,
      desc
    )

    const tierLabels: Record<string, string> = {
      TIER_A_FULLY_VERIFIED: "🅰 FULLY VERIFIED",
      TIER_B_WEBSITE_VERIFIED: "🅱 WEBSITE OK",
      TIER_C_NEEDS_REVIEW: "🅲 NEEDS REVIEW",
      TIER_D_REMOVE: "🅳 REMOVE",
    }
    console.log(tierLabels[audit.tier])

    if (audit.tier === "TIER_A_FULLY_VERIFIED") aCount++
    else if (audit.tier === "TIER_B_WEBSITE_VERIFIED") bCount++
    else if (audit.tier === "TIER_C_NEEDS_REVIEW") cCount++
    else dCount++

    results.push({ lead, audit })

    // Update DB
    const tierVal = audit.tier as any
    await prisma.discoveredLead.update({
      where: { id: lead.id },
      data: { verificationTier: tierVal },
    })

    // Also update DirectoryEntity if exists
    await prisma.directoryEntity.updateMany({
      where: { discoveredLeadId: lead.id },
      data: { verificationTier: tierVal },
    })

    // Also update SupplierProfile if this lead is linked to one
    await prisma.supplierProfile.updateMany({
      where: { id: lead.importedId || undefined },
      data: { verificationTier: tierVal },
    })

    // Skip delay for speed
    // await new Promise((r) => setTimeout(r, 50))
  }

  // Report
  const total = results.length
  const confidenceScore = total > 0
    ? Math.round(((aCount * 1 + bCount * 0.7 + cCount * 0.3) / total) * 100)
    : 0

  console.log("\n" + "=".repeat(70))
  console.log("  VERIFICATION AUDIT REPORT")
  console.log("=".repeat(70))
  console.log(`\n  Total suppliers audited:  ${total}`)
  console.log(`  TIER_A_FULLY_VERIFIED:     ${aCount} (${total > 0 ? Math.round((aCount / total) * 100) : 0}%)`)
  console.log(`  TIER_B_WEBSITE_VERIFIED:   ${bCount} (${total > 0 ? Math.round((bCount / total) * 100) : 0}%)`)
  console.log(`  TIER_C_NEEDS_REVIEW:       ${cCount} (${total > 0 ? Math.round((cCount / total) * 100) : 0}%)`)
  console.log(`  TIER_D_REMOVE:             ${dCount} (${total > 0 ? Math.round((dCount / total) * 100) : 0}%)`)
  console.log(`\n  Visible on platform (A+B): ${aCount + bCount} (${total > 0 ? Math.round(((aCount + bCount) / total) * 100) : 0}%)`)
  console.log(`  Confidence score:          ${confidenceScore}%`)

  // TIER A detail
  const tierA = results.filter((r) => r.audit.tier === "TIER_A_FULLY_VERIFIED")
  if (tierA.length > 0) {
    console.log(`\n${"─".repeat(70)}`)
    console.log("  TIER A — FULLY VERIFIED SUPPLIERS")
    console.log("─".repeat(70))
    tierA.forEach((r) => {
      console.log(`  ✅ ${r.lead.companyName?.padEnd(45)} ${r.lead.country || ""} ${r.lead.website ? "🌐" : ""}`)
    })
  }

  // TIER B detail
  const tierB = results.filter((r) => r.audit.tier === "TIER_B_WEBSITE_VERIFIED")
  if (tierB.length > 0) {
    console.log(`\n${"─".repeat(70)}`)
    console.log("  TIER B — WEBSITE VERIFIED (needs manual review)")
    console.log("─".repeat(70))
    tierB.forEach((r) => {
      const companyOnSite = r.audit.companyOnWebsite ? "✅" : "❌"
      const country = r.audit.countryMatches ? "✅" : "❌"
      console.log(`  ${companyOnSite}${country} ${r.lead.companyName?.padEnd(43)} ${r.lead.website || "N/A"}`)
      if (r.audit.reasons.length > 0) {
        console.log(`     ${r.audit.reasons.slice(0, 3).join("; ")}`)
      }
    })
  }

  // TIER D detail (to remove)
  const tierD = results.filter((r) => r.audit.tier === "TIER_D_REMOVE")
  if (tierD.length > 0) {
    console.log(`\n${"─".repeat(70)}`)
    console.log("  TIER D — SUPPLIERS TO REMOVE")
    console.log("─".repeat(70))
    tierD.forEach((r) => {
      console.log(`  🗑 ${r.lead.companyName?.padEnd(45)} ${r.lead.website || ""}`)
      console.log(`     ${r.audit.reasons.slice(0, 2).join("; ")}`)
    })
  }

  // Summary for platform updates
  console.log(`\n${"=".repeat(70)}`)
  console.log("  SUMMARY FOR PLATFORM UPDATE")
  console.log("=".repeat(70))
  console.log(`  Visible suppliers (A+B):    ${aCount + bCount}`)
  console.log(`  Hidden suppliers (C+D):     ${cCount + dCount}`)
  console.log(`  Featured restriction:       Tier A only`)
  console.log(`  Directory messaging:        "Verified international supplier network"`)
  console.log(`  Homepage metric:            ${aCount + bCount} verified suppliers`)
  console.log(`  Confidence score:           ${confidenceScore}%`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Audit failed:", e)
  process.exit(1)
})
