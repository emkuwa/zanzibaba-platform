"use client"

import { useState } from "react"
import { Sparkles, Globe, ImageIcon, Award, ChevronRight, Check, Star, Zap, Shield } from "lucide-react"

const PACKAGES = [
  {
    id: "ai-logo",
    name: "AI Logo Package",
    price: "$49",
    description: "Professional brand identity for your business",
    icon: ImageIcon,
    features: ["AI-generated logo", "Social profile image", "Cover banner", "Brand color palette", "High-resolution download"],
    color: "from-violet-500 to-purple-600",
    badge: "Most Popular",
  },
  {
    id: "ai-website",
    name: "AI Website Package",
    price: "$149",
    description: "Full business website with lead generation",
    icon: Globe,
    features: ["5-page business website", "Contact form", "WhatsApp integration", "Mobile responsive", "Custom domain support", "Hosting included"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "supplier-launch",
    name: "Supplier Launch Package",
    price: "$249",
    description: "Complete business launch on Zanzibaba",
    icon: Rocket,
    features: ["Logo + Website + Profile", "AI-generated content", "SEO optimization", "Cover image design", "Featured placement (30 days)", "Priority support"],
    color: "from-zanzibar-600 to-emerald-600",
    badge: "Best Value",
  },
  {
    id: "founding-partner",
    name: "Founding Industry Partner",
    price: "$999/year",
    description: "Premium visibility and lead generation",
    icon: Award,
    features: ["Verified badge", "Featured placement", "Sponsored categories", "Opportunity alerts", "Homepage visibility", "Priority RFQ access", "Dedicated account manager", "Quarterly business review"],
    color: "from-amber-500 to-orange-600",
    badge: "Enterprise",
  },
]

function Rocket(props: any) { return <Zap {...props} /> }

export function BusinessServicesSection() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Grow Your Business with Zanzibaba</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Get discovered by thousands of buyers, contractors, and developers across Zanzibar and East Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => {
            const Icon = pkg.icon
            const isSelected = selected === pkg.id
            return (
              <div
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                className={`relative bg-gray-900 rounded-2xl border p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected ? "border-zanzibar-400 ring-2 ring-zanzibar-400/30" : "border-gray-800 hover:border-gray-700"
                }`}
              >
                {pkg.badge && (
                  <span className={`absolute -top-2.5 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${pkg.color} text-white uppercase tracking-wide`}>
                    {pkg.badge}
                  </span>
                )}

                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{pkg.price}</p>
                <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>

                <ul className="mt-4 space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full mt-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isSelected
                    ? "bg-zanzibar-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}>
                  {isSelected ? "Selected" : "Get Started"}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-zanzibar-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Verified & Trusted</h4>
                <p className="text-xs text-gray-400 mt-1">All supplier profiles are verified for authenticity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-zanzibar-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">Featured Visibility</h4>
                <p className="text-xs text-gray-400 mt-1">Get prime placement on homepage and category pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-zanzibar-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm">AI-Powered Growth</h4>
                <p className="text-xs text-gray-400 mt-1">AI-generated content, SEO, and opportunity matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
