import { prisma } from "@/lib/prisma"

export async function getFoundingStats() {
  const entries = await prisma.foundingSupplier.findMany()
  const byCampaign: Record<string, { invited: number; claimed: number; verified: number; featured: number }> = {}

  for (const entry of entries) {
    const campaign = entry.campaign || "default"
    if (!byCampaign[campaign]) {
      byCampaign[campaign] = { invited: 0, claimed: 0, verified: 0, featured: 0 }
    }
    byCampaign[campaign].invited++
    if (entry.stage === "CLAIMED" || entry.stage === "VERIFIED" || entry.stage === "FEATURED") {
      byCampaign[campaign].claimed++
    }
    if (entry.stage === "VERIFIED" || entry.stage === "FEATURED") {
      byCampaign[campaign].verified++
    }
    if (entry.stage === "FEATURED") {
      byCampaign[campaign].featured++
    }
  }

  return {
    totalInvited: entries.length,
    totalClaimed: entries.filter((e) => e.stage !== "INVITED").length,
    totalVerified: entries.filter((e) => e.stage === "VERIFIED" || e.stage === "FEATURED").length,
    totalFeatured: entries.filter((e) => e.stage === "FEATURED").length,
    byCampaign,
  }
}

export async function inviteToFoundingProgram(
  campaign: string = "founding-batch-1"
) {
  const leads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: { in: ["UNCLAIMED", "CLAIMED"] },
      foundingEntry: null,
    },
  })

  let invited = 0
  for (const lead of leads) {
    await prisma.foundingSupplier.create({
      data: {
        leadId: lead.id,
        stage: "INVITED",
        campaign,
      },
    })
    invited++
  }
  return { invited, total: leads.length }
}

export async function getFoundingSuppliers(stage?: string) {
  const where: any = {}
  if (stage) where.stage = stage

  return prisma.foundingSupplier.findMany({
    where,
    orderBy: { invitedAt: "desc" },
    include: {
      lead: {
        select: {
          companyName: true,
          email: true,
          phone: true,
          city: true,
          trustScore: true,
          activationStatus: true,
          categoryLabels: true,
        },
      },
    },
  })
}
