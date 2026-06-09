import { prisma } from "../src/lib/prisma"
import crypto from "crypto"

async function main() {
  const leads = await prisma.discoveredLead.findMany({
    where: { activationStatus: "NONE", claimToken: null },
    orderBy: { trustScore: "desc" },
    select: { id: true, companyName: true },
  })

  console.log(`Found ${leads.length} leads with NONE status needing tokens`)

  let updated = 0
  for (const lead of leads) {
    const token = crypto.randomBytes(24).toString("hex")
    await prisma.discoveredLead.update({
      where: { id: lead.id },
      data: {
        claimToken: token,
        activationStatus: "UNCLAIMED",
        claimLinkSentAt: new Date(),
      },
    })
    updated++
  }

  console.log(`Generated ${updated} claim tokens`)

  const total = await prisma.discoveredLead.count()
  const unclaimed = await prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } })
  const none = await prisma.discoveredLead.count({ where: { activationStatus: "NONE" } })

  console.log(`Final state: ${total} total, ${unclaimed} UNCLAIMED, ${none} NONE`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
