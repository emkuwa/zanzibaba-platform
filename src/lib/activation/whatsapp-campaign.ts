import { prisma } from "@/lib/prisma"

function buildClaimUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/claim/${token}`
}

function generateWhatsAppContent(
  companyName: string | null,
  contactName: string | null,
  categoryLabels: any,
  claimUrl: string
): string {
  const name = contactName || companyName || "there"
  const categories = Array.isArray(categoryLabels)
    ? categoryLabels.slice(0, 3).join(", ")
    : "building supplies"
  return `Hi ${name}! 👋

Great news — we've created a free business profile for ${companyName || "your company"} on Zanzibaba, the marketplace connecting verified suppliers with buyers across Zanzibar and East Africa.

Your profile is ready to claim:
✅ ${categories} listed
✅ Reach buyers from hotels, resorts, and construction projects
✅ Free to claim and manage

Claim your profile here: ${claimUrl}

This link is unique to your business. Simply click, review your info, and go live in under 2 minutes.

Let me know if you need any help getting started!

— The Zanzibaba Team`
}

export async function prepareWhatsAppMessages() {
  const leads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: "UNCLAIMED",
      phone: { not: null },
    },
  })

  let prepared = 0
  for (const lead of leads) {
    if (!lead.claimToken || !lead.phone) continue

    const claimUrl = buildClaimUrl(lead.claimToken)
    const content = generateWhatsAppContent(
      lead.companyName,
      lead.contactName,
      lead.categoryLabels,
      claimUrl
    )

    const existing = await prisma.whatsAppMessage.findFirst({
      where: { leadId: lead.id, messageType: "activation" },
    })

    if (!existing) {
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
  }

  return { prepared, total: leads.length }
}

export async function getPendingMessages() {
  return prisma.whatsAppMessage.findMany({
    where: { status: "PENDING" },
    include: {
      lead: {
        select: {
          companyName: true,
          phone: true,
          contactName: true,
        },
      },
    },
  })
}

export async function markAsSent(messageId: string) {
  await prisma.whatsAppMessage.update({
    where: { id: messageId },
    data: { status: "SENT", sentAt: new Date() },
  })
}

export async function markAsDelivered(messageId: string) {
  await prisma.whatsAppMessage.update({
    where: { id: messageId },
    data: { status: "DELIVERED", deliveredAt: new Date() },
  })
}

export async function markAsOpened(messageId: string) {
  await prisma.whatsAppMessage.update({
    where: { id: messageId },
    data: { status: "OPENED", openedAt: new Date() },
  })
}

export async function sendAllPending() {
  const pending = await getPendingMessages()
  let sent = 0
  for (const msg of pending) {
    await markAsSent(msg.id)
    sent++
  }
  return { sent, total: pending.length }
}

export async function getWhatsAppStats() {
  const messages = await prisma.whatsAppMessage.findMany({
    where: { messageType: "activation" },
  })

  return {
    pending: messages.filter((m) => m.status === "PENDING").length,
    sent: messages.filter((m) => m.status === "SENT" || m.status === "DELIVERED" || m.status === "OPENED" || m.status === "CLAIMED").length,
    delivered: messages.filter((m) => m.status === "DELIVERED" || m.status === "OPENED" || m.status === "CLAIMED").length,
    opened: messages.filter((m) => m.status === "OPENED" || m.status === "CLAIMED").length,
    claimed: messages.filter((m) => m.status === "CLAIMED").length,
  }
}
