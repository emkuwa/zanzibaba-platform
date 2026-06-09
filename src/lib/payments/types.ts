import type { MembershipTier } from "@prisma/client"

export interface SubscriptionPlan {
  tier: MembershipTier
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice?: number
  priceLabel?: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

export interface PaymentGateway {
  name: string
  key: string
  enabled: boolean
}

export interface ManualPaymentRequest {
  plan: MembershipTier
  currency: string
  receiptUrl?: string
  receiptFileName?: string
  transactionRef?: string
  bankName?: string
  notes?: string
}

export interface BankDetails {
  bankName: string
  accountName: string
  accountNumber: string
  currency: string
  swiftCode?: string
  branch?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: "FREE",
    name: "Free",
    description: "Get started with basic marketplace visibility",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Basic company profile",
      "Up to 5 product listings",
      "Standard search placement",
      "Public RFQ access",
    ],
  },
  {
    tier: "VERIFIED",
    name: "Verified Supplier",
    description: "Build trust and stand out from competitors",
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: 99,
    priceLabel: "USD 99 — one-time payment",
    features: [
      "Verified badge on profile",
      "Priority search ranking",
      "Unlimited product listings",
      "Direct RFQ notifications",
      "Advanced analytics",
      "Company verification documents",
    ],
    highlighted: true,
    badge: "Popular",
  },
  {
    tier: "FOUNDING",
    name: "Founding Supplier",
    description: "Exclusive early-adopter status with premium benefits",
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: 199,
    priceLabel: "USD 199 — one-time payment",
    features: [
      'All Verified Supplier features',
      '"Founding Supplier" badge',
      "Priority placement in search results",
      "Free featured listing for 3 months",
      "Premium RFQ access",
      "Dedicated support",
      "Early access to new features",
    ],
    highlighted: true,
    badge: "Exclusive",
  },
]

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  { name: "Bank Transfer", key: "bank_transfer", enabled: true },
  { name: "Mobile Money", key: "mobile_money", enabled: true },
]

export const BANK_DETAILS: BankDetails[] = [
  {
    bankName: "NMB Bank",
    accountName: "Zanzibaba Ltd",
    accountNumber: "1231001234567",
    currency: "TZS",
    branch: "Dar es Salaam",
  },
  {
    bankName: "CRDB Bank",
    accountName: "Zanzibaba Ltd",
    accountNumber: "0150123456700",
    currency: "USD",
    swiftCode: "CORUTZTZ",
    branch: "Dar es Salaam",
  },
]

export const VERIFIED_PRICE_USD = 199
export const VERIFIED_PRICE_TZS = 498000
export const FOUNDING_PRICE_USD = 99
export const FOUNDING_PRICE_TZS = 248000
