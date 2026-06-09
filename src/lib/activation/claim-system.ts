import { prisma } from "@/lib/prisma"
import crypto from "crypto"

function generateClaimToken(): string {
  return crypto.randomBytes(24).toString("hex")
}

function buildClaimUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/claim/${token}`
}

export async function generateClaimLinks() {
  const leads = await prisma.discoveredLead.findMany({
    where: {
      activationStatus: "NONE",
      claimToken: null,
    },
    orderBy: { trustScore: "desc" },
  })

  let generated = 0
  for (const lead of leads) {
    const token = generateClaimToken()
    const claimUrl = buildClaimUrl(token)
    await prisma.discoveredLead.update({
      where: { id: lead.id },
      data: {
        claimToken: token,
        activationStatus: "UNCLAIMED",
        claimLinkSentAt: new Date(),
      },
    })
    generated++
  }
  return { generated, total: leads.length }
}

export async function getClaimableLeads() {
  return prisma.discoveredLead.findMany({
    where: { activationStatus: "UNCLAIMED" },
    orderBy: { trustScore: "desc" },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      city: true,
      trustScore: true,
      trustLevel: true,
      claimToken: true,
      claimLinkSentAt: true,
      categoryLabels: true,
    },
  })
}

export async function getLeadByClaimToken(token: string) {
  return prisma.discoveredLead.findUnique({
    where: { claimToken: token },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      website: true,
      city: true,
      country: true,
      description: true,
      categoryLabels: true,
      products: true,
      trustScore: true,
      activationStatus: true,
    },
  })
}

export async function trackClaimPageVisit(token: string) {
  await prisma.discoveredLead.update({
    where: { claimToken: token },
    data: { claimPageVisitedAt: new Date() },
  })
}

export async function claimProfile(
  token: string,
  claimData: {
    contactName: string
    email: string
    phone?: string
    password?: string
  }
) {
  const lead = await prisma.discoveredLead.findUnique({
    where: { claimToken: token },
  })

  if (!lead) return { success: false, error: "Invalid claim link" }
  if (lead.activationStatus !== "UNCLAIMED") {
    return { success: false, error: "This profile has already been claimed" }
  }

  await prisma.discoveredLead.update({
    where: { id: lead.id },
    data: {
      activationStatus: "CLAIMED",
      claimedAt: new Date(),
      claimedByEmail: claimData.email,
      contactName: claimData.contactName || lead.contactName,
      email: claimData.email || lead.email,
      phone: claimData.phone || lead.phone,
    },
  })

  const foundingEntry = await prisma.foundingSupplier.findUnique({
    where: { leadId: lead.id },
  })
  if (foundingEntry) {
    await prisma.foundingSupplier.update({
      where: { leadId: lead.id },
      data: { stage: "CLAIMED", claimedAt: new Date() },
    })
  }

  await prisma.whatsAppMessage.updateMany({
    where: { leadId: lead.id, status: "SENT" },
    data: { status: "CLAIMED", claimedAt: new Date() },
  })

  return {
    success: true,
    lead: {
      id: lead.id,
      companyName: lead.companyName,
      activationStatus: "CLAIMED",
      email: claimData.email,
    },
  }
}

export async function verifySupplier(leadId: string) {
  const lead = await prisma.discoveredLead.findUnique({ where: { id: leadId } })
  if (!lead) return { success: false, error: "Supplier not found" }
  if (lead.activationStatus !== "CLAIMED") {
    return { success: false, error: "Supplier must claim profile first" }
  }

  await prisma.discoveredLead.update({
    where: { id: leadId },
    data: {
      activationStatus: "VERIFIED",
      verifiedAt: new Date(),
      status: "VERIFIED",
    },
  })

  const foundingEntry = await prisma.foundingSupplier.findUnique({ where: { leadId } })
  if (foundingEntry) {
    await prisma.foundingSupplier.update({
      where: { leadId },
      data: { stage: "VERIFIED", verifiedAt: new Date() },
    })
  }

  return { success: true }
}

export async function featureSupplier(leadId: string) {
  const lead = await prisma.discoveredLead.findUnique({ where: { id: leadId } })
  if (!lead) return { success: false, error: "Supplier not found" }
  if (lead.activationStatus !== "VERIFIED") {
    return { success: false, error: "Supplier must be verified first" }
  }

  await prisma.discoveredLead.update({
    where: { id: leadId },
    data: {
      activationStatus: "FEATURED",
      featuredAt: new Date(),
    },
  })

  const foundingEntry = await prisma.foundingSupplier.findUnique({ where: { leadId } })
  if (foundingEntry) {
    await prisma.foundingSupplier.update({
      where: { leadId },
      data: { stage: "FEATURED", featuredAt: new Date() },
    })
  }

  return { success: true }
}
