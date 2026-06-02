import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Building2, Star, Shield, Users, Globe, Heart, Target,
  Eye, TrendingUp, Award, Handshake, Lightbulb, Sparkles,
  ArrowRight, ChevronRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Zanzibaba",
  description: "Learn about Zanzibaba's mission to transform the building materials marketplace in Zanzibar and East Africa.",
}

const team = [
  { name: "Ali Hassan", role: "CEO & Co-Founder", bio: "Former construction executive with 20+ years in East African building industry." },
  { name: "Mariam Suleiman", role: "CTO & Co-Founder", bio: "Tech entrepreneur with expertise in marketplace platforms and supply chain technology." },
  { name: "James Mwangi", role: "Head of Operations", bio: "Supply chain specialist with experience managing logistics across East Africa." },
  { name: "Amina Juma", role: "Head of Supplier Relations", bio: "Building strong partnerships with manufacturers and suppliers across the region." },
]

const values = [
  { icon: Shield, title: "Trust & Transparency", description: "Every supplier is verified. Every rating is authentic. Every transaction is secure." },
  { icon: Heart, title: "Community First", description: "We're building for Zanzibar's growth, connecting local businesses with opportunities." },
  { icon: Lightbulb, title: "Innovation", description: "Leveraging technology to make construction procurement faster, easier, and more transparent." },
  { icon: Handshake, title: "Partnership", description: "Success comes from strong relationships with our suppliers, contractors, and buyers." },
]

const stats = [
  { value: "2,000+", label: "Products Listed" },
  { value: "500+", label: "Verified Suppliers" },
  { value: "150+", label: "Contractors" },
  { value: "50+", label: "Categories" },
  { value: "$50M+", label: "Marketplace GMV" },
  { value: "10,000+", label: "Active Buyers" },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Building Zanzibar&apos;s Future, Together
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Zanzibaba is more than a marketplace — we are a mission-driven platform transforming how 
              building materials, services, and expertise flow into and across Zanzibar.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zanzibar-100 text-zanzibar-600 mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                To democratize access to building materials and construction services in Zanzibar, 
                creating a transparent, efficient, and trustworthy marketplace that empowers local 
                businesses, contractors, and developers to build better, faster, and more affordably.
              </p>
            </div>
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-600 mb-4">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                To become the definitive construction and development ecosystem for East Africa, 
                connecting every builder, supplier, and professional on a single trusted platform 
                that drives economic growth and sustainable development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900">The Zanzibaba Story</h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Zanzibaba was founded in 2024 by a team of construction industry veterans and technology 
                entrepreneurs who recognized a fundamental problem: finding quality building materials and 
                trusted suppliers in Zanzibar was fragmented, time-consuming, and opaque.
              </p>
              <p>
                Builders had to contact dozens of suppliers individually, compare prices manually, and 
                rely on word-of-mouth for supplier reliability. Contractors struggled to find qualified 
                professionals. International suppliers had no direct channel to Zanzibar&apos;s growing market.
              </p>
              <p>
                We built Zanzibaba to solve all of this. One platform where you can search, compare, 
                connect, and build — with transparency, trust, and efficiency at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-zanzibar-800 to-emerald-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">Zanzibaba by the Numbers</h2>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gold-400">{stat.value}</div>
                <div className="mt-1 text-sm text-zanzibar-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Our Values</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                    <Icon className="h-7 w-7 text-zanzibar-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{v.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="mt-2 text-center text-gray-600">The people building Zanzibaba</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                    <span className="text-xl font-bold text-zanzibar-600">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-zanzibar-600">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Join the Zanzibaba Community</h2>
            <p className="mt-4 text-lg text-zanzibar-100">
              Whether you are a buyer, supplier, contractor, or professional — there is a place for you on Zanzibaba.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register" className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-gold-600">
                Join Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-8 text-base font-medium text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
