import { prisma } from "../src/lib/prisma"

const PUBLISH_MAP: Record<string, { entityType: string; profileModel: string | null }> = {
  contractor: { entityType: "contractor", profileModel: "ContractorProfile" },
  architect: { entityType: "architect", profileModel: "ProfessionalProfile" },
  engineer: { entityType: "engineer", profileModel: "ProfessionalProfile" },
  surveyor: { entityType: "surveyor", profileModel: "ProfessionalProfile" },
  "interior-designer": { entityType: "interior-designer", profileModel: null },
  developer: { entityType: "developer", profileModel: null },
  service: { entityType: "service", profileModel: null },
  partner: { entityType: "partner", profileModel: null },
  "hardware-store": { entityType: "hardware-store", profileModel: null },
  "hospitality-service": { entityType: "hospitality-service", profileModel: null },
  landscaping: { entityType: "landscaping", profileModel: null },
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
}

async function generateUniqueSlug(name: string, seen: Set<string>): Promise<string> {
  const base = slugify(name) || "entity"
  let slug = base
  let i = 1
  while (seen.has(slug)) {
    slug = `${base}-${i}`
    i++
  }
  seen.add(slug)
  return slug
}

async function main() {
  const leadTypes = Object.keys(PUBLISH_MAP)
  const leads = await prisma.discoveredLead.findMany({
    where: {
      leadType: { in: leadTypes },
    },
    orderBy: { trustScore: "desc" },
  })

  console.log(`Found ${leads.length} leads to publish`)

  const existingSlugs = new Set<string>(
    (await prisma.directoryEntity.findMany({ select: { slug: true } })).map((e) => e.slug)
  )

  let created = 0
  let skipped = 0

  for (const lead of leads) {
    const mapping = PUBLISH_MAP[lead.leadType]
    if (!mapping) {
      console.log(`  SKIP ${lead.companyName}: unknown leadType "${lead.leadType}"`)
      skipped++
      continue
    }

    const existing = await prisma.directoryEntity.findFirst({
      where: { discoveredLeadId: lead.id },
    })
    if (existing) {
      skipped++
      continue
    }

    if (!lead.companyName) {
      skipped++
      continue
    }

    const slug = await generateUniqueSlug(lead.companyName, existingSlugs)

    await prisma.directoryEntity.create({
      data: {
        entityType: mapping.entityType,
        entityId: null,
        profileModel: mapping.profileModel,
        slug,
        name: lead.companyName,
        description: lead.description,
        categoryLabels: lead.categoryLabels as any,
        country: lead.country || null,
        city: lead.city || null,
        website: lead.website || null,
        email: lead.email || null,
        phone: lead.phone || null,
        activationStatus: lead.activationStatus === "NONE" ? "UNCLAIMED" : lead.activationStatus,
        claimToken: lead.claimToken,
        claimLinkSentAt: lead.claimLinkSentAt,
        trustScore: lead.trustScore,
        discoveredLeadId: lead.id,
      },
    })
    created++
    console.log(`  OK  ${lead.companyName} → ${mapping.entityType} (${slug})`)
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Publish failed:", e)
  process.exit(1)
})
