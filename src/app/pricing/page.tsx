"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Check, ChevronRight, HelpCircle, Sparkles, Building2, Store,
  Users, Shield, TrendingUp, MessageSquare, BarChart3, Globe,
  Phone, Mail, Star
} from "lucide-react"

const plans = [
  {
    tier: "free" as const,
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For buyers & suppliers getting started",
    badge: "Get Started",
    features: [
      "Browse marketplace & search products",
      "Post unlimited RFQs (buyers)",
      "List up to 5 products (suppliers)",
      "Basic supplier profile",
      "Email support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    tier: "verified" as const,
    name: "Verified",
    monthlyPrice: 0,
    yearlyPrice: 199,
    description: "One-time verification + annual renewal",
    badge: "Trust Signal",
    features: [
      "All Free features, plus:",
      "✅ Verified Supplier badge",
      "✅ Verified Contractor badge",
      "✅ Verified Professional badge",
      "Priority in RFQ matching",
      "Higher visibility in search results",
      "Trust indicator on profile & products",
      "Filterable by buyers seeking verified",
      "Renewed annually at $49/yr",
    ],
    cta: "Apply for Verification",
    highlighted: false,
    isOneTime: true,
  },
  {
    tier: "professional" as const,
    name: "Professional",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    description: "For active suppliers & contractors",
    badge: "Most Popular",
    features: [
      "Everything in Free, plus:",
      "Unlimited product listings",
      "Featured supplier profile placement",
      "Advanced analytics & reports",
      "Priority customer support",
      "RFQ priority matching",
      "In-platform messaging",
      "Bulk discount management",
      "API access for catalog sync",
      "Dedicated account manager",
    ],
    cta: "Subscribe to Professional",
    highlighted: true,
  },
  {
    tier: "enterprise" as const,
    name: "Enterprise",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    description: "For large organizations & manufacturers",
    features: [
      "Everything in Professional, plus:",
      "Custom catalog integration",
      "Multi-user account management",
      "White-label RFQ portal",
      "Advanced API & webhooks",
      "Custom reporting & BI tools",
      "Dedicated support team",
      "SLA guarantees",
      "Training & onboarding",
      "Custom contract terms",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

const standaloneProducts = [
  { name: "Product Spotlight", price: "$29/mo", description: "Feature individual products at the top of category search results" },
  { name: "Category Banner", price: "$199/mo", description: "Premium banner placement across a specific category" },
  { name: "Homepage Featured", price: "$499/week", description: "Featured placement in the homepage carousel" },
  { name: "Supplier Spotlight", price: "$99/mo", description: "Featured position in the supplier directory" },
]

const faqs = [
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades apply at the next billing cycle.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Yes! Annual plans give you 2 months free compared to monthly billing. That's a 17% saving.",
  },
  {
    q: "Are there any transaction fees?",
    a: "Free and Basic plans include a 3% transaction fee. Professional plans include 1.5%. Enterprise plans have custom negotiated rates.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit/debit cards, mobile money (M-Pesa, Tigo Pesa, Airtel Money), bank transfers, and PayPal.",
  },
  {
    q: "Can I try Professional before upgrading?",
    a: "Yes! You can request a 14-day free trial of the Professional plan. No credit card required.",
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-4 w-4" /> Pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Choose the Right Plan for Your Business
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Scale from browsing to enterprise with flexible plans designed for every type of user.
            </p>
            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!annual ? "bg-zanzibar-600 text-white" : "text-gray-300"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${annual ? "bg-zanzibar-600 text-white" : "text-gray-300"}`}
              >
                Annual <span className="text-gold-400 ml-1">Save 17%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.tier}
                className={`relative flex flex-col transition-all hover:shadow-xl ${
                  plan.highlighted
                    ? "border-zanzibar-500 ring-2 ring-zanzibar-500 shadow-lg shadow-zanzibar-100"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="bg-zanzibar-600 text-white px-4 py-1 text-sm">
                      <Star className="mr-1 h-3.5 w-3.5" /> Recommended
                    </Badge>
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      {plan.tier === 'verified' ? (
                        <>
                          <span className="text-4xl font-bold text-gray-900">$199</span>
                          <span className="text-sm text-gray-500">/one-time</span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            {plan.monthlyPrice === 0 ? "Free" : `$${annual ? plan.yearlyPrice : plan.monthlyPrice}`}
                          </span>
                          {plan.monthlyPrice > 0 && (
                            <span className="text-sm text-gray-500">/{annual ? "year" : "month"}</span>
                          )}
                        </>
                      )}
                    </div>
                    {plan.tier === 'verified' && (
                      <p className="mt-1 text-xs text-gray-500">+ $49/year renewal</p>
                    )}
                    {annual && plan.monthlyPrice > 0 && (
                      <p className="mt-1 text-xs text-gold-600">
                        ${plan.monthlyPrice}/mo if paid monthly
                      </p>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-zanzibar-600" />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    variant={plan.highlighted ? "default" : "outline"}
                    className={`mt-6 w-full ${plan.highlighted ? "" : ""}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standalone Products */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-4 w-4" /> Add-Ons
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Listings & Advertising
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Boost your visibility with targeted placement options
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {standaloneProducts.map((product) => (
              <Card key={product.name} className="transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-gold-500" />
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-3xl font-bold text-zanzibar-600">{product.price}</p>
                  <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                  <Button variant="outline" className="mt-6 w-full">Get This Feature</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Pricing FAQ</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-gray-900">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
