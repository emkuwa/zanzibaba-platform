import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS, PAYMENT_GATEWAYS, BANK_DETAILS } from "@/lib/payments/types"

export async function GET() {
  return NextResponse.json({
    plans: SUBSCRIPTION_PLANS,
    gateways: PAYMENT_GATEWAYS,
    bankDetails: BANK_DETAILS,
  })
}
