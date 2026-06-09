import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserSubscriptions, getUserPaymentHistory, getUserTransactions, getCurrentMembership } from "@/lib/payments/manual"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [subscriptions, payments, transactions, membership] = await Promise.all([
    getUserSubscriptions(session.user.id),
    getUserPaymentHistory(session.user.id),
    getUserTransactions(session.user.id),
    getCurrentMembership(session.user.id),
  ])

  return NextResponse.json({
    subscriptions,
    payments,
    transactions,
    membership,
  })
}
