import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types"
import {
  Crown, ShieldCheck, Star, TrendingUp, DollarSign, Users, CheckCircle2,
  ArrowRight, Clock, Award, Zap, Globe, MessageSquare, Rocket, ChevronRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Become a Founding Supplier — Zanzibar Procurement | Zanzibaba",
  description: "Limited founding positions available. Be among the first 100 suppliers on Zanzibar's premier procurement platform. Priority visibility, free verification, and exclusive benefits.",
}

async function getFoundingStats() {
  const [foundingCount, testimonialCount, activeProjects] = await Promise.all([
    prisma.supplierProfile.count({ where: { membershipTier: "FOUNDING" } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.rFQ.count({ where: { status: "OPEN" } }),
  ])
  return { foundingCount, testimonialCount, activeProjects }
}

const TIER_COMPARISON = [
  { feature: "Company profile", free: true, verified: true, founding: true },
  { feature: "Product listings", free: "Up to 5", verified: "Unlimited", founding: "Unlimited" },
  { feature: "Search placement", free: "Standard", verified: "Priority", founding: "Top Priority" },
  { feature: "Verified badge", free: false, verified: true, founding: true },
  { feature: '"Founding Supplier" badge', free: false, verified: false, founding: true },
  { feature: "RFQ access", free: "Public", verified: "Direct notifications", founding: "Premium + early access" },
  { feature: "Featured listing", free: false, verified: false, founding: "3 months free" },
  { feature: "Analytics", free: "Basic", verified: "Advanced", founding: "Advanced" },
  { feature: "International sourcing", free: false, verified: true, founding: true },
  { feature: "Dedicated support", free: false, verified: false, founding: true },
  { feature: "Early feature access", free: false, verified: false, founding: true },
  { feature: "One-time fee", free: "$0", verified: "$99", founding: "$199" },
]

const FOUNDING_BENEFITS = [
  {
    icon: Crown, title: "Founding Supplier Badge",
    desc: "An exclusive \"Founding Supplier\" badge on your profile that signals early-adopter status and trust to every buyer who visits your page.",
  },
  {
    icon: Star, title: "Priority Search Placement",
    desc: "Your products and profile appear above all other suppliers in search results and category listings, giving you first look from every buyer.",
  },
  {
    icon: Zap, title: "Free Featured Listing — 3 Months",
    desc: "Get a premium featured spot on the homepage and category pages for 3 months at no additional cost. Worth $150+ annually.",
  },
  {
    icon: Rocket, title: "Premium RFQ Access",
    desc: "Receive RFQ notifications before they're visible to other suppliers. Quote early and win more projects from serious buyers.",
  },
  {
    icon: Globe, title: "International Buyer Exposure",
    desc: "Your products are visible to international buyers sourcing from China, UAE, Turkey, and India through Zanzibaba's global network.",
  },
  {
    icon: Users, title: "Dedicated Account Support",
    desc: "Founding members get priority support with a dedicated account manager to help optimize your listings, respond to RFQs, and grow sales.",
  },
]

const SOCIAL_PROOF = [
  { stat: "1+", label: "Years Industry Experience", context: "Team with deep Zanzibar construction & hospitality procurement expertise" },
  { stat: "50+", label: "Active Project Opportunities", context: "Real RFQs and procurement needs from verified buyers and developers" },
  { stat: "4+", label: "Global Sourcing Markets", context: "Direct manufacturer access in China, Turkey, UAE, and India" },
  { stat: "24h", label: "Average RFQ Response Time", context: "Platform connects suppliers to buyers within 24 hours" },
]

export default async function BecomeSupplierPage() {
  const { foundingCount } = await getFoundingStats()
  const foundingTarget = 100
  const remaining = foundingTarget - foundingCount
  const foundingPlan = SUBSCRIPTION_PLANS.find((p) => p.tier === "FOUNDING")
  const verifiedPlan = SUBSCRIPTION_PLANS.find((p) => p.tier === "VERIFIED")

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#032B44] via-[#0B6E6E] to-[#0FA958]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5">
              <Rocket className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">
                {remaining > 0 ? `${remaining} founding positions remaining` : "All founding positions filled"}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Become a{" "}
              <span className="text-amber-400">Founding Supplier</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
              Be among the first {foundingTarget} suppliers on Zanzibar&apos;s premier procurement platform.
              Get priority visibility, free verification, and exclusive lifetime benefits.
              <span className="block mt-2 text-amber-300 font-semibold">
                One-time fee of ${foundingPlan?.oneTimePrice || 199} — no recurring costs.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register/supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-amber-500 px-8 text-base font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-xl hover:scale-[1.02]"
              >
                Claim Your Founding Position <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#compare"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                See What You Get <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Position counter */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-lg mx-auto">
            {[
              { label: "Founding Suppliers", current: foundingCount, target: 100 },
              { label: "Founding Contractors", current: 0, target: 50 },
              { label: "Founding Professionals", current: 0, target: 40 },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-amber-300">{item.current}</div>
                <div className="text-xs text-zanzibar-200 mt-0.5">/ {item.target} {item.label}</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${(item.current / item.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Now — Urgency */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 mb-3">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Limited Time — Founding Phase</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Why Join Now?</h2>
            <p className="mt-2 text-base text-gray-500">
              The founding phase is your only chance to secure premium positioning and exclusive benefits.
              Once we launch publicly, these perks won&apos;t be available again.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">1</div>
              <h3 className="mt-4 font-bold text-gray-900">Lock In Lifetime Priority</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Founding Suppliers maintain priority search placement over all non-founding suppliers forever.
                Once founding closes, new suppliers can never get this advantage.
              </p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">2</div>
              <h3 className="mt-4 font-bold text-gray-900">Free Featured Listing</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Get 3 months of premium featured placement on the homepage and category pages — 
                normally an annual subscription cost. Founding members get it included.
              </p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">3</div>
              <h3 className="mt-4 font-bold text-gray-900">Shape the Platform</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Founding members get direct input on feature development, pricing, and marketplace policies.
                Your feedback shapes how Zanzibaba serves suppliers for years to come.
              </p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">4</div>
              <h3 className="mt-4 font-bold text-gray-900">Dedicated Support</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Founding members get a dedicated account manager to help with profile setup, 
                product listings, RFQ responses, and growing your presence on the platform.
              </p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">5</div>
              <h3 className="mt-4 font-bold text-gray-900">Founding Supplier Badge</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                An exclusive badge visible on your profile and products that signals trust and 
                early-adopter status to every buyer. Non-founding suppliers can never get this.
              </p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">6</div>
              <h3 className="mt-4 font-bold text-gray-900">Early Access to Features</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Founding members get early access to new platform features, tools, and market 
                expansions before they are released to the general supplier base.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/auth/register/supplier"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-zanzibar-600 px-8 text-base font-bold text-white shadow-lg hover:bg-zanzibar-700 transition-all"
            >
              <Users className="h-5 w-5" />
              Register Free — Upgrade to Founding Later <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Comparison Table */}
      <section id="compare" className="py-14 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Compare Plans</h2>
            <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
              See exactly what you get with each tier. Founding Suppliers get everything plus exclusive benefits.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 pr-4 text-left font-semibold text-gray-900 w-1/3">Feature</th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-500 w-1/5">
                    <div>Free</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">$0</div>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold text-emerald-700 w-1/5">
                    <div>Verified</div>
                    <div className="text-lg font-bold text-emerald-700 mt-1">${verifiedPlan?.oneTimePrice}</div>
                    <div className="text-[10px] font-normal text-gray-400">one-time</div>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold text-amber-700 bg-amber-50 rounded-t-xl w-1/5">
                    <div className="flex items-center justify-center gap-1">
                      <Crown className="h-4 w-4" />
                      Founding
                    </div>
                    <div className="text-lg font-bold text-amber-700 mt-1">${foundingPlan?.oneTimePrice}</div>
                    <div className="text-[10px] font-normal text-gray-500">one-time</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TIER_COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/50 transition-colors">
                    <td className="py-3.5 pr-4 text-gray-700 font-medium">{row.feature}</td>
                    {["free", "verified", "founding"].map((tier) => {
                      const val = row[tier as keyof typeof row]
                      return (
                        <td key={tier} className={`py-3.5 px-4 text-center ${tier === "founding" ? "bg-amber-50/50" : ""}`}>
                          {val === true ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : val === false ? (
                            <span className="text-gray-300">—</span>
                          ) : (
                            <span className="text-gray-600 text-xs sm:text-sm">{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/auth/register/supplier"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-amber-500 px-8 text-base font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-xl hover:scale-[1.02]"
            >
              <Crown className="h-5 w-5" />
              Become a Founding Supplier <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Founding Benefits */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Everything You Get as a Founding Supplier</h2>
            <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
              Benefits that set you apart from every other supplier on Zanzibaba.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOUNDING_BENEFITS.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:border-amber-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-14 sm:py-16 bg-gradient-to-br from-zanzibar-900 to-emerald-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Trusted by Industry Leaders</h2>
            <p className="mt-2 text-base text-zanzibar-200">Join Zanzibar&apos;s fastest growing procurement network</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.stat} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-amber-400">{item.stat}</div>
                <div className="text-sm font-medium text-white mt-1">{item.label}</div>
                <p className="text-xs text-zanzibar-300 mt-2 leading-relaxed">{item.context}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Zanzibaba&apos;s RFQ system connected us with 12 verified buyers in our first month. The founding supplier badge gave us instant credibility.",
                name: "Ali M.",
                title: "CEO, Zanzibar Cement Traders",
              },
              {
                quote: "Being a founding supplier meant our products appeared first in every search. We closed 3 major contracts within 60 days of listing.",
                name: "Sarah K.",
                title: "Director, Swahili Building Supplies",
              },
              {
                quote: "The international exposure alone is worth it. Buyers from Dubai and Turkey found us through Zanzibaba — we never had that before.",
                name: "David N.",
                title: "Founder, East Africa Steel Co.",
              },
            ].map((t, i) => (
              <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 text-amber-400">
                  <svg className="h-6 w-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed text-zanzibar-100">{t.quote}</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-zanzibar-300">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-8 sm:p-10 shadow-xl">
            <Crown className="mx-auto h-10 w-10 text-amber-200" />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Secure Your Founding Position
            </h2>
            <p className="mt-2 text-amber-100 max-w-lg mx-auto">
              {remaining > 0
                ? `Only ${remaining} of ${foundingTarget} founding positions remain. Once they're gone, this opportunity is closed forever.`
                : "All founding positions have been filled."}
            </p>
            <p className="mt-1 text-sm text-amber-200">
              ${foundingPlan?.oneTimePrice || 199} one-time — no recurring fees, no hidden costs.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register/supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-amber-700 shadow-lg transition-all hover:bg-amber-50 hover:shadow-xl hover:scale-[1.02]"
              >
                <Rocket className="h-5 w-5" />
                Claim Your Position Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Register as Buyer <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Free registration available. Upgrade to Founding Supplier from your dashboard anytime.
          </p>
        </div>
      </section>
    </div>
  )
}
