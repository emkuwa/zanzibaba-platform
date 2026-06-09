import { prisma } from "../src/lib/prisma"

async function main() {
  const heading = "=".repeat(52)
  console.log(`\n${heading}`)
  console.log("  ACTIVATION PILOT — 72-HOUR REPORT")
  console.log(`${heading}\n`)

  // 1. Activation Pipeline Stats
  const [
    totalDiscovered,
    claimReady,
    invited,
    visitedCount,
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
      select: { status: true, sentAt: true, deliveredAt: true, openedAt: true, claimedAt: true },
    }),
    prisma.foundingSupplier.findMany({ select: { stage: true } }),
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
  const wsClaimed = whatsappMessages.filter((m) => m.status === "CLAIMED").length

  const pilotSize = 20

  console.log("  FUNNEL")
  console.log("  " + "-".repeat(40))
  console.log(`  Invited (pilot batch):  ${pilotSize}`)
  console.log(`  WhatsApp Sent:           ${wsSent}`)
  console.log(`  WhatsApp Delivered:      ${wsDelivered}`)
  console.log(`  WhatsApp Opened:         ${wsOpened}`)
  console.log(`  Claim Page Visited:      ${visitedCount}`)
  console.log(`  Claim Submitted:         ${claimed}`)
  console.log(`  Verified:                ${verified}`)
  console.log(`  Featured:                ${featured}`)
  console.log("")

  // 2. Rate Calculations
  const visitRate = pilotSize > 0 ? ((visitedCount / pilotSize) * 100).toFixed(1) : "0.0"
  const claimRate = pilotSize > 0 ? ((claimed / pilotSize) * 100).toFixed(1) : "0.0"
  const deliveryRate = wsSent > 0 ? ((wsDelivered / wsSent) * 100).toFixed(1) : "0.0"
  const openRate = wsDelivered > 0 ? ((wsOpened / wsDelivered) * 100).toFixed(1) : "0.0"
  const conversionRate = wsOpened > 0 ? ((claimed / wsOpened) * 100).toFixed(1) : "0.0"

  console.log("  RATES")
  console.log("  " + "-".repeat(40))
  console.log(`  Visit rate:              ${visitRate}%  (target > 10%)`)
  console.log(`  Claim rate:              ${claimRate}%  (target > 5%)`)
  console.log(`  Delivery rate:           ${deliveryRate}%`)
  console.log(`  Open rate:               ${openRate}%`)
  console.log(`  Visit→Claim conversion:  ${conversionRate}%`)
  console.log("")

  // 3. Status check
  const visitTarget = visitRate !== "0.0" ? parseFloat(visitRate) >= 10 : false
  const claimTarget = claimRate !== "0.0" ? parseFloat(claimRate) >= 5 : false

  console.log("  SUCCESS CRITERIA")
  console.log("  " + "-".repeat(40))
  console.log(`  Visit rate > 10%:        ${visitTarget ? "PASS ✅" : parseFloat(visitRate) > 0 ? "PARTIAL ⚠️" : "PENDING ⏳"} (${visitRate}%)`)
  console.log(`  Claim rate > 5%:         ${claimTarget ? "PASS ✅" : parseFloat(claimRate) > 0 ? "PARTIAL ⚠️" : "PENDING ⏳"} (${claimRate}%)`)
  console.log("")

  // 4. Pilot Supplier Detail
  const pilotLeads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: "UNCLAIMED",
      phone: { not: null },
      claimToken: { not: null },
      claimLinkSentAt: { not: null },
    },
    orderBy: { claimLinkSentAt: "desc" },
    take: 20,
    select: {
      companyName: true,
      phone: true,
      city: true,
      claimToken: true,
      claimLinkSentAt: true,
      claimPageVisitedAt: true,
      activationStatus: true,
    },
  })

  console.log("  PILOT SUPPLIER DETAIL")
  console.log("  " + "-".repeat(80))
  console.log(`  ${"Company".padEnd(30)} ${"Phone".padEnd(18)} ${"Visited".padEnd(10)} ${"Status".padEnd(12)}`)
  console.log("  " + "-".repeat(80))
  for (const l of pilotLeads) {
    const visited = l.claimPageVisitedAt ? "✅" : "—"
    console.log(`  ${(l.companyName || "N/A").padEnd(30)} ${(l.phone || "").padEnd(18)} ${visited.padEnd(10)} ${l.activationStatus.padEnd(12)}`)
  }

  console.log(`\n  REPORT GENERATED: ${new Date().toISOString()}`)
  console.log(`${heading}\n`)
}

main()
  .catch((e) => {
    console.error("Report generation failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
