"use client"

import { Palette, Globe, FileText, Building2, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const SERVICES = [
  { icon: Palette, name: "Logo Design", desc: "Professional AI-generated logo for your brand", color: "from-violet-500 to-purple-600" },
  { icon: Globe, name: "Business Website", desc: "Full website with contact form & WhatsApp", color: "from-blue-500 to-cyan-600" },
  { icon: FileText, name: "Company Profile", desc: "Professional supplier profile on Zanzibaba", color: "from-zanzibar-600 to-emerald-600" },
  { icon: Building2, name: "Supplier Profile Setup", desc: "Complete supplier listing with categories", color: "from-amber-500 to-orange-600" },
  { icon: Sparkles, name: "AI Branding", desc: "AI-generated content, SEO, and tagline", color: "from-pink-500 to-rose-600" },
]

export function HomepageOfferSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-zanzibar-900 via-zanzibar-800 to-zanzibar-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Need a Professional Business Presence?</h2>
          <p className="text-zanzibar-200 mt-3 max-w-2xl mx-auto text-lg">
            Get discovered by thousands of buyers actively sourcing suppliers. We help you build a complete digital presence in hours, not weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {SERVICES.map((svc) => {
            const Icon = svc.icon
            return (
              <div key={svc.name} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">{svc.name}</h3>
                <p className="text-xs text-zanzibar-200 mt-1">{svc.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white text-zanzibar-900 font-bold px-8 py-3.5 rounded-xl hover:bg-zanzibar-50 transition-colors text-sm"
          >
            Launch My Business Online
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-zanzibar-300 mt-3">Starting from $49 • Includes AI-powered content & branding</p>
        </div>
      </div>
    </section>
  )
}
