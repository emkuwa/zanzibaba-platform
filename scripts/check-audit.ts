import { prisma } from "../src/lib/prisma"

async function main() {
  const byTier = await prisma.discoveredLead.groupBy({
    by: ["verificationTier"],
    _count: true,
    where: { verificationTier: { not: null } },
  })
  const done = byTier.reduce((a, r) => a + r._count, 0)
  console.log("Audited:", done)
  byTier.forEach((r) => console.log(`  ${r.verificationTier}: ${r._count}`))

  const remaining = await prisma.discoveredLead.count({
    where: {
      verificationTier: null,
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
    },
  })
  console.log("Remaining:", remaining)

  await prisma.$disconnect()
}

main().catch(console.error)
