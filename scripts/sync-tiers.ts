import { prisma } from "../src/lib/prisma"

async function main() {
  const leads = await prisma.discoveredLead.findMany({
    where: { tier: { not: null } },
    select: { id: true, tier: true },
  })

  for (const lead of leads) {
    await prisma.directoryEntity.updateMany({
      where: { discoveredLeadId: lead.id },
      data: { tier: lead.tier },
    })
  }
  console.log(`Synced ${leads.length} tier values to DirectoryEntity`)
  await prisma.$disconnect()
}

main().catch(console.error)
