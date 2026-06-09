import { prisma } from "../src/lib/prisma"

async function main() {
  console.log("=== ACTIVATION PILOT - 20 SUPPLIERS ===\n")

  // 1. Count current state
  const totalUnclaimed = await prisma.discoveredLead.count({
    where: { activationStatus: "UNCLAIMED" },
  })
  const pendingMessages = await prisma.whatsAppMessage.count({
    where: { status: "PENDING", messageType: "activation" },
  })
  const existingPending = await prisma.whatsAppMessage.count({
    where: { status: "PENDING" },
  })
  console.log(`Total UNCLAIMED leads: ${totalUnclaimed}`)
  console.log(`Existing pending WA messages: ${existingPending}`)
  console.log(`Existing activation pending: ${pendingMessages}`)

  // 2. Select 20 highest trust-score leads with phones
  const leads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: "UNCLAIMED",
      phone: { not: null },
      claimToken: { not: null },
    },
    orderBy: { trustScore: "desc" },
    take: 20,
    select: {
      id: true,
      companyName: true,
      contactName: true,
      phone: true,
      city: true,
      country: true,
      trustScore: true,
      trustLevel: true,
      claimToken: true,
      categoryLabels: true,
    },
  })

  console.log(`\nSelected ${leads.length} pilot suppliers:\n`)
  leads.forEach((l, i) => {
    const cats = Array.isArray(l.categoryLabels) ? l.categoryLabels.slice(0, 2).join(", ") : "-"
    console.log(`  ${i + 1}. ${l.companyName} | ${l.city}, ${l.country} | Trust: ${l.trustScore} | ${cats}`)
  })

  // 3. Delete existing PENDING messages for non-selected leads
  const selectedIds = new Set(leads.map((l) => l.id))
  const deleted = await prisma.whatsAppMessage.deleteMany({
    where: {
      status: "PENDING",
      messageType: "activation",
      leadId: { notIn: Array.from(selectedIds) },
    },
  })
  console.log(`\nCleared ${deleted.count} pending messages for non-pilot leads`)

  // 4. Delete any existing pending messages for pilot leads (in case of re-runs)
  const existingPilotPending = await prisma.whatsAppMessage.deleteMany({
    where: {
      status: "PENDING",
      messageType: "activation",
      leadId: { in: Array.from(selectedIds) },
    },
  })
  if (existingPilotPending.count > 0) {
    console.log(`Cleared ${existingPilotPending.count} existing pending messages for pilot leads`)
  }

  // 5. Prepare messages for the 20 selected leads
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  let prepared = 0
  for (const lead of leads) {
    if (!lead.claimToken || !lead.phone) continue

    const claimUrl = `${baseUrl}/claim/${lead.claimToken}`
    const name = lead.contactName || lead.companyName || "there"
    const categories = Array.isArray(lead.categoryLabels)
      ? lead.categoryLabels.slice(0, 3).join(", ")
      : "building supplies"

    const content = [
      `Hi ${name}! 👋`,
      "",
      `Great news — we've created a free business profile for ${lead.companyName} on Zanzibaba, the marketplace connecting verified suppliers with buyers across Zanzibar and East Africa.`,
      "",
      "Your profile is ready to claim:",
      `✅ ${categories} listed`,
      "✅ Reach buyers from hotels, resorts, and construction projects",
      "✅ Free to claim and manage",
      "",
      `Claim your profile here: ${claimUrl}`,
      "",
      "This link is unique to your business. Simply click, review your info, and go live in under 2 minutes.",
      "",
      "Let me know if you need any help getting started!",
      "",
      "— The Zanzibaba Team",
    ].join("\n")

    await prisma.whatsAppMessage.create({
      data: {
        leadId: lead.id,
        channel: "whatsapp",
        messageType: "activation",
        status: "PENDING",
        claimLink: claimUrl,
        content,
      },
    })
    prepared++
  }
  console.log(`Prepared ${prepared} WhatsApp messages for pilot`)

  // 6. Summary
  const totalNow = await prisma.whatsAppMessage.count({ where: { status: "PENDING", messageType: "activation" } })
  console.log(`\n=== SUMMARY ===`)
  console.log(`Total pending WA messages now: ${totalNow}`)
  console.log(`Pilot batch ready for send: ${prepared} suppliers`)
  console.log(`\nTo send, call: POST /api/activation/whatsapp/send`)
  console.log(`Or visit: ${baseUrl}/dashboard/supplier/activation → WhatsApp tab → "Send All Pending"`)
}

main()
  .catch((e) => {
    console.error("Pilot setup failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
