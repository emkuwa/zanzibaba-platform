import { prisma } from "../src/lib/prisma"

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
const WHATSAPP_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
const CONTACT_PAGE_REGEX = /contact|about-us|get-in-touch|reach-us|contact-us/i

const EXCLUDED_EMAILS = [
  "info@", "sales@", "admin@", "contact@", "hello@", "support@",
  "noreply@", "no-reply@", "enquiries@", "inquiry@", "orders@",
  "marketing@", "careers@", "jobs@", "hr@", "pr@",
  "example.com", "domain.com", "yourcompany.com",
]

function isUsefulEmail(email: string): boolean {
  const lower = email.toLowerCase()
  if (EXCLUDED_EMAILS.some((e) => lower.startsWith(e))) return false
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif") || lower.endsWith(".svg")) return false
  return true
}

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_REGEX) || []
  return [...new Set(matches)].filter(isUsefulEmail)
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_REGEX) || []
  return [...new Set(matches)]
    .filter((p) => p.length >= 8 && p.length <= 20)
    .filter((p) => !p.includes(".") || p.includes("+"))
    .slice(0, 3)
}

function extractWhatsApp(text: string): string | null {
  const waMatch = text.match(/(?:whatsapp|wa)[:\s]*\+?\d[\d\s\-()]{7,20}/i)
  if (waMatch) return waMatch[0].replace(/^(?:whatsapp|wa)[:\s]*/i, "").trim()
  return null
}

function findContactPageUrl(html: string, baseUrl: string): string | null {
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>.*?(?:contact|get in touch|reach us).*?<\/a>/i
  const match = html.match(linkRegex)
  if (match) {
    const href = match[1]
    if (href.startsWith("http")) return href
    if (href.startsWith("/")) return `${baseUrl.replace(/\/$/, "")}${href}`
    return `${baseUrl.replace(/\/$/, "")}/${href}`
  }
  return null
}

async function enrichWebsite(website: string): Promise<{
  email: string | null
  phone: string | null
  whatsapp: string | null
  contactPageUrl: string | null
  description: string | null
}> {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ZanzibabaEnrichment/1.0)" },
    })
    if (!res.ok) return { email: null, phone: null, whatsapp: null, contactPageUrl: null, description: null }

    const html = await res.text()

    const emails = extractEmails(html)
    const phones = extractPhones(html)
    const whatsapp = extractWhatsApp(html)
    const contactPageUrl = findContactPageUrl(html, url)

    // Extract meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    const description = descMatch ? descMatch[1].slice(0, 500) : null

    // If we found a contact page, fetch that too
    let contactEmails: string[] = []
    let contactPhones: string[] = []
    if (contactPageUrl) {
      try {
        const contactRes = await fetch(contactPageUrl, {
          signal: AbortSignal.timeout(10000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; ZanzibabaEnrichment/1.0)" },
        })
        if (contactRes.ok) {
          const contactHtml = await contactRes.text()
          contactEmails = extractEmails(contactHtml)
          contactPhones = extractPhones(contactHtml)
        }
      } catch {}
    }

    const allEmails = [...new Set([...emails, ...contactEmails])].filter((e) => !e.includes("google") && !e.includes("facebook") && !e.includes("twitter"))
    const allPhones = [...new Set([...phones, ...contactPhones])]

    return {
      email: allEmails[0] || null,
      phone: allPhones[0] || null,
      whatsapp,
      contactPageUrl,
      description,
    }
  } catch {
    return { email: null, phone: null, whatsapp: null, contactPageUrl: null, description: null }
  }
}

async function main() {
  console.log("=".repeat(70))
  console.log("  SUPPLIER ENRICHMENT PASS")
  console.log("=".repeat(70))

  const pending = await prisma.supplierEnrichment.findMany({
    where: { enrichmentStatus: "pending" },
  })

  // Fetch discovered leads separately (no relation in schema)
  const leadIds = pending.map((p) => p.discoveredLeadId)
  const leads = await prisma.discoveredLead.findMany({
    where: { id: { in: leadIds } },
  })
  const leadMap = new Map(leads.map((l) => [l.id, l]))

  console.log(`\n  Pending enrichment: ${pending.length}`)

  let enriched = 0
  let failed = 0
  let emailsFound = 0
  let phonesFound = 0
  let whatsappFound = 0

  for (let i = 0; i < pending.length; i++) {
    const item = pending[i]
    const dl = leadMap.get(item.discoveredLeadId)
    const website = dl?.website
    const name = dl?.companyName || "Unknown"

    process.stdout.write(`  [${i + 1}/${pending.length}] ${(name || "").substring(0, 35).padEnd(37)} `)

    if (!website) {
      await prisma.supplierEnrichment.update({
        where: { id: item.id },
        data: { enrichmentStatus: "failed", errorMessage: "No website", enrichedAt: new Date(), updatedAt: new Date() },
      })
      console.log(`NO WEBSITE`)
      failed++
      continue
    }

    const result = await enrichWebsite(website)

    if (result.email || result.phone || result.whatsapp || result.contactPageUrl) {
      await prisma.supplierEnrichment.update({
        where: { id: item.id },
        data: {
          enrichmentStatus: "enriched",
          email: result.email,
          phone: result.phone,
          whatsapp: result.whatsapp,
          contactPageUrl: result.contactPageUrl,
          companyDescription: result.description || undefined,
          enrichedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      if (result.email) emailsFound++
      if (result.phone) phonesFound++
      if (result.whatsapp) whatsappFound++

      const tags = []
      if (result.email) tags.push(`📧${result.email.substring(0, 25)}`)
      if (result.phone) tags.push(`📞${result.phone.substring(0, 15)}`)
      if (result.whatsapp) tags.push(`💬WA`)
      console.log(tags.join(" | ") || "OK (contact page)")
      enriched++
    } else {
      await prisma.supplierEnrichment.update({
        where: { id: item.id },
        data: { enrichmentStatus: "failed", errorMessage: "No contacts found", enrichedAt: new Date(), updatedAt: new Date() },
      })
      console.log(`NO CONTACTS`)
      failed++
    }

    await new Promise((r) => setTimeout(r, 1000))
  }

  const total = enriched + failed
  console.log("\n" + "=".repeat(70))
  console.log("  ENRICHMENT REPORT")
  console.log("=".repeat(70))
  console.log(`  Total processed: ${total}`)
  console.log(`  Enriched:        ${enriched} (${total > 0 ? Math.round((enriched / total) * 100) : 0}%)`)
  console.log(`  Failed:          ${failed}`)
  console.log(`\n  Email found:     ${emailsFound}/${total} (${total > 0 ? Math.round((emailsFound / total) * 100) : 0}%)`)
  console.log(`  Phone found:     ${phonesFound}/${total} (${total > 0 ? Math.round((phonesFound / total) * 100) : 0}%)`)
  console.log(`  WhatsApp found:  ${whatsappFound}/${total} (${total > 0 ? Math.round((whatsappFound / total) * 100) : 0}%)`)

  // Combined coverage (discovery + enrichment)
  const leadsWithWebsites = await prisma.discoveredLead.count({
    where: { website: { not: null }, sourcePlatform: { contains: "V2 Discovery" } },
  })
  const enrichedLeads = await prisma.supplierEnrichment.findMany({
    where: { enrichmentStatus: "enriched", email: { not: null } },
  })
  const phoneLeads = await prisma.supplierEnrichment.findMany({
    where: { enrichmentStatus: "enriched", phone: { not: null } },
  })

  console.log(`\n  COMBINED COVERAGE:`)
  console.log(`  Total V2 suppliers: ${leadsWithWebsites}`)
  console.log(`  Email coverage:     ${enrichedLeads.length}/${total} (${total > 0 ? Math.round((enrichedLeads.length / total) * 100) : 0}%)`)
  console.log(`  Phone coverage:     ${phoneLeads.length}/${total} (${total > 0 ? Math.round((phoneLeads.length / total) * 100) : 0}%)`)
  console.log(`\n  Target: 60%+ email, 50%+ phone`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Enrichment failed:", e)
  process.exit(1)
})
