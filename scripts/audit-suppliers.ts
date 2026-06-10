import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // SupplierProfile audit
  const supplierCount = await prisma.supplierProfile.count()
  const withWebsite = await prisma.supplierProfile.count({ where: { website: { not: null }, NOT: { website: "" } } })
  const withDesc = await prisma.supplierProfile.count({ where: { companyDescription: { not: null }, NOT: { companyDescription: "" } } })
  const verified = await prisma.supplierProfile.count({ where: { verificationStatus: "VERIFIED" } })
  const pending = await prisma.supplierProfile.count({ where: { verificationStatus: "PENDING" } })
  const unverified = await prisma.supplierProfile.count({ where: { verificationStatus: "UNVERIFIED" } })
  const featured = await prisma.supplierProfile.count({ where: { isFeatured: true } })
  
  console.log("=== SUPPLIER PROFILE AUDIT ===")
  console.log(`Total suppliers: ${supplierCount}`)
  console.log(`With website: ${withWebsite}`)
  console.log(`With description: ${withDesc}`)
  console.log(`Verified: ${verified}`)
  console.log(`Pending: ${pending}`)
  console.log(`Unverified: ${unverified}`)
  console.log(`Featured: ${featured}`)

  // Sample suppliers
  const samples = await prisma.supplierProfile.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    select: { companyName: true, website: true, verificationStatus: true, city: true, country: true, createdAt: true, membershipTier: true }
  })
  console.log("\n=== RECENT SUPPLIERS ===")
  samples.forEach(s => console.log(`  ${s.companyName} | website=${s.website ? "YES" : "NO"} | status=${s.verificationStatus} | tier=${s.membershipTier} | ${s.city || ""}, ${s.country}`))

  // All suppliers (check for patterns)
  const allSuppliers = await prisma.supplierProfile.findMany({
    select: { companyName: true, website: true, verificationStatus: true, membershipTier: true, isFeatured: true }
  })
  
  const syntheticPattern = /supplier|test|demo|sample/i
  let synthetic = 0, test = 0, real = 0
  allSuppliers.forEach(s => {
    const name = s.companyName || ""
    if (name.toLowerCase().includes("test") || name.toLowerCase().includes("demo")) test++
    else if (!s.website && !s.verificationStatus) synthetic++
    else real++
  })
  console.log(`\n=== CLASSIFICATION (by pattern) ===`)
  console.log(`Likely TEST/DEMO: ${test}`)
  console.log(`Likely SYNTHETIC (no website, unverified): ${synthetic}`)
  console.log(`Likely REAL: ${real}`)

  // DiscoveredLead audit
  const leadCount = await prisma.discoveredLead.count()
  const leadWithWebsite = await prisma.discoveredLead.count({ where: { website: { not: null }, NOT: { website: "" } } })
  const highTrust = await prisma.discoveredLead.count({ where: { trustLevel: "HIGH" } })
  const mediumTrust = await prisma.discoveredLead.count({ where: { trustLevel: "MEDIUM" } })
  const lowTrust = await prisma.discoveredLead.count({ where: { trustLevel: "LOW" } })
  const unclaimed = await prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } })
  const claimed = await prisma.discoveredLead.count({ where: { activationStatus: "CLAIMED" } })
  const leadVerified = await prisma.discoveredLead.count({ where: { activationStatus: "VERIFIED" } })
  const leadFeatured = await prisma.discoveredLead.count({ where: { activationStatus: "FEATURED" } })

  console.log("\n=== DISCOVERED LEAD AUDIT ===")
  console.log(`Total leads: ${leadCount}`)
  console.log(`With website: ${leadWithWebsite}`)
  console.log(`High trust: ${highTrust}`)
  console.log(`Medium trust: ${mediumTrust}`)
  console.log(`Low trust: ${lowTrust}`)
  console.log(`Unclaimed: ${unclaimed}`)
  console.log(`Claimed: ${claimed}`)
  console.log(`Verified: ${leadVerified}`)
  console.log(`Featured: ${leadFeatured}`)

  // Sample leads
  const leadSamples = await prisma.discoveredLead.findMany({
    orderBy: { trustScore: "desc" },
    take: 15,
    select: { companyName: true, website: true, trustLevel: true, trustScore: true, activationStatus: true, country: true, categoryLabels: true }
  })
  console.log("\n=== TOP LEADS ===")
  leadSamples.forEach(s => console.log(`  ${s.companyName} | website=${s.website ? "YES" : "NO"} | trust=${s.trustLevel}(${s.trustScore}) | status=${s.activationStatus}`))

  // Check DirectoryEntity
  const dirCount = await prisma.directoryEntity.count()
  const dirByType = await prisma.directoryEntity.groupBy({ by: ["entityType"], _count: true })
  console.log("\n=== DIRECTORY ENTITY ===")
  console.log(`Total: ${dirCount}`)
  dirByType.forEach(d => console.log(`  ${d.entityType}: ${d._count}`))

  // FoundingSupplier
  const foundingCount = await prisma.foundingSupplier.count()
  console.log(`\nFounding Suppliers: ${foundingCount}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
