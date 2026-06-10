import Link from "next/link"
import type { Metadata } from "next"
import {
  Package, Shield, Truck, ClipboardCheck, FileText, Building2,
  ArrowRight, CheckCircle2, Clock, BarChart3, Headset, Crown, Sparkles, DollarSign, Search, Globe,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Fulfillment by Zanzibaba — Full-Service Procurement | Zanzibaba",
  description:
    "Let Zanzibaba handle your entire procurement — sourcing, supplier negotiation, quality checks, logistics and delivery. For complex projects, large orders, and tight timelines.",
}

const steps = [
  {
    icon: FileText,
    title: "Share Your Requirements",
    desc: "Tell us what you need — quantities, specs, delivery timeline. Upload BOQs, drawings, or any reference documents.",
  },
  {
    icon: Search,
    title: "We Source & Negotiate",
    desc: "Our team taps into our network of verified suppliers across Tanzania and international markets to find the best options.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Verification",
    desc: "We coordinate sampling, factory inspections, and third-party testing so you only pay for what meets your standards.",
  },
  {
    icon: Truck,
    title: "Logistics & Delivery",
    desc: "We handle shipping, customs clearance, warehousing, and last-mile delivery to your project site.",
  },
]

const comparisonRows = [
  { feature: "Supplier sourcing", self: "You search & vet", full: "We find & pre-qualify" },
  { feature: "Price negotiation", self: "You negotiate each deal", full: "We negotiate bulk & preferred rates" },
  { feature: "Quality control", self: "Coordinate yourself", full: "Factory inspections + third-party testing" },
  { feature: "Customs & compliance", self: "Handle paperwork", full: "Full documentation & clearance" },
  { feature: "Logistics", self: "Arrange shipping", full: "Door-to-door delivery" },
  { feature: "Order tracking", self: "Manual follow-up", full: "Real-time dashboard & updates" },
  { feature: "Dispute resolution", self: "Handle directly", full: "Mediation & replacement guarantee" },
]

const benefits = [
  { icon: Clock, title: "Save 40-60% of Your Time", desc: "Your team focuses on construction while we handle the entire supply chain." },
  { icon: DollarSign, title: "Cost Certainty", desc: "Lock in prices and avoid cost overruns from supply chain volatility." },
  { icon: Shield, title: "Quality Guaranteed", desc: "Every product is verified before shipment. Non-conforming goods are replaced at our cost." },
  { icon: BarChart3, title: "Supply Chain Intelligence", desc: "Get real-time market data, price trends, and alternative recommendations." },
  { icon: Headset, title: "Dedicated Procurement Manager", desc: "A single point of contact manages your entire order from RFQ to delivery." },
  { icon: Globe, title: "Global + Local Sourcing", desc: "We combine local Tanzanian suppliers with international procurement for the best value." },
]

const useCases = [
  { icon: Building2, title: "Hotel & Resort Development", desc: "FF&E, OS&E, MEP equipment, finishing materials — coordinated across dozens of suppliers and international shipments." },
  { icon: Package, title: "Infrastructure Projects", desc: "Steel, cement, aggregates, precast — bulk procurement with just-in-time delivery to remote sites." },
  { icon: Building2, title: "Commercial Fit-Outs", desc: "Interior finishes, furniture, lighting, AV equipment — sourced and delivered on your fit-out schedule." },
]

const pricingTiers = [
  {
    name: "Project-Based",
    price: "5-8%",
    label: "of order value",
    desc: "Best for one-off projects and single procurement cycles.",
    features: ["Dedicated procurement manager", "Supplier sourcing & negotiation", "Quality inspections", "Logistics coordination", "Order tracking dashboard"],
    cta: "Start a Project",
    href: "/contact",
  },
  {
    name: "Retainer",
    price: "3-5%",
    label: "of order value",
    desc: "Best for ongoing projects with recurring procurement needs.",
    features: ["Everything in Project-Based", "Priority allocation of procurement team", "Volume pricing discounts", "Monthly supply chain reports", "Same-day response SLA"],
    popular: true,
    cta: "Become a Client",
    href: "/contact",
  },
  {
    name: "Strategic Partner",
    price: "Custom",
    label: "pricing",
    desc: "Best for large-scale developments with end-to-end supply chain needs.",
    features: ["Everything in Retainer", "Embedded procurement team", "Direct factory pricing", "Inventory holding & warehousing", "Strategic sourcing advisory"],
    cta: "Talk to Our Team",
    href: "/contact",
  },
]

export default function FulfillmentPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zanzibar-900 via-zanzibar-800 to-ocean-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-zanzibar-200">
              <Sparkles className="h-4 w-4" />
              20/80 Fulfillment Model
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Fulfillment by Zanzibaba
            </h1>
            <p className="mt-6 text-lg text-zanzibar-200">
              You focus on building. We handle everything else — sourcing, negotiation,
              quality control, logistics, and delivery. One team, one point of contact,
              end-to-end procurement for your project.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-zanzibar-900 hover:bg-zanzibar-50 px-7 py-3 text-base font-bold transition-colors">
                Start Your Fulfillment Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/rfq" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3 text-base font-semibold transition-colors">
                Submit an RFQ <FileText className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Self-Service vs Full-Service</h2>
            <p className="mt-4 text-lg text-gray-600">
              See what changes when you let us handle your procurement.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">Self-Service (RFQ)</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-zanzibar-700 bg-zanzibar-50">Fulfillment by Zanzibaba</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5 text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                        {row.self}
                      </span>
                    </td>
                    <td className="bg-zanzibar-50/50 px-6 py-4 text-center text-sm font-medium text-zanzibar-700">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-zanzibar-600" />
                        {row.full}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              From requirements to delivery in four straightforward steps.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zanzibar-100 text-zanzibar-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zanzibar-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Fulfillment by Zanzibaba</h2>
            <p className="mt-4 text-lg text-gray-600">
              The 20% of effort that delivers 80% of your procurement outcomes.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-100 text-zanzibar-600">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Built For</h2>
            <p className="mt-4 text-lg text-gray-600">
              Procurement complexity varies. Our fulfillment model scales to match.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {useCases.map((uc, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-100 text-zanzibar-600">
                  <uc.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{uc.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">
              You pay only for what you need. No hidden fees, no retainers unless you want one.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-xl border p-8 ${
                  tier.popular
                    ? "border-zanzibar-600 ring-2 ring-zanzibar-600"
                    : "border-gray-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zanzibar-600 px-3 py-1 text-xs font-semibold text-white">
                      <Crown className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-sm text-gray-500">{tier.label}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{tier.desc}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-zanzibar-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                  <Link
                    href={tier.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
                      tier.popular
                        ? "bg-zanzibar-600 text-white hover:bg-zanzibar-700"
                        : "border border-zanzibar-600 text-zanzibar-600 hover:bg-zanzibar-50"
                    }`}
                  >
                    {tier.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-zanzibar-900 to-ocean-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Simplify Your Procurement?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zanzibar-200">
            Tell us about your project and get a fulfillment proposal within 48 hours.
            No obligation, no commitment — just a plan.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-zanzibar-900 hover:bg-zanzibar-50 px-7 py-3 text-base font-bold transition-colors">
              Get Your Fulfillment Proposal <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/rfq" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3 text-base font-semibold transition-colors">
              Try Self-Service RFQ <FileText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
