import { NextResponse } from 'next/server'
import { createTransaction, getTransactions, getRevenueSummary } from '@/lib/payments/payment-store'
import { paymentConfig } from '@/lib/payments/config'
import type { ProductKey } from '@/lib/payments/config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, productKey, amount, currency, gateway, status, paymentId } = body

    if (!productKey || !amount || !gateway || !status) {
      return NextResponse.json(
        { error: 'productKey, amount, gateway, and status are required' },
        { status: 400 }
      )
    }

    if (!(productKey in paymentConfig.products)) {
      return NextResponse.json(
        { error: 'Invalid productKey' },
        { status: 400 }
      )
    }

    if (!['selcom', 'flutterwave', 'stripe', 'manual'].includes(gateway)) {
      return NextResponse.json(
        { error: 'Invalid gateway' },
        { status: 400 }
      )
    }

    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const product = paymentConfig.products[productKey as ProductKey]

    const transaction = createTransaction({
      userId,
      productKey: productKey as ProductKey,
      productName: product.name,
      amount,
      currency: currency || paymentConfig.currency,
      gateway,
      status,
      paymentId,
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const summary = searchParams.get('summary')

  if (summary === 'true') {
    const revenue = getRevenueSummary()
    return NextResponse.json({ revenue })
  }

  const transactions = getTransactions()
  return NextResponse.json({ transactions })
}
