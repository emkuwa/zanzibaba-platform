import { prisma } from "../src/lib/prisma"

async function main() {
  const rows = await prisma.discoveredLead.groupBy({
    by: ["tier"],
    _count: true,
    where: {
      activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
      dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
    },
  })
  console.log("Verification tier distribution:")
  let total = 0
  rows.forEach((r) => {
    console.log(`  ${r.tier || "null"}: ${r._count}`)
    total += r._count
  })
  console.log("Total active leads:", total)
  await prisma.$disconnect()
}

main().catch(console.error)
