import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Building2, Sofa, CookingPot, Bath, Lightbulb, Warehouse, Package,
  Clock, Mail, ChevronRight, MapPin, Sparkles, Eye, Ruler, HardHat,
  Home, Shirt, DoorOpen, Phone
} from "lucide-react"

export const metadata: Metadata = {
  title: "Experience Center - Zanzibaba",
  description: "Visit our physical showroom in Fumba to see and touch building materials, kitchen displays, and more. Contact +255 716 002 790.",
}

const experiences = [
  { icon: Package, title: "Material Samples", description: "Touch and compare thousands of material samples — tiles, stone, wood, fabrics, and finishes." },
  { icon: CookingPot, title: "Kitchen Displays", description: "Explore fully built kitchen setups with different cabinet styles, countertops, and appliances." },
  { icon: Bath, title: "Bathroom Displays", description: "See complete bathroom installations with tiles, sanitary ware, fixtures, and lighting." },
  { icon: Sofa, title: "Furniture Showroom", description: "Try before you buy — our showroom features sofas, beds, dining sets, and outdoor furniture." },
  { icon: Warehouse, title: "Prefab Solutions", description: "View prefab house models, container conversions, and modular building samples up close." },
  { icon: Lightbulb, title: "Lighting Gallery", description: "See lighting fixtures in real room settings with different ambiance controls." },
]

export default function ExperienceCenterPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zanzibar-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-4 w-4" /> Coming Soon
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Zanzibaba Experience Center
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
               Zanzibar's first physical building materials experience center. See, touch, and feel 
               products before you buy — all under one roof in Fumba.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-gold-400" />
                <span className="text-white">Opening Q3 2026</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
                <MapPin className="h-5 w-5 text-gold-400" />
                <span className="text-white">Fumba, Zanzibar</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
                <Phone className="h-5 w-5 text-gold-400" />
                <a href="tel:+255716002790" className="text-white hover:text-gold-400 transition-colors">+255 716 002 790</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What to Expect</h2>
            <p className="mt-2 text-lg text-gray-600">A premium experience designed to help you make confident purchasing decisions</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp) => {
              const Icon = exp.icon
              return (
                <Card key={exp.title} className="transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                      <Icon className="h-6 w-6 text-zanzibar-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Concept Preview */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Concept Preview</h2>
            <p className="mt-2 text-lg text-gray-600">A glimpse of what the Experience Center will look like</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { label: "Showroom Interior", gradient: "from-zanzibar-100 via-zanzibar-50 to-ocean-50" },
              { label: "Kitchen Display Area", gradient: "from-gold-100 via-zanzibar-50 to-white" },
              { label: "Material Library", gradient: "from-ocean-50 via-zanzibar-50 to-zanzibar-100" },
              { label: "Prefab Model Display", gradient: "from-gray-100 via-zanzibar-50 to-gold-50" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} border border-gray-200`}
              >
                <div className="text-center">
                  <Eye className="mx-auto h-8 w-8 text-zanzibar-400" />
                  <p className="mt-2 text-sm font-medium text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Opening Timeline</h2>
          <div className="mt-12 space-y-6">
            {[
              { phase: "Phase 1", title: "Site Selection & Design", status: "Completed", date: "Q1 2026" },
              { phase: "Phase 2", title: "Renovation & Build-Out", status: "In Progress", date: "Q2 2026" },
              { phase: "Phase 3", title: "Supplier Exhibits Installation", status: "Upcoming", date: "Q3 2026" },
              { phase: "Phase 4", title: "Grand Opening", status: "Upcoming", date: "Q3 2026" },
            ].map((phase) => (
              <div key={phase.phase} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
                  phase.status === "Completed" ? "bg-green-100 text-green-700" :
                  phase.status === "In Progress" ? "bg-gold-100 text-gold-700" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {phase.status === "Completed" ? "✓" : phase.phase.replace("Phase ", "")}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                  <p className="text-sm text-gray-500">{phase.date}</p>
                </div>
                <Badge variant={phase.status === "Completed" ? "success" : phase.status === "In Progress" ? "warning" : "secondary"}>
                  {phase.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="mx-auto h-10 w-10 text-zanzibar-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Location & Contact</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <MapPin className="mx-auto h-6 w-6 text-zanzibar-600" />
              <h3 className="mt-3 font-semibold text-gray-900">Address</h3>
              <p className="mt-1 text-sm text-gray-600">
                Fumba, Eneo la Uwekezaji<br />
                Mkoa wa Kusini Unguja<br />
                Zanzibar, Tanzania
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <Phone className="mx-auto h-6 w-6 text-zanzibar-600" />
              <h3 className="mt-3 font-semibold text-gray-900">Phone</h3>
              <a href="tel:+255716002790" className="mt-1 block text-sm text-zanzibar-600 hover:text-zanzibar-700 font-medium">
                +255 716 002 790
              </a>
              <a href="mailto:info@zanzibaba.com" className="block text-sm text-zanzibar-600 hover:text-zanzibar-700 font-medium">
                info@zanzibaba.com
              </a>
              <p className="mt-1 text-xs text-gray-400">Call or email for inquiries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Get Notified When We Open</h2>
            <p className="mt-3 text-lg text-zanzibar-100">
              Be the first to know about our grand opening, exclusive preview events, and special offers.
            </p>
            <form className="mt-8 flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-zanzibar-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white border-0">
                <Mail className="mr-2 h-4 w-4" /> Notify Me
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
