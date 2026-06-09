import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createPaymentRequest } from "@/lib/payments/manual"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { plan, currency, receiptUrl, receiptFileName, transactionRef, bankName, notes } = body

    if (!plan || !["VERIFIED", "FOUNDING"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const payment = await createPaymentRequest(session.user.id, {
      plan,
      currency: currency || "USD",
      receiptUrl,
      receiptFileName,
      transactionRef,
      bankName,
      notes,
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment request", details: String(error) },
      { status: 500 }
    )
  }
}
