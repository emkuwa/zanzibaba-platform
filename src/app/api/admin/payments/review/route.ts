import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { approvePayment, rejectPayment, requestClarification, getPaymentRequests } from "@/lib/payments/manual"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get("status") || undefined
  const payments = await getPaymentRequests(status)
  return NextResponse.json(payments)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action, paymentId, reason } = body

    if (!paymentId || !action) {
      return NextResponse.json({ error: "Missing paymentId or action" }, { status: 400 })
    }

    let result
    switch (action) {
      case "approve":
        result = await approvePayment(paymentId, session.user.id)
        if (!result) return NextResponse.json({ error: "Payment not found or already processed" }, { status: 404 })
        break
      case "reject":
        result = await rejectPayment(paymentId, session.user.id, reason || "No reason provided")
        break
      case "clarification":
        result = await requestClarification(paymentId, session.user.id, reason || "")
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process review", details: String(error) },
      { status: 500 }
    )
  }
}
