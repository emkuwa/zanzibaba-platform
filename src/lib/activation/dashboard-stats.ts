import { prisma } from "@/lib/prisma"
import type { ActivationStats } from "./types"

export async function getActivationStats(): Promise<ActivationStats> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalDiscovered,
    claimReady,
    invited,
    visited,
    claimed,
    verified,
    featured,
    whatsappMessages,
    foundingEntries,
  ] = await Promise.all([
    prisma.discoveredLead.count({ where: { status: { in: ["DISCOVERED", "IMPORTED"] } } }),
    prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "UNCLAIMED", claimLinkSentAt: { not: null } } }),
    prisma.discoveredLead.count({
      where: { activationStatus: "UNCLAIMED", claimPageVisitedAt: { not: null } },
    }),
    prisma.discoveredLead.count({ where: { activationStatus: "CLAIMED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "VERIFIED" } }),
    prisma.discoveredLead.count({ where: { activationStatus: "FEATURED" } }),
    prisma.whatsAppMessage.findMany({
      where: { messageType: "activation" },
      select: { status: true },
    }),
    prisma.foundingSupplier.findMany({
      select: { stage: true },
    }),
  ])

  const wsSent = whatsappMessages.filter((m) =>
    ["SENT", "DELIVERED", "OPENED", "CLAIMED"].includes(m.status)
  ).length
  const wsDelivered = whatsappMessages.filter((m) =>
    ["DELIVERED", "OPENED", "CLAIMED"].includes(m.status)
  ).length
  const wsOpened = whatsappMessages.filter((m) =>
    ["OPENED", "CLAIMED"].includes(m.status)
  ).length

  return {
    totalDiscovered,
    claimReady,
    invited,
    visited,
    claimed,
    verified,
    featured,
    whatsappSent: wsSent,
    whatsappDelivered: wsDelivered,
    whatsappOpened: wsOpened,
    foundingInvited: foundingEntries.length,
    foundingClaimed: foundingEntries.filter((e) => e.stage !== "INVITED").length,
  }
}
