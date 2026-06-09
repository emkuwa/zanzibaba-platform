import type { ManualPaymentRequest } from "./types"
import type { ManualPayment, MembershipTier } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { VERIFIED_PRICE_USD, VERIFIED_PRICE_TZS, FOUNDING_PRICE_USD, FOUNDING_PRICE_TZS } from "./types"

export async function createPaymentRequest(
  userId: string,
  data: ManualPaymentRequest
): Promise<ManualPayment> {
  const amount = data.plan === "VERIFIED"
    ? (data.currency === "TZS" ? VERIFIED_PRICE_TZS : VERIFIED_PRICE_USD)
    : (data.currency === "TZS" ? FOUNDING_PRICE_TZS : FOUNDING_PRICE_USD)

  return prisma.manualPayment.create({
    data: {
      userId,
      plan: data.plan,
      amount,
      currency: data.currency,
      receiptUrl: data.receiptUrl,
      receiptFileName: data.receiptFileName,
      transactionRef: data.transactionRef,
      bankName: data.bankName,
      notes: data.notes,
      status: "PENDING",
    },
  })
}

export async function approvePayment(paymentId: string, adminUserId: string) {
  const payment = await prisma.manualPayment.findUnique({ where: { id: paymentId } })
  if (!payment || payment.status !== "PENDING") return null

  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  const [updatedPayment] = await prisma.$transaction([
    prisma.manualPayment.update({
      where: { id: paymentId },
      data: {
        status: "APPROVED",
        reviewedBy: adminUserId,
        reviewedAt: now,
        activatedAt: now,
      },
    }),
    prisma.subscription.create({
      data: {
        userId: payment.userId,
        profileType: "SUPPLIER",
        tier: payment.plan,
        status: "active",
        price: payment.amount,
        currency: payment.currency,
        interval: "yearly",
        startedAt: now,
        expiresAt,
      },
    }),
    prisma.transaction.create({
      data: {
        userId: payment.userId,
        type: "membership",
        amount: payment.amount,
        currency: payment.currency,
        status: "completed",
        paymentMethod: payment.bankName || "bank_transfer",
        paymentProvider: "manual",
        description: `${payment.plan} subscription`,
      },
    }),
  ])

  if (payment.plan === "VERIFIED" || payment.plan === "FOUNDING") {
    await prisma.supplierProfile.updateMany({
      where: { userId: payment.userId },
      data: {
        membershipTier: payment.plan,
        membershipExpiresAt: expiresAt,
        verificationStatus: "VERIFIED",
        verificationBadge: true,
      },
    })
  }

  return updatedPayment
}

export async function rejectPayment(paymentId: string, adminUserId: string, reason: string) {
  return prisma.manualPayment.update({
    where: { id: paymentId },
    data: {
      status: "REJECTED",
      adminNotes: reason,
      reviewedBy: adminUserId,
      reviewedAt: new Date(),
    },
  })
}

export async function requestClarification(paymentId: string, adminUserId: string, note: string) {
  return prisma.manualPayment.update({
    where: { id: paymentId },
    data: {
      status: "CLARIFICATION",
      adminNotes: note,
      reviewedBy: adminUserId,
      reviewedAt: new Date(),
    },
  })
}

export async function getPaymentRequests(status?: string) {
  const where = status ? { status: status as any } : {}
  return prisma.manualPayment.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId, status: "active" },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserPaymentHistory(userId: string) {
  return prisma.manualPayment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCurrentMembership(userId: string) {
  const profile = await prisma.supplierProfile.findUnique({
    where: { userId },
    select: { membershipTier: true, membershipExpiresAt: true },
  })
  return profile
}
